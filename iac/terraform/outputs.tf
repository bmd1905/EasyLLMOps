// This will create the output likes this
// Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

// Outputs:
//    kubernetes_cluster_host = "34.28.90.0"
//    kubernetes_cluster_name = "mle-course-gke"
//    project_id = "mle-course"
//    region = "us-central1"

output "project_id" {
  value       = var.project_id
  description = "Project ID"
}

output "kubernetes_cluster_name" {
  value       = google_container_cluster.primary.name
  description = "GKE Cluster Name"
}

output "kubernetes_cluster_host" {
  value       = google_container_cluster.primary.endpoint
  description = "GKE Cluster Host"
}

output "region" {
  value       = var.region
  description = "GKE region"
}
