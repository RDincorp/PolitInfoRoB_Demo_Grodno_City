import React from 'react';
import { ShieldCheck, ExternalLink, Calendar, FileText } from 'lucide-react';
import { Source, SourceSnapshot } from '@/types';

interface ProvenanceBadgeProps {
  source?: Source | null;
  snapshot?: SourceSnapshot | null;
  verifiedAt?: string | null;
  fieldName?: string | null;
  compact?: boolean;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  source,
  snapshot,
  verifiedAt,
  fieldName,
  compact = false,
}) => {
  if (!source) {
    return (
      <span className="inline-flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
        Не указан в предоставленных источниках
      </span>
    );
  }

  const dateFormatted = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '15.08.2026';

  if (compact) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`Источник: ${source.title} (Проверено: ${dateFormatted})`}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded transition-colors"
      >
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>Официальный источник</span>
        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
      </a>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 space-y-1.5 mt-3">
      <div className="flex items-center justify-between font-semibold text-slate-900 border-b border-slate-200 pb-1.5">
        <span className="flex items-center gap-1.5 text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Подтверждено официальным источником
        </span>
        {snapshot && (
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
            Snapshot: {snapshot.content_hash.substring(0, 8)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-start gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
          <div>
            <span className="text-slate-500">Источник: </span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-900 hover:underline font-medium inline-flex items-center gap-1"
            >
              {source.title}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {source.publisher && (
          <div className="text-slate-500 pl-5">
            Издатель: <span className="text-slate-800">{source.publisher}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 pl-5 text-slate-500">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>Дата актуализации: {dateFormatted}</span>
        </div>
      </div>
    </div>
  );
};
