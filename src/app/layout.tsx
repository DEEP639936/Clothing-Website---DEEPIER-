import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deepier.example.com"),
  title: {
    default: "DEEPIER — Premium Embroidered Clothing | Wear Your Story",
    template: "%s | DEEPIER",
  },
  description:
    "DEEPIER crafts premium embroidered clothing — contemporary streetwear and sophisticated everyday fashion. Premium fabrics, detailed embroidery, designed for those who go deeper.",
  keywords: [
    "DEEPIER",
    "embroidered clothing",
    "premium streetwear",
    "embroidery fashion",
    "oversized t-shirts",
    "premium hoodies",
    "Indian fashion brand",
    "designer clothing",
  ],
  authors: [{ name: "DEEPIER" }],
  creator: "DEEPIER",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "DEEPIER — Premium Embroidered Clothing",
    description:
      "Premium clothing where embroidery becomes the identity. Crafted for those who go deeper.",
    url: "https://deepier.example.com",
    siteName: "DEEPIER",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "DEEPIER — Premium Embroidered Clothing",
    description:
      "Premium clothing where embroidery becomes the identity. Crafted for those who go deeper.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#141414",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DEEPIER",
  url: "https://deepier.example.com",
  logo: "https://deepier.example.com/logo.svg",
  sameAs: [
    "https://instagram.com/deepier",
    "https://facebook.com/deepier",
    "https://youtube.com/@deepier",
    "https://pinterest.com/deepier",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "care@deepier.com",
    availableLanguage: ["English", "Hindi"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans antialiased bg-background text-foreground`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
