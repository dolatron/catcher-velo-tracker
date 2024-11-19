# Catcher Velocity Program Tracker

A React-based web application for tracking progress through Driveline Baseball's 8-week catcher velocity program.

## Features

- 8-week workout schedule visualization
- Exercise tracking and progress persistence
- Video demonstrations for exercises
- Mobile-responsive design
- Accessibility support


### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/          # React components
│   ├── exercise-row.tsx
│   └── velo-tracker.tsx
├── data/               # Data and configuration files
│   ├── programs/
│   ├── exercises.ts
│   ├── programs.ts
│   ├── types.ts
│   └── workouts.ts
└── utils/              # Utility functions
    ├── common.ts
    ├── program-loader.ts
    └── program-utils.ts
```


## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
