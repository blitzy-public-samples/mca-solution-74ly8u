#!/bin/bash

set -e

# Authenticate with Google Cloud
echo "Authenticating with Google Cloud..."
gcloud auth activate-service-account --key-file=${GCP_SERVICE_ACCOUNT_KEY}
gcloud config set project ${GCP_PROJECT_ID}

# Build and push Docker images
echo "Building and pushing Docker images..."
docker build -t gcr.io/${GCP_PROJECT_ID}/mca-backend:${VERSION} ./backend
docker push gcr.io/${GCP_PROJECT_ID}/mca-backend:${VERSION}

docker build -t gcr.io/${GCP_PROJECT_ID}/mca-frontend:${VERSION} ./frontend
docker push gcr.io/${GCP_PROJECT_ID}/mca-frontend:${VERSION}

# Apply Terraform configurations
echo "Applying Terraform configurations..."
cd terraform
terraform init
terraform apply -auto-approve

# Deploy backend to Google Kubernetes Engine
echo "Deploying backend to GKE..."
gcloud container clusters get-credentials ${GKE_CLUSTER_NAME} --zone ${GKE_ZONE}
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Deploy frontend to Google Cloud Storage or CDN
echo "Deploying frontend to Google Cloud Storage..."
gsutil rsync -R ./frontend/build gs://${FRONTEND_BUCKET_NAME}

# Update database schema if necessary
echo "Updating database schema..."
# HUMAN ASSISTANCE NEEDED
# Add database migration commands here. This depends on the specific database and migration tool used.

# Configure Google Cloud services
echo "Configuring Google Cloud services..."
gcloud sql instances patch ${CLOUD_SQL_INSTANCE_NAME} --database-flags=${DB_FLAGS}
gsutil mb gs://${STORAGE_BUCKET_NAME}
gsutil iam ch allUsers:objectViewer gs://${STORAGE_BUCKET_NAME}

# Set up monitoring and logging
echo "Setting up monitoring and logging..."
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com

# Perform post-deployment tests
echo "Performing post-deployment tests..."
# HUMAN ASSISTANCE NEEDED
# Add specific post-deployment test commands here. These will vary based on the application's requirements.

echo "Deployment completed successfully!"