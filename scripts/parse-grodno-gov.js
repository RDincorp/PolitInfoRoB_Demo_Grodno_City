const fs = require('fs');

const councilHtml = fs.readFileSync('C:/Users/rdins/.gemini/antigravity/brain/6bb92971-29b2-4ce0-82bf-a51e28223d80/.system_generated/steps/1120/content.md', 'utf-8');
const houseHtml = fs.readFileSync('C:/Users/rdins/.gemini/antigravity/brain/6bb92971-29b2-4ce0-82bf-a51e28223d80/.system_generated/steps/1122/content.md', 'utf-8');

function cleanHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&laquo;|&raquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// 1. Parse City Council (30 deputies)
const councilRows = councilHtml.split('<tr>').slice(2);
const cityDeputies = [];

councilRows.forEach((row, idx) => {
  if (!row.includes('избирательный округ') && !row.includes('img')) return;

  const tds = row.split('</td>');
  if (tds.length < 3) return;

  const photoMatch = row.match(/src="([^"]+)"/i);
  const photo = photoMatch ? 'http://grodno.gov.by' + photoMatch[1] : null;

  // Extract FIO
  const td0 = tds[0];
  const strongMatches = [...td0.matchAll(/<strong>([^<]+)<\/strong>/gi)]
    .map(m => m[1].trim())
    .filter(t => t && !t.includes('&nbsp;') && !t.includes('img') && !t.includes('src'));

  let lastName = '';
  let firstName = '';
  let middleName = '';
  let fullName = '';

  if (strongMatches.length >= 2) {
    lastName = strongMatches[strongMatches.length - 2];
    const rest = strongMatches[strongMatches.length - 1].split(/\s+/);
    firstName = rest[0] || '';
    middleName = rest[1] || '';
    fullName = `${lastName} ${firstName} ${middleName}`.trim();
  } else if (strongMatches.length === 1) {
    const parts = strongMatches[0].split(/\s+/);
    lastName = parts[0] || '';
    firstName = parts[1] || '';
    middleName = parts[2] || '';
    fullName = strongMatches[0];
  }

  const workplace = cleanHtml(tds[1]);
  const td2Clean = cleanHtml(tds[2]);

  // District name and number
  const distNumberMatch = td2Clean.match(/избирательный округ\s*№?\s*(\d+)/i) || td2Clean.match(/округ\s*№?\s*(\d+)/i);
  const distNum = distNumberMatch ? parseInt(distNumberMatch[1], 10) : idx + 1;
  
  const distNameMatch = td2Clean.match(/^([^,]+избирательный округ\s*№?\s*\d+)/i) || td2Clean.match(/^([А-Яа-яЁё\-]+\s+избирательный округ\s*№?\s*\d+)/i);
  const distTitle = distNameMatch ? distNameMatch[1] : `Избирательный округ № ${distNum}`;

  // Boundaries
  let boundaries = td2Clean.replace(distTitle, '').trim();
  if (boundaries.startsWith(':') || boundaries.startsWith('.')) {
    boundaries = boundaries.substring(1).trim();
  }

  cityDeputies.push({
    number: distNum,
    title: distTitle,
    fullName: fullName,
    lastName: lastName,
    firstName: firstName,
    middleName: middleName,
    workplace: workplace,
    photoUrl: photo,
    boundaries: boundaries
  });
});

console.log(`Parsed ${cityDeputies.length} City Council deputies.`);
cityDeputies.forEach(d => console.log(`[№${d.number}] ${d.fullName} — ${d.title}`));

// 2. Parse House of Representatives (4 deputies from Grodno)
const houseBlocks = houseHtml.split('<td style="padding: 10px">')[1]?.split('<div>&nbsp;</div>') || [];
const houseDeputies = [];

