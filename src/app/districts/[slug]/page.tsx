import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DBRepository } from '@/lib/db';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { CheckCircle, MapPin, User, Calendar, Phone, ArrowLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const districts = DBRepository.getDistricts();
  return districts.map((d) => ({ slug: d.slug }));
}

export default function DistrictDetailPage({ params }: PageProps) {
  const district = DBRepository.getDistrictBySlug(params.slug);

  if (!district) {
    notFound();
  }

  const deputy = district.deputy;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <Link href="/districts" className="hover:text-emerald-700">
          Округа
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Округ №{district.number}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                Округ №{district.number}
              </span>
              <span className="text-xs text-slate-500">
                Уровень: <strong className="text-slate-800">
                  {district.level === 'national_assembly'
                    ? 'Палата представителей Национального собрания РБ (VIII созыв)'
                    : 'Гродненский городской Совет депутатов (29-й созыв)'}
                </strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {district.name}
            </h1>
            {district.territory && (
              <p className="text-xs text-slate-500 font-medium mt-1">
                Территория: {district.territory.name}
              </p>
            )}
          </div>

          <ProvenanceBadge
            source={district.sources[0]?.source}
            snapshot={district.sources[0]?.snapshot}
            verifiedAt={district.sources[0]?.verified_at}
            compact={true}
          />
        </div>

        {/* Boundaries Description */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            Официальное описание границ и перечень улиц
          </h2>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
            <p>{district.boundaries_description || 'Описание границ не указано в предоставленных источниках.'}</p>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              ⚖️ <strong>Правовая основа:</strong> Решение избирательной комиссии об образовании избирательных округов. В соответствии с Избирательным кодексом РБ границы округов определяются официальным перечнем адресов.
            </p>
          </div>
        </div>

        {/* Elected Deputy Card */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600" />
            Избранный депутат по данному округу
          </h2>

          {deputy ? (
            <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-200 text-purple-900 font-bold flex items-center justify-center text-lg shrink-0 overflow-hidden">
                    {deputy.person.photo_url ? (
                      <img
                        src={deputy.person.photo_url}
                        alt={deputy.person.full_name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <>
                        {deputy.person.first_name?.[0] || deputy.person.full_name[0]}
                        {deputy.person.last_name?.[0] || ''}
                      </>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{deputy.person.full_name}</h3>
                    <p className="text-xs text-purple-800 font-medium">
                      {district.level === 'national_assembly'
                        ? 'Депутат Палаты представителей Национального собрания РБ (VIII созыв)'
                        : 'Депутат Гродненского городского Совета депутатов (29-й созыв)'}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/people/${deputy.person.slug}`}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shrink-0 inline-flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  Полный профиль депутата <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Deputy Reception info */}
              {(deputy.reception_schedule || deputy.reception_address || deputy.reception_phone) && (
                <div className="bg-white p-3.5 rounded-xl border border-purple-100 text-xs space-y-2">
                  <span className="font-bold text-slate-800 block">
                    Личный приём избирателей округа:
                  </span>

                  {deputy.reception_schedule && (
                    <div className="flex items-start gap-2 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                      <span>График: {deputy.reception_schedule}</span>
                    </div>
                  )}

                  {deputy.reception_address && (
                    <div className="flex items-start gap-2 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                      <span>Адрес приёма: {deputy.reception_address}</span>
                    </div>
                  )}

                  {deputy.reception_phone && (
                    <div className="flex items-start gap-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                      <span>Телефон для справок: <strong className="text-slate-900">{deputy.reception_phone}</strong></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
              Сведения о депутате для данного округа отсутствуют в предоставленных источниках.
            </div>
          )}
        </div>

        {/* Provenance Box */}
        {district.sources.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <ProvenanceBadge
              source={district.sources[0]?.source}
              snapshot={district.sources[0]?.snapshot}
              verifiedAt={district.sources[0]?.verified_at}
            />
          </div>
        )}
      </div>
    </div>
  );
}
