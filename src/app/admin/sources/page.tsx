'use client';

import React, { useState } from 'react';
import { ShieldCheck, Play, FileCode, Plus, CheckCircle2, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Source } from '@/types';

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<Source[]>([
    {
      id: "src-gorsovet-official",
      title: "Гродненский городской Совет депутатов — Официальный портал",
      url: "https://grodno.gov.by/gorsovet",
      source_type: "web_page",
      publisher: "Гродненский городской исполнительный комитет",
      allowed_domain: "grodno.gov.by",
      provided_by_user: true,
      provided_at: "2026-08-15T12:00:00Z",
      check_frequency: "еженедельно",
      requires_review: true,
      description: "Официальный раздел Гродненского горсовета 29-го созыва, депутаты, округа, график приёма.",
      status: "active",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "src-ispolkom-official",
      title: "Официальный сайт Гродненского горисполкома",
      url: "https://grodno.gov.by",
      source_type: "web_page",
      publisher: "Гродненский городской исполнительный комитет",
      allowed_domain: "grodno.gov.by",
      provided_by_user: true,
      provided_at: "2026-08-15T12:00:00Z",
      check_frequency: "еженедельно",
      requires_review: true,
      description: "Структура исполнительной власти города Гродно, службы и подразделения.",
      status: "active",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    }
  ]);

  const [selectedSourceId, setSelectedSourceId] = useState<string>('src-gorsovet-official');
  const [rawHtmlInput, setRawHtmlInput] = useState<string>(
    `<table>
  <tr><td>Округ №1</td><td>Белявский Александр Сергеевич</td><td>Депутат</td><td>Второй вторник 16:00-18:00</td></tr>
  <tr><td>Округ №2</td><td>Козлова Елена Викторовна</td><td>Депутат</td><td>Третий четверг 17:00-19:00</td></tr>
  <tr><td>Округ №3</td><td>Морозов Дмитрий Николаевич</td><td>Депутат</td><td>Первый понедельник 15:00-17:00</td></tr>
</table>`
  );
  const [running, setRunning] = useState(false);
  const [parseResult, setParseResult] = useState<any | null>(null);

  const handleRunParser = async () => {
    setRunning(true);
    setParseResult(null);
    try {
      const res = await fetch('/api/ingestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: selectedSourceId,
          rawContent: rawHtmlInput,
          fetchLive: false,
        }),
      });
      const data = await res.json();
      setParseResult(data);
    } catch (err: any) {
      setParseResult({ success: false, message: err.message });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Source Registry & Ingestion Runner
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Управление доверенными доменами, политиками верификации и запуск парсеров данных.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Ingestion Tool */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Play className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Запуск Ingestion Pipeline</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Выберите целевой источник из реестра:
              </label>
              <select
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.allowed_domain})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Контент источника (HTML / Таблица / Текст):
              </label>
              <textarea
                rows={7}
                value={rawHtmlInput}
                onChange={(e) => setRawHtmlInput(e.target.value)}
                placeholder="Вставьте HTML-код или текст страницы официального источника..."
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                SSRF Guard: Проверка белого списка доменов и приватных IP включена.
              </span>
              <button
                disabled={running}
                onClick={handleRunParser}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-sm inline-flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Обработать источник</span>
              </button>
            </div>

            {parseResult && (
              <div
                className={`p-4 rounded-xl text-xs space-y-2 mt-4 ${
                  parseResult.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {parseResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{parseResult.message}</span>
                </div>
                {parseResult.snapshotId && (
                  <div className="text-[11px] font-mono text-slate-600 space-y-0.5">
                    <p>Snapshot ID: {parseResult.snapshotId}</p>
                    <p>Извлечено записей: {parseResult.recordsExtracted}</p>
                    <p>Направлено в Review Queue: {parseResult.recordsQueued}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Registry list */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Доверенные источники</h2>
          </div>

          <div className="space-y-3">
            {sources.map((s) => (
              <div
                key={s.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{s.title}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Домен: <span className="text-emerald-800 font-bold">{s.allowed_domain}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Режим: {s.requires_review ? 'Manual Review' : 'Auto'}</span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    URL <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
