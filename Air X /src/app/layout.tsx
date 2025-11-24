import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Air X - Gestão de Aeronaves',
  description: 'Sistema completo de gestão compartilhada para aviões e helicópteros',
  keywords: 'aviação, gestão, aeronaves, helicóptero, avião',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-aviation antialiased`}>
        {children}
      </body>
    </html>
  );
}