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
  title: "Next.js E-Commerce Store",
  description: "A comprehensive showcase of Next.js features through an e-commerce application",
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
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  NextJS Store
                </Link>
                <div className="hidden md:flex space-x-6">
                  <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                  <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Products
                  </Link>
                  <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Cart
                  </Link>
                  <a href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Dashboard
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors">
                  🛒 Cart (0)
                </a>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Next.js E-Commerce Store. Built to showcase Next.js features.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
