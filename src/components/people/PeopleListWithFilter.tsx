'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User, Building2, CheckCircle, Calendar, ChevronRight } from 'lucide-react';
import { PersonFullDetails } from '@/types';

interface Props {
  people: PersonFullDetails[];
}

export const PeopleListWithFilter: React.FC<Props> = ({ people }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'deputy' | 'executive'>('all');

  const clean = searchTerm.trim().toLowerCase();
  const filtered = people.filter((p) => {
    // Role filter
    const isDeputy = p.districts && p.districts.length > 0;
    if (roleFilter === 'deputy' && !isDeputy) return false;
    if (roleFilter === 'executive' && isDeputy) return false;

    // Search term filter
    if (!clean) return true;

    const matchesName = p.full_name.toLowerCase().includes(clean);
    const matchesPosition = p.positions.some(
      (pos) =>
        pos.position.name.toLowerCase().includes(clean) ||
        (pos.institution && pos.institution.name.toLowerCase().includes(clean))
    );
    const matchesDistrict = p.districts.some(
      (d) =>
        d.district.name.toLowerCase().includes(clean) ||
        String(d.district.number).includes(clean) ||
        (d.district.boundaries_description && d.district.boundaries_description.toLowerCase().includes(clean))
    );

    return matchesName || matchesPosition || matchesDistrict;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск по ФИО, должности, округу или улице приёма..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs shrink-0">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              roleFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Все ({people.length})
          </button>
          <button
            onClick={() => setRoleFilter('deputy')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              roleFilter === 'deputy' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Депутаты
          </button>
          <button
            onClick={() => setRoleFilter('executive')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              roleFilter === 'executive' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Руководство
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-slate-500 text-sm">
            По запросу <strong className="text-slate-900">«{searchTerm}»</strong> ничего не найдено.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((person) => {
            const primaryPosition = person.positions?.[0];
            const primaryDistrict = person.districts?.[0];

            const initialFirst = person.first_name?.[0] || person.full_name?.[0] || 'П';
            const initialLast = person.last_name?.[0] || '';

            return (
              <div
                key={person.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-base shrink-0 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors overflow-hidden">
                      {person.photo_url ? (
                        <img
                          src={person.photo_url}
                          alt={person.full_name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span>{initialFirst}{initialLast}</span>
                      )}
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
      )}
    </div>
  );
};
