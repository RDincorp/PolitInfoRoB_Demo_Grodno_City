import React from 'react';
import Link from 'next/link';
import { DBRepository } from '@/lib/db';
import { FileQuestion, Building2, MapPin, Phone, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Куда обращаться по вопросам | Политическая карта Беларуси',
  description: 'Справочник компетенций государственных органов и служб города Гродно: ЖКХ, архитектура, образование, загс.',
};

export default function CompetencesPage() {
  const competences = DBRepository.getCompetences();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Вопросы и компетенции</span>
      </div>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
          <FileQuestion className="w-4 h-4" />
          <span>Навигатор по жизненным ситуациям и вопросам</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Куда обращаться по вопросам
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Официальное распределение сфер ответственности между органами исполнительной власти и их структурными подразделениями в городе Гродно.
        </p>
      </div>

      {/* Competences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competences.map((c) => {
          const details = DBRepository.getCompetenceBySlug(c.slug);

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
                    {c.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    г. Гродно
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg group-hover:text-rose-700 transition-colors">
                  {c.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

                {details?.institution && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="font-semibold text-slate-700 block">Ответственный орган:</span>
                    <p className="font-bold text-emerald-800">{details.institution.name}</p>
                    {details.department && (
                      <p className="text-slate-600">Подразделение: {details.department.name}</p>
                    )}
                    {details.department?.phone && (
                      <p className="text-slate-600 font-medium">Телефон: {details.department.phone}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={`/competences/${c.slug}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-rose-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  Подробнее и нормативная база <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
