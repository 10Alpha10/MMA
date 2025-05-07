import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuizMate – Your Studying Companion",
  description: "Generate multiple-choice, short-answer or true-false quiz exams from text descriptions or PDF documents using AI",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
          <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
              <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
              >
                  <AuthProvider>
                    {children}
                  </AuthProvider>
              </ThemeProvider>
          </body>
      </html>
  );
}
