import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, CheckSquare, ShieldCheck, Database, ArrowLeft, Landmark } from 'lucide-react';
import { DBRepository } from '@/lib/db';

export const metadata = {
  title: 'Административная панель | Политическая карта Беларуси',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stats = DBRepository.getDashboardStats();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Topbar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-emerald-400 text-xs font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться на сайт</span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Административная панель верификации
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>Режим: <strong>Production Local (WAL)</strong></span>
        </div>
      </div>

      {/* Admin Subheader & Navigation */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span>Сводка (Dashboard)</span>
          </Link>

          <Link
            href="/admin/review-queue"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <CheckSquare className="w-4 h-4 text-purple-600" />
            <span>Очередь верификации (Review Queue)</span>
            {stats.pendingReviewsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-600 text-white font-bold">
                {stats.pendingReviewsCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/sources"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Реестр источников & Парсер</span>
          </Link>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-grow">
        {children}
      </div>
    </div>
  );
}
