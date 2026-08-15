import React from 'react';
import Link from 'next/link';
import { DBRepository } from '@/lib/db';
import { Users, Building2, CheckCircle, ArrowLeft, ChevronRight, Search, Calendar, Phone } from 'lucide-react';

import { PeopleListWithFilter } from '@/components/people/PeopleListWithFilter';

export const metadata = {
  title: 'Депутаты и руководители | Политическая карта Беларуси',
  description: 'Официальный реестр депутатов и должностных лиц.',
};

export default function PeoplePage() {
  const people = DBRepository.getPeople();
  const peopleDetails = people
    .map((p) => DBRepository.getPersonBySlug(p.slug))
    .filter(Boolean) as any[];

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

      {/* Filterable People Grid */}
      <PeopleListWithFilter people={peopleDetails} />
    </div>
  );
}
