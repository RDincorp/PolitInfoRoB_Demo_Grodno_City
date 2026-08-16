'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GlossaryTerm } from '@/types';
import { Search, BookOpen, ExternalLink, Tag, Scale, Info, CheckCircle2, ChevronRight, Filter } from 'lucide-react';

interface GlossaryListProps {
  initialTerms: GlossaryTerm[];
}

const CATEGORIES = [
  { id: 'all', label: 'Все термины' },
  { id: 'system', label: 'Система власти' },
  { id: 'representative', label: 'Представительная власть' },
  { id: 'executive', label: 'Исполнительная власть' },
  { id: 'electoral', label: 'Избирательная система' },
  { id: 'procedure', label: 'Регламент и процедуры' },
];

export const GlossaryList: React.FC<GlossaryListProps> = ({ initialTerms }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTerms = useMemo(() => {
    return initialTerms.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const clean = searchQuery.trim().toLowerCase();
      if (!clean) return matchCat;

      const matchText =
        item.term.toLowerCase().includes(clean) ||
        item.short_definition.toLowerCase().includes(clean) ||
        item.full_explanation.toLowerCase().includes(clean) ||
        (item.examples && item.examples.toLowerCase().includes(clean)) ||
        (item.legal_basis && item.legal_basis.toLowerCase().includes(clean));

      return matchCat && matchText;
    });
  }, [initialTerms, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск термина, определения или нормы закона (например: созыв, исполком, ВНС)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Очистить
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 pl-1 pr-2 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" /> Категории:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Найдено понятий: <strong className="text-slate-900">{filteredTerms.length}</strong> из {initialTerms.length}
        </span>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-emerald-700 hover:underline font-medium"
          >
            Сбросить фильтр
          </button>
        )}
      </div>

      {/* Glossary Cards Grid */}
      {filteredTerms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Термины не найдены</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            По вашему запросу &quot;{searchQuery}&quot; ничего не найдено. Попробуйте изменить параметры поиска или сбросить фильтр категорий.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors"
          >
            Показать все термины
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTerms.map((term) => (
            <div
              key={term.id}
              id={term.slug}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 space-y-4 scroll-mt-24"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {term.category_label}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {term.term}
                  </h2>
                </div>
              </div>

              {/* Short Definition */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 leading-relaxed">
                {term.short_definition}
              </div>

              {/* Full Explanation */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  Подробное разъяснение:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {term.full_explanation}
                </p>
              </div>

              {/* Local Example if present */}
              {term.examples && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
                  <span className="font-bold text-[11px] uppercase tracking-wider block text-amber-800">
                    Пример на примере города Гродно:
                  </span>
                  <p className="leading-relaxed">{term.examples}</p>
                </div>
              )}

              {/* Legal Basis & Provenance */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start sm:items-center gap-2 text-slate-600">
                  <Scale className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <span className="font-semibold text-slate-800">Правовое основание: </span>
                    <span>{term.legal_basis}</span>
                  </div>
                </div>

                {term.legal_basis_url && (
                  <a
                    href={term.legal_basis_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl font-bold transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    <span>Текст на Pravo.by</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  </a>
                )}
              </div>

              {/* Related Terms */}
              {term.related_terms && term.related_terms.length > 0 && (
                <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400">Связанные понятия:</span>
                  {term.related_terms.map((relTerm) => (
                    <button
                      key={relTerm}
                      onClick={() => setSearchQuery(relTerm)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium transition-colors"
                    >
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      <span>{relTerm}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
