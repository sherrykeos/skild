import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#080B0A",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: "SkillAtlas — The Agentic Skills Marketplace",
    template: "%s | SkillAtlas",
  },
  description:
    "Discover, publish, and share agentic skills to supercharge your AI agents. Serious developer tooling for the agentic future.",
  keywords: ["AI skills", "agentic workflows", "AI agents", "SKILL.md", "developer tools", "marketplace"],
  authors: [{ name: "SkillAtlas Team" }],
  openGraph: {
    title: "SkillAtlas — The Agentic Skills Marketplace",
    description: "Discover, publish, and share agentic skills to supercharge your AI agents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#080B0A] text-[#F1F4EF] selection:bg-[#CCD7C5] selection:text-[#080B0A] flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
