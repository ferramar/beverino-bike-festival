import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "../components/header";
import Footer from "../components/footer";
import SkipLink from "../components/SkipLink";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"

// Inter è più moderno e leggibile di Roboto per UI
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Beverino Bike Festival 2025 - Raduno MTB in Liguria",
  description: "Partecipa alla quarta edizione del Beverino Bike Festival. 21 Settembre 2025. Tre percorsi attraverso paesaggi mozzafiato: 30km, 35km e 50km. Iscrizioni aperte!",
  keywords: "beverino bike festival, raduno ciclistico liguria, ciclismo la spezia, mountain bike liguria, granfondo liguria",
  authors: [{ name: "Beverino Bike Festival" }],
  creator: "Beverino Bike Festival",
  publisher: "Beverino Bike Festival",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Beverino Bike Festival 2025",
    description: "Partecipa alla quarta edizione del Beverino Bike Festival. 21 Settembre 2025.",
    url: "https://beverinobikefestival.it",
    siteName: "Beverino Bike Festival",
    images: [
      {
        url: "https://beverinobikefestival.it/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Beverino Bike Festival - Raduno ciclistico tra le colline liguri",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beverino Bike Festival 2025",
    description: "21 Settembre 2025 - Tre percorsi attraverso paesaggi mozzafiato",
    images: ["https://beverinobikefestival.it/twitter-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#A52D0C",
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://beverinobikefestival.it",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={inter.variable}>
      <body className={inter.className}>
        <Providers>
          {/* Skip Link - componente client separato */}
          <SkipLink />
          
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              overflowX: "hidden",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            <Header />
            
            {/* Main content con semantic HTML */}
            <main
              id="main-content"
              tabIndex={-1}
              style={{
                flex: 1,
                outline: "none",
              }}
            >
              {children}
            </main>
            
            <Footer />
          </div>
        </Providers>

        <Script id="iubenda-cs-configuration" strategy="beforeInteractive">
          {`
            var _iub = _iub || [];
            _iub.csConfiguration = {
              "siteId": 4157081,
              "cookiePolicyId": 20393244,
              "lang": "it",
              "storage": {
                "useSiteId": true
              },
              "banner": {
                "position": "bottom",
                "acceptButtonDisplay": true,
                "customizeButtonDisplay": true,
                "closeButtonDisplay": false,
                "fontSizeBody": "14px",
                "backgroundColor": "#000000",
                "textColor": "#FFFFFF",
                "acceptButtonColor": "#A52D0C",
                "acceptButtonCaptionColor": "#FFFFFF",
                "customizeButtonColor": "#212121",
                "customizeButtonCaptionColor": "#FFFFFF"
              }
            };
          `}
        </Script>
        
        <Script 
          src="https://cs.iubenda.com/autoblocking/4157081.js"
          strategy="beforeInteractive"
        />
        
        <Script 
          src="//cdn.iubenda.com/cs/gpp/stub.js"
          strategy="beforeInteractive"
        />
        
        <Script 
          src="//cdn.iubenda.com/cs/iubenda_cs.js"
          strategy="lazyOnload"
          charSet="UTF-8"
        />


        {/* Noscript fallback */}
        <noscript>
          <div style={{
            padding: '20px',
            background: '#FFF3CD',
            color: '#856404',
            textAlign: 'center',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}>
            Questo sito richiede JavaScript per funzionare correttamente. 
            Per favore, abilita JavaScript nel tuo browser.
          </div>
        </noscript>
        <Analytics />
      </body>
    </html>
  );
}