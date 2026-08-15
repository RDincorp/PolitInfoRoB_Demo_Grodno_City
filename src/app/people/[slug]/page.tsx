import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DBRepository } from '@/lib/db';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { User, Building2, CheckCircle, Calendar, Phone, MapPin, ArrowLeft, ExternalLink, ChevronRight, ShieldCheck } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const people = DBRepository.getPeople();
  return people.map((p) => ({ slug: p.slug }));
}

export default function PersonProfilePage({ params }: PageProps) {
  const person = DBRepository.getPersonBySlug(params.slug);

  if (!person) {
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
        <Link href="/people" className="hover:text-emerald-700">
          Люди
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{person.full_name}</span>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-2xl shrink-0 shadow-inner">
              {person.first_name?.[0] || person.full_name[0]}
              {person.last_name?.[0] || ''}
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                Официальный профиль
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {person.full_name}
              </h1>
              {person.official_profile_url && (
                <a
                  href={person.official_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-medium pt-0.5"
                >
                  Оригинальный профиль на официальном сайте <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <ProvenanceBadge
            source={person.sources[0]?.source}
            snapshot={person.sources[0]?.snapshot}
            verifiedAt={person.sources[0]?.verified_at}
            compact={true}
          />
        </div>

        {/* Positions & Duties */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Занимаемые должности и статус
          </h2>

          <div className="space-y-3">
            {person.positions.map((posItem) => (
              <div
                key={posItem.person_position_id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-bold text-slate-900 text-sm">{posItem.position.name}</h3>
                  {posItem.start_date && (
                    <span className="text-xs text-slate-500">
                      С {new Date(posItem.start_date).toLocaleDateString('ru-RU')} по н.в.
                    </span>
                  )}
                </div>

                {posItem.institution && (
                  <div className="text-xs text-slate-600">
                    Орган:{' '}
                    <Link
                      href={`/institutions/${posItem.institution.slug}`}
                      className="text-emerald-700 hover:underline font-medium"
                    >
                      {posItem.institution.name}
                    </Link>
                  </div>
                )}

                {/* Reception Schedule info box */}
                {(posItem.reception_schedule || posItem.reception_address || posItem.reception_phone) && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                    <span className="font-semibold text-slate-800 block">
                      Приём граждан и представителей юридических лиц:
                    </span>

                    {posItem.reception_schedule && (
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>График: {posItem.reception_schedule}</span>
                      </div>
                    )}

                    {posItem.reception_address && (
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>Адрес приёма: {posItem.reception_address}</span>
                      </div>
                    )}

                    {posItem.reception_phone && (
                      <div className="flex items-start gap-1.5 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>Телефон для записи: <strong className="text-slate-900">{posItem.reception_phone}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Electoral Districts (if Deputy) */}
        {person.districts.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              Избирательный округ
            </h2>

            <div className="space-y-3">
              {person.districts.map((dItem) => (
                <div
                  key={dItem.person_district_id}
                  className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-purple-800 uppercase">
                      Округ №{dItem.district.number}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{dItem.district.name}</h3>
                    {dItem.district.boundaries_description && (
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {dItem.district.boundaries_description}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/districts/${dItem.district.slug}`}
                    className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shrink-0 inline-flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    Страница округа и улицы <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Biography (if in official source) */}
        {person.biography && (
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Сведения из официального источника</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {person.biography}
            </p>
          </div>
        )}

        {/* Provenance Box */}
        {person.sources.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <ProvenanceBadge
              source={person.sources[0]?.source}
              snapshot={person.sources[0]?.snapshot}
              verifiedAt={person.sources[0]?.verified_at}
            />
          </div>
        )}
      </div>
    </div>
  );
}
