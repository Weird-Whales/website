import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/site/CurrencyProvider";
import { getEthRates } from "@/lib/rates";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://weirdwhales.com"),
  title: {
    default: "Weird Whales",
    template: "%s · Weird Whales",
  },
  description:
    "3,350 generative pixel-art whales swimming on the Ethereum blockchain.",
  openGraph: {
    title: "Weird Whales",
    description:
      "3,350 generative pixel-art whales swimming on the Ethereum blockchain.",
    url: "https://weirdwhales.com",
    siteName: "Weird Whales",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weird Whales",
    description:
      "3,350 generative pixel-art whales swimming on the Ethereum blockchain.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rates = await getEthRates();
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${pressStart.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CurrencyProvider rates={{ usd: rates.usd, gbp: rates.gbp }}>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
