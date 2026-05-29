import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Order Management System",
  description: "Multi-store order management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4 flex gap-6">
            <Link href="/" className="font-bold text-blue-600 text-lg">
              OrderMS
            </Link>
            <Link href="/create-order" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              Create Order
            </Link>
            <Link href="/orders" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              Orders List
            </Link>
            <Link href="/update-status" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
              Update Status
            </Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}