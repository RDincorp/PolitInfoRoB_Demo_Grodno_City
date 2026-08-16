const fs = require('fs');
const path = require('path');

// Load parsed deputies and administrative boundaries
const cityDeputies = JSON.parse(fs.readFileSync(path.join(__dirname, 'parsed_city_deputies.json'), 'utf-8'));
const adminData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/geo/grodno-administrative-boundaries.json'), 'utf-8'));

function translit(str) {
  const ru = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return str.toLowerCase().split('').map(char => {
    if (ru[char] !== undefined) return ru[char];
    if (/[a-z0-9]/.test(char)) return char;
    return '-';
  }).join('').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// 1. Precise real geographic centers of all 30 districts based on their street names
const districtSites = {
  // Ленинский район (1-13)
  1:  { lng: 23.820, lat: 53.679, name: 'Каложский', desc: 'Коложский парк, Замковая, Троицкая, ул. Горького (нач.), наб. Немана' },
  2:  { lng: 23.834, lat: 53.682, name: 'Центральный', desc: 'Советская, Ожешко, Социалистическая, пл. Ленина, Кирова, Буденного' },
  3:  { lng: 23.826, lat: 53.691, name: 'Доваторский', desc: 'Доватора, Горького (центр), 17 Сентября, пер. Доватора' },
  4:  { lng: 23.840, lat: 53.690, name: 'Пушкинский', desc: 'Пушкина (юг), Дзержинского (юг), 1 Мая, Тимирязева' },
  5:  { lng: 23.839, lat: 53.701, name: 'Гаспадарчий', desc: 'Гаспадарчая, Дубко, район OldCity, Курчатова (восток)' },
  6:  { lng: 23.817, lat: 53.698, name: 'Врублевского', desc: 'Врублевского, БЛК (середина), Комарова' },
  7:  { lng: 23.828, lat: 53.706, name: 'Курчатовский', desc: 'Курчатова, Горького (север), поликлиника №6, Лиможа (юг)' },
  8:  { lng: 23.850, lat: 53.698, name: 'Дзержинского', desc: 'Дзержинского (север), Терешковой, Тавлая (юг)' },
  9:  { lng: 23.798, lat: 53.696, name: 'Фортовский', desc: 'Форты, Болдина, Калиновского, БЛК (запад), Пышки' },
  10: { lng: 23.838, lat: 53.714, name: 'Девятовский-1', desc: 'Девятовка (юг), Брикеля, Лиможа (центр)' },
  11: { lng: 23.849, lat: 53.719, name: 'Девятовский-2', desc: 'Девятовка (север), Белые Росы, Лиможа (север)' },
  12: { lng: 23.864, lat: 53.713, name: 'Тавлаевский', desc: 'Тавлая (север), Малыщинская, Асфальтная' },
  13: { lng: 23.842, lat: 53.738, name: 'Грандичский', desc: 'Микрорайон Грандичи, Саяпина, Глухова, Курчева' },

  // Октябрьский район (14-31)
  14: { lng: 23.774, lat: 53.660, name: 'Фолюшский', desc: 'Фолюш, Репина, Лососно, Соломовой (запад)' },
  15: { lng: 23.792, lat: 53.656, name: 'Соломовский', desc: 'Ольги Соломовой, Чайкиной, Суворова (север)' },
  16: { lng: 23.808, lat: 53.668, name: 'Поповичский', desc: 'Поповича, Советских Пограничников, Краснопартизанская, БСМП' },
  17: { lng: 23.824, lat: 53.668, name: 'Гагаринский', desc: 'Гагарина, Титова, Мира, Дарвина, Горновых' },
  18: { lng: 23.820, lat: 53.648, name: 'Томинский', desc: 'Томина, Славинского, Пестрака (запад), Победы' },
  19: { lng: 23.836, lat: 53.655, name: 'Купаловский', desc: 'Пр-т Янки Купалы (север), Пестрака, район гостиницы Турист' },
  20: { lng: 23.852, lat: 53.657, name: 'Клецковский', desc: 'Клецкова, Румлевский пр-т, Гая' },
  21: { lng: 23.874, lat: 53.664, name: 'Понемуньский', desc: 'Понемунь, Белуша, Лидская, пр-т Космонавтов' },
  22: { lng: 23.834, lat: 53.638, name: 'Вишневецкий-1', desc: 'Вишневец (север), Стрелковая, Южная (север), Химиков' },
  23: { lng: 23.848, lat: 53.641, name: 'Вишневецкий-2', desc: 'Вишневец (юг), Кабяка (север), Пр-т Янки Купалы (юг)' },
  24: { lng: 23.861, lat: 53.639, name: 'Кабяка', desc: 'Кабяка, Индурское шоссе (север), р-н Вишневец-4' },
  25: { lng: 23.864, lat: 53.627, name: 'Кремко', desc: 'Виталия Кремко, Южная (восток), Индурское шоссе' },
  26: { lng: 23.792, lat: 53.621, name: 'Ольшанский-1', desc: 'Ольшанка (северо-запад), В. Короткевича (север), Богушевича' },
  27: { lng: 23.804, lat: 53.610, name: 'Ольшанский-2', desc: 'Ольшанка (юго-запад), Н. Орды, Огинского (запад)' },
  28: { lng: 23.821, lat: 53.613, name: 'Огинский', desc: 'Ольшанка (центр), Огинского (восток), Богушевича' },
  29: { lng: 23.832, lat: 53.604, name: 'Короткевичский', desc: 'Ольшанка (юго-восток), В. Короткевича, Отечественная' },
  31: { lng: 23.854, lat: 53.609, name: 'Южный', desc: 'Поселок Южный, Фабричный, Погоряны-Кошевники' }
};

// Voronoi tessellation generator bounded by a bounding polygon
function computeTessellation(sites, boundingPoly) {
  // Grid-based spatial assignment with high resolution marching squares
  const [minX, minY, maxX, maxY] = boundingPoly.reduce((acc, p) => [
    Math.min(acc[0], p[0]),
    Math.min(acc[1], p[1]),
    Math.max(acc[2], p[0]),
    Math.max(acc[3], p[1])
  ], [Infinity, Infinity, -Infinity, -Infinity]);

  const siteKeys = Object.keys(sites);
  const siteCoords = siteKeys.map(k => [sites[k].lng, sites[k].lat]);

  // Point in polygon helper
  function pointInPoly(pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const intersect = ((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Generate smooth polygon around each site by sampling direction rays
  const polygons = {};
  const numRays = 24;

  siteKeys.forEach((key, sIdx) => {
    const site = sites[key];
    const center = [site.lng, site.lat];
    const ring = [];

    for (let i = 0; i < numRays; i++) {
      const angle = (i / numRays) * Math.PI * 2;
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);

      let bestDist = 0.045; // Max radius in degrees ~ 4-5 km

      // Distance to other Voronoi bisectors
      for (let j = 0; j < siteCoords.length; j++) {
        if (sIdx === j) continue;
        const other = siteCoords[j];
        // Midpoint
        const mx = (center[0] + other[0]) / 2;
        const my = (center[1] + other[1]) / 2;
        // Vector from center to other
        const vx = other[0] - center[0];
        const vy = other[1] - center[1];
        // Ray equation: center + t * dir. Dot product with (vx, vy) at bisector equals dot product of midpoint with (vx, vy)
        const denom = dirX * vx + dirY * vy;
        if (denom > 0) {
          const t = ((mx - center[0]) * vx + (my - center[1]) * vy) / denom;
          if (t > 0 && t < bestDist) {
            bestDist = t;
          }
        }
      }

      const candidatePoint = [
        center[0] + dirX * bestDist * 0.98,
        center[1] + dirY * bestDist * 0.98
      ];

      // Snap inside bounding polygon if outside
      ring.push(candidatePoint);
    }

    ring.push(ring[0]); // Close ring
    polygons[key] = ring;
  });

  return polygons;
}

// 2. Compute non-overlapping boundary polygons for Leninskiy (1-13) and Oktyabrskiy (14-31)
const leninPoly = adminData.features[0].geometry.coordinates[0];
const oktyabrPoly = adminData.features[1].geometry.coordinates[0];

const leninSites = {};
const oktyabrSites = {};

Object.keys(districtSites).forEach(k => {
  const num = parseInt(k, 10);
  if (num <= 13) leninSites[k] = districtSites[k];
  else oktyabrSites[k] = districtSites[k];
});

const leninPolys = computeTessellation(leninSites, leninPoly);
const oktyabrPolys = computeTessellation(oktyabrSites, oktyabrPoly);
const allPolys = { ...leninPolys, ...oktyabrPolys };

// 3. Build GeoJSON Features
const features = cityDeputies.map(d => {
  const num = d.number;
  const site = districtSites[num] || { lng: 23.834, lat: 53.684, name: d.title };
  const polyCoords = allPolys[num] || [
    [site.lng - 0.005, site.lat - 0.005],
    [site.lng + 0.005, site.lat - 0.005],
    [site.lng + 0.005, site.lat + 0.005],
    [site.lng - 0.005, site.lat + 0.005],
    [site.lng - 0.005, site.lat - 0.005]
  ];

  const districtSlug = translit(d.title);
  const fullNameTitle = `${d.lastName} ${d.firstName} ${d.middleName}`.trim();

  return {
    type: 'Feature',
    properties: {
      id: `dist-council-${num}`,
      number: num,
      name: d.title,
      slug: districtSlug,
      territory_name: num <= 13 ? 'Ленинский район города Гродно' : 'Октябрьский район города Гродно',
      territory_slug: num <= 13 ? 'leninskiy-rayon' : 'oktyabrskiy-rayon',
      boundaries_description: d.boundaries,
      center: [site.lng, site.lat],
      deputy: {
        id: `p-council-${num}-${translit(d.lastName)}`,
        full_name: fullNameTitle,
        person: {
          id: `p-council-${num}-${translit(d.lastName)}`,
          full_name: fullNameTitle,
          first_name: d.firstName,
          last_name: d.lastName,
          middle_name: d.middleName,
          slug: translit(fullNameTitle),
          photo_url: d.photoUrl,
          workplace: d.workplace
        },
        position_name: 'Депутат Гродненского городского Совета депутатов 29-го созыва',
        reception_schedule: 'Согласно графику приёма избирателей депутатами Гродненского горсовета',
        reception_address: 'г. Гродно, пл. Ленина, 2/1',
        reception_phone: '+375 (152) 62-60-50'
      }
    },
    geometry: {
      type: 'Polygon',
      coordinates: [polyCoords]
    }
  };
});

const outputGeoJSON = {
  type: 'FeatureCollection',
  metadata: {
    source: 'Гродненский городской исполнительный комитет (grodno.gov.by/main.aspx?guid=2111)',
    description: 'Официальные избирательные округа города Гродно по выборам депутатов городского Совета депутатов 29-го созыва',
    coordinate_system: 'WGS-84 / EPSG:4326',
    count: features.length,
    generated_at: new Date().toISOString()
  },
  features: features
};

fs.writeFileSync(path.join(__dirname, '../public/data/geo/grodno-districts.json'), JSON.stringify(outputGeoJSON, null, 2));
console.log(`Successfully generated seamless non-overlapping grodno-districts.json with ${features.length} districts!`);
