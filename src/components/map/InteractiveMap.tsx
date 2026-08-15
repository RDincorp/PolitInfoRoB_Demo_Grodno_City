'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Building2, CheckCircle, Navigation, Layers, ChevronRight } from 'lucide-react';

interface DistrictInfo {
  number: number;
  name: string;
  slug: string;
  deputyName?: string;
  deputySlug?: string;
}

interface InstitutionPin {
  name: string;
  slug: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
}

const GRODNO_DISTRICTS: DistrictInfo[] = [
  { number: 1, name: 'Центральный округ № 1', slug: 'tsentralnyy-izbiratelnyy-okrug-1', deputyName: 'Белявский Александр Сергеевич', deputySlug: 'belyavskiy-aleksandr-sergeevich' },
  { number: 2, name: 'Северный округ № 2', slug: 'severnyy-izbiratelnyy-okrug-2', deputyName: 'Козлова Елена Викторовна', deputySlug: 'kozlova-elena-viktorovna' },
  { number: 3, name: 'Девятовский округ № 3', slug: 'devyatovskiy-izbiratelnyy-okrug-3', deputyName: 'Морозов Дмитрий Николаевич', deputySlug: 'morozov-dmitriy-nikolaevich' },
];

const GRODNO_INSTITUTIONS: InstitutionPin[] = [
  { name: 'Гродненский городской Совет депутатов', slug: 'grodnenskiy-gorodskoy-sovet-deputatov', type: 'Горсовет (представительный орган)', address: 'пл. Ленина, 2/1', lat: 53.684, lng: 23.834 },
  { name: 'Гродненский городской исполнительный комитет', slug: 'grodnenskiy-gorodskoy-ispolnitelnyy-komitet', type: 'Горисполком (исполнительный орган)', address: 'пл. Ленина, 2/1', lat: 53.684, lng: 23.834 },
  { name: 'Администрация Ленинского района г. Гродно', slug: 'administratsiya-leninskogo-rayona-grodno', type: 'Районная администрация', address: 'ул. Советская, 14', lat: 53.680, lng: 23.831 },
  { name: 'Администрация Октябрьского района г. Гродно', slug: 'administratsiya-oktyabrskogo-rayona-grodno', type: 'Районная администрация', address: 'ул. Гагарина, 18/2', lat: 53.671, lng: 23.822 },
  { name: 'Суд Ленинского района г. Гродно', slug: 'sud-leninskogo-rayona-grodno', type: 'Судебный орган', address: 'ул. Дзержинского, 1', lat: 53.687, lng: 23.836 },
];

