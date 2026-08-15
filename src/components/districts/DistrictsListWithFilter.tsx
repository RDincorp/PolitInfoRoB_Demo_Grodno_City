'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, CheckCircle, ChevronRight, MapPin, User } from 'lucide-react';
import { DistrictFullDetails } from '@/types';

interface Props {
  districts: DistrictFullDetails[];
}

export const DistrictsListWithFilter: React.FC<Props> = ({ districts }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const clean = searchTerm.trim().toLowerCase();
  const filtered = districts.filter((d) => {
    if (!clean) return true;
    return (
      d.name.toLowerCase().includes(clean) ||
      String(d.number).includes(clean) ||
      (d.boundaries_description && d.boundaries_description.toLowerCase().includes(clean)) ||
      (d.deputy?.person.full_name && d.deputy.person.full_name.toLowerCase().includes(clean))
    );
  });

  return (
    <div className="space-y-6">
      {/* Live filter input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Быстрый поиск по улице, номеру дома, названию округа или ФИО депутата..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-900 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
          />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
          >
            Сбросить фильтр
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-slate-500 text-sm">
            По запросу <strong className="text-slate-900">«{searchTerm}»</strong> ничего не найдено.
          </p>
          <p className="text-xs text-slate-400">
            Попробуйте ввести только название улицы (например, «Советская» или «Горького») без слова «улица».
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => {
            const deputy = d.deputy;

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
                      <span className="text-[10px] font-bold text-purple-900 uppercase flex items-center gap-1">
                        <User className="w-3 h-3 text-purple-700" />
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
                    <p className="text-xs text-slate-600 line-clamp-3">
                      <strong className="text-slate-800">Улицы и границы: </strong>
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
      )}
    </div>
  );
};
