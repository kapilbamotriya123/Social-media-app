import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/app/ui/fonts";
import React from "react";


export const metadata: Metadata = {
  title: {
    template: "%s | Kapil",
    default: "Kapil",
  },
  description: "The social media app by Kapil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
