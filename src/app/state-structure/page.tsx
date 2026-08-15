import React from 'react';
import Link from 'next/link';
import { StateStructureDiagram } from '@/components/state-structure/StateStructureDiagram';
import { Landmark, ArrowLeft, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Государственное устройство Республики Беларусь | Политическая карта',
  description: 'Интерактивная схема и официальная структура органов власти Республики Беларусь.',
};

export default function StateStructurePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Государственное устройство</span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <Landmark className="w-4 h-4" />
          <span>Общенациональный информационный слой</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Государственное устройство Республики Беларусь
        </h1>
        <p className="text-sm text-slate-600 max-w-4xl leading-relaxed">
          В соответствии с Конституцией Республика Беларусь — унитарное демократическое социально-правовое государство. Государственная власть в республике осуществляется на основе разделения её на законодательную, исполнительную и судебную. Местное самоуправление осуществляется через местные Советы депутатов.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <div className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Нормативная основа: Конституция Республики Беларусь</span>
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Источник: Pravo.by & President.gov.by</span>
          </div>
        </div>
      </div>

      {/* Main Diagram */}
      <StateStructureDiagram />

      {/* Connection to Local Level (Grodno) */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-emerald-400">Пилотный уровень местного самоуправления</span>
          <h3 className="text-lg font-bold mt-1">Органы власти и депутаты города Гродно</h3>
          <p className="text-xs text-slate-300 mt-1">
            Исследуйте детальную модель Гродненского горсовета 29-го созыва, горисполкома и избирательных округов.
          </p>
        </div>
        <Link
          href="/territories/grodno"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shrink-0 inline-flex items-center gap-1.5 transition-colors"
        >
          Перейти в паспорт Гродно <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
