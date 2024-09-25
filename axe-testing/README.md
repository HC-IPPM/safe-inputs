
Using Axe-core wth puppeteer 

https://www.deque.com/blog/axe-and-attest-integration-puppeteer/


Here is the uk governments' on accessibility testing 
https://design.sis.gov.uk/accessibility/testing/automated-testing

end to end testing 
selenium and cypress axe core wroapper - test dialogs, temp elements and multiple pages

a

Multiple rulesets such as WCAG 2.0, Section 508, Dev-min.
Support for ruleset customization and augmentation.
Various reporting capabilities such as HTML, JUnit XML, but no longer SonarQube
TODO


* save to database with API
* have this actually crawl instead of finding/ scanning only the surface slugs 
* address credentials by creating service account/ prinicipal to single sign on with minimal permissions to scan set pages for accessibility




Accessibiltiy checks - information found here - https://www.w3.org/TR/wai-aria/

Manually run cloudbuild 
gcloud config set project YOUR_PROJECT_ID
gcloud builds submit --config cloudbuild.yaml .

or gcloud builds submit /path/to/source --config cloudbuild.yaml
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/your-image .
