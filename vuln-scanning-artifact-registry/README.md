# Artifact Registry Vunerability Scanning 

Containers are continuously scanned for vulnerabilities in the Artifact Registry. (https://cloud.google.com/artifact-analysis/docs/container-scanning-overview) We're following this [tutorial](https://medium.com/google-cloud/centrally-managing-artifact-registry-container-image-vulnerabilities-on-google-cloud-part-one-d86fb4791601) as a starting point - collecting vunerabilities, cosolidating them and then pushing them to Google Cloud Storage Bucket where they will be available for use by the dashboard. 

Note - artifacts need to be <30 days old, otherwise medatdata is archived. 
** Include d2 diagram 

## Set up 

The steps outlined in init.sh will need to be created and orchestrated in the IaC GitHub repository. 

- ensure scanning is enabled,
- turn on pubsub and cloud function APIS

https://cloud.google.com/run/docs/tutorials/eventarc-functions

https://cloud.google.com/artifact-analysis/docs/investigate-vulnerabilities

https://medium.com/@a.j.abbott24/google-cloud-surfacing-container-image-vulnerabilities-91dcf3f147f3


## Deploy

The Cloud Function is not containerized initially in GitHub, as the function is containerization through Cloud Run Functions.  The image is deployed to the 'gcf-artifacts' repository in the Artifact Registry. Any changes to the function here are deployed by Cloud Build.

This can be triggered manually:

```
export BRANCH_NAME=main
gcloud builds submit --config ./cloudbuild.yaml --substitutions=BRANCH_NAME=$BRANCH_NAME,COMMIT_SHA=runOutSideOfGitTrigger-$COMMIT_SHA
```

## Considerations

This will likely need to be updated in the near future as [Cloud Functions are now part of Cloud Run](https://cloud.google.com/blog/products/serverless/google-cloud-functions-is-now-cloud-run-functions?_gl=1*5tvv8f*_ga*MzIwMDg1MDAyLjE3MTQ3Njc0NzE.*_ga_WH2QY8WWF5*MTcyOTYwOTIwOC4yNTIuMS4xNzI5NjA5NDEyLjU5LjAuMA..) and anticipate deployment scripts to become more streamlined. 
