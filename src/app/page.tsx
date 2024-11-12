'use client';

import dynamic from 'next/dynamic';

const WorkoutTracker = dynamic(() => import('@/components/velo-tracker'), { ssr: false });

export default function Home() {
  return (
    <main>
      <WorkoutTracker />
    </main>
  );
}