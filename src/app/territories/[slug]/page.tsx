import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DBRepository } from '@/lib/db';
import { ProvenanceBadge } from '@/components/provenance/ProvenanceBadge';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { MapPin, Building2, Users, CheckCircle, ArrowLeft, ChevronRight, Landmark, ExternalLink } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const territories = DBRepository.getTerritories();
  return territories.map((t) => ({ slug: t.slug }));
}

export default function TerritoryPage({ params }: PageProps) {
  const territory = DBRepository.getTerritoryBySlug(params.slug);

  if (!territory) {
    notFound();
  }

  const representativeInstitutions = territory.institutions.filter((i) => i.type === 'representative');
  const executiveInstitutions = territory.institutions.filter((i) => i.type === 'executive');
  const judicialInstitutions = territory.institutions.filter((i) => i.type === 'judicial');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        {territory.parent_territory && (
          <>
            <Link href={`/territories/${territory.parent_territory.slug}`} className="hover:text-emerald-700">
              {territory.parent_territory.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-800 font-medium">{territory.name}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              {territory.type === 'city' ? 'Город' : territory.type === 'region' ? 'Область' : 'Территория'}
            </span>
            <span className="text-xs text-slate-500">
              Статус: <strong className="text-emerald-700">Официальные сведения</strong>
            </span>
          </div>

          <ProvenanceBadge
            source={territory.sources[0]?.source}
            snapshot={territory.sources[0]?.snapshot}
            verifiedAt={territory.sources[0]?.verified_at}
            compact={true}
          />
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{territory.name}</h1>
          {territory.official_name && (
            <p className="text-sm text-slate-500 font-medium mt-1">{territory.official_name}</p>
          )}
        </div>

        {territory.description && (
          <p className="text-sm text-slate-600 max-w-4xl leading-relaxed">{territory.description}</p>
        )}
      </div>

      {/* Interactive Map */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Территориальная структура и избирательные округа
          </h2>
        </div>
        <InteractiveMap initialLevel="grodno" />
      </section>

      {/* 3 Columns: Representative, Executive, Judicial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Representative System */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-base pb-2 border-b border-slate-100">
            <Users className="w-5 h-5" />
            <span>Представительная власть</span>
          </div>

          <div className="space-y-3">
            {representativeInstitutions.map((inst) => (
              <div key={inst.id} className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{inst.name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{inst.description}</p>
                <div className="pt-1">
                  <Link
                    href={`/institutions/${inst.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900"
                  >
                    Страница органа <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                Избирательные округа территории ({territory.districts.length}):
              </span>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {territory.districts.map((d) => (
                  <Link
                    key={d.id}
                    href={`/districts/${d.slug}`}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 flex items-center justify-between text-xs transition-colors group"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-purple-700">
                        Округ №{d.number}: {d.name}
                      </span>
                      {d.deputy && (
                        <p className="text-[11px] text-slate-500">Депутат: {d.deputy.full_name}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Executive System */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-base pb-2 border-b border-slate-100">
            <Building2 className="w-5 h-5" />
            <span>Исполнительная власть</span>
          </div>

          <div className="space-y-3">
            {executiveInstitutions.map((inst) => (
              <div key={inst.id} className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{inst.name}</h4>
                {inst.address && (
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {inst.address}
                  </p>
                )}
                <div className="pt-1">
                  <Link
                    href={`/institutions/${inst.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    Руководство и отделы <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Judicial and Other Organs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-base pb-2 border-b border-slate-100">
            <Landmark className="w-5 h-5" />
            <span>Судебные и территориальные органы</span>
          </div>

          <div className="space-y-3">
            {judicialInstitutions.map((inst) => (
              <div key={inst.id} className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{inst.name}</h4>
                {inst.address && (
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {inst.address}
                  </p>
                )}
                <div className="pt-1">
                  <Link
                    href={`/institutions/${inst.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Карточка суда <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Child Territories (Rayony) */}
          {territory.child_territories.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                Районы в составе города ({territory.child_territories.length}):
              </span>
              <div className="space-y-1.5">
                {territory.child_territories.map((ct) => (
                  <Link
                    key={ct.id}
                    href={`/territories/${ct.slug}`}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="font-medium text-slate-800">{ct.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Provenance Footer */}
      {territory.sources.length > 0 && (
        <ProvenanceBadge
          source={territory.sources[0]?.source}
          snapshot={territory.sources[0]?.snapshot}
          verifiedAt={territory.sources[0]?.verified_at}
        />
      )}
    </div>
  );
}
