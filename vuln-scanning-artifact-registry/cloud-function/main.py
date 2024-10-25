
# https://medium.com/@a.j.abbott24/google-cloud-surfacing-container-image-vulnerabilities-91dcf3f147f3
# https://github.com/GoogleCloudPlatform/python-docs-samples/tree/main/containeranalysis/snippets
# https://cloud.google.com/artifact-analysis/docs
# https://cloud.google.com/artifact-analysis/docs/reference/rest
# https://cloud.google.com/artifact-analysis/docs/reference/libraries
# https://github.com/googleapis/google-cloud-python/tree/main/packages/google-cloud-containeranalysis
# https://cloud.google.com/artifact-analysis/docs/create-notes-occurrences

import base64
import os
import json
from google.cloud.devtools import containeranalysis_v1
from google.cloud import storage
import functions_framework
# from google.cloud.devtools.containeranalysis_v1.types import NoteKind 

def write_vuln_to_bucket(bucket_name, vuln_text, destination_object_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    obj = bucket.blob(destination_object_name)
    obj.upload_from_string(vuln_text)

# @functions_framework.cloud_event
def image_vuln_pubsub_handler(event, context):
    
    # Get the Pub/Sub message containing the vulnerability occurrence id
    data = json.loads(base64.b64decode(event['data']).decode('utf-8')) # 'data' contains 3 elements { name, kind, notifcation time}

    # Load in environment variables for GCS bucket.  
    # bucket_name = os.environ.get("BUCKET_NAME", "")
    bucket_name = 'my-bucket-of-risk'

    if bucket_name == '':
        print("Bucket name not set")
        return

    # Get the occurrence via the grafeas client
    occurrence_name = (data['name'])
    client = containeranalysis_v1.ContainerAnalysisClient()
    grafeas_client = client.get_grafeas_client()
    o = grafeas_client.get_occurrence(name=occurrence_name)

    # print(f"Occurrence kind: {o.kind}") # this is numeric
    print(f"Occurance content: {o}") 
    # print(f"resource uri: {o.resource_uri}")
    # print(f"occurance note name: {o.note_name}")

    if o.kind == 1: # Note o.kind of 1 = VUNERABILITY,  4 = PACKAGE, 6 = DISCOVERY
        print('VULNERABILITY')
        
        # Extract components for filename (vunerability id, package - version)
        vuln_id = o.note_name.split('/')[-1]
        resource_name = o.resource_uri.split('/')[-1]

        # # Extract short sha
        # full_identifier = o.resource_uri.split('/')[-1] # includes container and full sha
        # # Split into name and SHA
        # container_name, full_sha = full_identifier.split(':')  # name is "sha256" and full_sha is the full SHA
        # short_sha = full_sha[:12]  # Take the first 12 characters of the SHA

         # Loop through package issues to get package details
        for issue in o.vulnerability.package_issue:
            affected_package = issue.affected_package
            affected_version = issue.affected_version.name
            # effective_severity = issue.effective_severity # This is numerical 

        # Concatenate and save to bucket
        occurance_filename = f"{vuln_id}-{affected_package}-{affected_version}-{resource_name}"
        write_vuln_to_bucket(bucket_name, str(o), str(occurance_filename))
        print(f"saved {occurance_filename} to gcs")

    elif o.kind == 4:
        print('PACKAGE')
    elif o.kind == 6:
        print('DISCOVERY')
    else:
        print(o.kind)