import React from 'react';
import Link from 'next/link';
import { DBRepository } from '@/lib/db';
import { CheckCircle, MapPin, User, ArrowLeft, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Избирательные округа г. Гродно | Политическая карта Беларуси',
  description: 'Список избирательных округов по выборам в Гродненский городской Совет депутатов 29-го созыва.',
};

export default function DistrictsPage() {
  const districts = DBRepository.getDistricts();

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

      {/* Districts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {districts.map((d) => {
          const details = DBRepository.getDistrictBySlug(d.slug);
          const deputy = details?.deputy;

          return (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                    Округ №{d.number}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">
                    29-й созыв
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition-colors">
                  {d.name}
                </h3>

                {deputy && (
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1">
                    <span className="text-[10px] font-bold text-purple-900 uppercase">
                      Избранный депутат:
                    </span>
                    <p className="text-xs font-bold text-slate-900">{deputy.person.full_name}</p>
                    {deputy.reception_schedule && (
                      <p className="text-[11px] text-slate-600 line-clamp-1">
                        Приём: {deputy.reception_schedule}
                      </p>
                    )}
                  </div>
                )}

                {d.boundaries_description && (
                  <p className="text-xs text-slate-600 line-clamp-2">
                    <strong className="text-slate-800">Улицы: </strong>
                    {d.boundaries_description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={`/districts/${d.slug}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-purple-50 text-slate-800 hover:text-purple-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  Карта округа и границы <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
