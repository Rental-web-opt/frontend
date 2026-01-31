import { Inter, Poppins } from 'next/font/google';
import type { ReactNode } from 'react';
// @ts-ignore: allow importing global CSS without type declaration
import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext'; // <-- AJOUT

import { FavoriteProvider } from '@/context/FavoriteContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Rental Web',
  description: 'Rent your Dream Car',
}


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <NotificationProvider>
            <FavoriteProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </FavoriteProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}