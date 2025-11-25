#!/bin/bash
# Production startup script for Replit deployment
# Ensures database is initialized before starting the server

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting Next.js production server..."
npm start
