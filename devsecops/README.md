# DevSecOps in Safe Inputs

## Separation of CI from CD

TBA

- Pull based pipeline using Flux - removing the need to include environment variables in the pipeline (e.g., preventing codecov incident)

## Infrastructure as Code

TBA

- versioned
- least priviledge

## Continuous Vunerability Scanning

### GitHub Dependabot

TBA

### Artifact Registry Vunerability Scans

TBA

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

## Software Bill of Materials (SBOM) Collection

An SBOM provides a detailed inventory of all components, libraries, and dependencies within a software application. We scan the application in the main Cloud Build pipeline to maintain an up-to-date bill of materials for everything included in the software from the GitHub repository, which is updated on every push to the main branch. This will enables quicker impact assesments to incidents, such as the [Log4j vunerability](https://en.wikipedia.org/wiki/Log4Shell), and helps ensure adherence to security compliance requirements.

We selected [Syft](https://github.com/anchore/syft), an open source tool, for SBOM generation because it is more comprehensive than [Trivy](https://aquasecurity.github.io/trivy/v0.33/docs/sbom/), and using [GCP Artifact Registry SBOM](https://cloud.google.com/artifact-analysis/docs/sbom-overview) would exclude libraries used only in developement. (#TODO add source).

The SBOM results are saved to a Google Cloud Storage bucket using the Commit SHA as part of the filename.

While Syft includes licenses in the SBOM, we may also add a [specific license risk scan](https://aquasecurity.github.io/trivy/v0.47/docs/scanner/license/) to more easily flag conflicts and/or risks in the future.
# DevSecOps in Safe Inputs
