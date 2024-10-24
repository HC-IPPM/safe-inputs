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

def delete_vuln_from_bucket(bucket_name, destination_object_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    obj = bucket.blob(destination_object_name)
    obj.delete()

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

    # Get the occurrence via the grafeas client
    occurrence_name = (data['name'])
    client = containeranalysis_v1.ContainerAnalysisClient()
    grafeas_client = client.get_grafeas_client()
    occurrence = grafeas_client.get_occurrence(name=occurrence_name)

    # Create a simple file name based on the occurrence ID, storing it at the root of the bucket
    occurrence_id = occurrence_name.split('/')[-1]  # Extract the occurrence ID
    destination_object_name = f"{occurrence_id}.json"  # Use the ID as the filename

 # Check if the vulnerability has been resolved or fixed
    # vulnerability_state = occurrence.vulnerability.effective_severity
    # Or check for 'state' (if applicable)
    if occurrence.vulnerability.state in ["DISMISSED", "FIXED"]:  # not ACTIVE
        # Suffix the file with resolved/fixed
        new_object_name = f"{occurrence_id}-{occurrence.vulnerability.state.lower()}.json"

        # Delete the old active file
        try:
            delete_vuln_from_bucket(bucket_name, original_object_name)
            print(f"Deleted active vulnerability: {original_object_name}")
        except Exception as e:
            print(f"Failed to delete active vulnerability: {e}")

        # Write the new resolved/fixed vulnerability to the bucket
        write_vuln_to_bucket(bucket_name, str(occurrence), new_object_name)
        print(f"Saved resolved/fixed vulnerability as: {new_object_name}")

    else:
        # Write or update the vulnerability information in the bucket
        write_vuln_to_bucket(bucket_name, str(occurrence), destination_object_name)
        print(f"Updated vulnerability: {occurrence_id}")

    # #write to storage
    # # write_vuln_to_bucket(bucket_name, str(o), str(o.name))
    # write_vuln_to_bucket(bucket_name, str(o), destination_object_name)