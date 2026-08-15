import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Интерактивная политическая карта Беларуси | Гродно',
  description:
    'Информационно-справочная веб-платформа об официальном государственном устройстве Республики Беларусь, органах власти, представителях и избирательных округах (пилот: г. Гродно).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
