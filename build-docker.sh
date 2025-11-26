#!/bin/bash

# Build script for Docker image
# Usage: ./build-docker.sh [image-name] [tag]

set -e

# Default values
IMAGE_NAME=${1:-decklist-exporter}
TAG=${2:-latest}
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"

echo "Building Docker image: ${FULL_IMAGE_NAME}"

# Build the Docker image
docker build -t "${FULL_IMAGE_NAME}" .

echo "✓ Docker image built successfully: ${FULL_IMAGE_NAME}"
echo ""
echo "To run the container:"
echo "  docker run -p 8080:80 -e BACKEND_HOST=backend-host:3000 ${FULL_IMAGE_NAME}"
echo ""
echo "Example:"
echo "  docker run -p 8080:80 -e BACKEND_HOST=localhost:3000 ${FULL_IMAGE_NAME}"

