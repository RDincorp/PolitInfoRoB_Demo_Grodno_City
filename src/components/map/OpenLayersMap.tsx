'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Circle as CircleStyle, Text, Icon } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls } from 'ol/control';

interface Props {
  initialLevel?: 'belarus' | 'grodno';
  selectedDistrictSlug?: string;
  onSelectEntity?: (entity: any) => void;
}

// Color palette for 30 electoral districts
const DISTRICT_PALETTE = [
  '#0284c7', '#0d9488', '#16a34a', '#ca8a04', '#ea580c',
  '#dc2626', '#9333ea', '#4f46e5', '#2563eb', '#059669',
  '#65a30d', '#d97706', '#e11d48', '#7c3aed', '#3b82f6',
  '#10b981', '#84cc16', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#14b8a6', '#22c55e', '#eab308', '#f97316',
  '#f43f5e', '#a855f7', '#6366f1', '#0ea5e9', '#34d399'
];

export const OpenLayersMap: React.FC<Props> = ({
  initialLevel = 'grodno',
  selectedDistrictSlug,
  onSelectEntity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

  // Layer references
  const tileLayerRef = useRef<TileLayer<XYZ> | null>(null);
  const regionsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const adminDistrictsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const electoralDistrictsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const institutionsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const userMarkerLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // States
  const [currentLevel, setCurrentLevel] = useState<'belarus' | 'grodno'>(initialLevel);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [hoveredFeatureInfo, setHoveredFeatureInfo] = useState<{ title: string; subtitle?: string } | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    adminDistricts: true,
    districts: true,
    institutions: true,
  });
  const [baseMapType, setBaseMapType] = useState<'cadastre' | 'topo'>('cadastre');
  const [isLoading, setIsLoading] = useState(true);
  const [locatingUser, setLocatingUser] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  // Raw GeoJSON cache
  const [geoData, setGeoData] = useState<{
    regions: any;
    adminDistricts: any;
    districts: any;
    institutions: any;
  }>({ regions: null, adminDistricts: null, districts: null, institutions: null });

  // Ray-casting point in polygon
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

  // 1. Fetch GeoJSON layers
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

  // 2. Initialize OpenLayers Map
  useEffect(() => {
    if (!mapContainerRef.current || !geoData.regions || mapInstanceRef.current) return;

    const geojsonFormat = new GeoJSON({
      featureProjection: 'EPSG:3857',
      dataProjection: 'EPSG:4326',
    });

    // Base Tile Source (PKK / GovTech Cadastral & Topo Layers)
    const cadastreUrl = 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const topoUrl = 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    const tileSource = new XYZ({
      url: baseMapType === 'cadastre' ? cadastreUrl : topoUrl,
      attributions: '© Публичная кадастровая карта Республики Беларусь (ГУП «НКА») | Госкомимущество РБ',
      maxZoom: 19,
    });

    const tileLayer = new TileLayer({
      source: tileSource,
    });
    tileLayerRef.current = tileLayer;

    // --- A. Regions Layer (Belarus Level) ---
    const regionsSource = new VectorSource({
      features: geojsonFormat.readFeatures(geoData.regions),
    });

    const regionsLayer = new VectorLayer({
      source: regionsSource,
      style: (feature) => {
        const props = feature.getProperties();
        const isGrodno = props.name === 'Гродненская область' || props.slug === 'grodnenskaya-oblast';
        return new Style({
          fill: new Fill({
            color: isGrodno ? 'rgba(5, 150, 105, 0.22)' : 'rgba(100, 116, 139, 0.12)',
          }),
          stroke: new Stroke({
            color: isGrodno ? '#047857' : '#94a3b8',
            width: isGrodno ? 2.5 : 1.5,
          }),
          text: new Text({
            text: props.name || '',
            font: isGrodno ? 'bold 12px sans-serif' : '11px sans-serif',
            fill: new Fill({ color: isGrodno ? '#064e3b' : '#334155' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
          }),
        });
      },
      visible: currentLevel === 'belarus',
    });
    regionsLayerRef.current = regionsLayer;

    // --- B. Admin Districts Layer (Leninskiy / Oktyabrskiy) ---
    const adminSource = new VectorSource({
      features: geojsonFormat.readFeatures(geoData.adminDistricts),
    });

    const adminDistrictsLayer = new VectorLayer({
      source: adminSource,
      style: (feature) => {
        const props = feature.getProperties();
        const isLeninskiy = props.slug === 'leninskiy-rayon' || props.name?.includes('Ленинский');
        return new Style({
          fill: new Fill({
            color: isLeninskiy ? 'rgba(59, 130, 246, 0.08)' : 'rgba(245, 158, 11, 0.08)',
          }),
          stroke: new Stroke({
            color: isLeninskiy ? '#2563eb' : '#d97706',
            width: 2.5,
            lineDash: [6, 6],
          }),
          text: new Text({
            text: props.name || '',
            font: 'bold 13px sans-serif',
            fill: new Fill({ color: isLeninskiy ? '#1e40af' : '#92400e' }),
            stroke: new Stroke({ color: '#ffffff', width: 3 }),
            offsetY: isLeninskiy ? -20 : 20,
          }),
        });
      },
      visible: currentLevel === 'grodno' && activeLayers.adminDistricts,
    });
    adminDistrictsLayerRef.current = adminDistrictsLayer;

    // --- C. 30 Electoral Districts Layer ---
    const electoralSource = new VectorSource({
      features: geojsonFormat.readFeatures(geoData.districts),
    });

    const electoralDistrictsLayer = new VectorLayer({
      source: electoralSource,
      style: (feature) => {
        const props = feature.getProperties();
        const num = props.number || 1;
        const color = DISTRICT_PALETTE[(num - 1) % DISTRICT_PALETTE.length];
        const isSelected = selectedEntity?.id === props.id || selectedEntity?.slug === props.slug;

        return new Style({
          fill: new Fill({
            color: isSelected ? `${color}4D` : `${color}26`, // 30% or 15% opacity
          }),
          stroke: new Stroke({
            color: isSelected ? '#0f172a' : color,
            width: isSelected ? 3.5 : 2,
          }),
          text: new Text({
            text: `№${num}`,
            font: 'bold 11px sans-serif',
            fill: new Fill({ color: isSelected ? '#0f172a' : color }),
            stroke: new Stroke({ color: '#ffffff', width: 3 }),
          }),
        });
      },
      visible: currentLevel === 'grodno' && activeLayers.districts,
    });
    electoralDistrictsLayerRef.current = electoralDistrictsLayer;

    // --- D. Institutions Layer ---
    const institutionsSource = new VectorSource({
      features: geojsonFormat.readFeatures(geoData.institutions),
    });

    const institutionsLayer = new VectorLayer({
      source: institutionsSource,
      style: (feature) => {
        const props = feature.getProperties();
        const isExecutive = props.category === 'executive' || props.type === 'executive';
        const pinColor = isExecutive ? '#047857' : '#7c3aed';

        return new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: pinColor }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
          }),
          text: new Text({
            text: props.short_name || props.name || '',
            font: 'bold 10px sans-serif',
            fill: new Fill({ color: '#1e293b' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
            offsetY: 15,
          }),
        });
      },
      visible: currentLevel === 'grodno' && activeLayers.institutions,
    });
    institutionsLayerRef.current = institutionsLayer;

    // --- E. User Marker Layer ---
    const userMarkerSource = new VectorSource();
    const userMarkerLayer = new VectorLayer({
      source: userMarkerSource,
      style: new Style({
        image: new CircleStyle({
          radius: 9,
          fill: new Fill({ color: '#2563eb' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 }),
        }),
      }),
    });
    userMarkerLayerRef.current = userMarkerLayer;

    // --- Initial View ---
    const centerCoords =
      currentLevel === 'belarus'
        ? fromLonLat([27.95, 53.70])
        : fromLonLat([23.834, 53.684]);
    const zoomLevel = currentLevel === 'belarus' ? 6.5 : 12.5;

    const view = new View({
      center: centerCoords,
      zoom: zoomLevel,
      minZoom: 5,
      maxZoom: 18,
    });

    // Create Map Instance
    const map = new Map({
      target: mapContainerRef.current,
      layers: [
        tileLayer,
        regionsLayer,
        adminDistrictsLayer,
        electoralDistrictsLayer,
        institutionsLayer,
        userMarkerLayer,
      ],
      view: view,
      controls: defaultControls({
        zoom: true,
        attribution: true,
        rotate: false,
      }),
    });

    mapInstanceRef.current = map;

    // Popup Overlay setup
    if (popupRef.current) {
      const overlay = new Overlay({
        element: popupRef.current,
        autoPan: {
          animation: { duration: 250 },
        },
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10],
      });
      map.addOverlay(overlay);
      overlayRef.current = overlay;
    }

    // --- Pointer Move (Hover interaction) ---
    map.on('pointermove', (evt) => {
      if (evt.dragging) return;
      const pixel = map.getEventPixel(evt.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';

      const feature = map.forEachFeatureAtPixel(pixel, (feat) => feat);
      if (feature) {
        const props = feature.getProperties();
        if (props.deputy) {
          setHoveredFeatureInfo({
            title: props.name || `Округ №${props.number}`,
            subtitle: `Депутат: ${props.deputy.person.full_name}`,
          });
        } else if (props.name) {
          setHoveredFeatureInfo({
            title: props.name,
            subtitle: props.category === 'executive' ? 'Орган исполнительной власти' : props.description,
          });
        }
      } else {
        setHoveredFeatureInfo(null);
      }
    });

    // --- Click interaction ---
    map.on('singleclick', (evt) => {
      let foundFeature: Feature | null = null;
      map.forEachFeatureAtPixel(evt.pixel, (feat) => {
        if (!foundFeature && feat instanceof Feature) {
          foundFeature = feat;
        }
      });

      if (foundFeature) {
        const props = (foundFeature as Feature).getProperties();

        // If clicked on Grodno region from Belarus level -> switch to Grodno
        if (currentLevel === 'belarus' && (props.name === 'Гродненская область' || props.slug === 'grodnenskaya-oblast')) {
          switchLevel('grodno');
          return;
        }

        // Electoral District Click
        if (props.number !== undefined) {
          const entity = {
            id: props.id || `dist-${props.number}`,
            name: props.name || `Избирательный округ №${props.number}`,
            number: props.number,
            slug: props.slug,
            boundaries_description: props.boundaries_description,
            territory: props.territory_name ? { name: props.territory_name } : undefined,
            deputy: props.deputy,
            type: 'district',
          };
          setSelectedEntity(entity);
          if (onSelectEntity) onSelectEntity(entity);
          electoralDistrictsLayer.changed();
          return;
        }

        // Institution Click
        if (props.category || props.address) {
          const entity = {
            id: props.id,
            name: props.name,
            short_name: props.short_name,
            address: props.address,
            phone: props.phone,
            website: props.website,
            leader: props.leader,
            type: 'institution',
          };
          setSelectedEntity(entity);
          if (onSelectEntity) onSelectEntity(entity);
          return;
        }
      } else {
        // Deselect if clicked outside
        setSelectedEntity(null);
        electoralDistrictsLayer.changed();
      }
    });

    // Select initial district if requested via props
    if (selectedDistrictSlug && geoData.districts?.features) {
      const match = geoData.districts.features.find((f: any) => f.properties.slug === selectedDistrictSlug);
      if (match) {
        const props = match.properties;
        setSelectedEntity({
          id: props.id,
          name: props.name,
          number: props.number,
          slug: props.slug,
          boundaries_description: props.boundaries_description,
          territory: props.territory_name ? { name: props.territory_name } : undefined,
          deputy: props.deputy,
          type: 'district',
        });
      }
    }

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, [geoData, currentLevel]);

  // 3. Update layer visibility when activeLayers state changes
  useEffect(() => {
    if (adminDistrictsLayerRef.current) {
      adminDistrictsLayerRef.current.setVisible(currentLevel === 'grodno' && activeLayers.adminDistricts);
    }
    if (electoralDistrictsLayerRef.current) {
      electoralDistrictsLayerRef.current.setVisible(currentLevel === 'grodno' && activeLayers.districts);
    }
    if (institutionsLayerRef.current) {
      institutionsLayerRef.current.setVisible(currentLevel === 'grodno' && activeLayers.institutions);
    }
    if (regionsLayerRef.current) {
      regionsLayerRef.current.setVisible(currentLevel === 'belarus');
    }
  }, [activeLayers, currentLevel]);

  // 4. Update base map source when baseMapType changes
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const cadastreUrl = 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const topoUrl = 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    const newSource = new XYZ({
      url: baseMapType === 'cadastre' ? cadastreUrl : topoUrl,
      attributions: '© Публичная кадастровая карта Республики Беларусь (ГУП «НКА») | Госкомимущество РБ',
      maxZoom: 19,
    });
    tileLayerRef.current.setSource(newSource);
  }, [baseMapType]);

  // Switch Level helper
  const switchLevel = (level: 'belarus' | 'grodno') => {
    setCurrentLevel(level);
    setSelectedEntity(null);
    if (!mapInstanceRef.current) return;

    const view = mapInstanceRef.current.getView();
    if (level === 'belarus') {
      view.animate({
        center: fromLonLat([27.95, 53.70]),
        zoom: 6.5,
        duration: 700,
      });
    } else {
      view.animate({
        center: fromLonLat([23.834, 53.684]),
        zoom: 12.5,
        duration: 700,
      });
    }
  };

  // 5. Geolocation ("Определить мой округ")
  const locateUserDistrict = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Геолокация не поддерживается вашим браузером.');
      return;
    }

    setLocatingUser(true);
    setLocationMessage('Определение точных координат...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocatingUser(false);

        if (!mapInstanceRef.current) return;

        // Animate map to user position
        const userPoint = fromLonLat([lng, lat]);
        mapInstanceRef.current.getView().animate({
          center: userPoint,
          zoom: 14.5,
          duration: 800,
        });

        // Add user marker
        if (userMarkerLayerRef.current) {
          const source = userMarkerLayerRef.current.getSource();
          source?.clear();
          source?.addFeature(new Feature(new Point(userPoint)));
        }

        // Find which district contains user coordinates
        if (geoData.districts?.features) {
          let matchedDistrict: any = null;
          for (const feat of geoData.districts.features) {
            const geom = feat.geometry;
            if (geom.type === 'Polygon') {
              if (isPointInPolygon([lng, lat], geom.coordinates[0])) {
                matchedDistrict = feat.properties;
                break;
              }
            } else if (geom.type === 'MultiPolygon') {
              for (const poly of geom.coordinates) {
                if (isPointInPolygon([lng, lat], poly[0])) {
                  matchedDistrict = feat.properties;
                  break;
                }
              }
              if (matchedDistrict) break;
            }
          }

          if (matchedDistrict) {
            const entity = {
              id: matchedDistrict.id,
              name: matchedDistrict.name,
              number: matchedDistrict.number,
              slug: matchedDistrict.slug,
              boundaries_description: matchedDistrict.boundaries_description,
              territory: matchedDistrict.territory_name ? { name: matchedDistrict.territory_name } : undefined,
              deputy: matchedDistrict.deputy,
              type: 'district',
            };
            setSelectedEntity(entity);
            setLocationMessage(`Вы находитесь в округе: ${matchedDistrict.name}`);
            if (electoralDistrictsLayerRef.current) {
              electoralDistrictsLayerRef.current.changed();
            }
          } else {
            setLocationMessage('Вы находитесь за пределами границ избирательных округов г. Гродно.');
          }
        }
      },
      (err) => {
        setLocatingUser(false);
        setLocationMessage('Не удалось получить координаты. Разрешите доступ к геолокации в браузере.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
      {/* Top Bar / Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Left: Level switcher & Title */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => switchLevel('grodno')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentLevel === 'grodno'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Город Гродно
          </button>
          <button
            onClick={() => switchLevel('belarus')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentLevel === 'belarus'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Вся Беларусь
          </button>
        </div>

        {/* Right: GPS Locator & Base Map Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {currentLevel === 'grodno' && (
            <button
              onClick={locateUserDistrict}
              disabled={locatingUser}
              className="px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 rounded-2xl text-xs font-semibold backdrop-blur-md shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Crosshair className={`w-3.5 h-3.5 text-emerald-400 ${locatingUser ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Определить мой округ</span>
            </button>
          )}

          <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-lg flex items-center gap-1">
            <button
              onClick={() => setBaseMapType('cadastre')}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                baseMapType === 'cadastre'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ПКК (НКА)
            </button>
            <button
              onClick={() => setBaseMapType('topo')}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                baseMapType === 'topo'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Топооснова
            </button>
          </div>
        </div>
      </div>

      {/* Layer Visibility Toggles (Bottom Left) */}
      {currentLevel === 'grodno' && (
        <div className="absolute bottom-6 left-4 z-10 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-700/80 shadow-lg text-xs space-y-2 hidden sm:block">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] tracking-wider px-1">
            <Layers className="w-3 h-3 text-emerald-400" />
            Слои карты
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white px-1">
              <input
                type="checkbox"
                checked={activeLayers.districts}
                onChange={(e) => setActiveLayers({ ...activeLayers, districts: e.target.checked })}
                className="w-3.5 h-3.5 accent-emerald-500 rounded"
              />
              <span>Избирательные округа (30)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white px-1">
              <input
                type="checkbox"
                checked={activeLayers.adminDistricts}
                onChange={(e) => setActiveLayers({ ...activeLayers, adminDistricts: e.target.checked })}
                className="w-3.5 h-3.5 accent-blue-500 rounded"
              />
              <span>Административные районы (2)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white px-1">
              <input
                type="checkbox"
                checked={activeLayers.institutions}
                onChange={(e) => setActiveLayers({ ...activeLayers, institutions: e.target.checked })}
                className="w-3.5 h-3.5 accent-purple-500 rounded"
              />
              <span>Органы власти и приёмные</span>
            </label>
          </div>
        </div>
      )}

      {/* Hover Info Tooltip (Top Center) */}
      {hoveredFeatureInfo && !selectedEntity && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 shadow-xl text-center max-w-sm">
          <p className="text-xs font-bold text-white">{hoveredFeatureInfo.title}</p>
          {hoveredFeatureInfo.subtitle && (
            <p className="text-[11px] text-emerald-400 mt-0.5">{hoveredFeatureInfo.subtitle}</p>
          )}
        </div>
      )}

      {/* Location Status Message */}
      {locationMessage && (
        <div className="absolute top-16 right-4 z-10 pointer-events-auto bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-500/50 shadow-xl text-xs text-emerald-300 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{locationMessage}</span>
          <button onClick={() => setLocationMessage(null)} className="hover:text-white ml-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main OpenLayers Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-[540px] sm:h-[620px] bg-slate-950 focus:outline-none"
      />

      {/* Right Drawer / Inspector Panel */}
      {selectedEntity && (
        <div className="absolute top-4 bottom-4 right-4 z-20 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-5 overflow-y-auto flex flex-col justify-between space-y-4 animate-in slide-in-from-right duration-200">
          <div className="space-y-4">
            {/* Header & Close Button */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {selectedEntity.type === 'district' ? `Округ №${selectedEntity.number}` : 'Орган власти'}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mt-1">
                  {selectedEntity.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* District Details */}
            {selectedEntity.type === 'district' && (
              <div className="space-y-3.5">
                {/* Elected Deputy */}
                {selectedEntity.deputy ? (
                  <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-100 space-y-3">
                    <span className="text-[10px] font-bold text-purple-900 uppercase flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Избранный депутат:
                    </span>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-200 text-purple-900 font-bold flex items-center justify-center text-base shrink-0 overflow-hidden shadow-xs">
                        {selectedEntity.deputy.person.photo_url ? (
                          <img
                            src={selectedEntity.deputy.person.photo_url}
                            alt={selectedEntity.deputy.person.full_name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <span>
                            {selectedEntity.deputy.person.first_name?.[0] || selectedEntity.deputy.person.full_name[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">
                          {selectedEntity.deputy.person.full_name}
                        </h4>
                        <p className="text-[11px] text-purple-800 font-medium mt-0.5">
                          Депутат городского Совета 29-го созыва
                        </p>
                      </div>
                    </div>

                    {/* Reception schedule */}
                    {selectedEntity.deputy.reception_schedule && (
                      <div className="pt-2 border-t border-purple-200/60 text-xs text-slate-700 space-y-1">
                        <div className="flex items-start gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-snug">{selectedEntity.deputy.reception_schedule}</span>
                        </div>
                        {selectedEntity.deputy.reception_phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span className="text-[11px] font-semibold text-slate-900">{selectedEntity.deputy.reception_phone}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <Link
                      href={`/people/${selectedEntity.deputy.person.slug}`}
                      className="w-full inline-flex items-center justify-center gap-1 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Профиль депутата <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                    Сведения о депутате для данного округа уточняются.
                  </div>
                )}

                {/* Boundaries & Streets description */}
                {selectedEntity.boundaries_description && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <MapIcon className="w-3 h-3" />
                      Закрепленные улицы и адреса:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed max-h-36 overflow-y-auto pr-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {selectedEntity.boundaries_description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Institution Details */}
            {selectedEntity.type === 'institution' && (
              <div className="space-y-3 text-xs text-slate-700">
                {selectedEntity.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{selectedEntity.address}</span>
                  </div>
                )}
                {selectedEntity.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900">{selectedEntity.phone}</span>
                  </div>
                )}
                {selectedEntity.leader && (
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-900 uppercase block">Руководитель:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedEntity.leader}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* District full passport link */}
          {selectedEntity.type === 'district' && (
            <div className="pt-2 border-t border-slate-100">
              <Link
                href={`/districts/${selectedEntity.slug}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-purple-50 text-slate-800 hover:text-purple-800 rounded-xl text-xs font-bold transition-colors"
              >
                Паспорт округа и границы <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Official Footnote / Provenance (Bottom Right) */}
      <div className="absolute bottom-2 right-2 z-10 pointer-events-none text-[10px] text-slate-400 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-800 flex items-center gap-1.5">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Основа: Публичная кадастровая карта Республики Беларусь (ГУП «НКА»)</span>
      </div>
    </div>
  );
};
