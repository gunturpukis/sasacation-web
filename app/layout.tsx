import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 
export const metadata: Metadata = {
  title: "Sasacation - Jelajahi Keindahan Lombok",
  description: "Temukan destinasi wisata, hotel, dan kuliner terbaik di Lombok",
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${fraunces.variable} ${jakartaSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
 