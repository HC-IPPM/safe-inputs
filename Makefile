#################################################################################
# GLOBALS                                                                       #
#################################################################################
SHELL := /usr/bin/bash

project = $(project)
name = safe-inputs
region = northamerica-northeast1

.PHONY: cluster
cluster:
		gcloud beta container --project "$(project)" clusters create "$(name)" --region "$(region)" --no-enable-basic-auth --cluster-version "1.22.8-gke.202" --release-channel "regular" --machine-type "e2-standard-4" --image-type "COS_CONTAINERD" --disk-type "pd-standard" --disk-size "100" --metadata disable-legacy-endpoints=true --service-account "gke-least-privilege@$(project).iam.gserviceaccount.com" --max-pods-per-node "110" --num-nodes "1" --logging=SYSTEM,WORKLOAD --monitoring=SYSTEM --enable-ip-alias --network "projects/$(project)/global/networks/default" --subnetwork "projects/$(project)/regions/northamerica-northeast1/subnetworks/default" --no-enable-intra-node-visibility --default-max-pods-per-node "110" --enable-autoscaling --min-nodes "0" --max-nodes "2" --enable-dataplane-v2 --no-enable-master-authorized-networks --addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver --enable-autoupgrade --enable-autorepair --max-surge-upgrade 1 --max-unavailable-upgrade 0 --labels mesh_id=proj-145891259449 --workload-pool "$(project).svc.id.goog" --enable-shielded-nodes --shielded-secure-boot --shielded-integrity-monitoring

.PHONY: install-asm
install-asm:
		curl https://storage.googleapis.com/csm-artifacts/asm/asmcli > ingress/asmcli
		 chmod +x ingress/asmcli
		./ingress/asmcli install  --project_id $(project) --cluster_name "$(name)" --cluster_location "$(region)" --output_dir ingress/asm --enable_all --ca mesh_ca --managed --use_managed_cni

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
		  name: flux-credentials
		  namespace: flux-system
		generatorOptions:
		  disableNameSuffixHash: true
		EOF
		@echo "Now add the contents of deploy/identity.pub as a GitHub deploy key."
