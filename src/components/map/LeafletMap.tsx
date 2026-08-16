'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Building2,
  Users,
  Landmark,
  Crosshair,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Phone,
  Info,
  Globe,
  Map as MapIcon,
} from 'lucide-react';

interface Props {
  initialLevel?: 'belarus' | 'grodno';
  selectedDistrictSlug?: string;
  onSelectEntity?: (entity: any) => void;
}

export const LeafletMap: React.FC<Props> = ({
  initialLevel = 'grodno',
  selectedDistrictSlug,
  onSelectEntity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{
    regionsLayer?: any;
    adminDistrictsLayer?: any;
    districtsLayer?: any;
    institutionsLayer?: any;
    userLocationMarker?: any;
    tileLayer?: any;
  }>({});

  const [currentLevel, setCurrentLevel] = useState<'belarus' | 'grodno'>(initialLevel);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [activeLayers, setActiveLayers] = useState({
    adminDistricts: true,
    districts: true,
    institutions: true,
  });
  const [geoData, setGeoData] = useState<{
    regions: any;
    adminDistricts: any;
    districts: any;
    institutions: any;
  }>({ regions: null, adminDistricts: null, districts: null, institutions: null });
  const [isLoading, setIsLoading] = useState(true);
  const [locatingUser, setLocatingUser] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [baseMapType, setBaseMapType] = useState<'voyager' | 'cadastre'>('voyager');

  // Point-in-polygon algorithm (Ray-casting)
  const isPointInPolygon = (point: [number, number], vs: number[][]) => {
    const x = point[0];
    const y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0];
      const yi = vs[i][1];
      const xj = vs[j][0];
      const yj = vs[j][1];
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // 1. Fetch GeoJSON files including NCA Administrative Boundaries
  useEffect(() => {
    let isMounted = true;

    async function loadGeoJSON() {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const [regRes, admRes, distRes, instRes] = await Promise.all([
          fetch(`${basePath}/data/geo/belarus-regions.json`),
          fetch(`${basePath}/data/geo/grodno-administrative-boundaries.json`),
          fetch(`${basePath}/data/geo/grodno-districts.json`),
          fetch(`${basePath}/data/geo/grodno-institutions.json`),
        ]);

        const [regions, adminDistricts, districts, institutions] = await Promise.all([
          regRes.json(),
          admRes.json(),
          distRes.json(),
          instRes.json(),
        ]);

        if (isMounted) {
          setGeoData({ regions, adminDistricts, districts, institutions });
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load GeoJSON layers', err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadGeoJSON();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || !geoData.regions || mapInstanceRef.current) return;

    let L: any;
    let map: any;

    async function initMap() {
      L = (await import('leaflet')).default;

      if (!mapContainerRef.current) return;

      const initialCenter: [number, number] =
        currentLevel === 'belarus' ? [53.7, 28.0] : [53.684, 23.834];
      const initialZoom = currentLevel === 'belarus' ? 6 : 13;

      map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        minZoom: 5,
        maxZoom: 18,
        zoomControl: false,
      });

      // Add Zoom Control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Base Tile Layer
      const tileUrl =
        baseMapType === 'cadastre'
          ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://map.nca.by/" target="_blank">ПКК НКА РБ</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      layersRef.current.tileLayer = tileLayer;
      mapInstanceRef.current = map;
      renderLayers(L, map);
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [geoData]);

  // Update base tile when baseMapType changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layersRef.current.tileLayer) return;
    const map = mapInstanceRef.current;
    import('leaflet').then((module) => {
      const L = module.default;
      map.removeLayer(layersRef.current.tileLayer);
      const tileUrl =
        baseMapType === 'cadastre'
          ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const newTile = L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://map.nca.by/" target="_blank">ПКК НКА РБ</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);
      layersRef.current.tileLayer = newTile;
    });
  }, [baseMapType]);

  // 3. Render and Update Layers
  const renderLayers = async (L: any, map: any) => {
    if (!map || !L || !geoData.regions) return;

    // Clear existing GeoJSON layers
    if (layersRef.current.regionsLayer) map.removeLayer(layersRef.current.regionsLayer);
    if (layersRef.current.adminDistrictsLayer) map.removeLayer(layersRef.current.adminDistrictsLayer);
    if (layersRef.current.districtsLayer) map.removeLayer(layersRef.current.districtsLayer);
    if (layersRef.current.institutionsLayer) map.removeLayer(layersRef.current.institutionsLayer);

    if (currentLevel === 'belarus') {
      // --- Belarus Regions Layer ---
      const regionsLayer = L.geoJSON(geoData.regions, {
        style: (feature: any) => {
          const isPilot = feature.properties.isPilot;
          return {
            fillColor: isPilot ? '#059669' : '#64748b',
            weight: isPilot ? 2.5 : 1.5,
            opacity: 1,
            color: isPilot ? '#047857' : '#94a3b8',
            fillOpacity: isPilot ? 0.35 : 0.15,
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const props = feature.properties;
          layer.bindTooltip(
            `<div class="font-bold text-xs">${props.name}</div>
             <div class="text-[10px] text-slate-500">${props.isPilot ? '★ Пилотный регион (Гродно)' : 'Областной центр: ' + props.capital}</div>`,
            { sticky: true, className: 'rounded-md shadow-sm border border-slate-300' }
          );

          layer.on({
            mouseover: (e: any) => {
              const l = e.target;
              l.setStyle({ fillOpacity: props.isPilot ? 0.6 : 0.3, weight: 3 });
            },
            mouseout: (e: any) => {
              regionsLayer.resetStyle(e.target);
            },
            click: () => {
              if (props.isPilot) {
                switchLevel('grodno');
              } else {
                setSelectedEntity({
                  type: 'region',
                  title: props.name,
                  subtitle: `Административный центр: ${props.capital}`,
                  description: props.description,
                  population: props.population,
                  area: props.area,
                  districtsCount: props.districtsCount,
                  isPilot: props.isPilot,
                });
              }
            },
          });
        },
      }).addTo(map);

      layersRef.current.regionsLayer = regionsLayer;
      map.flyTo([53.7, 28.0], 6, { duration: 1 });
    } else {
      // --- Grodno Detailed Layers ---

      // 1. NCA Administrative Districts (Ленинский и Октябрьский районы)
      if (activeLayers.adminDistricts && geoData.adminDistricts) {
        const adminDistrictsLayer = L.geoJSON(geoData.adminDistricts, {
          style: (feature: any) => {
            const props = feature.properties;
            const isSelected = selectedEntity?.slug === props.slug;
            return {
              fillColor: props.color || '#047857',
              weight: isSelected ? 3.5 : 2,
              opacity: 0.9,
              color: isSelected ? '#0f172a' : props.color || '#047857',
              dashArray: '4, 4',
              fillOpacity: isSelected ? 0.25 : 0.12,
            };
          },
          onEachFeature: (feature: any, layer: any) => {
            const props = feature.properties;

            layer.bindTooltip(
              `<div class="p-1">
                <div class="font-bold text-xs text-slate-900">${props.name}</div>
                <div class="text-[11px] text-emerald-800 font-semibold mt-0.5">Глава: ${props.head_of_administration}</div>
                <div class="text-[10px] text-slate-500">Население: ~${props.population} чел. • Данные ПКК НКА</div>
              </div>`,
              { sticky: true, className: 'rounded-lg shadow-md border border-slate-300' }
            );

            layer.on({
              mouseover: (e: any) => {
                const l = e.target;
                l.setStyle({ fillOpacity: 0.25, weight: 3 });
              },
              mouseout: (e: any) => {
                if (selectedEntity?.slug !== props.slug) {
                  adminDistrictsLayer.resetStyle(e.target);
                }
              },
              click: () => {
                const entity = {
                  type: 'admin_district',
                  id: props.id,
                  title: props.name,
                  slug: props.slug,
                  head_of_administration: props.head_of_administration,
                  address: props.address,
                  phone: props.phone,
                  population: props.population,
                  area_km2: props.area_km2,
                  website: props.website,
                  cadastre_code: props.cadastre_code,
                  description: props.description,
                  badge: 'Административный район (ПКК НКА)',
                  source: 'Публичная кадастровая карта РБ (map.nca.by)',
                };
                setSelectedEntity(entity);
                if (onSelectEntity) onSelectEntity(entity);
              },
            });
          },
        }).addTo(map);

        layersRef.current.adminDistrictsLayer = adminDistrictsLayer;
      }

      // 2. Electoral Districts Layer (Округа 29-го созыва)
      if (activeLayers.districts && geoData.districts) {
        const districtsLayer = L.geoJSON(geoData.districts, {
          style: (feature: any) => {
            const props = feature.properties;
            const isSelected = selectedEntity?.slug === props.slug;
            return {
              fillColor: props.color || '#7c3aed',
              weight: isSelected ? 3.5 : 1.5,
              opacity: 1,
              color: isSelected ? '#1e1b4b' : props.color || '#7c3aed',
              fillOpacity: isSelected ? 0.45 : 0.22,
            };
          },
          onEachFeature: (feature: any, layer: any) => {
            const props = feature.properties;

            layer.bindTooltip(
              `<div class="p-1">
                <div class="font-bold text-xs text-purple-900">Округ №${props.number}: ${props.name}</div>
                <div class="text-[11px] text-slate-700 font-semibold mt-0.5">Депутат: ${props.deputy_name}</div>
                <div class="text-[10px] text-slate-500">${props.admin_district}</div>
              </div>`,
              { sticky: true, className: 'rounded-lg shadow-md border border-purple-200' }
            );

            layer.on({
              mouseover: (e: any) => {
                const l = e.target;
                l.setStyle({ fillOpacity: 0.45, weight: 3 });
              },
              mouseout: (e: any) => {
                if (selectedEntity?.slug !== props.slug) {
                  districtsLayer.resetStyle(e.target);
                }
              },
              click: () => {
                const entity = {
                  type: 'district',
                  id: props.id,
                  number: props.number,
                  title: `Округ №${props.number}: ${props.name}`,
                  slug: props.slug,
                  deputy_name: props.deputy_name,
                  deputy_slug: props.deputy_slug,
                  deputy_position: props.deputy_position,
                  reception_schedule: props.reception_schedule,
                  admin_district: props.admin_district,
                  boundaries: props.boundaries,
                  photo_url: props.photo_url,
                  url: `/districts/${props.slug}`,
                  badge: 'Избирательный округ горсовета',
                };
                setSelectedEntity(entity);
                if (onSelectEntity) onSelectEntity(entity);
              },
            });
          },
        }).addTo(map);

        layersRef.current.districtsLayer = districtsLayer;
      }

      // 3. Institutions POI Layer
      if (activeLayers.institutions && geoData.institutions) {
        const institutionsLayer = L.geoJSON(geoData.institutions, {
          pointToLayer: (feature: any, latlng: any) => {
            const p = feature.properties;

            const bgClass =
              p.type === 'representative'
                ? 'bg-purple-700 border-purple-900'
                : p.type === 'judicial'
                ? 'bg-amber-700 border-amber-900'
                : p.type === 'service'
                ? 'bg-blue-700 border-blue-900'
                : 'bg-emerald-700 border-emerald-900';

            const customIcon = L.divIcon({
              className: 'custom-poi-marker',
              html: `
                <div class="w-7 h-7 rounded-md ${bgClass} text-white flex items-center justify-center shadow-md border border-white transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
              `,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });

            return L.marker(latlng, { icon: customIcon });
          },
          onEachFeature: (feature: any, layer: any) => {
            const p = feature.properties;
            layer.bindPopup(`
              <div class="p-3 space-y-2 text-xs">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-300">${p.category}</span>
                <h4 class="font-bold text-slate-900 text-sm">${p.name}</h4>
                <p class="text-slate-600 font-medium">📍 ${p.address}</p>
                <p class="text-slate-600">📞 ${p.phone}</p>
                <div class="pt-2">
                  <a href="${process.env.NEXT_PUBLIC_BASE_PATH || ''}/institutions/${p.slug}" class="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950">
                    Открыть карточку органа →
                  </a>
                </div>
              </div>
            `);

            layer.on('click', () => {
              setSelectedEntity({
                type: 'institution',
                title: p.name,
                subtitle: p.category,
                address: p.address,
                phone: p.phone,
                schedule: p.work_schedule,
                head: p.head,
                slug: p.slug,
                url: `/institutions/${p.slug}`,
                badge: 'Орган власти',
              });
            });
          },
        }).addTo(map);

        layersRef.current.institutionsLayer = institutionsLayer;
      }

      map.flyTo([53.684, 23.834], 13, { duration: 1 });
    }
  };

  // Re-render layers whenever currentLevel, activeLayers or selection changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      import('leaflet').then((module) => {
        renderLayers(module.default, mapInstanceRef.current);
      });
    }
  }, [currentLevel, activeLayers, selectedEntity?.slug]);

  // Switch between macro Belarus view and micro Grodno city view
  const switchLevel = (level: 'belarus' | 'grodno') => {
    setCurrentLevel(level);
    setSelectedEntity(null);
    setLocationMessage(null);
  };

  // User Geolocation Tool: "Find My District"
  const handleFindMyDistrict = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Геолокация не поддерживается вашим браузером.');
      return;
    }

    setLocatingUser(true);
    setLocationMessage('Определяем координаты...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocatingUser(false);
        const { latitude, longitude } = pos.coords;
        const L = (await import('leaflet')).default;
        const map = mapInstanceRef.current;

        if (!map) return;

        if (currentLevel !== 'grodno') {
          setCurrentLevel('grodno');
        }

        if (layersRef.current.userLocationMarker) {
          map.removeLayer(layersRef.current.userLocationMarker);
        }

        const userIcon = L.divIcon({
          className: 'user-pulse-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                <div class="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div class="absolute w-8 h-8 rounded-full bg-rose-500 opacity-75 animate-ping"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
        layersRef.current.userLocationMarker = userMarker;

        map.flyTo([latitude, longitude], 15, { duration: 1.5 });

        // Point-in-polygon test against Grodno districts
        if (geoData.districts) {
          let foundDistrict: any = null;
          for (const feat of geoData.districts.features) {
            const coords = feat.geometry.coordinates[0];
            if (isPointInPolygon([longitude, latitude], coords)) {
              foundDistrict = feat.properties;
              break;
            }
          }

          if (foundDistrict) {
            setLocationMessage(`Вы находитесь в ${foundDistrict.name}!`);
            setSelectedEntity({
              type: 'district',
              id: foundDistrict.id,
              number: foundDistrict.number,
              title: `Округ №${foundDistrict.number}: ${foundDistrict.name}`,
              slug: foundDistrict.slug,
              deputy_name: foundDistrict.deputy_name,
              deputy_slug: foundDistrict.deputy_slug,
              deputy_position: foundDistrict.deputy_position,
              reception_schedule: foundDistrict.reception_schedule,
              admin_district: foundDistrict.admin_district,
              boundaries: foundDistrict.boundaries,
              url: `/districts/${foundDistrict.slug}`,
              badge: 'Ваш избирательный округ',
            });
          } else {
            setLocationMessage('Координаты определены, но точка вне полигонов округов Гродно.');
          }
        }
      },
      (error) => {
        setLocatingUser(false);
        setLocationMessage('Не удалось получить координаты. Разрешите доступ к геолокации в браузере.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[620px]">
      {/* Map Area */}
      <div className="flex-1 relative min-h-[420px] lg:min-h-[620px] bg-slate-100 flex flex-col">
        {/* Top Control Bar */}
        <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
          {/* Level Switcher */}
          <div className="bg-white shadow-md rounded-md p-1 flex items-center border border-slate-300 text-xs font-semibold">
            <button
              onClick={() => switchLevel('belarus')}
              className={`px-3 py-1.5 rounded transition-all ${
                currentLevel === 'belarus'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Беларусь (Области)
            </button>
            <button
              onClick={() => switchLevel('grodno')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                currentLevel === 'grodno'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>г. Гродно (Пилот)</span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            </button>
          </div>

          {/* Layer toggles for Grodno */}
          {currentLevel === 'grodno' && (
            <div className="bg-white shadow-md rounded-md p-1 flex items-center border border-slate-300 text-xs gap-1">
              <button
                onClick={() =>
                  setActiveLayers((prev) => ({ ...prev, adminDistricts: !prev.adminDistricts }))
                }
                className={`px-2.5 py-1.5 rounded font-semibold transition-all flex items-center gap-1 ${
                  activeLayers.adminDistricts
                    ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Официальные границы Ленинского и Октябрьского районов (ПКК НКА)"
              >
                <MapIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>Районы НКА</span>
              </button>
              <button
                onClick={() =>
                  setActiveLayers((prev) => ({ ...prev, districts: !prev.districts }))
                }
                className={`px-2.5 py-1.5 rounded font-semibold transition-all flex items-center gap-1 ${
                  activeLayers.districts
                    ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-700" />
                <span>Округа</span>
              </button>
              <button
                onClick={() =>
                  setActiveLayers((prev) => ({ ...prev, institutions: !prev.institutions }))
                }
                className={`px-2.5 py-1.5 rounded font-semibold transition-all flex items-center gap-1 ${
                  activeLayers.institutions
                    ? 'bg-blue-100 text-blue-900 font-bold border border-blue-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Органы власти</span>
              </button>
            </div>
          )}

          {/* Base Map Style Switcher */}
          <div className="bg-white shadow-md rounded-md p-1 flex items-center border border-slate-300 text-xs font-semibold">
            <button
              onClick={() => setBaseMapType(baseMapType === 'voyager' ? 'cadastre' : 'voyager')}
              className="px-2.5 py-1.5 rounded text-slate-700 hover:text-slate-900 flex items-center gap-1"
              title="Переключить подложку карты (Схема / Кадастровый нейтральный)"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{baseMapType === 'voyager' ? 'Кадастр. вид' : 'Цветной вид'}</span>
            </button>
          </div>

          {/* Geolocation Button */}
          {currentLevel === 'grodno' && (
            <button
              onClick={handleFindMyDistrict}
              disabled={locatingUser}
              className="bg-white shadow-md hover:bg-rose-50 text-slate-800 hover:text-rose-700 px-3 py-1.5 rounded-md border border-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Найти мой избирательный округ по GPS"
            >
              <Crosshair className={`w-3.5 h-3.5 text-rose-600 ${locatingUser ? 'animate-spin' : ''}`} />
              <span>{locatingUser ? 'Определение...' : 'Где мой округ?'}</span>
            </button>
          )}
        </div>

        {/* Location notification banner */}
        {locationMessage && (
          <div className="absolute bottom-8 left-4 z-[1000] bg-slate-900 text-white text-xs px-3.5 py-2 rounded-md shadow-lg border border-slate-700 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{locationMessage}</span>
          </div>
        )}

        {/* Cadastral Attribution Badge on map */}
        <div className="absolute bottom-2 left-3 z-[1000] bg-white/90 text-slate-700 text-[10px] px-2.5 py-1 rounded border border-slate-300 shadow-sm flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Геобаза: <strong>ПКК НКА РБ (map.nca.by)</strong></span>
        </div>

        {/* Leaflet container */}
        <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-sm z-[1001] flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-800">Загрузка слоев ПКК НКА и OpenStreetMap...</p>
          </div>
        )}
      </div>

      {/* Inspector Panel */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-300 p-6 flex flex-col justify-between bg-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-emerald-800" />
              <span>Инспектор объектов</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
              {currentLevel === 'belarus' ? 'Слой: Области' : 'Слой: г. Гродно'}
            </span>
          </div>

          {selectedEntity ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                  {selectedEntity.badge || selectedEntity.type}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5 leading-snug">
                  {selectedEntity.title}
                </h3>
                {selectedEntity.subtitle && (
                  <p className="text-xs text-slate-600 font-medium">
                    {selectedEntity.subtitle}
                  </p>
                )}
              </div>

              {/* Administrative District Inspector (NCA CADASTRE) */}
              {selectedEntity.type === 'admin_district' && (
                <div className="p-3.5 bg-emerald-50/70 rounded-md border border-emerald-200 space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                      Глава администрации района:
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {selectedEntity.head_of_administration}
                    </p>
                  </div>
                  <div className="space-y-1 text-slate-700">
                    <p>📍 <strong>Адрес:</strong> {selectedEntity.address}</p>
                    <p>📞 <strong>Телефон:</strong> {selectedEntity.phone}</p>
                    <p>👥 <strong>Население:</strong> ~{selectedEntity.population} чел.</p>
                    <p>📐 <strong>Площадь:</strong> {selectedEntity.area_km2} км²</p>
                    <p>🏛️ <strong>Код СОАТО:</strong> {selectedEntity.cadastre_code}</p>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-[11px] text-emerald-900 font-semibold">
                    <span>{selectedEntity.source}</span>
                    {selectedEntity.website && (
                      <a
                        href={selectedEntity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1 text-emerald-800"
                      >
                        <span>Официальный сайт</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* District Deputy Info */}
              {selectedEntity.type === 'district' && (
                <div className="p-3.5 bg-purple-50/70 rounded-md border border-purple-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block">
                    Избранный депутат:
                  </span>
                  <div className="flex items-start gap-3">
                    {selectedEntity.photo_url && (
                      <img
                        src={selectedEntity.photo_url}
                        alt={selectedEntity.deputy_name}
                        className="w-12 h-12 rounded-md object-cover object-top border border-purple-200 shrink-0 shadow-sm"
                      />
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedEntity.deputy_name}
                      </p>
                      {selectedEntity.deputy_position && (
                        <p className="text-xs text-slate-600 mt-0.5">
                          {selectedEntity.deputy_position}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedEntity.reception_schedule && (
                    <div className="pt-2 border-t border-purple-200 text-xs text-purple-950 flex items-start gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-700 mt-0.5 shrink-0" />
                      <span>{selectedEntity.reception_schedule}</span>
                    </div>
                  )}
                  {selectedEntity.deputy_slug && (
                    <div className="pt-1">
                      <Link
                        href={`/people/${selectedEntity.deputy_slug}`}
                        className="text-xs text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1"
                      >
                        <span>Профиль депутата</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Institution Details */}
              {selectedEntity.type === 'institution' && (
                <div className="space-y-2 text-xs text-slate-600">
                  {selectedEntity.address && (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{selectedEntity.address}</span>
                    </div>
                  )}
                  {selectedEntity.phone && (
                    <div className="flex items-start gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{selectedEntity.phone}</span>
                    </div>
                  )}
                  {selectedEntity.head && (
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800">
                      <strong>Руководитель:</strong> {selectedEntity.head}
                    </div>
                  )}
                </div>
              )}

              {/* Boundaries info */}
              {selectedEntity.boundaries && (
                <div className="text-xs text-slate-600 space-y-1.5">
                  <span className="font-bold text-slate-800 block">Официальный перечень улиц:</span>
                  <p className="line-clamp-4 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-700">
                    {selectedEntity.boundaries}
                  </p>
                  <p className="text-[10px] text-slate-500 italic bg-amber-50/70 p-2 rounded border border-amber-200">
                    ℹ️ <strong>Примечание:</strong> В РБ избирательные округа утверждаются в виде текстового перечня адресов (Решение городской избирательной комиссии). Контур на карте является визуализацией охвата улиц.
                  </p>
                </div>
              )}

              {/* Region statistics */}
              {selectedEntity.type === 'region' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Население</span>
                    <strong className="text-slate-900">{selectedEntity.population}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Площадь</span>
                    <strong className="text-slate-900">{selectedEntity.area}</strong>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {selectedEntity.url && (
                <div className="pt-2">
                  <Link
                    href={selectedEntity.url}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-900 hover:bg-emerald-800 text-white rounded-md text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>Открыть подробный паспорт</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 py-8 text-center">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-600 max-w-[240px] mx-auto leading-relaxed">
                Кликните по <strong>Ленинскому или Октябрьскому району (ПКК НКА)</strong>, избирательному округу или используйте кнопку <strong>«Где мой округ?»</strong>
              </p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>ПКК НКА РБ (map.nca.by)</span>
          </span>
          <span>WGS-84 • EPSG:4326</span>
        </div>
      </div>
    </div>
  );
};
