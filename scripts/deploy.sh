#!/bin/bash

# Street Cast Server - Vercel Deployment Script

echo "🚀 Starting Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

# Run TypeScript check
echo "🔍 Running TypeScript check..."
npm run tsc
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix them before deploying."
    exit 1
fi

# Run ESLint check
echo "🔍 Running ESLint check..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ ESLint errors found. Please fix them before deploying."
    exit 1
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
