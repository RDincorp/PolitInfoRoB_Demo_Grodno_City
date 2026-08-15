'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, CheckCircle, XCircle, ArrowRight, ShieldCheck, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { ReviewQueueItem, Source } from '@/types';

export default function ReviewQueuePage() {
  const [items, setItems] = useState<Array<ReviewQueueItem & { source?: Source | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; message: string; type: 'success' | 'error' } | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      // In this client component, we can query via API or load initial data
      const res = await fetch('/api/search?q=a'); // or dedicated endpoint
      // We can also have an endpoint for queue
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load from state
    setItems([
      {
        id: "rq-sample-1",
        entity_type: "person",
        entity_id: "p-ivanov-okr1",
        change_type: "update",
        old_data: {
          full_name: "Белявский Александр Сергеевич",
          reception_schedule: "Второй вторник месяца: 16.00 – 18.00"
        },
        new_data: {
          full_name: "Белявский Александр Сергеевич",
          reception_schedule: "Второй и четвертый вторник месяца: 16.00 – 19.00"
        },
        diff_summary: {
          reception_schedule: {
            old: "Второй вторник месяца: 16.00 – 18.00",
            new: "Второй и четвертый вторник месяца: 16.00 – 19.00"
          }
        },
        source_id: "src-gorsovet-official",
        source: {
          id: "src-gorsovet-official",
          title: "Гродненский городской Совет депутатов — Официальный портал",
          url: "https://grodno.gov.by/gorsovet",
          source_type: "web_page",
          publisher: "Гродненский горисполком",
          allowed_domain: "grodno.gov.by",
          provided_by_user: true,
          provided_at: "2026-08-15T12:00:00Z",
          check_frequency: "еженедельно",
          requires_review: true,
          status: "active",
          created_at: "2026-08-15T12:00:00Z",
          updated_at: "2026-08-15T12:00:00Z"
        },
        source_snapshot_id: "snap-gorsovet-2026-08-15",
        status: "pending",
        reviewed_by: null,
        reviewed_at: null,
        reviewer_notes: null,
        created_at: "2026-08-15T14:30:00Z"
      }
    ]);
    setLoading(false);
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          action,
          reviewedBy: 'Администратор (User)',
          reviewerNotes: action === 'reject' ? 'Отклонено пользователем' : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setFeedback({ id, message: data.message, type: 'success' });
      } else {
        setFeedback({ id, message: data.error || 'Ошибка', type: 'error' });
      }
    } catch (err: any) {
      setFeedback({ id, message: err.message, type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Очередь верификации (Review Queue)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Сравнение изменений между текущей базой и новыми данными из официальных источников.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200">
          <CheckSquare className="w-4 h-4" />
          <span>Ожидают проверки: {items.length}</span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Очередь верификации пуста</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Все извлеченные данные проверены и опубликованы. При появлении изменений из парсера они отобразятся здесь.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase">
                    {item.change_type === 'create' ? 'Новая запись' : 'Обновление'}
                  </span>
                  <span className="font-semibold text-slate-800">
                    Сущность: {item.entity_type} ({item.new_data?.full_name || item.entity_id})
                  </span>
                </div>

                {item.source && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Источник: <strong className="text-slate-800">{item.source.title}</strong></span>
                  </div>
                )}
              </div>

              {/* Side-by-Side Diff */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                {/* Current / Old Data */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Текущие данные в базе (Old):
                  </span>
                  <div className="p-4 bg-red-50/50 rounded-xl border border-red-200 text-xs font-mono text-slate-800 space-y-2">
                    {item.old_data ? (
                      Object.entries(item.old_data).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-slate-500">{key}: </span>
                          <span className={item.diff_summary?.[key] ? 'bg-red-200 px-1 rounded' : ''}>
                            {String(val)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">Запись отсутствует (Новое добавление)</span>
                    )}
                  </div>
                </div>

                {/* Proposed / New Data */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Предлагаемые данные из источника (New):
                  </span>
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs font-mono text-slate-800 space-y-2">
                    {Object.entries(item.new_data || {}).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-slate-500">{key}: </span>
                        <span className={item.diff_summary?.[key] ? 'bg-emerald-200 text-emerald-900 font-bold px-1 rounded' : ''}>
                          {String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  disabled={processingId === item.id}
                  onClick={() => handleAction(item.id, 'reject')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors border border-rose-200 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Отклонить</span>
                </button>

                <button
                  disabled={processingId === item.id}
                  onClick={() => handleAction(item.id, 'approve')}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {processingId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>Утвердить и опубликовать</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
