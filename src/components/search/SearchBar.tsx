'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Building2, User, MapPin, CheckCircle, FileQuestion, ArrowRight, Loader2 } from 'lucide-react';
import { SearchResultItem } from '@/types';
import { DBRepository } from '@/lib/db';

export const SearchBar: React.FC<{ placeholder?: string; autoFocus?: boolean }> = ({
  placeholder = 'Найти человека, орган, округ, территорию или вопрос (напр. ЖКХ, Фёдоров, Округ 1)...',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

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
      return;
    }

    setLoading(true);
    try {
      const typeFilter = activeFilter !== 'all' ? (activeFilter as any) : undefined;
      const searchRes = DBRepository.search(query, typeFilter);
      setResults(searchRes);
      setIsOpen(true);
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

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'institution':
        return <Building2 className="w-4 h-4 text-emerald-600" />;
      case 'district':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'territory':
        return <MapPin className="w-4 h-4 text-amber-600" />;
      case 'competence':
        return <FileQuestion className="w-4 h-4 text-rose-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      {/* Search Input Box */}
      <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
        <div className="pl-4 text-slate-400">
          {loading ? <Loader2 className="w-5 h-5 animate-spin text-emerald-600" /> : <Search className="w-5 h-5 text-emerald-600" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full px-3 py-3.5 text-slate-800 placeholder-slate-400 bg-transparent rounded-xl focus:outline-none text-sm md:text-base font-medium"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="pr-4 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-xs text-slate-600">
        <span className="font-medium text-slate-400 mr-1">Фильтр:</span>
        {[
          { id: 'all', label: 'Все' },
          { id: 'person', label: 'Люди' },
          { id: 'institution', label: 'Органы' },
          { id: 'district', label: 'Округа' },
          { id: 'competence', label: 'Вопросы / ЖКХ' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              activeFilter === tab.id
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item.url)}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all mt-0.5">
                    {getItemIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm group-hover:text-emerald-700">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>}
                    {item.description && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{item.description}</p>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-slate-500">
              По запросу <span className="font-semibold text-slate-700">«{query}»</span> ничего не найдено в официальной базе.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
