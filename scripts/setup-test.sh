#!/bin/bash

# Check if .env file exists, if not create it
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "DATABASE_URL=\"postgresql://postgres:lol***3000@localhost:5432/turaco_db\"" > .env
  echo "NEXT_PUBLIC_APP_URL=\"http://localhost:3001\"" >> .env
fi

# Check if database exists and create it if not
echo "Checking database..."
if ! psql -h localhost -U postgres -lqt | cut -d \| -f 1 | grep -qw turaco; then
  echo "Creating database..."
  psql -h localhost -U postgres -c "CREATE DATABASE turaco"
fi

# Push the database schema
echo "Setting up database schema..."
npx prisma db push

# Create test data
echo "Creating test gift..."
node -r ts-node/register scripts/testGiftAPI.ts

# Start the development server
echo "Starting Next.js development server..."
npm run dev 