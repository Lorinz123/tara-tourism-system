import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// Import your CartProvider
import { CartProvider } from "./context/CartContext"; 

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"] 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: "TARA Bisita Cordova",
  description: "Explore Cordova, Cebu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex flex-col min-h-screen bg-[#FDFCF8]">
        {/* Wrap everything in the CartProvider */}
        <CartProvider>
          <Navbar />
          
          {/* The flex-grow pushes the footer down if the page has little content */}
          <main className="flex-grow">
            {children}
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}