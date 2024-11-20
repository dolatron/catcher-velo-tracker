'use client';

import dynamic from 'next/dynamic';

const WorkoutTracker = dynamic(() => import('@/components/workout-tracker'), { ssr: false });

export default function Home() {
  return (
    <main>
      <WorkoutTracker />
    </main>
  );
}