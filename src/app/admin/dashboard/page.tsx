import React from 'react';
import Link from 'next/link';
import { DBRepository } from '@/lib/db';
import {
  Users,
  Building2,
  CheckCircle,
  ShieldCheck,
  CheckSquare,
  FileCode,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = DBRepository.getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Панель управления и мониторинга</h1>
        <p className="text-xs text-slate-500 mt-1">
          Оперативный статус базы знаний, очереди верификации и реестра официальных источников.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Очередь изменений</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.pendingReviewsCount}</span>
            <span className="text-xs text-slate-500">требуют подтверждения</span>
          </div>
          <Link
            href="/admin/review-queue"
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 pt-1"
          >
            Открыть Review Queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Официальные источники</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.sourcesCount}</span>
            <span className="text-xs text-slate-500">доверенных URL</span>
          </div>
          <Link
            href="/admin/sources"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 pt-1"
          >
            Управление и запуск парсера <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Снапшоты в архиве</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileCode className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.snapshotsCount}</span>
            <span className="text-xs text-slate-500">хешированных слепков</span>
          </div>
          <span className="text-xs text-slate-400 block pt-1">
            SHA-256 контроль целостности активен
          </span>
        </div>
      </div>

      {/* Published entities breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Опубликованные сущности в базе данных</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-bold text-slate-900">{stats.peopleCount}</span>
              <span className="text-xs text-slate-500">Персон / депутатов</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-bold text-slate-900">{stats.institutionsCount}</span>
              <span className="text-xs text-slate-500">Органов власти</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-800 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xl font-bold text-slate-900">{stats.districtsCount}</span>
              <span className="text-xs text-slate-500">Избирательных округов</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
