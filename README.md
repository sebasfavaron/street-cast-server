# Street Cast Server - Phase 1

A Next.js application for managing advertising campaigns on connected displays, starting with tennis ball vending machines.

## Features

- **Advertiser Management**: Create and manage advertising clients
- **Campaign Management**: Create campaigns with start/end dates
- **Device Management**: Register and monitor connected displays
- **Analytics**: View impression data and export CSV reports
- **Manifest API**: Serve video playlists to devices
- **Impression Tracking**: Record when videos are played

## Tech Stack

- **Next.js 15** with TypeScript
- **Prisma** for database ORM
- **PostgreSQL** for data storage
- **Tailwind CSS** for styling

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Set up a PostgreSQL database (local, Railway, or Supabase)
2. Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/streetcastserver?schema=public"
```

3. Generate Prisma client and push schema to database:

```bash
npm run db:generate
npm run db:push
```

### 3. Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3050](http://localhost:3050) to view the admin dashboard.

## API Endpoints

### Manifest API

- `GET /api/manifest/[deviceId]` - Get video playlist for a specific device

### Impression API

- `POST /api/impression` - Record when a video is played
  - Body: `{ deviceId: string, creativeId: string }`

### Admin APIs

- `GET /api/advertisers` - List all advertisers
- `POST /api/advertisers` - Create new advertiser
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/devices` - List all devices
- `POST /api/devices` - Register new device
- `GET /api/analytics` - Get analytics data

## Database Schema

The application uses the following main entities:

- **Advertiser**: Advertising clients
- **Campaign**: Advertising campaigns with start/end dates
- **Creative**: Video files associated with campaigns
- **Device**: Connected displays/screens
- **Impression**: Records of when videos are played

## Usage

1. **Register Devices**: Go to the Devices page and register your connected displays
2. **Create Advertisers**: Add advertising clients in the Advertisers section
3. **Create Campaigns**: Set up campaigns with start/end dates and assign to advertisers
4. **Upload Videos**: Place MP4 files in the `public/videos/` directory and update the Creative records
5. **Monitor Analytics**: View impression data and export reports

## Next Steps (Phase 2)

- Deploy to Raspberry Pi with Chromium kiosk mode
- Create PWA for device playback
- Add video upload interface
- Implement real-time updates

## Development Notes

- The manifest API serves active campaigns (between start and end dates)
- Devices should poll the manifest API every few minutes
- Impression data is recorded in real-time
- CSV export includes campaign performance data for billing
