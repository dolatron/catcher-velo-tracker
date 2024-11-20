# Catcher Velo Tracker

A web application for tracking progress through an 8-week velocity development program designed for baseball catchers.

## Overview

Built with Next.js 15 and TypeScript, this application helps catchers track their progression through specialized throwing programs. It features workout tracking, exercise demonstrations, and progress monitoring.

## Features

- 8-week workout schedule visualization
- Daily workout tracking with RPE recording
- Exercise note-taking capabilities
- Mobile-responsive interface
- Dark mode support
- Local storage persistence

## Tech Stack

- Next.js 15
- TypeScript
- React 18
- TailwindCSS
- Radix UI Components
- Local Font Optimization (Geist Sans/Mono)

## Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dolatron/catcher-velo-tracker.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
├── src
│   ├── app
│   │   ├── favicon.ico
│   │   ├── fonts
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── common
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── components
│   │   ├── date-picker.tsx
│   │   ├── day-card.tsx
│   │   ├── exercise-row.tsx
│   │   ├── ui
│   │   │   ├── alert.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── confirm-modal.tsx
│   │   │   └── label.tsx
│   │   ├── workout-detail-card.tsx
│   │   └── workout-tracker.tsx
│   ├── contexts
│   │   └── program-context.tsx
│   ├── lib
│   │   └── utils.ts
│   └── programs
│       └── driveline-catcher-velo
│           ├── exercises.json
│           └── program.json
```

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
