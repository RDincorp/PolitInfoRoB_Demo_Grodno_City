import React from 'react';
import Link from 'next/link';
import { DBRepository } from '@/lib/db';
import { ShieldCheck, ExternalLink, Globe, Calendar, ArrowLeft, ChevronRight, FileText } from 'lucide-react';

export const metadata = {
  title: 'Реестр официальных источников | Политическая карта Беларуси',
  description: 'Прозрачный реестр проверенных источников данных, снапшотов и политик верификации.',
};

export default function SourcesPage() {
  const sources = DBRepository.getSources();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Реестр источников</span>
      </div>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <ShieldCheck className="w-4 h-4" />
          <span>Source Registry & Provenance Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Реестр официальных источников данных
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          В соответствии с архитектурным принципом <strong className="text-slate-800">«The agent builds the system; the user controls the knowledge base»</strong>, все данные в системе поступают исключительно из утвержденных пользователем официальных источников.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((src) => {
          const details = DBRepository.getSourceById(src.id);

          return (
            <div
              key={src.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-100 text-emerald-800">
                    {src.source_type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {src.allowed_domain}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                  {src.title}
                </h3>

                {src.publisher && (
                  <p className="text-xs text-slate-600">
                    Издатель: <span className="font-semibold text-slate-800">{src.publisher}</span>
                  </p>
                )}

                {src.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">{src.description}</p>
                )}

                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline truncate inline-flex items-center gap-1"
                    >
                      {src.url}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Снапшотов в архиве: {details?.snapshots.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={`/sources/${src.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  История снапшотов и проверок <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
