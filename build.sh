#!/bin/bash

# Frontend Docker Build Script

echo "🚀 Building Qode Frontend Docker Image..."

# Build the production image
docker build -t qode-frontend:latest .

if [ $? -eq 0 ]; then
    echo "✅ Frontend Docker image built successfully!"
    echo "📦 Image name: qode-frontend:latest"
    echo ""
    echo "To run the frontend container:"
    echo "  docker run -p 3000:80 qode-frontend:latest"
    echo ""
    echo "To run with docker-compose:"
    echo "  docker-compose up frontend"
else
    echo "❌ Failed to build frontend Docker image"
    exit 1
fi
