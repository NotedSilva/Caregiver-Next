import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import Modal from "./components/modals/modal";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caregiver",
  description: "Caregiver Next",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={font.className}>
        <Modal actionLabel="Submit" title="Hello World" isOpen />
        <Navbar />
        {children}
        </body>
    </html>
  );
}
