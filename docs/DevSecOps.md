# DevSecOps in Safe Inputs 

## Separation of CI from CD

- TODO pull based pipeline, removing the need to include environment variables in the pipeline (codecov)
- Flux 

## Infrastructure as Code

- versioned
- least priviledge

## Continuous Vunerability Scanning 

### GitHub Dependabot
### Artifact Registry Vunerability Scans 
### TODO Cluster scanning 
### Eslint Security Plugin

## Code Quality and Code Reviews

- main branch requires peer review before merge
- Any changes to IaC code requires 
- GitHub actions ensure complys with linting and code quality checks (CodeQL)

## Deployment frequency with Test coverage 

## Accessibilty Compliance

## Software Bill of Materials (SBOM) Collection

Syft was chosen as it was more comprehensive than Trivy and GCP (TODO add source).  The filesystem is scanned in the main Cloud Build when a commit is added to 