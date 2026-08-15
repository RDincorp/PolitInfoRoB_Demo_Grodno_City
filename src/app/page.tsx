import React from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { StateStructureDiagram } from '@/components/state-structure/StateStructureDiagram';
import { DBRepository } from '@/lib/db';
import { MapPin, Users, Building2, CheckCircle, FileQuestion, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const stats = DBRepository.getDashboardStats();

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-emerald-600/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Официальная информационно-справочная веб-платформа</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Интерактивная политическая карта <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Республики Беларусь
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Структурированная цифровая модель органов государственной власти, местного самоуправления, депутатов и избирательных округов. Пилотный детальный уровень — <strong className="text-white">город Гродно</strong>.
          </p>

          {/* Universal Search Bar */}
          <div className="pt-4">
            <SearchBar autoFocus={false} />
          </div>

          {/* Quick Metrics */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="block text-2xl font-bold text-emerald-400">{stats.institutionsCount}</span>
              <span className="text-[11px] text-slate-400">Органов власти</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="block text-2xl font-bold text-emerald-400">{stats.peopleCount}</span>
              <span className="text-[11px] text-slate-400">Депутатов и руководителей</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="block text-2xl font-bold text-emerald-400">{stats.districtsCount}</span>
              <span className="text-[11px] text-slate-400">Округов в базе</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="block text-2xl font-bold text-emerald-400">{stats.sourcesCount}</span>
              <span className="text-[11px] text-slate-400">Официальных источников</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Quick Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-8 relative z-10">
          <Link
            href="/territories/grodno"
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl border border-slate-200 hover:border-emerald-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700">Город Гродно</h3>
              <p className="text-xs text-slate-500 mt-1">
                Паспорт пилотной территории, горсовет, горисполком, районные администрации, суды.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 mt-4">
              Открыть территорию <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/people"
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl border border-slate-200 hover:border-blue-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700">Депутаты и руководство</h3>
              <p className="text-xs text-slate-500 mt-1">
                Депутаты Гродненского горсовета 29-го созыва, график личного приёма, округа и контакты.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 mt-4">
              Реестр персон <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/districts"
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl border border-slate-200 hover:border-purple-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                <CheckCircle className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-700">Избирательные округа</h3>
              <p className="text-xs text-slate-500 mt-1">
                Границы округов, перечень улиц и домов, закрепленные представители.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 mt-4">
              Список округов <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/competences"
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl border border-slate-200 hover:border-rose-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                <FileQuestion className="w-5 h-5 text-rose-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-rose-700">Вопросы и компетенции</h3>
              <p className="text-xs text-slate-500 mt-1">
                Куда обращаться по вопросам ЖКХ, строительства, школ, загса и нормативные основания.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 mt-4">
              Поиск по вопросам <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </section>

        {/* Section 1: Interactive Map */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Картографическая навигация</span>
              <h2 className="text-2xl font-extrabold text-slate-900">Территориальный и институциональный слой</h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Интерактивная карта позволяет исследовать округа г. Гродно, находить точки органов власти и переходить к карточкам.
            </p>
          </div>

          <InteractiveMap initialLevel="grodno" />
        </section>

        {/* Section 2: State Structure Diagram */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Общенациональный уровень</span>
              <h2 className="text-2xl font-extrabold text-slate-900">Государственное устройство Республики Беларусь</h2>
            </div>
            <Link
              href="/state-structure"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
            >
              Подробнее о структуре <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <StateStructureDiagram />
        </section>

        {/* Section 3: Principles & Provenance Notice */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Принцип полной прозрачности и проверенных источников</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Все опубликованные данные опираются исключительно на официальные порталы государственных органов, нормативные акты и предоставленные пользователем материалы. Никакие биографии или оценки не генерируются искусственным интеллектом.
            </p>
          </div>

          <Link
            href="/sources"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shrink-0 inline-flex items-center gap-2"
          >
            Реестр источников и снапшотов
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
