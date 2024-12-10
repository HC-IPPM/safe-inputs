# DevSecOps in Safe Inputs

## Separation of CI from CD

TBA

- Pull based pipeline using Flux/ArgoCD - removing the need to include environment variables in the pipeline (e.g., preventing codecov incident)

## Infrastructure as Code

TBA

- versioned
- least priviledge

## Vunerability Scanning

Scanning for vulnerabilities using third-party tools in CI is limited to the time of commit. Since both Dependabot/Renovate and Artifact Registry both already scan for vunerabilities continuously, we can use these assess risk.

### Continuous Scanning with Renovate

[Renovate](https://docs.renovatebot.com/) continuously scans the source code in GitHub, which will include any development dependencies, for vulnerabilities. Renovate will automatically create PRs with patches and update these dependencies.

### [Automatic Artifact Registry Vunerability Scans](./artifact-registry-vulnerability-scanning)

Artifact Registry stores container images that are used by GCP services. When the container analysis service is turned on, Artifact Registry checks for vunerabilities multiple times a day, then publishes occurances (i.e. discovery, package, vunerability) to Pub/Sub which can be monitored.

As we're looking to access these vunerabilities through an external (non-public) DevSecOps dashboard, we're using a cloud function to filter the occurances, then save the vunerabilities to a storage bucket that the dashboard will have access to.

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
