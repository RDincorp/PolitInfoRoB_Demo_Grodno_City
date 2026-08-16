'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Loader2 } from 'lucide-react';

// Dynamically import OpenLayersMap with SSR disabled to prevent window/document undefined during Next.js SSR / Static Export
const OpenLayersMap = dynamic(
  () => import('./OpenLayersMap').then((mod) => mod.OpenLayersMap),
  {
    ssr: false,
    loading: () => (
      <div className="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-12 min-h-[540px] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse border border-emerald-500/30">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1.5">
          <h4 className="font-bold text-white text-sm">Инициализация картографического слоя</h4>
          <p className="text-xs text-slate-400 max-w-sm">
            Загрузка Публичной кадастровой карты РБ (ГУП «НКА») и границ округов города Гродно...
          </p>
        </div>
      </div>
    ),
  }
);

interface Props {
  initialLevel?: 'belarus' | 'grodno';
  selectedDistrictSlug?: string;
  onSelectEntity?: (entity: any) => void;
}

export const InteractiveMap: React.FC<Props> = (props) => {
  return <OpenLayersMap {...props} />;
};
