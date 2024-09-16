output "vpc_network_id" {
  description = "The ID of the VPC network"
  value       = google_compute_network.vpc_network.id
}

output "subnet_id" {
  description = "The ID of the subnet"
  value       = google_compute_subnetwork.subnet.id
}

output "database_instance_connection_name" {
  description = "The connection name of the Cloud SQL instance"
  value       = google_sql_database_instance.database_instance.connection_name
}

output "storage_bucket_url" {
  description = "The URL of the Google Cloud Storage bucket"
  value       = google_storage_bucket.storage_bucket.url
}

output "gke_cluster_endpoint" {
  description = "The endpoint for the GKE cluster"
  value       = google_container_cluster.gke_cluster.endpoint
}

output "gke_cluster_name" {
  description = "The name of the GKE cluster"
  value       = google_container_cluster.gke_cluster.name
}

output "service_account_emails" {
  description = "The emails of the service accounts"
  value = {
    gke_service_account     = google_service_account.gke_service_account.email
    storage_service_account = google_service_account.storage_service_account.email
    # Add other service account emails as needed
  }
}