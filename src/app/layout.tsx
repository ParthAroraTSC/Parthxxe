import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import IPTracker from "@/components/IPTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixelMovies | Premium Streaming",
  description: "Watch movies and TV shows from Netflix, Prime Video, Apple TV+, and Disney+",
};

import Sidebar from "@/components/Sidebar";
import AntiInspect from "@/components/AntiInspect";
import SplashScreen from "@/components/SplashScreen";
import "@/components/NetflixIntro.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex bg-black text-white overflow-x-hidden">
        <SplashScreen />
        <Sidebar />
        <AntiInspect />
        <div className="flex-1 flex flex-col min-h-screen relative md:ml-[260px] lg:ml-0 w-full md:w-[calc(100%-260px)] lg:w-full">
          <Navbar />
          <IPTracker />
          <main className="flex-1 pb-20">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
