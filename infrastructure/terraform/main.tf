# Main Terraform configuration for MCA application infrastructure on GCP

# Provider configuration for Google Cloud
provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# VPC network and subnet definitions
resource "google_compute_network" "vpc_network" {
  name                    = "mca-vpc-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "mca-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc_network.id
}

# Google Cloud SQL instance for PostgreSQL
resource "google_sql_database_instance" "mca_db" {
  name             = "mca-db-instance"
  database_version = "POSTGRES_13"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled    = true
      private_network = google_compute_network.vpc_network.id
    }
  }

  deletion_protection = false
}

# Google Cloud Storage bucket for document storage
resource "google_storage_bucket" "document_storage" {
  name     = "mca-document-storage"
  location = var.region
  force_destroy = true

  uniform_bucket_level_access = true
}

# Google Kubernetes Engine (GKE) cluster configuration
resource "google_container_cluster" "mca_cluster" {
  name     = "mca-gke-cluster"
  location = var.region

  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.vpc_network.name
  subnetwork = google_compute_subnetwork.subnet.name

  master_auth {
    client_certificate_config {
      issue_client_certificate = false
    }
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "mca-node-pool"
  location   = var.region
  cluster    = google_container_cluster.mca_cluster.name
  node_count = 3

  node_config {
    preemptible  = true
    machine_type = "e2-medium"

    service_account = google_service_account.gke_sa.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}

# Cloud Armor security policy
resource "google_compute_security_policy" "mca_security_policy" {
  name = "mca-security-policy"

  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default rule, allow all traffic"
  }
}

# Cloud NAT and Router for outbound internet access
resource "google_compute_router" "router" {
  name    = "mca-router"
  region  = var.region
  network = google_compute_network.vpc_network.id
}

resource "google_compute_router_nat" "nat" {
  name                               = "mca-nat"
  router                             = google_compute_router.router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

# IAM roles and service accounts
resource "google_service_account" "gke_sa" {
  account_id   = "mca-gke-sa"
  display_name = "GKE Service Account"
}

resource "google_project_iam_member" "gke_sa_roles" {
  for_each = toset([
    "roles/storage.objectViewer",
    "roles/cloudsql.client"
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.gke_sa.email}"
  project = var.project_id
}

# HUMAN ASSISTANCE NEEDED
# Please review the following:
# 1. Ensure that the VPC, subnet, and GKE cluster configurations align with your network design requirements.
# 2. Verify that the Cloud SQL instance settings (tier, version) meet your performance needs.
# 3. Confirm that the GKE node pool configuration (machine type, node count) is appropriate for your workload.
# 4. Review and adjust the Cloud Armor security policy rules according to your security requirements.
# 5. Check if additional IAM roles are needed for the GKE service account based on your application's requirements.