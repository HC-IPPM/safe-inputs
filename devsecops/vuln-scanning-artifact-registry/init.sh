# ARTIFACT REGISTRY VUNERABILITIES 
#   Here we're setting up the resources in order to copying vunerabilities detected from Artifact Registry 
#   vunerability scanning to a Google Cloud Storage bucket using a built in Artifact registry occurance pubsub topic

# This will be done with Config Connector, but using gcloud (in a separate project for now) to determine resources to provision

# REFERENCES:
#   https://medium.com/google-cloud/centrally-managing-artifact-registry-container-image-vulnerabilities-on-google-cloud-part-one-d86fb4791601
#   https://cloud.google.com/run/docs/tutorials/eventarc-functions



# ---- SET ENV VARIABLES (commented out as used when run piece-meal)
# export PROJECT_ID=phx-01hwmw2c1r4
export PROJECT_ID=phx-01jck529wqj
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
export BUCKET_NAME=my-bucket-of-risk-the-third
export VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT=filter-vuln-gcf-sa
export REPO_NAME=risky-images-repo
export REGION=northamerica-northeast1

PROJECT_ID=phx-01hwmw2c1r4
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
BUCKET_NAME=my-bucket-of-risk-the-third
VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT=filter-vuln-gcf-sa
REPO_NAME=risky-images-repo
REPO_NAME=risky-images-repo
REGION=northamerica-northeast1



# ---- SET PROJECT (to test project at the moment))
gcloud config set project $PROJECT_ID



# ----- ENABLE SERVICES  artifact registry, scanning of registry, visibiliity into metadata (occurances) and cloudbuild
#   event-driven serverless (cloud run) function, and storage to store results in bucket 
gcloud services enable cloudresourcemanager.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    eventarc.googleapis.com \
    run.googleapis.com \
    storage.googleapis.com \
    pubsub.googleapis.com \
    containeranalysis.googleapis.com \
    cloudkms.googleapis.com \
    cloudfunctions.googleapis.com \
    containerscanning.googleapis.com

# check with services have been enabled 
gcloud services list --enabled

# # To undo (doesnt seem to remove the associated google generated service account)
# gcloud services disable cloudresourcemanager.googleapis.com \
#     artifactregistry.googleapis.com \
#     cloudbuild.googleapis.com \
#     eventarc.googleapis.com \
#     run.googleapis.com \
#     storage.googleapis.com \
#     pubsub.googleapis.com \
#     containeranalysis.googleapis.com \
#     cloudkms.googleapis.com \
#     cloudfunctions.googleapis.com \
#     containerscanning.googleapis.com



# ----- CREATE BUCKET to store vunerablity occurances
gsutil mb -l northamerica-northeast1 -p $PROJECT_ID gs://$BUCKET_NAME



# ---- IAM 
# Service account the cloud function runs under
gcloud iam service-accounts create $VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT \
--description="Service Account to create process image scan vulnerabilities" \
--display-name="Image Vulnerability Processor"

# Add Container Analysis Occurrences Viewer role to service account 
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member=serviceAccount:$VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com \
    --role=roles/containeranalysis.occurrences.viewer

# And add Object Creator role to vuln sa (on bucket we just created) 
gsutil iam ch serviceAccount:$VULN_CLOUD_FUNCTION_SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com:objectCreator gs://$BUCKET_NAME



# ---- CREATE PUBSUB TOPIC ----
gcloud pubsub topics create container-analysis-occurrences-v1 --project=$PROJECT_ID



# ---- DEPLOY CLOUD FUNCTION (this will be done with cloud build in the future)
#   Node (https://cloud.google.com/sdk/gcloud/reference/functions/deploy)
gcloud functions deploy imageVulnPubSubHandler \
    --source ./cloud-function/node \
    --runtime nodejs18 \
    --trigger-topic container-analysis-occurrences-v1 \
    --entry-point imageVulnPubSubHandler \
    --set-env-vars BUCKET_NAME=$BUCKET_NAME \
    --region=$REGION
# https://cloud.google.com/run/docs/configuring/cpu

# # Python
# gcloud functions deploy image-vuln-cf-trigger \
#     --source ./cloud-function/python \
#     --runtime python39 \
#     --trigger-topic container-analysis-occurrences-v1 \
#     --allow-unauthenticated \
#     --entry-point image_vuln_pubsub_handler \
#     --region=northamerica-northeast1

# ---- TEST
# Create Artifact Registry Repo to store image (we don't need to do this as there's one already in Safe inputs)
gcloud artifacts repositories create $REPO_NAME \
 --location=northamerica-northeast1 \
 --repository-format=docker  \
 --project=$PROJECT_ID

# Push image with vunerabilities to test (nginx) (nginx - ie Dockerfile in this dir) to Artifact Registry to test
gcloud auth configure-docker northamerica-northeast1-docker.pkg.dev
docker build --tag nginx .
docker tag nginx northamerica-northeast1-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/nginx-test
docker push northamerica-northeast1-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/nginx-test







