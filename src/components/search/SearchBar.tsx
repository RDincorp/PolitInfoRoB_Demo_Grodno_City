'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Building2,
  User,
  MapPin,
  CheckCircle,
  FileQuestion,
  BookOpen,
  ArrowRight,
  Loader2,
  CornerDownLeft,
  Sparkles,
} from 'lucide-react';
import { SearchResultItem } from '@/types';
import { DBRepository } from '@/lib/db';

const POPULAR_SUGGESTIONS = [
  { label: 'Фёдоров', type: 'person' },
  { label: 'Хмель', type: 'person' },
  { label: 'Горисполком', type: 'institution' },
  { label: 'Горсовет', type: 'institution' },
  { label: 'ЖКХ', type: 'competence' },
  { label: 'Советская', type: 'district' },
  { label: 'ВНС', type: 'glossary' },
];

export const SearchBar: React.FC<{ placeholder?: string; autoFocus?: boolean }> = ({
  placeholder = 'Найти человека, орган, округ, улицу или вопрос (напр. ЖКХ, Фёдоров, Советская, ВНС)...',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);
    try {
      const typeFilter = activeFilter !== 'all' ? (activeFilter as any) : undefined;
      const searchRes = DBRepository.search(query, typeFilter);
      setResults(searchRes);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [query, activeFilter]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'ArrowDown' && query.trim() && results.length > 0) {
        setIsOpen(true);
        setSelectedIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex].url);
      } else if (results.length > 0) {
        handleSelect(results[0].url);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[selectedIndex]) {
        (items[selectedIndex] as HTMLElement).scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="w-4 h-4 text-blue-700" />;
      case 'institution':
        return <Building2 className="w-4 h-4 text-emerald-700" />;
      case 'district':
        return <CheckCircle className="w-4 h-4 text-purple-700" />;
      case 'territory':
        return <MapPin className="w-4 h-4 text-amber-700" />;
      case 'competence':
        return <FileQuestion className="w-4 h-4 text-rose-700" />;
      case 'glossary':
        return <BookOpen className="w-4 h-4 text-teal-700" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      {/* Search Input Box */}
      <div className="relative flex items-center bg-white rounded-xl shadow-md border border-slate-300 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
        <div className="pl-4 text-slate-400">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
          ) : (
            <Search className="w-5 h-5 text-emerald-800" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full px-3 py-3.5 text-slate-900 placeholder-slate-400 bg-transparent rounded-xl focus:outline-none text-sm md:text-base font-medium"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="pr-4 text-slate-400 hover:text-slate-700 transition-colors"
            title="Очистить поиск"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-xs text-slate-600">
        <span className="font-semibold text-slate-400 mr-1">Фильтр:</span>
        {[
          { id: 'all', label: 'Все' },
          { id: 'person', label: 'Люди' },
          { id: 'institution', label: 'Органы' },
          { id: 'district', label: 'Округа и улицы' },
          { id: 'competence', label: 'Вопросы / ЖКХ' },
          { id: 'glossary', label: 'Глоссарий' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
              activeFilter === tab.id
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden z-50 divide-y divide-slate-100 max-h-[440px] flex flex-col">
          {results.length > 0 ? (
            <>
              <div ref={listRef} className="divide-y divide-slate-100 overflow-y-auto flex-1">
                {results.map((item, idx) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item.url)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3.5 cursor-pointer transition-colors group ${
                      selectedIndex === idx ? 'bg-emerald-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg transition-all mt-0.5 border ${
                          selectedIndex === idx
                            ? 'bg-white shadow-sm border-emerald-200 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {getItemIcon(item.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm transition-colors ${
                              selectedIndex === idx
                                ? 'text-emerald-900'
                                : 'text-slate-900 group-hover:text-emerald-800'
                            }`}
                          >
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                                selectedIndex === idx
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 ml-2 transition-all ${
                        selectedIndex === idx
                          ? 'text-emerald-800 translate-x-1'
                          : 'text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-1'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Bottom Nav Hint */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 px-4">
                <span>Найдено совпадений: <strong>{results.length}</strong></span>
                <span className="flex items-center gap-2">
                  <span><strong>↑↓</strong> навигация</span>
                  <span><strong>Enter ↵</strong> открыть</span>
                  <span><strong>Esc</strong> закрыть</span>
                </span>
              </div>
            </>
          ) : (
            <div className="p-6 text-center space-y-4">
              <p className="text-sm text-slate-600">
                По запросу <strong className="text-slate-900">«{query}»</strong> ничего не найдено в официальной базе.
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-2 font-medium">Рекомендуемые частые запросы:</p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {POPULAR_SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => {
                        setQuery(s.label);
                        setActiveFilter('all');
                      }}
                      className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 rounded-md border border-slate-200 font-medium transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
