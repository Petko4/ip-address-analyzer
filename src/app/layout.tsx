import "./globals.css";
import type { Metadata } from "next";
import { Didact_Gothic } from "next/font/google";

const didacticGothic = Didact_Gothic({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-didactic-gothic",
});

export const metadata: Metadata = {
  title: "IP address analyzer",
  description: "Find out information about specific IP address",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${didacticGothic.variable}`}>
      <body className="font-didactic">{children}</body>
    </html>
  );
}
