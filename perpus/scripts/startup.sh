#!/bin/bash
# Startup script for Replit deployment
# Ensures database is initialized before starting the server

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting Next.js development server on port 5000..."
PORT=5000 npm run dev -- -H 0.0.0.0 -p 5000
