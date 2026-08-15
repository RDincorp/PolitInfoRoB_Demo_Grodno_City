import React from 'react';
import Link from 'next/link';
import { DBRepository } from '@/lib/db';
import { CheckCircle, MapPin, User, ArrowLeft, ChevronRight } from 'lucide-react';

import { DistrictsListWithFilter } from '@/components/districts/DistrictsListWithFilter';

export const metadata = {
  title: 'Избирательные округа г. Гродно | Политическая карта Беларуси',
  description: 'Список избирательных округов по выборам в Гродненский городской Совет депутатов 29-го созыва.',
};

export default function DistrictsPage() {
  const districts = DBRepository.getDistricts();
  const districtDetails = districts
    .map((d) => DBRepository.getDistrictBySlug(d.slug))
    .filter(Boolean) as any[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Избирательные округа</span>
      </div>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
          <CheckCircle className="w-4 h-4" />
          <span>Гродненский городской Совет депутатов 29-го созыва</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Избирательные округа города Гродно
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Границы округов, перечень закрепленных улиц и адресов, а также депутаты, представляющие интересы жителей соответствующей территории.
        </p>
      </div>

      {/* Filterable Districts Grid */}
      <DistrictsListWithFilter districts={districtDetails} />
    </div>
  );
}
