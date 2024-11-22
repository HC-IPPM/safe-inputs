# DevSecOps in Safe Inputs

## Separation of CI from CD

TBA

- Pull based pipeline using Flux/ArgoCD - removing the need to include environment variables in the pipeline (e.g., preventing codecov incident)

## Infrastructure as Code

TBA

- versioned
- least priviledge

## Vunerability Scanning

Scanning for vulnerabilities using third party tools in CI have the limitation of only being scanned at the time of commit. As both Dependabot/Renovate and Artifact Registry already continuously scanning for vulnerabilities, we can use this information from these sources for the (non-public) DevSecOps dashboard.

### Continuous Scanning with Renovate

[Renovate](https://docs.renovatebot.com/) continuously scans source code in GitHub, including development dependencies, for vulnerabilities. It automates dependency updates.

### [Continuous Artifact Registry Vunerability Scans](./artifact-registry-vulnerability-scanning)

The Artifact Registry is where the container images used by other Google Cloud Platform (GCP) services are stored. When continuous vunerability scanning is enabled on the Artifact Registry, it pushes occurrences via Pub/Sub, which can be monitored in the Security Command Center.  

To enable visibility into these vulnerability occurrences outside of GCP and integrate them with the DevSecOps dashboard, we use a Cloud Function.This Cloud Function:

* Subscribes to Pub/Sub messages.
* Filters for vulnerability-related occurrences.
* Saves the filtered data to a Google Cloud Storage bucket for the dashboard to access. 

### TODO Cluster scanning

TBA

### Eslint Security Plugin

TBA

## Code Quality and Code Reviews

TBA

- Main branch requires peer review before merge
- GitHub actions ensure complys with linting and code quality checks (CodeQL)
- Any changes to IaC code requires

## Deployment Frequency - Enabled with Test Coverage

TBA

## Accessibilty Compliance

TBA

## [Software Bill of Materials (SBOM) Collection](./sbom)

An SBOM provides a detailed inventory of all components, libraries, and dependencies within a software application. We scan the application in the main Cloud Build pipeline to maintain an up-to-date bill of materials for everything included in the software from the GitHub repository, which is updated on every push to the main branch. This will enables quicker impact assesments to incidents, such as the [Log4j vunerability](https://en.wikipedia.org/wiki/Log4Shell), and helps ensure adherence to security compliance requirements.

We selected [Syft](https://github.com/anchore/syft), an open source tool, for SBOM generation because it is more comprehensive than [Trivy](https://aquasecurity.github.io/trivy/v0.33/docs/sbom/), and using [GCP Artifact Registry SBOM](https://cloud.google.com/artifact-analysis/docs/sbom-overview) would exclude libraries used only in developement. (#TODO add source).

The SBOM results are saved to a Google Cloud Storage bucket using the Commit SHA as part of the filename.

While Syft includes licenses in the SBOM, we may also add a [specific license risk scan](https://aquasecurity.github.io/trivy/v0.47/docs/scanner/license/) to more easily flag conflicts and/or risks in the future.

## Accessibility

While accessibility might not traditionally be part of DevSecOps, it plays an important role in delivering compliant applications. Accessibilty can often become a bottleneck when seeking authority to operate (ATO), and since DevSecOps aims to remove bottlenecks, we're addressing this by shifting accessibility left in the development process. This approach ensures applications are built with accessibility in mind from the start, allowing developers to learn and integrate feedback from the accessibility scans and linters as they work. However, because not all accessibility issues can be caught through automation, automated scans testing is paired with manual testing at regular intervals.

As the application matures, so will the accessibility testing, eventually incorporating testing for specific user flows.

For further details, refer to the [axe-testing directory](./axe-testing/README.md).
