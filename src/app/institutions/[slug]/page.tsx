import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DBRepository } from '@/lib/db';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  FileQuestion,
  FileText,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const institutions = DBRepository.getInstitutions();
  return institutions.map((i) => ({ slug: i.slug }));
}

export default function InstitutionDetailPage({ params }: PageProps) {
  const inst = DBRepository.getInstitutionBySlug(params.slug);

  if (!inst) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <Link href="/institutions" className="hover:text-emerald-700">
          Органы власти
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{inst.name}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {inst.type === 'representative' ? 'Представительный орган' : inst.type === 'executive' ? 'Исполнительный орган' : 'Судебный орган'}
              </span>
              <span className="text-xs text-slate-500">
                Уровень: <strong className="text-slate-800 uppercase">{inst.level}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {inst.name}
            </h1>
            {inst.official_name && inst.official_name !== inst.name && (
              <p className="text-xs text-slate-500 font-medium mt-1">{inst.official_name}</p>
            )}
          </div>

          <ProvenanceBadge
            source={inst.sources[0]?.source}
            snapshot={inst.sources[0]?.snapshot}
            verifiedAt={inst.sources[0]?.verified_at}
            compact={true}
          />
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {inst.address && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Адрес:</span>
              </div>
              <p className="font-semibold text-slate-800">{inst.address}</p>
            </div>
          )}

          {inst.phone && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Телефон приемной:</span>
              </div>
              <p className="font-semibold text-slate-800">{inst.phone}</p>
            </div>
          )}

          {inst.working_hours && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Режим работы:</span>
              </div>
              <p className="font-semibold text-slate-800">{inst.working_hours}</p>
            </div>
          )}

          {inst.website && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Официальный сайт:</span>
              </div>
              <a
                href={inst.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1 truncate block"
              >
                {inst.website.replace('https://', '').replace('http://', '')}
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}
        </div>

        {inst.description && (
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {inst.description}
          </div>
        )}
      </div>

      {/* Leadership Section */}
      {inst.leadership.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Руководство органа</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inst.leadership.map((leader, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">
                    {leader.position.name}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-0.5">
                    {leader.person.full_name}
                  </h3>
                </div>

                {leader.reception_schedule && (
                  <div className="text-xs text-slate-600 p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700 block">График приёма граждан:</span>
                    <div className="flex items-start gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{leader.reception_schedule}</span>
                    </div>
                  </div>
                )}

                <div className="pt-1">
                  <Link
                    href={`/people/${leader.person.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    Перейти в профиль руководителя <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Departments / Divisions */}
      {inst.departments.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Структурные подразделения и отделы</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inst.departments.map((dept) => (
              <div
                key={dept.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <h3 className="font-bold text-slate-900 text-sm">{dept.name}</h3>
                {dept.description && (
                  <p className="text-xs text-slate-600 line-clamp-2">{dept.description}</p>
                )}
                {dept.phone && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Телефон: {dept.phone}</span>
                  </p>
                )}
                {dept.address && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{dept.address}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competences & Legal Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Competences */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileQuestion className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Сферы ведения и компетенции</h2>
          </div>

          <div className="space-y-2.5">
            {inst.competences.length > 0 ? (
              inst.competences.map((c) => (
                <Link
                  key={c.id}
                  href={`/competences/${c.slug}`}
                  className="p-3 rounded-xl bg-rose-50/50 hover:bg-rose-50 border border-rose-100 flex items-center justify-between text-xs transition-colors group"
                >
                  <div>
                    <span className="font-semibold text-slate-900 group-hover:text-rose-700">
                      {c.name}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{c.category}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-700" />
                </Link>
              ))
            ) : (
              <p className="text-xs text-slate-500">Информация о компетенциях агрегируется.</p>
            )}
          </div>
        </div>

        {/* Legal Documents */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Нормативная основа</h2>
          </div>

          <div className="space-y-2.5">
            {inst.legal_documents.length > 0 ? (
              inst.legal_documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100 flex items-center justify-between text-xs transition-colors group"
                >
                  <div>
                    <span className="font-semibold text-slate-900 group-hover:text-blue-700">
                      {doc.title}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {doc.document_type} №{doc.number}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                </a>
              ))
            ) : (
              <p className="text-xs text-slate-500">Нормативные акты закреплены в общих законах РБ.</p>
            )}
          </div>
        </div>
      </div>

      {/* Provenance Box */}
      {inst.sources.length > 0 && (
        <ProvenanceBadge
          source={inst.sources[0]?.source}
          snapshot={inst.sources[0]?.snapshot}
          verifiedAt={inst.sources[0]?.verified_at}
        />
      )}
    </div>
  );
}
