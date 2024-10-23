import base64
import os
import json
from google.cloud.devtools import containeranalysis_v1
from google.cloud import storage

def write_vuln_to_bucket(bucket_name, vuln_text, destination_object_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    obj = bucket.blob(destination_object_name)
    obj.upload_from_string(vuln_text)

# @functions_framework.cloud_event
def image_vuln_pubsub_handler(event, context):
    #get the Pub/Sub message containing the vulnerability occurrence id
    data = json.loads(base64.b64decode(event['data']).decode('utf-8'))

    #load in environment variables for GCS bucket.  
    # bucket_name = os.environ.get("BUCKET_NAME", "")
    bucket_name = "my-bucket-of-risk"

    if bucket_name == '':
        print("Bucket name not set")
        return

    #get the occurrence via the grafeas client
    occurrence_name = (data['name'])
    client = containeranalysis_v1.ContainerAnalysisClient()
    grafeas_client = client.get_grafeas_client()
    o = grafeas_client.get_occurrence(name=occurrence_name)

    #write to storage
    write_vuln_to_bucket(bucket_name, str(o), str(o.name))