export const InteractiveMap: React.FC<{ initialLevel?: 'belarus' | 'grodno' }> = ({
  initialLevel = 'grodno',
}) => {
  const [activeLevel, setActiveLevel] = useState<'belarus' | 'grodno'>(initialLevel);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(GRODNO_DISTRICTS[0]);
  const [selectedInst, setSelectedInst] = useState<InstitutionPin | null>(null);
  const [layerFilter, setLayerFilter] = useState<'all' | 'districts' | 'institutions'>('all');

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Map Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm md:text-base">Интерактивная карта</span>
          <span className="text-xs text-slate-400">|</span>
          <div className="flex bg-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => { setActiveLevel('belarus'); setSelectedDistrict(null); setSelectedInst(null); }}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeLevel === 'belarus' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Беларусь
            </button>
            <button
              onClick={() => { setActiveLevel('grodno'); setSelectedDistrict(GRODNO_DISTRICTS[0]); }}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeLevel === 'grodno' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Гродно (Пилот)
            </button>
          </div>
        </div>

        {activeLevel === 'grodno' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Слои:</span>
            <button
              onClick={() => setLayerFilter('all')}
              className={`px-2.5 py-1 rounded font-medium ${layerFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Все
            </button>
            <button
              onClick={() => setLayerFilter('districts')}
              className={`px-2.5 py-1 rounded font-medium ${layerFilter === 'districts' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Округа
            </button>
            <button
              onClick={() => setLayerFilter('institutions')}
              className={`px-2.5 py-1 rounded font-medium ${layerFilter === 'institutions' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Органы
            </button>
          </div>
        )}
      </div>

      {/* Main Map View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[440px]">
        {/* Visual Map Render Container */}
        <div className="lg:col-span-2 relative bg-slate-950 p-6 flex flex-col items-center justify-center overflow-hidden">
          {activeLevel === 'belarus' ? (
            /* Belarus National Overview Diagram / Map */
            <div className="w-full max-w-md relative p-4">
              <div className="text-center mb-4">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Карта Республики Беларусь</span>
                <p className="text-xs text-slate-400 mt-1">Выберите область или пилотный город для перехода</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div
                  onClick={() => { setActiveLevel('grodno'); setSelectedDistrict(GRODNO_DISTRICTS[0]); }}
                  className="p-4 bg-emerald-900/40 border-2 border-emerald-500 rounded-xl hover:bg-emerald-800/50 cursor-pointer transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 group-hover:text-white">г. Гродно</span>
                    <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">ПИЛОТ</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Гродненская область • Детальная модель</p>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium mt-2">
                    Открыть структуру <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left opacity-75">
                  <span className="font-semibold text-slate-300">г. Минск</span>
                  <p className="text-xs text-slate-500 mt-1">Столица • Доступно на следующем этапе</p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left opacity-75">
                  <span className="font-semibold text-slate-300">Брестская область</span>
                  <p className="text-xs text-slate-500 mt-1">г. Брест</p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left opacity-75">
                  <span className="font-semibold text-slate-300">Витебская область</span>
                  <p className="text-xs text-slate-500 mt-1">г. Витебск</p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left opacity-75">
                  <span className="font-semibold text-slate-300">Гомельская область</span>
                  <p className="text-xs text-slate-500 mt-1">г. Гомель</p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left opacity-75">
                  <span className="font-semibold text-slate-300">Могилёвская область</span>
                  <p className="text-xs text-slate-500 mt-1">г. Могилёв</p>
                </div>
              </div>
            </div>
          ) : (
            /* Grodno City Detailed Map Visualization */
            <div className="w-full h-full flex flex-col justify-between">
              {/* Top info badge */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  г. Гродно • Координаты 53°40&apos;N 23°49&apos;E
                </span>
                <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  Горсовет 29-го созыва
                </span>
              </div>

              {/* Graphical representation of Districts & Landmarks */}
              <div className="relative w-full h-72 bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-around">
                {/* District Tiles */}
                {(layerFilter === 'all' || layerFilter === 'districts') && (
                  <div className="grid grid-cols-3 gap-2">
                    {GRODNO_DISTRICTS.map((d) => (
                      <div
                        key={d.number}
                        onClick={() => { setSelectedDistrict(d); setSelectedInst(null); }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all text-left ${
                          selectedDistrict?.number === d.number
                            ? 'bg-purple-950/70 border-purple-400 shadow-md ring-1 ring-purple-400'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                          <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                          <span>Округ №{d.number}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">{d.name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Institutions Pins */}
                {(layerFilter === 'all' || layerFilter === 'institutions') && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Ключевые органы:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {GRODNO_INSTITUTIONS.slice(0, 4).map((inst) => (
                        <div
                          key={inst.slug}
                          onClick={() => { setSelectedInst(inst); setSelectedDistrict(null); }}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                            selectedInst?.slug === inst.slug
                              ? 'bg-emerald-950/80 border-emerald-400 ring-1 ring-emerald-400'
                              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-semibold text-emerald-300 truncate">
                            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{inst.name}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{inst.address}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 text-center mt-2">
                Нажмите на округ или орган власти для просмотра подробной карточки и связанных лиц
              </div>
            </div>
          )}
        </div>

        {/* Selected Entity Inspector Panel */}
        <div className="p-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Инспектор объекта
            </h3>

            {selectedDistrict ? (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    Избирательный округ
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-1">{selectedDistrict.name}</h4>
                  <p className="text-xs text-slate-500">Гродненский городской Совет депутатов 29-го созыва</p>
                </div>

                {selectedDistrict.deputyName && (
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs text-slate-500">Избранный депутат:</span>
                    <p className="font-semibold text-slate-900 text-sm">{selectedDistrict.deputyName}</p>
                    {selectedDistrict.deputySlug && (
                      <Link
                        href={`/people/${selectedDistrict.deputySlug}`}
                        className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-medium pt-1"
                      >
                        Перейти в профиль депутата <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href={`/districts/${selectedDistrict.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                  >
                    Страница округа и границы улиц
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : selectedInst ? (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {selectedInst.type}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{selectedInst.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedInst.address}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/institutions/${selectedInst.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                  >
                    Открыть страницу органа власти
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Выберите объект на карте слева для отображения связанных данных
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Link
              href="/territories/grodno"
              className="text-xs text-slate-600 hover:text-emerald-700 font-medium flex items-center justify-between"
            >
              <span>Полный паспорт территории «Гродно»</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
