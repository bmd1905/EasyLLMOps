# Ref: https://github.com/terraform-google-modules/terraform-google-kubernetes-engine/blob/master/examples/simple_autopilot_public
# To define that we will use GCP
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.80.0" // Provider version
    }
  }
  required_version = "1.9.5" // Terraform version
}

// The library with methods for creating and
// managing the infrastructure in GCP, this will
// apply to all the resources in the project
provider "google" {
  project = var.project_id
  region  = var.region
}

// Google Kubernetes Engine
resource "google_container_cluster" "primary" {
  name     = "${var.project_id}-gke"
  location = var.region

  // Enabling Autopilot for this cluster
  enable_autopilot = false

  // Specify the initial number of nodes
  initial_node_count = 3

  // Node configuration
  node_config {
    machine_type = "e2-standard-2" // 2 vCPUs, 8 GB RAM
    disk_size_gb = 30
  }
}