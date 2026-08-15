'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Building2, Landmark, Scale, Users, FileCheck, Shield, ExternalLink } from 'lucide-react';

interface StateBranch {
  id: string;
  title: string;
  type: string;
  description: string;
  icon: any;
  institutions: Array<{
    name: string;
    slug?: string;
    level: string;
    url?: string;
  }>;
}

const STATE_BRANCHES: StateBranch[] = [
  {
    id: 'president',
    title: 'Глава государства',
    type: 'Институт президентства',
    description: 'Президент Республики Беларусь является Главой государства, гарантом Конституции Республики Беларусь, прав и свобод человека и гражданина.',
    icon: Shield,
    institutions: [
      { name: 'Президент Республики Беларусь', slug: 'president-rb', level: 'Республиканский' },
      { name: 'Администрация Президента Республики Беларусь', level: 'Республиканский' },
      { name: 'Совет Безопасности Республики Беларусь', level: 'Республиканский' },
    ],
  },
  {
    id: 'parliament',
    title: 'Законодательная власть (Парламент)',
    type: 'Национальное собрание Республики Беларусь',
    description: 'Представительный и законодательный орган Республики Беларусь, состоящий из двух палат.',
    icon: Landmark,
    institutions: [
      { name: 'Палата представителей (110 депутатов)', slug: 'palata-predstaviteley', level: 'Республиканский' },
      { name: 'Совет Республики (палата территориального представительства)', slug: 'sovet-respubliki', level: 'Республиканский' },
    ],
  },
  {
    id: 'government',
    title: 'Исполнительная власть (Правительство и местное управление)',
    type: 'Совет Министров и исполнительные комитеты',
    description: 'Центральный орган государственного управления, руководящий системой подчиненных ему органов государственного управления и местными исполкомами.',
    icon: Building2,
    institutions: [
      { name: 'Совет Министров Республики Беларусь (Правительство)', slug: 'sovet-ministrov', level: 'Республиканский' },
      { name: 'Гродненский городской исполнительный комитет (Горисполком)', slug: 'grodnenskiy-gorodskoy-ispolnitelnyy-komitet', level: 'Городской (Пилот)' },
      { name: 'Администрация Ленинского района г. Гродно', slug: 'administratsiya-leninskogo-rayona-grodno', level: 'Районный' },
      { name: 'Администрация Октябрьского района г. Гродно', slug: 'administratsiya-oktyabrskogo-rayona-grodno', level: 'Районный' },
    ],
  },
  {
    id: 'judiciary',
    title: 'Судебная власть',
    type: 'Суды общей юрисдикции и конституционный контроль',
    description: 'Осуществление правосудия на основе Конституции и принятых в соответствии с ней иных нормативных правовых актов.',
    icon: Scale,
    institutions: [
      { name: 'Конституционный Суд Республики Беларусь', level: 'Республиканский' },
      { name: 'Верховный Суд Республики Беларусь', level: 'Республиканский' },
      { name: 'Суд Ленинского района г. Гродно', slug: 'sud-leninskogo-rayona-grodno', level: 'Районный / Городской' },
    ],
  },
  {
    id: 'local-self-government',
    title: 'Местное самоуправление',
    type: 'Местные Советы депутатов',
    description: 'Представительные органы государственной власти на соответствующей территории, избираемые гражданами.',
    icon: Users,
    institutions: [
      { name: 'Гродненский городской Совет депутатов 29-го созыва', slug: 'grodnenskiy-gorodskoy-sovet-deputatov', level: 'Городской (Пилот)' },
      { name: 'Гродненский областной Совет депутатов', level: 'Областной' },
    ],
  },
];

export const StateStructureDiagram: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('government');

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex items-center gap-2 text-emerald-400 text-xs uppercase font-bold tracking-wider">
          <Landmark className="w-4 h-4" />
          <span>Официальная структура государственного устройства</span>
        </div>
        <h2 className="text-xl font-bold mt-1">Республика Беларусь</h2>
        <p className="text-xs text-slate-300 mt-1">
          Интерактивная институциональная схема органов государственной власти и местного самоуправления
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {STATE_BRANCHES.map((branch) => {
          const isExpanded = expandedId === branch.id;
          const Icon = branch.icon;

          return (
            <div key={branch.id} className="transition-colors">
              {/* Header Toggle */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : branch.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl transition-colors ${
                    isExpanded ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900">{branch.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{branch.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline-block">
                    {branch.institutions.length} органов в базе
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Branch Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 bg-slate-50 border-t border-slate-100 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    {branch.description}
                  </p>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                      Органы и учреждения в информационной модели:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {branch.institutions.map((inst, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between group"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-900 group-hover:text-emerald-800">
                                {inst.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-500 uppercase">
                              Уровень: {inst.level}
                            </span>
                          </div>

                          {inst.slug ? (
                            <Link
                              href={`/institutions/${inst.slug}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded-lg group-hover:bg-emerald-100 transition-colors shrink-0 ml-2"
                            >
                              Карточка <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          ) : (
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded shrink-0 ml-2">
                              Каркас
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
