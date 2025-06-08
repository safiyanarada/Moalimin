import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moalimin - Plateforme d'apprentissage islamique",
  description: "Votre plateforme d'apprentissage islamique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