const houseDeputiesRaw = [
  {
    fullName: 'Оксенюк Михаил Петрович',
    shortName: 'Оксенюк М. П.',
    role: 'Депутат Палаты представителей Национального собрания РБ (VIII созыв)',
    commission: 'Член Постоянной комиссии по национальной безопасности',
    districtNumber: 49,
    districtName: 'Гродненский-Занеманский избирательный округ № 49',
    votersCount: 55868,
    contacts: {
      address: 'г. Минск, ул. Советская, 11',
      phone: '+375 17 222 38 33',
      email: 'Oksenyuk-MP@house.gov.by',
      website: 'https://oksenyuk.house.gov.by'
    },
    assistants: [
      { name: 'Безменов Игорь Александрович', location: 'г. Минск' },
      { name: 'Родионов Александр Николаевич', location: 'г. Гродно, ул. Советская, 31, каб. 6', phone: '+375 33 301 10 52' }
    ],
    boundaries: 'Часть Октябрьского района г. Гродно в границах: от реки Неман по проспекту Клецкова (не включая дома, кроме № 8, и ряд домов по пр. Янки Купалы) до ул. Славинского, по ул. Славинского до ул. Маслакова, далее по ж/д путям Гродно — Брузги до городской черты и реки Неман; Подлабенский сельсовет Гродненского района.',
    photoUrl: 'http://grodno.gov.by/sm_full.aspx?guid=285553'
  },
  {
    fullName: 'Потапова Елена Станиславовна',
    shortName: 'Потапова Е. С.',
    role: 'Депутат Палаты представителей Национального собрания РБ (VIII созыв)',
    commission: 'Заместитель председателя Постоянной комиссии по государственному строительству, местному самоуправлению и регламенту',
    districtNumber: 50,
    districtName: 'Гродненский-Октябрьский избирательный округ № 50',
    votersCount: 57463,
    contacts: {
      address: 'г. Минск, ул. Советская, 11',
      phone: '+375 17 222 61 72',
      email: 'Potapova@house.gov.by',
      website: 'http://Potapova.house.gov.by'
    },
    assistants: [
      { name: 'Михеева Алевтина Леонидовна', phone: '+375 33 321 01 96', email: 'alevtinamiheeva1@gmail.com' },
      { name: 'Пичковская Екатерина Сергеевна', phone: '+375 29 270 86 78', email: 'k_pichkovskaya@list.ru' }
    ],
    boundaries: 'Часть Октябрьского района г. Гродно в границах: от реки Неман по проспекту Клецкова (включая дома, кроме № 8), по ул. Славинского, Маслакова, ж/д ветке Гродно — Брузги до городской черты и пр-та Янки Купалы, ул. Солы до реки Неман.',
    photoUrl: 'http://grodno.gov.by/sm_full.aspx?guid=285563'
  },
  {
    fullName: 'Анисимов Андрей Викторович',
    shortName: 'Анисимов А. В.',
    role: 'Депутат Палаты представителей Национального собрания РБ (VIII созыв)',
    commission: 'Член Постоянной комиссии по законодательству',
    districtNumber: 51,
    districtName: 'Гродненский-Ленинский избирательный округ № 51',
    votersCount: 55655,
    contacts: {
      address: 'г. Минск, ул. Советская, 11',
      phone: '+375 17 222 43 86',
      email: 'anisimov-av@house.gov.by',
      website: 'https://anisimov.house.gov.by'
    },
    assistants: [
      { name: 'Коледа Диана Дмитриевна', location: 'г. Гродно, пл. Ленина, 2/1', phone: '+375 33 364 56 79' },
      { name: 'Гринцевич Светлана Юрьевна', location: 'г. Гродно, пл. Ленина, 2/1', phone: '+375 152 62 63 40' }
    ],
    boundaries: 'Части Ленинского и Октябрьского районов г. Гродно в границах: от реки Неман по ул. Меловые Горы, ул. Домбровского, БЛК, ул. Дубко, ул. Брикеля до ж/д Гродно — Аульс; микрорайон «Кошевники — Погораны».',
    photoUrl: 'http://grodno.gov.by/sm_full.aspx?guid=285573'
  },
  {
    fullName: 'Романов Олег Александрович',
    shortName: 'Романов О. А.',
    role: 'Депутат Палаты представителей Национального собрания РБ (VIII созыв)',
    commission: 'Заместитель председателя Постоянной комиссии по правам человека, национальным отношениям и средствам массовой информации',
    districtNumber: 52,
    districtName: 'Гродненский-Северный избирательный округ № 52',
    votersCount: 57378,
    contacts: {
      address: 'г. Минск, ул. Советская, 11',
      phone: '+375 17 222 43 86',
      email: 'Romanov-OA@house.gov.by',
      website: 'https://romanov.house.gov.by/ru/'
    },
    assistants: [
      { name: 'Кувшинов Владимир Петрович', location: 'г. Гродно, ул. Лермонтова, 2, каб. 108', phone: '+375 152 62 42 64' }
    ],
    boundaries: 'Часть Ленинского района г. Гродно в границах: от реки Неман по ул. Меловые Горы, ул. Домбровского, БЛК, ул. Дубко (нечетная), Брикеля (четная) до ж/д Гродно — Аульс; Путришковский сельсовет Гродненского района.',
    photoUrl: 'http://grodno.gov.by/sm_full.aspx?guid=285583'
  }
];

fs.writeFileSync('./scripts/parsed_house_deputies.json', JSON.stringify(houseDeputiesRaw, null, 2));
console.log(`Saved ${houseDeputiesRaw.length} House of Representatives deputies.`);

