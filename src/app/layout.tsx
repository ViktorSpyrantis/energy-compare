import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EnergyCompare | Σύγκριση Παρόχων Ρεύματος Ελλάδα",
  description:
    "Σύγκρινε όλους τους παρόχους ηλεκτρικής ενέργειας στην Ελλάδα. Βρες τον φθηνότερο πάροχο και εξοικόνομε έως 300€ τον χρόνο.",
  keywords:
    "πάροχοι ρεύματος, σύγκριση ηλεκτρισμός, φθηνός πάροχος, ΔΕΗ, Elpedison, NRG, τιμές ρεύμα Ελλάδα",
  openGraph: {
    title: "EnergyCompare | Σύγκριση Παρόχων Ρεύματος",
    description: "Βρες τον φθηνότερο πάροχο ρεύματος και εξοικόνομε χρήματα.",
    locale: "el_GR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
