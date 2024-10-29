import Providers from "@/components/providers/provider";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "GitHub Integration",
    "AI-powered Code Analysis",
    "Codebase Summarization",
    "Frontend and Backend Explanation",
    "Data Model Visualization",
    "Developer Productivity",
    "Code Documentation",
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
        url: `${siteConfig.url}/api/og`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/api/og`],
    creator: "@XSinghAstra",
  },
  icons: {
    icon: "/assets/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-background text-foreground antialiased !font-default overflow-x-hidden`}
      >
        <Providers>
          <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
