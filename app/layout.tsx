import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mail | Tecnosocialismo",
  description: "La posta della suite Tecnosocialismo: semplice, leggibile, tua.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
