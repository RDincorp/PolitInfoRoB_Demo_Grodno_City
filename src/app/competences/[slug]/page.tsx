import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DBRepository } from '@/lib/db';
import { FileQuestion, Building2, MapPin, Phone, Clock, FileText, ArrowLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const competences = DBRepository.getCompetences();
  return competences.map((c) => ({ slug: c.slug }));
}

export default function CompetenceDetailPage({ params }: PageProps) {
  const comp = DBRepository.getCompetenceBySlug(params.slug);

  if (!comp) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <Link href="/competences" className="hover:text-emerald-700">
          Вопросы
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{comp.name}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="pb-4 border-b border-slate-100">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
            {comp.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {comp.name}
          </h1>
          {comp.territory && (
            <p className="text-xs text-slate-500 font-medium mt-1">
              Территориальная юрисдикция: {comp.territory.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Суть и содержание вопроса:</h2>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {comp.description}
          </p>
        </div>

        {/* Responsible Institution & Department */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Уполномоченный орган и структурное подразделение
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comp.institution && (
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Орган власти:
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{comp.institution.name}</h3>
                {comp.institution.address && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{comp.institution.address}</span>
                  </p>
                )}
                <div className="pt-2">
                  <Link
                    href={`/institutions/${comp.institution.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    Страница органа власти <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {comp.department && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Профильное подразделение:
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{comp.department.name}</h3>
                {comp.department.phone && (
                  <p className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Телефон: {comp.department.phone}</span>
                  </p>
                )}
                {comp.department.working_hours && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Режим работы: {comp.department.working_hours}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Legal Basis */}
        {comp.legal_basis && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Законодательная и правовая основа (Pravo.by):
            </h2>
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-3">
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {comp.legal_basis}
              </p>
              {comp.legal_basis_url && (
                <div className="pt-2 border-t border-blue-200/50 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={comp.legal_basis_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
                  >
                    <span>Официальный текст документа на Pravo.by</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                    Первоисточник: Национальный правовой Интернет-портал РБ
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
