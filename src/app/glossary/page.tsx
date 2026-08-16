import React from 'react';
import Link from 'next/link';
import { DBRepository } from '@/lib/db';
import { GlossaryList } from '@/components/glossary/GlossaryList';
import { BookOpen, ArrowLeft, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Глоссарий терминов государственного устройства | Политическая карта Беларуси',
  description: 'Официальный справочник и глоссарий понятий государственного управления и местного самоуправления Республики Беларусь на основе Конституции и законов с pravo.by.',
};

export default function GlossaryPage() {
  const terms = DBRepository.getGlossaryTerms();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Глоссарий терминов</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
          <BookOpen className="w-4 h-4" />
          <span>Справочник государственного и муниципального устройства</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Глоссарий терминов и правовых статусов
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Терминологический словарь ключевых понятий государственного управления, местного самоуправления, представительной власти и избирательной системы Республики Беларусь.
        </p>

        {/* Provenance Box */}
        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              Все определения и формулировки строго верифицированы и опираются на нормативные правовые акты с портала <strong>Pravo.by</strong>.
            </span>
          </div>
          <a
            href="https://pravo.by"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline whitespace-nowrap"
          >
            <span>Портал Pravo.by</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Interactive Glossary Component */}
      <GlossaryList initialTerms={terms} />
    </div>
  );
}
