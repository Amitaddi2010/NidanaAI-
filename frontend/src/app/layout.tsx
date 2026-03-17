import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Shell from "@/components/layout/Shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "NidanaAI | CDSS for Orthopedic Infections",
  description: "AI-powered clinical decision support system for FRI and PJI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
