#################################################################################
# GLOBALS                                                                       #
#################################################################################
SHELL := /usr/bin/bash

project := pdcp-cloud-005-safeinputs
project_number := 718380134822
name := safe-inputs
region := northamerica-northeast1
ipname := safeinputs-ip
release_channel := regular
english_domain := safeinputs.phac.alpha.canada.ca

ip = $(shell gcloud compute addresses describe --region $(region) $(ipname) --format='value(address)')

.PHONY: cluster
cluster:
		gcloud container --project "$(project)" clusters create-auto "$(name)" --region "$(region)" --release-channel "$(release_channel)"

.PHONY: cluster-join-fleet
cluster-join-fleet:
		gcloud services enable mesh.googleapis.com --project="$(project)"
		gcloud container fleet memberships register "$(name)" --gke-uri=https://container.googleapis.com/v1/projects/"$(project)"/locations/"$(region)"/clusters/"$(name)" --enable-workload-identity --project "$(project)"
		gcloud projects add-iam-policy-binding "$(project)" --member "serviceAccount:service-$(project_number)@gcp-sa-servicemesh.iam.gserviceaccount.com" --role roles/anthosservicemesh.serviceAgent
		gcloud container clusters update  --project "$(project)" "$(name)" --region "$(region)" --update-labels "mesh_id=proj-$(project_number)"
		gcloud container fleet mesh update --management automatic --memberships "$(name)" --project "$(project)"

.PHONY: watch-mesh
watch-mesh:
		watch gcloud container fleet mesh describe --project "$(project)"

# TODO: test this and figure out a reasonable zone name
.PHONY: dns
dns:
		gcloud services enable dns.googleapis.com
		gcloud dns --project="$(project)" managed-zones create $(name) --description="" --dns-name="$(english_domain)." --visibility="public" --dnssec-state="off"
		gcloud dns --project="$(project)" record-sets create "$(english_domain)." --zone=$(name) --type="CAA" --ttl="300" --rrdatas="0 issue "letsencrypt.org""
		gcloud compute addresses create $(ipname) --project="$(project)" --region="$(region)"
		gcloud dns --project="$(project)" record-sets create "$(english_domain)." --zone=$(name) --type="A" --ttl="300" --rrdatas="$(ip)"

# TODO: reduce priviledges below dns admin
.PHONY: dns-solver-service-account
dns-solver-service-account:
		gcloud iam service-accounts create dns01-solver --display-name "dns01-solver"
		gcloud projects add-iam-policy-binding "$(project)" --member "serviceAccount:dns01-solver@$(project).iam.gserviceaccount.com" --role roles/dns.admin
		gcloud iam service-accounts add-iam-policy-binding --role roles/iam.workloadIdentityUser --member "serviceAccount:$(project).svc.id.goog[cert-manager/cert-manager]" dns01-solver@$(project).iam.gserviceaccount.com


.ONESHELL:
.PHONY: deploy-keys
deploy-keys:
		mkdir deploy
		kubectl create namespace flux-system -o yaml --dry-run=client > deploy/namespace.yaml
		ssh-keygen -t ed25519 -q -N "" -C "flux-read-write" -f deploy/identity
		ssh-keyscan github.com > deploy/known_hosts
		@cat <<-'EOF' > deploy/kustomization.yaml
		apiVersion: kustomize.config.k8s.io/v1beta1
		kind: Kustomization
		resources:
		  - namespace.yaml
		secretGenerator:
		- files:
		  - identity
		  - identity.pub
		  - known_hosts
		  name: flux-system
		  namespace: flux-system
		generatorOptions:
		  disableNameSuffixHash: true
		EOF
		@echo "Now add the contents of deploy/identity.pub as a GitHub deploy key."
