import type { Metadata } from 'next';
import './globals.css';
import { poppins } from '@/app/ui/fonts';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import ReactQueryProvider from '@/app/ReactQueryProvider';

export const metadata: Metadata = {
   title: {
      template: '%s | Kapil',
      default: 'Kapil',
   },
   description: 'The social media app by Kapil',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={poppins.className}>
            <ReactQueryProvider>
               <ThemeProvider
                  attribute={'class'}
                  defaultTheme={'system'}
                  enableSystem
                  disableTransitionOnChange
               >
                  {children}
               </ThemeProvider>
            </ReactQueryProvider>
            <Toaster />
         </body>
      </html>
   );
}
