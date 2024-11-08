const { ContainerAnalysisClient } = require('@google-cloud/containeranalysis');
const { Storage } = require('@google-cloud/storage');
const functions = require('@google-cloud/functions-framework');

const storage = new Storage();
const client = new ContainerAnalysisClient();

async function writeVulnToBucket(bucketName, vulnText, destinationObjectName) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(destinationObjectName);
  await file.save(vulnText);
  console.log(`File ${destinationObjectName} saved to bucket ${bucketName}`);
}

functions.cloudEvent('imageVulnPubSubHandler', async (event) => {
  // Decode and parse the Pub/Sub message
  const data = JSON.parse(Buffer.from(event.data, 'base64').toString());

  // Load bucket name (can be set as an environment variable)
  const bucketName = process.env.BUCKET_NAME || 'my-bucket-of-risk-the-second';

  if (!bucketName) {
    console.error('Bucket name not set');
    return;
  }

  try {
    // Get the occurrence via the Container Analysis API client
    const occurrenceName = data.name;
    const [grafeasClient] = await client.getGrafeasClient();
    const [occurrence] = await grafeasClient.getOccurrence({ name: occurrenceName });

    console.log(`Occurrence content: ${JSON.stringify(occurrence, null, 2)}`);

    if (occurrence.kind === 'VULNERABILITY') {
      console.log('VULNERABILITY');

      // Extract components for filename
      const vulnId = occurrence.noteName.split('/').pop();
      const resourceName = occurrence.resourceUri.split('/').pop();

      // Loop through package issues to get package details
      for (const issue of occurrence.vulnerability.packageIssue) {
        const affectedPackage = issue.affectedPackage;
        const affectedVersion = issue.affectedVersion.name;

        // Create filename and save to bucket
        const occurrenceFilename = `${vulnId}-${affectedPackage}-${affectedVersion}-${resourceName}`;
        await writeVulnToBucket(bucketName, JSON.stringify(occurrence, null, 2), occurrenceFilename);
        console.log(`Saved ${occurrenceFilename} to GCS`);
      }
    } else if (occurrence.kind === 'PACKAGE') {
      console.log('PACKAGE');
    } else if (occurrence.kind === 'DISCOVERY') {
      console.log('DISCOVERY');
    } else {
      console.log(occurrence.kind);
    }
  } catch (error) {
    console.error('Error processing occurrence:', error);
  }
});

