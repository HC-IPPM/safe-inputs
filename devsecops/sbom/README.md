# Software Bill of Materials (SBOM)

## To trigger locally (not GitHub triggered)

1. Change the bucket in the generate-sbom-if-main step to one in your GCP project

2. Authenticate

```
gcloud auth login
```

3. From the root of the project:

```
export COMMIT_SHA=$(git rev-parse HEAD)
gcloud builds submit --config ./cloudbuild.yaml --substitutions=BRANCH_NAME=main,COMMIT_SHA=$COMMIT_SHA
```
