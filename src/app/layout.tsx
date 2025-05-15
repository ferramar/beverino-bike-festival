import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "../components/header";
import Footer from "../components/footer";

const roboto = Roboto({
  weight: ['300','400','500','700'],
  subsets: ['latin'],
  display: 'swap', // per evitare FOIT/FOUT
});

export const metadata: Metadata = {
  title: "Beverino Bike Festival 2025",
  description: "Partecipa alla quarta edizione del Beverino Bike Festival",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={roboto.className}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
