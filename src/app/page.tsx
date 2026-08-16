import React from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { StateStructureDiagram } from '@/components/state-structure/StateStructureDiagram';
import { DBRepository } from '@/lib/db';
import {
  MapPin,
  Users,
  Building2,
  CheckCircle,
  FileQuestion,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Scale,
  Landmark,
  FileText,
} from 'lucide-react';

export default function HomePage() {
  const stats = DBRepository.getDashboardStats();

  return (
    <div className="space-y-12 pb-16">
      {/* Official GovTech Hero Section */}
      <section className="relative bg-slate-900 text-white border-b border-slate-800 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Официальная информационная платформа • г. Гродно</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Органы власти, депутаты и округа <br className="hidden sm:inline" />
            <span className="text-emerald-400 font-extrabold">города Гродно</span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Единая цифровая справочная система государственного устройства, депутатского корпуса и распределения компетенций органов управления на основе законодательства Республики Беларусь.
          </p>

          {/* Universal Civic Search Bar */}
          <div className="pt-2 max-w-3xl mx-auto">
            <SearchBar autoFocus={false} />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Популярные запросы:</span>
              <Link href="/people/fedorov-oleg-gennadevich" className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors">
                Фёдоров О. Г.
              </Link>
              <Link href="/people/potapova-elena-stanislavovna" className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors">
                Потапова Е. С.
              </Link>
              <Link href="/districts/kalozhskiy-izbiratelnyy-okrug-1" className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors">
                Каложский № 1
              </Link>
              <Link href="/districts/tsentralnyy-izbiratelnyy-okrug-2" className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors">
                ул. Советская
              </Link>
              <Link href="/competences/zhilischno-kommunalnye-voprosy" className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors">
                ЖКХ и благоустройство
              </Link>
            </div>
          </div>

          {/* Official Statistics Grid */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-center">
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">{stats.institutionsCount}</span>
              <span className="text-xs text-slate-300 font-medium">Органов власти и ведомств</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-400">{stats.peopleCount}</span>
              <span className="text-xs text-slate-300 font-medium">Депутатов и руководителей</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="block text-2xl sm:text-3xl font-extrabold text-white">{stats.districtsCount}</span>
              <span className="text-xs text-slate-300 font-medium">Избирательных округов</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-400">{stats.sourcesCount}</span>
              <span className="text-xs text-slate-300 font-medium">Официальных первоисточника</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Civic Quick Action Cards */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-800" />
              <span>Разделы системы и сервисы для граждан</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Быстрый переход к реестрам, округам, графику личного приёма и распределению компетенций.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/territories/grodno"
              className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md border border-slate-300 hover:border-emerald-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800">
                  Город Гродно (Паспорт)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Официальный паспорт города, Горсовет 29-го созыва, Горисполком, администрации районов и суды.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 mt-4 pt-3 border-t border-slate-100">
                Открыть структуру города <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/people"
              className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md border border-slate-300 hover:border-emerald-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-900 flex items-center justify-center font-bold mb-3 group-hover:bg-blue-800 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-900">
                  Депутаты и руководство
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Реестр депутатов Гродненского горсовета, руководство исполкомов, графики личного приёма граждан.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 mt-4 pt-3 border-t border-slate-100">
                Реестр персон и приём <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/districts"
              className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md border border-slate-300 hover:border-emerald-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-purple-100 text-purple-900 flex items-center justify-center font-bold mb-3 group-hover:bg-purple-800 group-hover:text-white transition-colors">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-900">
                  Избирательные округа
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Поиск округа по названию улицы и номеру дома, закрепленный депутат городского Совета.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-900 mt-4 pt-3 border-t border-slate-100">
                Список округов и улиц <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/competences"
              className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md border border-slate-300 hover:border-emerald-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center font-bold mb-3 group-hover:bg-amber-800 group-hover:text-white transition-colors">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-900">
                  Вопросы и компетенции
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Разграничение сфер ответственности: ЖКХ, образование, перепланировка, ЗАГС и нормы законов.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 mt-4 pt-3 border-t border-slate-100">
                Куда обращаться <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </section>

        {/* Section 1: Interactive Map */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-800" />
                <span>Интерактивная карта административно-территориального деления</span>
              </h2>
              <p className="text-xs text-slate-600">
                Визуализация районов города Гродно, избирательных округов и адресов органов власти.
              </p>
            </div>
            <Link
              href="/territories/grodno"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200"
            >
              Детализация Гродно <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-2 sm:p-4">
            <InteractiveMap initialLevel="grodno" />
          </div>
        </section>

        {/* Section 2: State Structure Diagram */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-800" />
                <span>Структура органов государственной власти и местного управления</span>
              </h2>
              <p className="text-xs text-slate-600">
                Конституционная иерархия: от Всебелорусского народного собрания до администраций районов в городе.
              </p>
            </div>
            <Link
              href="/state-structure"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200"
            >
              Полная схема <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4 sm:p-6">
            <StateStructureDiagram />
          </div>
        </section>

        {/* Section 3: Legal Basis & Glossary Banner */}
        <section className="bg-slate-100 rounded-lg border border-slate-300 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>Нормативно-правовая основа и глоссарий</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Глоссарий терминов государственного устройства
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Разъяснение официальных понятий законодательства Республики Беларусь: статус Всебелорусского народного собрания (ВНС), компетенция местных Советов депутатов и исполкомов, депутатские запросы и порядок обращений граждан.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/glossary"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Открыть глоссарий</span>
              </Link>
              <Link
                href="/sources"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-300 shadow-sm transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Реестр источников</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
