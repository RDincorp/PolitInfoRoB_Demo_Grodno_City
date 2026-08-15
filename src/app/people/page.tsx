import React from 'react';
import Link from 'next/link';
import { DBRepository } from '@/lib/db';
import { Users, Building2, CheckCircle, ArrowLeft, ChevronRight, Search, Calendar, Phone } from 'lucide-react';

export const metadata = {
  title: 'Депутаты и руководители | Политическая карта Беларуси',
  description: 'Официальный реестр депутатов и должностных лиц.',
};

export default function PeoplePage() {
  const people = DBRepository.getPeople();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Люди / Депутаты</span>
      </div>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
          <Users className="w-4 h-4" />
          <span>Реестр представителей и должностных лиц</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Депутаты и должностные лица
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          В списке представлены подтвержденные официальными источниками сведения о депутатах Гродненского городского Совета депутатов 29-го созыва и руководителях органов исполнительной власти.
        </p>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {people.map((person) => {
          const details = DBRepository.getPersonBySlug(person.slug);
          const primaryPosition = details?.positions?.[0];
          const primaryDistrict = details?.districts?.[0];

          const initialFirst = person.first_name?.[0] || person.full_name?.[0] || 'П';
          const initialLast = person.last_name?.[0] || '';

          return (
            <div
              key={person.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-base shrink-0 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                    {initialFirst}{initialLast}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                      {person.full_name}
                    </h3>
                    {primaryPosition?.position && (
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {primaryPosition.position.name}
                      </p>
                    )}
                  </div>
                </div>

                {primaryDistrict?.district && (
                  <div className="p-2.5 rounded-lg bg-purple-50 text-purple-900 text-xs border border-purple-100 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="font-medium">
                      Округ №{primaryDistrict.district.number}: {primaryDistrict.district.name}
                    </span>
                  </div>
                )}

                {primaryPosition?.reception_schedule && (
                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <div className="flex items-start gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{primaryPosition.reception_schedule}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={`/people/${person.slug}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  Полный профиль и контакты <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
