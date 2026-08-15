'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Loader2 } from 'lucide-react';

// Dynamically import LeafletMap with SSR disabled to prevent window/document undefined during Next.js SSR / Static Export
const LeafletMap = dynamic(
  () => import('./LeafletMap').then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 animate-pulse">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="text-center space-y-1">
          <h4 className="font-bold text-slate-800 text-sm">Инициализация картографического слоя</h4>
          <p className="text-xs text-slate-500">Загрузка OpenStreetMap и полигонов округов города Гродно...</p>
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
  return <LeafletMap {...props} />;
};
