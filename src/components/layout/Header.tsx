'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Landmark,
  MapPin,
  Users,
  Building2,
  CheckCircle,
  FileQuestion,
  BookOpen,
  ShieldCheck,
  Settings,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Главная', icon: MapPin },
  { href: '/state-structure', label: 'Гос. устройство', icon: Landmark },
  { href: '/institutions', label: 'Органы власти', icon: Building2 },
  { href: '/people', label: 'Депутаты', icon: Users },
  { href: '/districts', label: 'Округа', icon: CheckCircle },
  { href: '/competences', label: 'Компетенции', icon: FileQuestion },
  { href: '/territories/grodno', label: 'г. Гродно', icon: MapPin },
  { href: '/glossary', label: 'Глоссарий', icon: BookOpen },
  { href: '/sources', label: 'Источники', icon: ShieldCheck },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Official State Utility Top-Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs font-normal border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-semibold text-slate-100 truncate">Государственная справочная веб-система</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline truncate">Республика Беларусь • г. Гродно</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-slate-400 text-xs shrink-0">
            <a
              href="https://pravo.by"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>pravo.by</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a
              href="https://grodno.gov.by"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>grodno.gov.by</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <span className="text-slate-700 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline font-medium">29-й созыв (2024–2029)</span>
          </div>
        </div>
      </div>

      {/* Main GovTech Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-3 gap-4">
          {/* Official Emblem & Brand Title */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group py-1">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-amber-300 border border-emerald-700 flex items-center justify-center shadow-sm group-hover:bg-emerald-900 transition-colors shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight whitespace-nowrap">
                Политическая карта Беларуси
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-emerald-800 leading-tight whitespace-nowrap mt-0.5">
                Государственное устройство и управление • г. Гродно
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 2xl:px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-800 text-white font-bold shadow-sm'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin link & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-md transition-colors border border-slate-300 whitespace-nowrap"
              title="Панель верификации и управления данными"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Панель управления</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200"
              aria-label="Открыть меню"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Government Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-600" />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-300 px-4 pt-3 pb-4 space-y-1 shadow-xl">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-800 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
