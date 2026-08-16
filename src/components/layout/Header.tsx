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
  { href: '/', label: 'Главная и Карта', icon: MapPin },
  { href: '/state-structure', label: 'Гос. устройство', icon: Landmark },
  { href: '/people', label: 'Депутаты и руководство', icon: Users },
  { href: '/institutions', label: 'Органы власти', icon: Building2 },
  { href: '/territories/grodno', label: 'г. Гродно', icon: MapPin },
  { href: '/districts', label: 'Округа', icon: CheckCircle },
  { href: '/competences', label: 'Компетенции / ЖКХ', icon: FileQuestion },
  { href: '/glossary', label: 'Глоссарий', icon: BookOpen },
  { href: '/sources', label: 'Первоисточники', icon: ShieldCheck },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      {/* Official State Utility Top-Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-200">Государственная информационно-справочная система</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Республика Беларусь • Город Гродно</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <a
              href="https://pravo.by"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>pravo.by</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://grodno.gov.by"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>grodno.gov.by</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">29-й созыв (2024–2029)</span>
          </div>
        </div>
      </div>

      {/* Main GovTech Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Official Emblem & Brand Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-emerald-800 text-amber-300 border border-emerald-700 flex items-center justify-center shadow-sm group-hover:bg-emerald-900 transition-colors">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight block tracking-tight">
                Политическая карта Беларуси
              </span>
              <span className="text-xs font-medium text-emerald-800 block">
                Государственное устройство и управление • г. Гродно
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin link & Mobile Menu Trigger */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-300"
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
