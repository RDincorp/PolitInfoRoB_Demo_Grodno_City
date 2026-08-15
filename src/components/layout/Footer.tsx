import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Info, Landmark } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>Интерактивная политическая карта Беларуси</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Информационно-справочная веб-платформа, структурирующая официальные сведения о государственном устройстве, органах власти, представителях и компетенциях.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Пилотная территория: город Гродно</span>
            </div>
          </div>

          {/* Col 2: Principles */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Принципы платформы</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Исключительно проверенные официальные источники</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Information, not analysis — без оценок и рейтингов</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Полная трассируемость каждого факта до первоисточника</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Навигация</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/territories/grodno" className="hover:text-white transition-colors">г. Гродно</Link>
              <Link href="/people" className="hover:text-white transition-colors">Депутаты</Link>
              <Link href="/institutions" className="hover:text-white transition-colors">Органы власти</Link>
              <Link href="/districts" className="hover:text-white transition-colors">Округа</Link>
              <Link href="/competences" className="hover:text-white transition-colors">Вопросы (ЖКХ)</Link>
              <Link href="/sources" className="hover:text-white transition-colors">Реестр источников</Link>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Сведения сформированы на основе данных официальных порталов государственных органов (grodno.gov.by, pravo.by и др.).
            </span>
          </div>
          <div>
            <span>Актуализация: 2026 г. • 29-й созыв</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
