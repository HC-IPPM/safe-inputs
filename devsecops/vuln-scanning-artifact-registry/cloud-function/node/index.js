const { ContainerAnalysisClient } = require('@google-cloud/containeranalysis');
const { Storage } = require('@google-cloud/storage');
const functions = require('@google-cloud/functions-framework');

const storage = new Storage();
const containerAnalysisClient = new ContainerAnalysisClient();

const writeVulnToBucket = async (
  bucketName,
  vulnText,
  destinationObjectName,
) => {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(destinationObjectName);
    console.log(
      `Attempting to write file ${destinationObjectName} to bucket ${bucketName}`,
    );
    await file.save(vulnText);
    console.log(
      `File ${destinationObjectName} successfully written to ${bucketName}`,
    );
  } catch (error) {
    console.error(`Failed to write to bucket: ${error}`);
    throw error;
  }
};

exports.imageVulnPubSubHandler = async (event, context) => {
  try {
    // Decode the base64-encoded data and parse it as JSON
    const decodedData = Buffer.from(event.data, 'base64').toString('utf-8');
    const data = JSON.parse(decodedData);
    console.log('Decoded event data:', data);

    const bucketName =
      process.env.BUCKET_NAME || 'my-bucket-of-risk-the-second';
    if (!bucketName) {
      console.error('Bucket name not set');
      return;
    }

    // Retrieve the occurrence using the Grafeas client
    const occurrenceName = data.name;
    const grafeasClient = containerAnalysisClient.getGrafeasClient();
    const [occurrence] = await grafeasClient.getOccurrence({
      name: occurrenceName,
    });
    console.log(`Occurrence content: ${JSON.stringify(occurrence)}`);
    console.log('occurance.kind', occurrence.kind);

    if (occurrence.kind === 'VULNERABILITY') {
      // VULNERABILITY
      console.log('******************************************VULNERABILITY');
      console.log('occurrence.vulnerability', occurrence.vulnerability);

      if (
        !occurrence.vulnerability ||
        !occurrence.vulnerability.packageIssue ||
        occurrence.vulnerability.packageIssue.length === 0
      ) {
        console.log('No package issues found.');
        return;
      }

      const vulnId = occurrence.noteName.split('/').pop();
      const resourceName = occurrence.resourceUri.split('/').pop();
      console.log('Vulnerability ID:', vulnId);
      console.log('Resource Name:', resourceName);

      for (const issue of occurrence.vulnerability.packageIssue) {
        try {
          console.log('Processing issue:', issue);
          const affectedPackage = issue.affectedPackage;
          const affectedVersion = issue.affectedVersion.name;

          console.log('Affected Package:', affectedPackage);
          console.log('Affected Version:', affectedVersion);

          const occuranceFilename = `${vulnId}-${affectedPackage}-${affectedVersion}-${resourceName}`;
          console.log('Occurrence Filename:', occuranceFilename);

          await writeVulnToBucket(
            bucketName,
            JSON.stringify(occurrence),
            occuranceFilename,
          );
          console.log(`Saved ${occuranceFilename} to GCS`);
        } catch (issueError) {
          console.error(`Error processing issue ${issue}:`, issueError);
        }
      }
    } else if (occurrence.kind === 'PACKAGE') {
      console.log('PACKAGE');
    } else if (occurrence.kind === 'DISCOVERY') {
      console.log('DISCOVERY');
    } else {
      console.log(`Unhandled occurrence kind: ${occurrence.kind}`);
    }
  } catch (error) {
    console.error('Error processing event:', error);
  }
};

// Global unhandled rejection handler for more visibility
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
