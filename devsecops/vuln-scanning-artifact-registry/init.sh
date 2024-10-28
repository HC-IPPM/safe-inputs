# https://medium.com/google-cloud/centrally-managing-artifact-registry-container-image-vulnerabilities-on-google-cloud-part-one-d86fb4791601
# https://cloud.google.com/run/docs/tutorials/eventarc-functions

export PROJECT_ID=phx-01hwmw2c1r4
export PROJECT_NUMBER=
export BUCKET_NAME=my-bucket-of-risk
export VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT=vuln-cloud-function-sa
# export REPO_NAME=hello-world-repo

gsutil mb -l northamerica-northeast1 -p $PROJECT_ID gs://$BUCKET_NAME
gcloud config set project $PROJECT_ID
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerscanning.googleapis.com

# ---- IAM ----
# Service account the cloud function runs under
gcloud iam service-accounts create $VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT \
--description="Service Account to create process image scan vulnerabilities" \
--display-name="Image Vulnerability Processor"

# Add Container Analysis Occurrences Viewer role to service account 
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member=serviceAccount:$VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com \
    --role=roles/containeranalysis.occurrences.viewer

# And Object Creator (on bucket we just created) 
gsutil iam ch serviceAccount:$VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com:objectCreator gs://$BUCKET_NAME

# ---- Artifact Registry -----
# Create Artifact Registry (we don't need to do this as there's one already in Safe inputs)
gcloud artifacts repositories create $REPO_NAME \
 --location=northamerica-northeast1 \ 
 --repository-format=docker \
 --project=$PROJECT_ID

# # ---- Pub Sub ----
# gcloud pubsub topics create container-analysis-occurrences-v1 --project=$PROJECT_ID
# I don't think we need to do this - this automatically is created with vunerabiltiy scanning in Artifact Registry 

# ----- Cloud Function ----
# *** need to change the trigger of pub sub cloud function (tutorial has click ops to do this )
# enable cloud run functions API
# https://cloud.google.com/blog/products/serverless/google-cloud-functions-is-now-cloud-run-functions

gcloud services enable eventarc.googleapis.com \
    run.googleapis.com \
    storage.googleapis.com

export REGION=northamerica-northeast1
gcloud config set run/region ${REGION}
gcloud config set run/platform managed
gcloud config set eventarc/location ${REGION}

grant roles for $PROJECT_NUMBER-compute@developer.gserviceaccount.com:

roles/artifactregistry.createOnPushWriter on phx-01hwmw2c1r4
roles/logging.logWriter on phx-01hwmw2c1r4
roles/storage.objectAdmin on phx-01hwmw2c1r4

run invoker

https://cloud.google.com/run/docs/configuring/cpu
--concurrency=10
   --allow-unauthenticated \
gcloud functions deploy image-vuln-cf-trigger \
    --source ./cloud-function \
    --runtime python39 \
    --trigger-topic container-analysis-occurrences-v1 \
    --allow-unauthenticated \
    --entry-point image_vuln_pubsub_handler \
    --max-instances=20 \
    --region northamerica-northeast1

# gcloud run services remove-iam-policy-binding image-vuln-cf-trigger \
#   --member="allUsers" \
#   --role="roles/run.invoker"


# ------ Push image to Artifact Registry 
export REPO_NAME=cloud-function-testing3
export PROJECT_ID=phx-01hwmw2c1r4
gcloud auth configure-docker northamerica-northeast1-docker.pkg.dev
docker build --tag nginx .
docker tag nginx northamerica-northeast1-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/nginx-test
docker push northamerica-northeast1-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/nginx-test




