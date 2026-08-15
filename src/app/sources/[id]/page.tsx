import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DBRepository } from '@/lib/db';
import { ShieldCheck, ExternalLink, Globe, Calendar, FileCode, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  const sources = DBRepository.getSources();
  return sources.map((s) => ({ id: s.id }));
}

export default function SourceDetailPage({ params }: PageProps) {
  const source = DBRepository.getSourceById(params.id);

  if (!source) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Главная
        </Link>
        <span>/</span>
        <Link href="/sources" className="hover:text-emerald-700">
          Источники
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{source.title}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {source.source_type}
              </span>
              <span className="text-xs text-slate-500">
                SSRF-белый список: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">{source.allowed_domain}</code>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {source.title}
            </h1>
            {source.publisher && (
              <p className="text-xs text-slate-500 font-medium mt-1">
                Официальный издатель: <strong className="text-slate-800">{source.publisher}</strong>
              </p>
            )}
          </div>

          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shrink-0 inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            Перейти к первоисточнику <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Source Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium">Политика верификации:</span>
            <p className="font-semibold text-slate-900">
              {source.requires_review ? 'Обязательная ручная проверка (Review Queue)' : 'Автоматическая публикация'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium">Периодичность сверки:</span>
            <p className="font-semibold text-slate-900">{source.check_frequency || 'По запросу'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium">Статус источника:</span>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Активен и доверен</span>
            </div>
          </div>
        </div>

        {source.description && (
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {source.description}
          </div>
        )}

        {/* Snapshots History */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-600" />
            История цифровых слепков (Snapshots)
          </h2>

          <div className="space-y-2">
            {source.snapshots.length > 0 ? (
              source.snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">Слепок от {new Date(snap.retrieved_at).toLocaleString('ru-RU')}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold uppercase">
                        {snap.status}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      SHA-256: <span className="text-slate-700">{snap.content_hash}</span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400">Парсер v{snap.parser_version}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Слепки еще не создавались.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
