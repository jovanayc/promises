import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Promises — a gentler work inbox",
  description:
    "One Scripture or gentle faith-filled reminder delivered to your work inbox at a random weekday moment.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://promises-ten.vercel.app"
  ),
  openGraph: {
    title: "Promises",
    description:
      "Your inbox asks things from you all day. Promises puts something back.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
