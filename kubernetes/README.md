# Setup

## Infrastructure

All Google Cloud resources (except [these](https://github.com/PHACDataHub/safe-inputs/issues/142#issuecomment-2217704143)) for this application are stored in the [acm-core](https://github.com/PHACDataHub/acm-core/tree/main/DMIA-PHAC/Experimentation/ph-safeinputs) repository as [config-connector](https://cloud.google.com/config-connector/docs/overview) manifests. A PR must be submitted against `acm-core` to add / update GCP resources.

Developers / Maintainers of this application only have `Viewer` + `Cluster Admin` access on the project.

## Application

Once the infrastructure is ready, connect to the cluster with:

```sh
gcloud container clusters get-credentials phx-01j1tbke0ax-safe-inputs --region northamerica-northeast1 --project phx-01j1tbke0ax
```

Run the following command to bootstrap the application on the cluster:

```sh
flux bootstrap git \
    --url=ssh://git@github.com/PHACDataHub/safe-inputs\
    --branch=main \
    --path=kubernetes/clusters/gke \
    --components-extra="image-reflector-controller,image-automation-controller"
```
