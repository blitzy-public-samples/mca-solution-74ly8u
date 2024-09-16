variable "project_id" {
  description = "The ID of the Google Cloud project"
  type        = string
}

variable "region" {
  description = "The region to deploy resources"
  type        = string
}

variable "zone" {
  description = "The zone within the region to deploy resources"
  type        = string
}

variable "vpc_network_name" {
  description = "The name of the VPC network"
  type        = string
}

variable "subnet_cidr_range" {
  description = "The CIDR range for the subnet"
  type        = string
}

variable "db_instance_name" {
  description = "The name of the database instance"
  type        = string
}

variable "db_version" {
  description = "The database version"
  type        = string
}

variable "db_tier" {
  description = "The machine type of the database instance"
  type        = string
}

variable "storage_bucket_name" {
  description = "The name of the Google Cloud Storage bucket"
  type        = string
}

variable "gke_cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
}

variable "gke_node_count" {
  description = "The number of nodes in the GKE cluster"
  type        = number
}

variable "gke_machine_type" {
  description = "The machine type for GKE nodes"
  type        = string
}

variable "gke_min_master_version" {
  description = "The minimum version of the master in GKE"
  type        = string
}

variable "app_service_account_name" {
  description = "The name of the service account for the application"
  type        = string
}

variable "db_service_account_name" {
  description = "The name of the service account for the database"
  type        = string
}

variable "storage_service_account_name" {
  description = "The name of the service account for storage access"
  type        = string
}