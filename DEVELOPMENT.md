# Development Environment Setup

This guide will help you set up a local development environment for the Street Cast Server.

## Prerequisites

- Node.js 22+ (recommended: use nvm to manage versions)
- PostgreSQL database (local or cloud)
- Git

## Quick Start

### Automated Setup (Recommended)

The easiest way to get started is using our automated setup script:

```bash
git clone <your-repo-url>
cd street-cast-server

# Run the automated setup script
npm run setup
```

This will:

- Check Node.js version (requires 22+)
- Install all dependencies
- Generate Prisma client
- Create `.env.local` from template
- Guide you through the remaining steps

### Manual Setup

If you prefer to set up manually or the automated script doesn't work:

#### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd street-cast-server

# If using nvm (recommended)
nvm use

# Install dependencies
npm install
```

#### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your local configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/streetcastserver?schema=public"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3050"

# Development Settings
NODE_ENV="development"
```

#### 3. Database Setup

Choose one of these options:

**Option A: Local PostgreSQL**

1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE streetcastserver;
   ```
3. Update your `.env.local` with the correct connection string

**Option B: Cloud Database (Recommended for Development)**

1. **Neon**:
   - Ask owner for development/production connection string

#### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Add sample data (optional but recommended)
npm run db:seed
```

#### 5. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3050](http://localhost:3050)

## Development Scripts

- `npm run setup` - **Automated development environment setup**
- `npm run dev` - Start development server with Turbopack on port 3050
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Add sample data to database
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
street-cast-server/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── api/            # API routes
│   │   └── layout.tsx      # Root layout
│   └── types/              # TypeScript type definitions
├── prisma/
│   └── schema.prisma       # Database schema
├── public/
│   └── videos/             # Video files for testing
├── lib/
│   └── prisma.ts           # Prisma client configuration
└── scripts/
    └── deploy.sh           # Deployment script
```

## Testing the Setup

1. **Admin Dashboard**: Visit [http://localhost:3050](http://localhost:3050)
2. **Test with Sample Data** (if you ran `npm run db:seed`):
   - Sample advertiser: "Tennis Ball Co."
   - Sample campaign: "Summer Tennis Campaign"
   - Sample creatives: `sample-ad-1.mp4` and `sample-ad-2.mp4`
   - Sample device: "Tennis Court Display #1"
3. **Or Create Your Own Test Data**:
   - Create an advertiser
   - Create a campaign
   - Add a creative (use sample videos from `public/videos/`)
   - Register a test device
4. **Test API Endpoints**:
   - Manifest API: `GET /api/manifest/dev-device-1` (if using sample data)
   - Analytics: `GET /api/analytics`

## Sample Data

The `public/videos/` directory contains sample video files for testing:

- `sample-ad-1.mp4`
- `sample-ad-2.mp4`

## Troubleshooting

### Database Connection Issues

1. Verify your `DATABASE_URL` is correct
2. Ensure the database server is running
3. Check if the database exists
4. Verify network connectivity (for cloud databases)

### Port Already in Use

If port 3050 is already in use:

```bash
# Kill process on port 3050
lsof -ti:3050 | xargs kill -9

# Or use a different port
npm run dev -- -p 3051
```

### Prisma Issues

```bash
# Reset Prisma client
rm -rf node_modules/.prisma
npm run db:generate

# Reset database (WARNING: This will delete all data)
npx prisma db push --force-reset
```

## Development Tips

1. **Hot Reload**: The development server supports hot reloading for most changes
2. **Database Changes**: Use `npm run db:push` after schema changes
3. **Type Safety**: TypeScript will catch type errors during development
4. **Linting**: Run `npm run lint` to check code quality
5. **Database GUI**: Use `npm run db:studio` to inspect your database

## Next Steps

Once your development environment is set up:

1. Explore the admin dashboard
2. Create test campaigns and creatives
3. Test the device manifest API
4. Review the codebase structure
5. Make your first feature changes

## Getting Help

- Check the main [README.md](./README.md) for project overview
- Check the Prisma documentation for database operations
- Review Next.js documentation for framework-specific questions
