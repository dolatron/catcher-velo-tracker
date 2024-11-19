import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ProgramProvider } from '@/contexts/program-context';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Catcher Velocity Program",
  description: "8-Week Catcher Velocity Training Program by Driveline Baseball",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgramProvider>
          {children}
        </ProgramProvider>
      </body>
    </html>
  );
}
