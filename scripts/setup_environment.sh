#!/bin/bash

# Check and install required system dependencies
echo "Checking and installing system dependencies..."
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv nodejs npm postgresql

# Set up Python virtual environment
echo "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies from requirements.txt
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Set up Node.js environment
echo "Setting up Node.js environment..."
npm install -g n
n stable

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Configure environment variables
echo "Configuring environment variables..."
cp .env.example .env
# HUMAN ASSISTANCE NEEDED
# TODO: Update .env file with appropriate values for production environment

# Initialize database schema
echo "Initializing database schema..."
# HUMAN ASSISTANCE NEEDED
# TODO: Add commands to create database and run migrations

# Set up Google Cloud SDK and authenticate
echo "Setting up Google Cloud SDK..."
# Install the Google Cloud SDK
curl https://sdk.cloud.google.com | bash
# Restart shell to ensure gcloud command is available
exec -l $SHELL
# Initialize gcloud and authenticate
gcloud init
gcloud auth application-default login

echo "Environment setup complete!"