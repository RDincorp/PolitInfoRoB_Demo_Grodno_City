const fs = require('fs');
const path = require('path');

const cityDeputies = JSON.parse(fs.readFileSync(path.join(__dirname, 'parsed_city_deputies.json'), 'utf-8'));
const houseDeputies = JSON.parse(fs.readFileSync(path.join(__dirname, 'parsed_house_deputies.json'), 'utf-8'));
const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/db.json'), 'utf-8'));

function toTitleCase(str) {
  if (!str) return '';
  return str.split(/[\s-]+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

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

const NOW = '2026-08-16T12:00:00Z';

// 1. Ensure sources
const srcCouncil = {
  id: 'src-grodno-gov-council',
  title: 'Гродненский горисполком — Депутаты городского Совета депутатов 29-го созыва',
  url: 'http://grodno.gov.by/main.aspx?guid=2111',
  source_type: 'web_page',
  publisher: 'Гродненский городской исполнительный комитет',
  allowed_domain: 'grodno.gov.by',
  provided_by_user: true,
  provided_at: NOW,
  check_frequency: 'еженедельно',
  requires_review: false,
  description: 'Официальный реестр депутатов Гродненского городского Совета депутатов 29-го созыва, их мест работы, округов и описания границ.',
  status: 'active',
  created_at: NOW,
  updated_at: NOW
};

const srcHouse = {
  id: 'src-grodno-gov-house',
  title: 'Гродненский горисполком — Депутаты Палаты представителей VIII созыва от г. Гродно',
  url: 'http://grodno.gov.by/ru/print.aspx?guid=9081',
  source_type: 'web_page',
  publisher: 'Гродненский городской исполнительный комитет',
  allowed_domain: 'grodno.gov.by',
  provided_by_user: true,
  provided_at: NOW,
  check_frequency: 'еженедельно',
  requires_review: false,
  description: 'Официальные сведения о депутатах Палаты представителей Национального собрания Республики Беларусь VIII созыва от г. Гродно, их контактах, помощниках и округах.',
  status: 'active',
  created_at: NOW,
  updated_at: NOW
};

[srcCouncil, srcHouse].forEach(src => {
  const idx = db.sources.findIndex(s => s.id === src.id);
  if (idx >= 0) db.sources[idx] = src;
  else db.sources.push(src);
});

// Positions
let posCouncilDeputy = db.positions.find(p => p.id === 'pos-gorsovet-deputy');
if (!posCouncilDeputy) {
  posCouncilDeputy = {
    id: 'pos-gorsovet-deputy',
    name: 'Депутат Гродненского городского Совета депутатов 29-го созыва',
    institution_id: 'inst-grodno-soviet',
    department_id: null,
    territory_id: 't-grodno',
    description: 'Представитель избирателей округа в городском Совете депутатов.',
    is_leadership: false,
    created_at: NOW
  };
  db.positions.push(posCouncilDeputy);
}

let posHouseDeputy = db.positions.find(p => p.id === 'pos-house-deputy');
if (!posHouseDeputy) {
  posHouseDeputy = {
    id: 'pos-house-deputy',
    name: 'Депутат Палаты представителей Национального собрания Республики Беларусь VIII созыва',
    institution_id: 'inst-palata-predstaviteley',
    department_id: null,
    territory_id: 't-by',
    description: 'Депутат законодательного органа Республики Беларусь, избранный от избирательного округа г. Гродно.',
    is_leadership: false,
    created_at: NOW
  };
  db.positions.push(posHouseDeputy);
}

// Preserve existing leadership (Fedorov, Khmel)
const preservedPeople = db.people.filter(p => ['p-fedorov', 'p-khmel'].includes(p.id));
const peopleMap = new Map();
preservedPeople.forEach(p => peopleMap.set(p.id, p));

// Filter out old mock electoral districts and associations
db.electoral_districts = [];
db.person_positions = db.person_positions.filter(pp => ['pp-fedorov-1', 'pp-khmel-1'].includes(pp.id));
db.person_districts = [];
db.entity_sources = db.entity_sources.filter(es => !es.id.startsWith('es-dist-') && !es.id.startsWith('es-p-council') && !es.id.startsWith('es-p-house'));

// 2. Add 30 City Council deputies & districts
cityDeputies.forEach((d) => {
  const lastNameTitle = toTitleCase(d.lastName);
  const firstNameTitle = toTitleCase(d.firstName);
  const middleNameTitle = toTitleCase(d.middleName);
  const fullNameTitle = `${lastNameTitle} ${firstNameTitle} ${middleNameTitle}`.trim();

  const personId = `p-council-${d.number}-${translit(lastNameTitle)}`;
  const personSlug = translit(fullNameTitle);
  const districtSlug = translit(d.title);
  const districtId = `dist-council-${d.number}`;

  const personObj = {
    id: personId,
    full_name: fullNameTitle,
    first_name: firstNameTitle,
    last_name: lastNameTitle,
    middle_name: middleNameTitle,
    slug: personSlug,
    photo_url: d.photoUrl,
    biography: `Депутат Гродненского городского Совета депутатов 29-го созыва по избирательному округу № ${d.number} (${d.title}). Место работы: ${d.workplace}.`,
    official_profile_url: 'http://grodno.gov.by/main.aspx?guid=2111',
    status: 'published',
    created_at: NOW,
    updated_at: NOW
  };
  peopleMap.set(personId, personObj);

  // Electoral District
  const distObj = {
    id: districtId,
    name: d.title,
    number: d.number,
    slug: districtSlug,
    level: 'city_council',
    territory_id: 't-grodno',
    description: `Избирательный округ по выборам депутатов Гродненского городского Совета депутатов 29-го созыва. Депутат: ${fullNameTitle}.`,
    boundaries_description: d.boundaries,
    geometry: null,
    status: 'published',
    created_at: NOW,
    updated_at: NOW
  };
  db.electoral_districts.push(distObj);

  // Person Position
  db.person_positions.push({
    id: `pp-council-${d.number}`,
    person_id: personId,
    position_id: 'pos-gorsovet-deputy',
    start_date: '2024-02-25',
    end_date: null,
    reception_schedule: 'Согласно графику приёма избирателей депутатами Гродненского горсовета',
    reception_address: 'г. Гродно, пл. Ленина, 2/1',
    reception_phone: '+375 (152) 62-60-50',
    status: 'published',
    source_id: 'src-grodno-gov-council',
    created_at: NOW
  });

  // Person District
  db.person_districts.push({
    id: `pd-council-${d.number}`,
    person_id: personId,
    district_id: districtId,
    valid_from: '2024-02-25',
    valid_to: null,
    status: 'published',
    source_id: 'src-grodno-gov-council',
    created_at: NOW
  });

  // Entity Source
  db.entity_sources.push({
    id: `es-dist-council-${d.number}`,
    entity_type: 'district',
    entity_id: districtId,
    source_id: 'src-grodno-gov-council',
    verified_at: NOW,
    status: 'verified',
    created_at: NOW
  });

  db.entity_sources.push({
    id: `es-p-council-${d.number}`,
    entity_type: 'person',
    entity_id: personId,
    source_id: 'src-grodno-gov-council',
    verified_at: NOW,
    status: 'verified',
    created_at: NOW
  });
});

// 3. Add 4 House of Representatives deputies & districts
houseDeputies.forEach(hd => {
  const parts = hd.fullName.split(' ');
  const lastNameTitle = toTitleCase(parts[0]);
  const firstNameTitle = toTitleCase(parts[1] || '');
  const middleNameTitle = toTitleCase(parts[2] || '');
  const fullNameTitle = `${lastNameTitle} ${firstNameTitle} ${middleNameTitle}`.trim();

  const personId = `p-house-${hd.districtNumber}-${translit(lastNameTitle)}`;
  const personSlug = translit(fullNameTitle);
  const districtSlug = translit(hd.districtName);
  const districtId = `dist-house-${hd.districtNumber}`;

  const personObj = {
    id: personId,
    full_name: fullNameTitle,
    first_name: firstNameTitle,
    last_name: lastNameTitle,
    middle_name: middleNameTitle,
    slug: personSlug,
    photo_url: hd.photoUrl,
    biography: `${hd.role}. ${hd.commission}. Контакты: ${hd.contacts.address}, тел.: ${hd.contacts.phone}, e-mail: ${hd.contacts.email}. Помощники: ${hd.assistants.map(a => a.name + (a.phone ? ' (' + a.phone + ')' : '')).join(', ')}.`,
    official_profile_url: hd.contacts.website || 'http://grodno.gov.by/ru/print.aspx?guid=9081',
    status: 'published',
    created_at: NOW,
    updated_at: NOW
  };
  peopleMap.set(personId, personObj);

  const distObj = {
    id: districtId,
    name: hd.districtName,
    number: hd.districtNumber,
    slug: districtSlug,
    level: 'national_assembly',
    territory_id: 't-grodno',
    description: `Избирательный округ по выборам депутата Палаты представителей Национального собрания РБ VIII созыва. Депутат: ${fullNameTitle}. Число избирателей: ${hd.votersCount.toLocaleString('ru-RU')} чел.`,
    boundaries_description: hd.boundaries,
    geometry: null,
    status: 'published',
    created_at: NOW,
    updated_at: NOW
  };
  db.electoral_districts.push(distObj);

  db.person_positions.push({
    id: `pp-house-${hd.districtNumber}`,
    person_id: personId,
    position_id: 'pos-house-deputy',
    start_date: '2024-02-25',
    end_date: null,
    reception_schedule: `Приём граждан: ${hd.assistants[1]?.location || hd.assistants[0]?.location || 'г. Гродно'}, тел.: ${hd.assistants[0]?.phone || hd.contacts.phone}`,
    reception_address: hd.contacts.address,
    reception_phone: hd.contacts.phone,
    status: 'published',
    source_id: 'src-grodno-gov-house',
    created_at: NOW
  });

  db.person_districts.push({
    id: `pd-house-${hd.districtNumber}`,
    person_id: personId,
    district_id: districtId,
    valid_from: '2024-02-25',
    valid_to: null,
    status: 'published',
    source_id: 'src-grodno-gov-house',
    created_at: NOW
  });

  db.entity_sources.push({
    id: `es-dist-house-${hd.districtNumber}`,
    entity_type: 'district',
    entity_id: districtId,
    source_id: 'src-grodno-gov-house',
    verified_at: NOW,
    status: 'verified',
    created_at: NOW
  });

  db.entity_sources.push({
    id: `es-p-house-${hd.districtNumber}`,
    entity_type: 'person',
    entity_id: personId,
    source_id: 'src-grodno-gov-house',
    verified_at: NOW,
    status: 'verified',
    created_at: NOW
  });
});

db.people = Array.from(peopleMap.values());

// Save to data/db.json
fs.writeFileSync(path.join(__dirname, '../data/db.json'), JSON.stringify(db, null, 2));

// Save to src/lib/db/seed.ts
const seedContent = `import { DatabaseState } from './index';\n\nexport const initialSeedData: DatabaseState = ${JSON.stringify(db, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, '../src/lib/db/seed.ts'), seedContent);

console.log(`Successfully synced db.json & seed.ts! Total people: ${db.people.length}, Total electoral districts: ${db.electoral_districts.length}`);
