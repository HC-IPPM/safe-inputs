# https://medium.com/google-cloud/centrally-managing-artifact-registry-container-image-vulnerabilities-on-google-cloud-part-one-d86fb4791601
# https://cloud.google.com/run/docs/tutorials/eventarc-functions

# # Commented out for now as using for running piecemeal
# export PROJECT_ID=phx-01hwmw2c1r4
# export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
# export BUCKET_NAME=my-bucket-of-risk
# export VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT=vuln-cloud-function-sa
# export REPO_NAME=hello-world-repo

# Set ENV variables for cloud function
PROJECT_ID=phx-01hwmw2c1r4
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
BUCKET_NAME=my-bucket-of-risk-the-second
VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT=vuln-cloud-function-sa

# Create bucket
gsutil mb -l northamerica-northeast1 -p $PROJECT_ID gs://$BUCKET_NAME

# Set project (to save inputs (or mine at the moment))
gcloud config set project $PROJECT_ID

# Enable services: artifact registry, scanning of registry, visibiliity into metadata (occurances) and cloudbuild
gcloud services enable cloudresourcemanager.googleapis.com \
    artifactregistry.googleapis.com \
    services enable cloudbuild.googleapis.com \
    containerscanning.googleapis.com

# Enable services: event-driven serverless (cloud run) function, and to store results in bucket 
gcloud services enable eventarc.googleapis.com \
    run.googleapis.com \
    storage.googleapis.com

    # (uses "service-$PROJECT_NUMBER@gcf-admin-robot.iam.gserviceaccount.com")

# ----------- ROLES ------------------
# $PROJECT_NUMBER-compute@developer.gserviceaccount.com these roles: Artifact Registry Create-on-Push Writer
# Cloud Run Developer
# Compute Load Balancer Admin
# Compute Viewer
# Editor
# Eventarc Event Receiver
# Logs Bucket Writer
# Logs Writer
# Service Account User
# Storage Admin
# Storage Object Admin

# vuln-cloud-function-sa@$PROJECT_ID.iam.gserviceaccount.com
# Container Analysis Occurrences Viewer

# service-$PROJECT_NUMBER@gcf-admin-robot.iam.gserviceaccount.com 
# Cloud Functions Service Agent

# service-744920990938@gcp-sa-containerscanning.iam.gserviceaccount.com
# Container Scanner Service Agent

# service-744920990938@gcp-sa-eventarc.iam.gserviceaccount.com
# Eventarc Service Agent

# service-744920990938@gcp-sa-pubsub.iam.gserviceaccount.com
# Cloud Pub/Sub Service Agent
# Service Account Token Creator

# service-744920990938@gcp-sa-runapps.iam.gserviceaccount.com
# Serverless Integrations Service Agent

# service-744920990938@gcp-sa-cloudbuild.iam.gserviceaccount.com
# Cloud Build Service Agent

# service-744920990938@serverless-robot-prod.iam.gserviceaccount.com
# Cloud Run Service Agent

# service-744920990938@gs-project-accounts.iam.gserviceaccount.com
# Pub/Sub Publisher


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

# ---- to test with vunerable container image (nginx)
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


export REGION=northamerica-northeast1
gcloud config set run/region ${REGION}
gcloud config set run/platform managed
gcloud config set eventarc/location ${REGION}

# grant roles for $PROJECT_NUMBER-compute@developer.gserviceaccount.com:

# roles/artifactregistry.createOnPushWriter on phx-01hwmw2c1r4
# roles/logging.logWriter on phx-01hwmw2c1r4
# roles/storage.objectAdmin on phx-01hwmw2c1r4

run invoker ?

# https://cloud.google.com/run/docs/configuring/cpu

# # Python
# gcloud functions deploy image-vuln-cf-trigger \
#     --source ./cloud-function/python \
#     --runtime python39 \
#     --trigger-topic container-analysis-occurrences-v1 \
#     --allow-unauthenticated \
#     --entry-point image_vuln_pubsub_handler \
#     --region=northamerica-northeast1

# Node (https://cloud.google.com/sdk/gcloud/reference/functions/deploy)
gcloud functions deploy imageVulnPubSubHandler \
    --source ./cloud-function/node \
    --runtime nodejs18 \
    --trigger-topic container-analysis-occurrences-v1 \
    --entry-point imageVulnPubSubHandler \
    --set-env-vars BUCKET_NAME=my-bucket-of-risk-the-second \
    --region=northamerica-northeast1

# This gets pushed to gcf-artifacts (and is also scanned when up and running)

# ** need service account - right now using compute engine


# ------ Push image with lots of vunerabilities (nginx - ie Dockerfile in this dir) to Artifact Registry to test
REPO_NAME=cloud-function-testing3
PROJECT_ID=phx-01hwmw2c1r4
export REPO_NAME=cloud-function-testing-4
export PROJECT_ID=phx-01hwmw2c1r4
gcloud auth configure-docker northamerica-northeast1-docker.pkg.dev
docker build --tag nginx .
docker tag nginx northamerica-northeast1-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/nginx-test
docker push northamerica-northeast1-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/nginx-test




