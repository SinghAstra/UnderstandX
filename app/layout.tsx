import Providers from "@/components/providers/provider";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "GitHub",
    "repository documentation",
    "knowledge explorer",
    "semantic search",
    "open-source",
    "documentation tools",
    "code understanding",
    "intelligent documentation",
    "repository insights",
    "technical knowledge",
    "developer tool",
    "machine learning",
    "repository navigation",
    "code analysis",
  ],
  authors: [
    {
      name: "SinghAstra",
      url: "https://github.com/SinghAstra",
    },
  ],
  creator: "SinghAstra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/assets/hero.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/assets/hero.png"],
    creator: "@singhastra",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background">
        <Providers>
          <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                fontFamily: "Space Grotesk, monospace",
                background: "hsl(var(--muted) / 0.2)",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
                letterSpacing: "0.01em",
                fontSize: ".95rem",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
