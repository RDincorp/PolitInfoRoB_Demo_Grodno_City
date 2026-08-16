import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Info, Landmark, ExternalLink, Scale } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-16">
      {/* Decorative Government Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Status */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <div className="w-7 h-7 rounded bg-emerald-800 text-amber-300 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="leading-tight">Политическая карта Беларуси</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Государственная информационно-справочная веб-платформа по структуре органов власти, депутатам и избирательным округам города Гродно.
            </p>
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Пилотный регион: г. Гродно • 29-й созыв</span>
            </div>
          </div>

          {/* Col 2: Principles */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Правовая основа</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <a
                  href="https://pravo.by/pravovaya-informatsiya/normativnye-dokumenty/konstitutsiya-respubliki-belarus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Конституция Республики Беларусь</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pravo.by/document/?guid=3871&p0=H11000108"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Закон «О местном управлении»</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pravo.by/document/?guid=3871&p0=H10600170"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Избирательный кодекс Республики Беларусь</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Разделы системы</h4>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <Link href="/territories/grodno" className="hover:text-emerald-400 transition-colors">Паспорт города Гродно</Link>
              <Link href="/people" className="hover:text-emerald-400 transition-colors">Депутаты и руководство</Link>
              <Link href="/institutions" className="hover:text-emerald-400 transition-colors">Органы власти</Link>
              <Link href="/districts" className="hover:text-emerald-400 transition-colors">Избирательные округа</Link>
              <Link href="/competences" className="hover:text-emerald-400 transition-colors">Компетенции (ЖКХ, образование)</Link>
              <Link href="/glossary" className="hover:text-emerald-400 transition-colors">Глоссарий терминов</Link>
            </div>
          </div>

          {/* Col 4: Data Provenance */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Первоисточники</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <a href="https://grodno.gov.by" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  <span>grodno.gov.by (Горисполком)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://pravo.by" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  <span>pravo.by (Национальный реестр)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <Link href="/sources" className="text-emerald-400 hover:underline flex items-center gap-1">
                  <span>Реестр и архив снимков данных</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Сведения структурированы исключительно на основе открытых данных государственных органов Республики Беларусь. Принцип: Information, not analysis.
            </span>
          </div>
          <div className="shrink-0 text-slate-400">
            <span>Актуализация: 2026 г. • 29-й созыв</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
