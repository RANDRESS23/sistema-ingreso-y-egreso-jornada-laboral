import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Jornada Laboral",
  description:
    "Sistema moderno para el control de entrada y salida de jornadas laborales",
  keywords: ["jornada laboral", "control de tiempo", "recursos humanos"],
  authors: [{ name: "Sistema de Jornada" }],
  openGraph: {
    title: "Sistema de Jornada Laboral",
    description: "Control eficiente de tu tiempo de trabajo",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-linear-to-br from-slate-50 to-slate-100`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
