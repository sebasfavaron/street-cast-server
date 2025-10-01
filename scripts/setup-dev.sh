#!/bin/bash

# Street Cast Server - Development Setup Script
# This script helps set up a local development environment

set -e

echo "🚀 Setting up Street Cast Server development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .nvmrc exists and use it
if [ -f ".nvmrc" ]; then
    REQUIRED_NODE_VERSION=$(cat .nvmrc)
    print_status "Found .nvmrc file with Node.js version: $REQUIRED_NODE_VERSION"
    
    # Check if nvm is available
    if command -v nvm &> /dev/null; then
        print_status "Using nvm to switch to Node.js $REQUIRED_NODE_VERSION..."
        nvm use
    elif [ -f "$HOME/.nvm/nvm.sh" ]; then
        print_status "Loading nvm and switching to Node.js $REQUIRED_NODE_VERSION..."
        source "$HOME/.nvm/nvm.sh"
        nvm use
    else
        print_warning "nvm not found. Please install nvm or ensure Node.js $REQUIRED_NODE_VERSION is installed."
    fi
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 22+ first."
    print_error "You can use nvm: nvm install 22 && nvm use 22"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    print_error "Node.js version 22+ is required. Current version: $(node -v)"
    print_error "Please update to Node.js 22+ or use nvm: nvm install 22 && nvm use 22"
    exit 1
fi

print_success "Node.js $(node -v) is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm $(npm -v) is installed"

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npm run db:generate

if [ $? -eq 0 ]; then
    print_success "Prisma client generated successfully"
else
    print_warning "Prisma client generation failed (this is OK if database is not set up yet)"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_status "Creating .env.local file..."
    cp .env.example .env.local
    print_success ".env.local created from .env.example"
    print_warning "Please update .env.local with your database connection string"
else
    print_success ".env.local already exists"
fi

# Check if database is configured
if grep -q "postgresql://username:password@localhost" .env.local; then
    print_warning "Database URL is still using default values"
    print_warning "Please update .env.local with your actual database connection string"
    print_status "You can use:"
    print_status "  - Local PostgreSQL: postgresql://username:password@localhost:5432/streetcastserver?schema=public"
    print_status "  - Neon: Get from neon.tech dashboard"
fi

print_success "Development environment setup complete!"
echo ""
print_status "Next steps:"
echo "1. Update .env.local with your database connection string"
echo "2. Run: npm run db:push (to set up database schema)"
echo "3. Run: npm run db:seed (to add sample data - optional but recommended)"
echo "4. Run: npm run dev (to start development server)"
echo "5. Visit: http://localhost:3050"
echo ""
print_status "For detailed instructions, see DEVELOPMENT.md"
