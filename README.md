# AssetManagement-Web

A Next.js web application for managing dorm assets. This client application consumes the AssetManagement-API backend.

## Prerequisites

- Node.js 18+ and npm
- AssetManagement-API backend running on `http://localhost:5080` (or configure a different URL)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` to configure the backend API URL:

```env
# Backend API URL (default: http://localhost:5080)
NEXT_PUBLIC_API_URL=http://localhost:5080
```

**Note:** The frontend makes API calls to Next.js API routes (`/api/*`), which then proxy requests to the backend API configured above.

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001` (or next available port).

### 4. Build for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                 # Next.js app directory (pages and layouts)
├── components/          # React components
│   ├── dashboard/      # Dashboard-specific components
│   ├── layouts/        # Layout components (header, sidebar, etc.)
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API client
├── types/              # TypeScript type definitions
├── api/                # API route handlers (BFF pattern)
├── public/             # Static assets
└── styles/             # Global styles

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Data Fetching**: SWR
- **Charts**: Recharts
- **Icons**: Lucide React

## Features

- User authentication (register/login)
- Dashboard with asset overview
- Asset management
- Room management
- Checkout/return tracking
- Responsive design
- Dark mode support

## API Integration

The application connects to the AssetManagement-API backend. Ensure the API is running and accessible at the configured URL.

### API Endpoints Used

- `/api/auth/*` - Authentication
- `/api/assets/*` - Asset management
- `/api/rooms/*` - Room management
- `/api/checkouts/*` - Checkout tracking
- `/api/dorms/*` - Dorm management
- `/api/categories/*` - Category management

## Troubleshooting

### Build Errors

If you encounter build errors, try:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues

1. Verify the API is running: `curl http://localhost:3000/api/health`
2. Check the `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure no CORS issues in the API configuration

## Development Notes

- The project uses Tailwind CSS v4 with the new `@tailwindcss/postcss` plugin
- Font loading uses system fonts to avoid network dependencies
- ESLint is configured with Next.js recommended rules
- TypeScript strict mode is disabled by default but can be enabled in `tsconfig.json`
