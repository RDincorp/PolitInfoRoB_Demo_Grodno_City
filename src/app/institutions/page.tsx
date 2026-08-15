import React from 'react';
import Link from 'next/link';
import { DBRepository } from '@/lib/db';
import { Building2, MapPin, Phone, ArrowLeft, ChevronRight, Landmark } from 'lucide-react';

export const metadata = {
  title: 'Органы власти и управления | Политическая карта Беларуси',
  description: 'Реестр государственных органов, исполкомов, советов депутатов и судов.',
};

export default function InstitutionsPage() {
  const institutions = DBRepository.getInstitutions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Органы власти</span>
      </div>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <Building2 className="w-4 h-4" />
          <span>Реестр государственных институтов</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Органы власти и управления
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Структура государственных органов республиканского уровня, органов местного управления и самоуправления города Гродно.
        </p>
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.map((inst) => (
          <div
            key={inst.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Уровень: {inst.level}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {inst.type === 'representative' ? 'Представительный' : inst.type === 'executive' ? 'Исполнительный' : 'Судебный'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                  {inst.name}
                </h3>
                {inst.short_name && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">({inst.short_name})</p>
                )}
              </div>

              {inst.address && (
                <p className="text-xs text-slate-600 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>{inst.address}</span>
                </p>
              )}

              {inst.description && (
                <p className="text-xs text-slate-600 line-clamp-2">{inst.description}</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <Link
                href={`/institutions/${inst.slug}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-xl text-xs font-semibold transition-colors"
              >
                Карточка органа и службы <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
