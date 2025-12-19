# Affiliates Portal

A modern affiliate dashboard built with Next.js 15 for managing referral programs, tracking commissions, and monitoring affiliate performance.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Wallet Integration**: Solana Wallet Adapter
- **Affiliate SDK**: Fuul SDK
- **Forms**: React Hook Form + Zod

## Prerequisites

- Node.js 20+
- pnpm 9+
- A Fuul SDK API key

## Getting Started

This project is part of a pnpm monorepo. Run all commands from the **repository root**.

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Fuul SDK Configuration (Required)
NEXT_PUBLIC_FUUL_SDK_API_KEY="your-fuul-api-key"

# API Configuration (Optional - defaults to Fuul production)
# NEXT_PUBLIC_API_URL="https://api.fuul.xyz/api"

# HubSpot contact creation app token
HUBSPOT_PRIVATE_APP_TOKEN="your-hubspot-app-token"
```

### 3. Run the development server

```bash
pnpm --filter affiliates-portal dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

Run from the repository root using `pnpm --filter affiliates-portal <script>`:

| Command        | Description                             |
| -------------- | --------------------------------------- |
| `dev`          | Start development server with Turbopack |
| `build`        | Build for production                    |
| `start`        | Start production server                 |
| `lint`         | Run ESLint                              |
| `lint:fix`     | Fix ESLint errors automatically         |
| `format`       | Format code with Prettier               |
| `format:check` | Check code formatting                   |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── commission-activity/  # Commission tables
│   │   ├── common/       # Shared components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── forms/        # Form components
│   │   ├── layout/       # Layout components
│   │   ├── links/        # Referral links management
│   │   ├── providers/    # Context providers
│   │   ├── referred-users/  # Affiliate history
│   │   ├── stats/        # Statistics cards
│   │   ├── tabs/         # Tab components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── views/        # Page views
│   │   └── wallet/       # Wallet components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   └── store/            # Zustand stores
└── public/               # Static assets
```

## Features

### Dashboard Overview

- Total fees earned
- Active traders count
- Trading volume referred
- New traders and invitees statistics
- Rebate rate display

### Links Management

- Create referral codes
- View link performance (clicks, users, earnings)
- Edit commission split between affiliate and invitee

### Affiliate History

- View all referred users
- Track volume per user
- Monitor earnings per referral
- User rebate rates

### Commission Activity

- Track commission transactions
- View payout status (Completed, Pending, Rejected)
- Reward amounts in USDC

## Wallet Connection

The portal uses Solana Wallet Adapter for authentication. Supported wallets include:

- Phantom
- Solflare
- And other Solana-compatible wallets

## API Integration

The portal integrates with the Fuul API for:

- Fetching affiliate statistics
- Managing referral codes
- Tracking payouts and commissions
- User registration status

## Development

### Code Style

The project uses ESLint and Prettier for code formatting. Run before committing:

```bash
pnpm --filter affiliates-portal lint:fix
pnpm --filter affiliates-portal format
```

### Adding UI Components

This project uses shadcn/ui. To add new components, run from `packages/affiliates-portal`:

```bash
pnpm dlx shadcn@latest add [component-name]
```

## Troubleshooting

### Turbopack error: "Next.js package not found"

This is a known issue with Turbopack in pnpm monorepos. Use this alternative command:

```bash
pnpm next dev
```

### Build fails with PageNotFoundError

This is a known issue with the development setup and doesn't affect the production build.

### Wallet not connecting

Ensure you have a Solana wallet extension installed in your browser.

### API errors

Verify your `NEXT_PUBLIC_FUUL_SDK_API_KEY` is correctly set in `.env.local`.
