import { Geist, Geist_Mono } from "next/font/google";
import { Header } from '../components/header/Header';
import { Footer } from '../components/footer/Footer';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Persistent Counter App",
  description: "A Next.js app with a persistent counter stored in a relational database, featuring real-time updates and auto-reset after inactivity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
