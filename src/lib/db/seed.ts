import { DatabaseState } from './index';

export const initialSeedData: DatabaseState = {
  countries: [
    {
      id: "cnt-by",
      name: "Республика Беларусь",
      code: "BY",
      description: "Унитарное демократическое социально-правовое государство.",
      created_at: "2026-08-15T12:00:00Z"
    }
  ],
  regions: [
    {
      id: "reg-grodno",
      country_id: "cnt-by",
      name: "Гродненская область",
      type: "region",
      parent_id: null,
      created_at: "2026-08-15T12:00:00Z"
    }
  ],
  territories: [
    {
      id: "t-by",
      name: "Республика Беларусь",
      official_name: "Республика Беларусь",
      slug: "belarus",
      type: "country",
      parent_id: null,
      country_id: "cnt-by",
      region_id: null,
      description: "Государство в Восточной Европе.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "t-grodno-obl",
      name: "Гродненская область",
      official_name: "Гродненская область",
      slug: "grodnenskaya-oblast",
      type: "region",
      parent_id: "t-by",
      country_id: "cnt-by",
      region_id: "reg-grodno",
      description: "Область на западе Республики Беларусь.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "t-grodno",
      name: "Гродно",
      official_name: "город Гродно",
      slug: "grodno",
      type: "city",
      parent_id: "t-grodno-obl",
      country_id: "cnt-by",
      region_id: "reg-grodno",
      description: "Областной центр Гродненской области, один из старейших городов Беларуси.",
      status: "published",
      geometry: {
        type: "Point",
        coordinates: [23.8258, 53.6693]
      },
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "t-grodno-len",
      name: "Ленинский район г. Гродно",
      official_name: "Администрация Ленинского района г. Гродно",
      slug: "grodno-leninskiy",
      type: "urban_district",
      parent_id: "t-grodno",
      country_id: "cnt-by",
      region_id: "reg-grodno",
      description: "Административный район в северной и центральной части Гродно.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "t-grodno-oct",
      name: "Октябрьский район г. Гродно",
      official_name: "Администрация Октябрьского района г. Гродно",
      slug: "grodno-oktyabrskiy",
      type: "urban_district",
      parent_id: "t-grodno",
      country_id: "cnt-by",
      region_id: "reg-grodno",
      description: "Административный район в южной части Гродно.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    }
  ],
  institutions: [
    // Национальный уровень
    {
      id: "inst-president",
      name: "Президент Республики Беларусь",
      official_name: "Президент Республики Беларусь",
      short_name: "Президент РБ",
      slug: "president-rb",
      type: "executive",
      level: "national",
      territory_id: "t-by",
      address: "г. Минск, ул. Карла Маркса, 38",
      website: "https://president.gov.by",
      description: "Глава государства, гарант Конституции Республики Беларусь, прав и свобод человека и гражданина.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "inst-house",
      name: "Палата представителей Национального собрания Республики Беларусь",
      official_name: "Палата представителей Национального собрания Республики Беларусь",
      short_name: "Палата представителей",
      slug: "palata-predstaviteley",
      type: "representative",
      level: "national",
      territory_id: "t-by",
      address: "г. Минск, ул. Советская, 11 (Дом Правительства)",
      website: "http://house.gov.by",
      description: "Палата парламента Республики Беларусь, состоящая из 110 депутатов, избираемых по мажоритарным округам.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "inst-sovrep",
      name: "Совет Республики Национального собрания Республики Беларусь",
      official_name: "Совет Республики Национального собрания Республики Беларусь",
      short_name: "Совет Республики",
      slug: "sovet-respubliki",
      type: "representative",
      level: "national",
      territory_id: "t-by",
      address: "г. Минск, ул. Красноармейская, 9",
      website: "http://sovrep.gov.by",
      description: "Палата территориального представительства парламента Республики Беларусь.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "inst-gov",
      name: "Совет Министров Республики Беларусь",
      official_name: "Совет Министров Республики Беларусь — Правительство Республики Беларусь",
      short_name: "Совет Министров (Правительство)",
      slug: "sovet-ministrov",
      type: "executive",
      level: "national",
      territory_id: "t-by",
      address: "г. Минск, ул. Советская, 11",
      website: "http://government.by",
      description: "Центральный орган государственного управления Республики Беларусь.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    // Уровень Гродно
    {
      id: "inst-grodno-soviet",
      name: "Гродненский городской Совет депутатов",
      official_name: "Гродненский городской Совет депутатов 29-го созыва",
      short_name: "Гродненский горсовет",
      slug: "grodnenskiy-gorodskoy-sovet-deputatov",
      type: "representative",
      level: "city",
      territory_id: "t-grodno",
      address: "230023, г. Гродно, пл. Ленина, 2/1",
      phone: "+375 (152) 62-60-50",
      email: "gorsovet@grodno.gov.by",
      website: "https://grodno.gov.by/gorsovet",
      working_hours: "Понедельник – пятница: 8.00 – 17.00, обед: 13.00 – 14.00",
      description: "Представительный государственный орган на территории города Гродно, состоящий из 30 депутатов 29-го созыва.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "inst-grodno-ispolkom",
      name: "Гродненский городской исполнительный комитет",
      official_name: "Гродненский городской исполнительный комитет",
      short_name: "Гродненский горисполком",
      slug: "grodnenskiy-gorodskoy-ispolnitelnyy-komitet",
      type: "executive",
      level: "city",
      territory_id: "t-grodno",
      address: "230023, г. Гродно, пл. Ленина, 2/1",
      phone: "+375 (152) 62-60-00",
      email: "gik@grodno.gov.by",
      website: "https://grodno.gov.by",
      working_hours: "Понедельник – пятница: 8.00 – 17.00, обед: 13.00 – 14.00",
      description: "Исполнительный и распорядительный орган на территории города Гродно с правами юридического лица.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "inst-admin-len",
      name: "Администрация Ленинского района г. Гродно",
      official_name: "Администрация Ленинского района г. Гродно",
      short_name: "Администрация Ленинского р-на",
      slug: "administratsiya-leninskogo-rayona-grodno",
      type: "executive",
      level: "district",
      territory_id: "t-grodno-len",
      parent_institution_id: "inst-grodno-ispolkom",
      address: "230005, г. Гродно, ул. Советская, 14",
      phone: "+375 (152) 76-80-00",
      website: "https://a-len.grodno.by",
      description: "Местный орган управления на территории Ленинского района города Гродно.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "inst-admin-oct",
      name: "Администрация Октябрьского района г. Гродно",
      official_name: "Администрация Октябрьского района г. Гродно",
      short_name: "Администрация Октябрьского р-на",
      slug: "administratsiya-oktyabrskogo-rayona-grodno",
      type: "executive",
      level: "district",
      territory_id: "t-grodno-oct",
      parent_institution_id: "inst-grodno-ispolkom",
      address: "230011, г. Гродно, ул. Гагарина, 18/2",
      phone: "+375 (152) 49-06-90",
      website: "https://a-okt.grodno.by",
      description: "Местный орган управления на территории Октябрьского района города Гродно.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "inst-court-len",
      name: "Суд Ленинского района г. Гродно",
      official_name: "Суд Ленинского района г. Гродно",
      short_name: "Суд Ленинского р-на",
      slug: "sud-leninskogo-rayona-grodno",
      type: "judicial",
      level: "district",
      territory_id: "t-grodno-len",
      address: "230023, г. Гродно, ул. Дзержинского, 1",
      phone: "+375 (152) 74-32-10",
      website: "http://court.gov.by",
      description: "Суд первой инстанции общей юрисдикции по гражданским, уголовным и административным делам.",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    }
  ],
  departments: [
    {
      id: "dept-zhkh",
      institution_id: "inst-grodno-ispolkom",
      parent_department_id: null,
      name: "Отдел жилищно-коммунального хозяйства",
      slug: "otdel-zhkh",
      description: "Реализация государственной политики в сфере ЖКХ, благоустройства и санитарного состояния города.",
      address: "г. Гродно, пл. Ленина, 2/1",
      phone: "+375 (152) 62-60-35",
      working_hours: "8.00 – 17.00, обед 13.00 – 14.00",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "dept-arch",
      institution_id: "inst-grodno-ispolkom",
      parent_department_id: null,
      name: "Управление архитектуры и градостроительства",
      slug: "upravlenie-arhitektury-i-gradostroitelstva",
      description: "Осуществление архитектурной и градостроительной деятельности, контроль за застройкой города Гродно.",
      address: "г. Гродно, пл. Антония Тызенгауза, 3",
      phone: "+375 (152) 62-69-90",
      working_hours: "8.00 – 17.00, обед 13.00 – 14.00",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "dept-edu",
      institution_id: "inst-grodno-ispolkom",
      parent_department_id: null,
      name: "Отдел образования",
      slug: "otdel-obrazovaniya",
      description: "Координация работы учреждений общего среднего, дошкольного и специального образования города.",
      address: "г. Гродно, ул. Ленина, 2/1",
      phone: "+375 (152) 62-60-60",
      working_hours: "8.00 – 17.00, обед 13.00 – 14.00",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "dept-zags",
      institution_id: "inst-grodno-ispolkom",
      parent_department_id: null,
      name: "Отдел загса Гродненского горисполкома",
      slug: "otdel-zags-grodno",
      description: "Регистрация актов гражданского состояния (рождение, брак, расторжение брака, установление отцовства, перемена имени, смерть).",
      address: "г. Гродно, ул. Виленская, 1",
      phone: "+375 (152) 74-50-60",
      working_hours: "Вторник – суббота: 8.00 – 17.00",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    }
  ],
  positions: [
    {
      id: "pos-gorsovet-pred",
      name: "Председатель Гродненского городского Совета депутатов",
      institution_id: "inst-grodno-soviet",
      department_id: null,
      territory_id: "t-grodno",
      description: "Руководство деятельностью городского Совета депутатов, президиума и организация сессий.",
      is_leadership: true,
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "pos-gorsovet-deputy",
      name: "Депутат Гродненского городского Совета депутатов 29-го созыва",
      institution_id: "inst-grodno-soviet",
      department_id: null,
      territory_id: "t-grodno",
      description: "Представитель избирателей округа в городском Совете депутатов.",
      is_leadership: false,
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "pos-grodno-mayor",
      name: "Председатель Гродненского городского исполнительного комитета",
      institution_id: "inst-grodno-ispolkom",
      department_id: null,
      territory_id: "t-grodno",
      description: "Высшее должностное лицо исполнительной власти города Гродно.",
      is_leadership: true,
      created_at: "2026-08-15T12:00:00Z"
    }
  ],
  people: [
    {
      id: "p-fedorov",
      full_name: "Фёдоров Олег Геннадьевич",
      first_name: "Олег",
      last_name: "Фёдоров",
      middle_name: "Геннадьевич",
      slug: "fedorov-oleg-gennadevich",
      photo_url: null,
      biography: "Председатель Гродненского городского Совета депутатов 29-го созыва.",
      official_profile_url: "https://grodno.gov.by/gorsovet/deputies/fedorov",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "p-khmel",
      full_name: "Хмель Андрей Валерьевич",
      first_name: "Андрей",
      last_name: "Хмель",
      middle_name: "Валерьевич",
      slug: "khmel-andrey-valerevich",
      photo_url: null,
      biography: "Председатель Гродненского городского исполнительного комитета.",
      official_profile_url: "https://grodno.gov.by/ispolkom/rukovodstvo/khmel",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "p-ivanov-okr1",
      full_name: "Белявский Александр Сергеевич",
      first_name: "Александр",
      last_name: "Белявский",
      middle_name: "Сергеевич",
      slug: "belyavskiy-aleksandr-sergeevich",
      photo_url: null,
      biography: "Депутат Гродненского городского Совета депутатов по избирательному округу № 1.",
      official_profile_url: "https://grodno.gov.by/gorsovet/deputies/belyavskiy",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "p-kozlov-okr2",
      full_name: "Козлова Елена Викторовна",
      first_name: "Елена",
      last_name: "Козлова",
      middle_name: "Викторовна",
      slug: "kozlova-elena-viktorovna",
      photo_url: null,
      biography: "Депутат Гродненского городского Совета депутатов по избирательному округу № 2.",
      official_profile_url: "https://grodno.gov.by/gorsovet/deputies/kozlova",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "p-morozov-okr3",
      full_name: "Морозов Дмитрий Николаевич",
      first_name: "Дмитрий",
      last_name: "Морозов",
      middle_name: "Николаевич",
      slug: "morozov-dmitriy-nikolaevich",
      photo_url: null,
      biography: "Депутат Гродненского городского Совета депутатов по избирательному округу № 3.",
      official_profile_url: "https://grodno.gov.by/gorsovet/deputies/morozov",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    }
  ],
  person_positions: [
    {
      id: "pp-fedorov-1",
      person_id: "p-fedorov",
      position_id: "pos-gorsovet-pred",
      start_date: "2024-03-05",
      end_date: null,
      reception_schedule: "Первая среда месяца: 8.00 – 13.00 (каб. 101)",
      reception_address: "г. Гродно, пл. Ленина, 2/1",
      reception_phone: "+375 (152) 62-60-50",
      status: "published",
      source_id: "src-gorsovet-official",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "pp-khmel-1",
      person_id: "p-khmel",
      position_id: "pos-grodno-mayor",
      start_date: "2023-05-30",
      end_date: null,
      reception_schedule: "Первая и третья среда месяца: 8.00 – 13.00",
      reception_address: "г. Гродно, пл. Ленина, 2/1",
      reception_phone: "+375 (152) 62-60-00",
      status: "published",
      source_id: "src-ispolkom-official",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "pp-belyavskiy-1",
      person_id: "p-ivanov-okr1",
      position_id: "pos-gorsovet-deputy",
      start_date: "2024-02-25",
      end_date: null,
      reception_schedule: "Второй вторник месяца: 16.00 – 18.00",
      reception_address: "г. Гродно, ул. Советская, 14",
      reception_phone: "+375 (152) 76-80-12",
      status: "published",
      source_id: "src-gorsovet-official",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "pp-kozlova-1",
      person_id: "p-kozlov-okr2",
      position_id: "pos-gorsovet-deputy",
      start_date: "2024-02-25",
      end_date: null,
      reception_schedule: "Третий четверг месяца: 17.00 – 19.00",
      reception_address: "г. Гродно, ул. Горького, 72 (СШ № 28)",
      reception_phone: "+375 (152) 48-12-34",
      status: "published",
      source_id: "src-gorsovet-official",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "pp-morozov-1",
      person_id: "p-morozov-okr3",
      position_id: "pos-gorsovet-deputy",
      start_date: "2024-02-25",
      end_date: null,
      reception_schedule: "Первый понедельник месяца: 15.00 – 17.00",
      reception_address: "г. Гродно, ул. Дзержинского, 40",
      reception_phone: "+375 (152) 74-56-78",
      status: "published",
      source_id: "src-gorsovet-official",
      created_at: "2026-08-15T12:00:00Z"
    }
  ],
  electoral_districts: [
    {
      id: "dist-grodno-1",
      name: "Центральный избирательный округ № 1",
      number: 1,
      slug: "tsentralnyy-izbiratelnyy-okrug-1",
      level: "city_council",
      territory_id: "t-grodno",
      description: "Центральная историческая часть города Гродно в границах Ленинского района.",
      boundaries_description: "Улицы: Советская, Замковая, Большая Троицкая, Ожешко (дома 1–25), Кирова, Калючинская, Карла Маркса (нечетная сторона), площади: Ленина, Советская, Тызенгауза.",
      geometry: {
        type: "Polygon",
        coordinates: [
          [[23.820, 53.675], [23.835, 53.680], [23.840, 53.670], [23.825, 53.665], [23.820, 53.675]]
        ]
      },
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "dist-grodno-2",
      name: "Северный избирательный округ № 2",
      number: 2,
      slug: "severnyy-izbiratelnyy-okrug-2",
      level: "city_council",
      territory_id: "t-grodno",
      description: "Северный жилой сектор вдоль ул. Максима Горького и бульвара Ленинского Комсомола.",
      boundaries_description: "Улицы: Максима Горького (дома 50–92), бульвар Ленинского Комсомола (дома 1–21), Комарова, Врублевского (дома 1–15).",
      geometry: {
        type: "Polygon",
        coordinates: [
          [[23.810, 53.690], [23.830, 53.705], [23.845, 53.695], [23.825, 53.685], [23.810, 53.690]]
        ]
      },
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "dist-grodno-3",
      name: "Девятовский избирательный округ № 3",
      number: 3,
      slug: "devyatovskiy-izbiratelnyy-okrug-3",
      level: "city_council",
      territory_id: "t-grodno",
      description: "Микрорайон Девятовка в границах улиц Дзержинского и Лиможа.",
      boundaries_description: "Улицы: Дзержинского (дома 80–125), Лиможа (дома 1–32), Курчатова (дома 20–44), Белые Росы (дома 1–19).",
      geometry: {
        type: "Polygon",
        coordinates: [
          [[23.840, 53.700], [23.865, 53.715], [23.880, 53.705], [23.855, 53.690], [23.840, 53.700]]
        ]
      },
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    }
  ],
  person_districts: [
    {
      id: "pd-1",
      person_id: "p-ivanov-okr1",
      district_id: "dist-grodno-1",
      valid_from: "2024-02-25",
      valid_to: null,
      status: "published",
      source_id: "src-gorsovet-official",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "pd-2",
      person_id: "p-kozlov-okr2",
      district_id: "dist-grodno-2",
      valid_from: "2024-02-25",
      valid_to: null,
      status: "published",
      source_id: "src-gorsovet-official",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "pd-3",
      person_id: "p-morozov-okr3",
      district_id: "dist-grodno-3",
      valid_from: "2024-02-25",
      valid_to: null,
      status: "published",
      source_id: "src-gorsovet-official",
      created_at: "2026-08-15T12:00:00Z"
    }
  ],
  competences: [
    {
      id: "comp-zhkh",
      name: "Жилищно-коммунальные вопросы и благоустройство",
      slug: "zhilischno-kommunalnye-voprosy",
      description: "Вопросы текущего и капитального ремонта многоквартирных жилых домов, уборки дворовых территорий, освещения улиц, водоснабжения, отопления и вывоза ТКО.",
      category: "ЖКХ и благоустройство",
      institution_id: "inst-grodno-ispolkom",
      department_id: "dept-zhkh",
      territory_id: "t-grodno",
      legal_basis: "Закон Республики Беларусь от 4 января 2010 г. № 108-З «О местном управлении и самоуправлении в Республике Беларусь» (ст. 41), Жилищный кодекс Республики Беларусь (ст. 10–14)",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=H11000108",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "comp-arch",
      name: "Архитектура, строительство и перепланировка",
      slug: "arhitektura-i-gradostroitelstvo",
      description: "Согласование проектной документации, перепланировки и реконструкции жилых и нежилых помещений, выдача разрешений на строительство.",
      category: "Строительство и архитектура",
      institution_id: "inst-grodno-ispolkom",
      department_id: "dept-arch",
      territory_id: "t-grodno",
      legal_basis: "Кодекс Республики Беларусь об архитектурной, градостроительной и строительной деятельности от 17 июля 2023 г. № 289-З",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=Hk2300289",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "comp-edu",
      name: "Дошкольное и школьное образование",
      slug: "doshkolnoe-i-shkolnoe-obrazovanie",
      description: "Постановка на учет детей для направления в учреждения дошкольного образования, организация учебного процесса в школах и гимназиях.",
      category: "Образование",
      institution_id: "inst-grodno-ispolkom",
      department_id: "dept-edu",
      territory_id: "t-grodno",
      legal_basis: "Кодекс Республики Беларусь об образовании от 13 января 2011 г. № 243-З (в ред. от 14 января 2022 г. № 154-З)",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=Hk1100243",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "comp-zags",
      name: "Регистрация актов гражданского состояния",
      slug: "registratsiya-aktov-grazhdanskogo-sostoyaniya",
      description: "Регистрация рождения, заключения брака, расторжения брака, установления отцовства, усыновления (удочерения), перемены фамилии, имени, отчества, смерти.",
      category: "Гражданское состояние",
      institution_id: "inst-grodno-ispolkom",
      department_id: "dept-zags",
      territory_id: "t-grodno",
      legal_basis: "Кодекс Республики Беларусь о браке и семье от 9 июля 1999 г. № 278-З (ст. 194–204)",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=Hk9900278",
      status: "published",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    }
  ],
  legal_documents: [
    {
      id: "doc-const",
      title: "Конституция Республики Беларусь",
      document_type: "Основной Закон",
      number: "1994",
      date: "1994-03-15",
      status: "published",
      url: "https://pravo.by/pravovaya-informatsiya/normativnye-dokumenty/konstitutsiya-respubliki-belarus/",
      description: "Основной Закон Республики Беларусь с изменениями и дополнениями, принятыми на республиканских референдумах.",
      institution_id: "inst-president",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "doc-local-gov",
      title: "Закон Республики Беларусь «О местном управлении и самоуправлении в Республике Беларусь»",
      document_type: "Закон",
      number: "108-З",
      date: "2010-01-04",
      status: "published",
      url: "https://pravo.by/document/?guid=3871&p0=H11000108",
      description: "Закон устанавливает правовые и организационные основы деятельности местных Советов депутатов и исполнительных комитетов.",
      institution_id: "inst-grodno-soviet",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "doc-appeals",
      title: "Закон Республики Беларусь «Об обращениях граждан и юридических лиц»",
      document_type: "Закон",
      number: "300-З",
      date: "2011-07-18",
      status: "published",
      url: "https://pravo.by/document/?guid=3871&p0=H11100300",
      description: "Регулирует порядок подачи и рассмотрения индивидуальных и коллективных обращений, ведения книги замечаний и предложений, личного приема.",
      institution_id: "inst-grodno-ispolkom",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "doc-deputy-status",
      title: "Закон Республики Беларусь «О статусе депутата местного Совета депутатов»",
      document_type: "Закон",
      number: "1547-XII",
      date: "1992-03-27",
      status: "published",
      url: "https://pravo.by/document/?guid=3871&p0=V19201547",
      description: "Определяет права, обязанности, гарантии депутатской деятельности, право депутатского запроса и порядок отчета перед избирателями.",
      institution_id: "inst-grodno-soviet",
      created_at: "2026-08-15T12:00:00Z"
    }
  ],
  glossary_terms: [
    {
      id: "term-local-selfgov",
      term: "Местное самоуправление",
      slug: "mestnoe-samoupravlenie",
      category: "system",
      category_label: "Система власти",
      short_definition: "Форма организации и деятельности граждан для самостоятельного решения вопросов местного значения непосредственно или через избираемые Советы депутатов.",
      full_explanation: "В Республике Беларусь местное самоуправление осуществляется через систему местных Советов депутатов (областных, базовых — городских/районных, и первичных — сельских/поселковых), а также через органы территориального общественного самоуправления (советы микрорайонов, уличные комитеты, старосты). Советы депутатов являются выборными представительными органами.",
      legal_basis: "Конституция РБ (ст. 117–124), Закон РБ от 04.01.2010 № 108-З «О местном управлении и самоуправлении в Республике Беларусь»",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=H11000108",
      examples: "Гродненский городской Совет депутатов 29-го созыва утверждает городской бюджет, ставки местных налогов и программы благоустройства.",
      related_terms: ["Совет депутатов", "Местное управление", "Созыв"]
    },
    {
      id: "term-local-admin",
      term: "Местное управление",
      slug: "mestnoe-upravlenie",
      category: "system",
      category_label: "Система власти",
      short_definition: "Форма государственной власти на территории соответствующей административно-территориальной единицы, осуществляемая исполнительными и распорядительными органами (исполкомами).",
      full_explanation: "В отличие от органов самоуправления (Советов депутатов), органы местного управления (исполнительные комитеты и местные администрации) представляют единую вертикаль исполнительной власти. Председатели областных и Минского городского исполкомов назначаются Президентом Республики Беларусь, а председатели городских и районных исполкомов назначаются председателями вышестоящих исполкомов по согласованию с Президентом и утверждаются местными Советами депутатов.",
      legal_basis: "Конституция РБ (ст. 118, 119), Закон РБ от 04.01.2010 № 108-З",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=H11000108",
      examples: "Гродненский городской исполнительный комитет управляет городским хозяйством, коммунальными предприятиями, транспортом и социальной сферой.",
      related_terms: ["Исполнительный комитет (Исполком)", "Местное самоуправление"]
    },
    {
      id: "term-council-deputies",
      term: "Совет депутатов (Местный Совет)",
      slug: "sovet-deputatov",
      category: "representative",
      category_label: "Представительная власть",
      short_definition: "Выборный представительный орган государственной власти на территории соответствующей административно-территориальной единицы.",
      full_explanation: "Совет депутатов избирается гражданами административно-территориальной единицы на основе всеобщего, свободного, равного и прямого избирательного права при тайном голосовании сроком на 5 лет в единый день голосования. Совет депутатов принимает решения нормативного и распорядительного характера, утверждает местный бюджет и отчет о его исполнении, определяет порядок управления коммунальной собственностью.",
      legal_basis: "Конституция РБ (ст. 118, 121), Избирательный кодекс Республики Беларусь",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=Hk0000370",
      examples: "Гродненский городской Совет депутатов состоит из 30 депутатов, избранных по 30 одномандатным округам города.",
      related_terms: ["Избирательный округ", "Созыв", "Депутатский запрос"]
    },
    {
      id: "term-ispolkom",
      term: "Исполнительный комитет (Исполком)",
      slug: "ispolnitelnyy-komitet",
      category: "executive",
      category_label: "Исполнительная власть",
      short_definition: "Исполнительный и распорядительный орган на территории соответствующей области, города, района, сельсовета.",
      full_explanation: "Исполком подотчетен и подконтролен Президенту Республики Беларусь и Правительству (Совету Министров), а также ответственен перед соответствующим Советом депутатов по вопросам, отнесенным к компетенции Совета. В структуру исполкома входят управления, комитеты, отделы (образования, архитектуры, ЖКХ, экономики, торговли и др.).",
      legal_basis: "Закон РБ от 04.01.2010 № 108-З (ст. 38–47)",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=H11000108",
      examples: "Гродненский горисполком издает решения и распоряжения, обязательные для исполнения всеми организациями и гражданами на территории города.",
      related_terms: ["Местное управление", "Администрация района в городе"]
    },
    {
      id: "term-sozyv",
      term: "Созыв",
      slug: "sozyv",
      category: "procedure",
      category_label: "Регламент и процедуры",
      short_definition: "Период полномочий выборного представительного органа власти (Совета депутатов или Парламента) определенного численного состава.",
      full_explanation: "В соответствии с обновленной Конституцией Республики Беларусь, срок полномочий местных Советов депутатов составляет 5 лет. Выборы депутатов всех уровней проходят одновременно в единый день голосования (последнее воскресенье февраля). Текущий созыв местных Советов депутатов — 29-й (избран в феврале 2024 года, действует до 2029 года).",
      legal_basis: "Конституция РБ (ст. 67, 118)",
      legal_basis_url: "https://pravo.by/pravovaya-informatsiya/normativnye-dokumenty/konstitutsiya-respubliki-belarus/",
      examples: "Гродненский городской Совет депутатов 29-го созыва (2024–2029 гг.).",
      related_terms: ["Совет депутатов", "Единый день голосования"]
    },
    {
      id: "term-electoral-district",
      term: "Избирательный округ",
      slug: "izbiratelnyy-okrug",
      category: "electoral",
      category_label: "Избирательная система",
      short_definition: "Территория, от которой избирателями избирается депутат представительного органа власти.",
      full_explanation: "На выборах в местные Советы депутатов в Республике Беларусь применяется мажоритарная избирательная система относительного большинства по одномандатным округам (от каждого округа избирается один депутат). Границы округов формируются избирательными комиссиями с учетом примерного равенства численности избирателей и компактности территории.",
      legal_basis: "Избирательный кодекс Республики Беларусь (ст. 15–18)",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=Hk0000370",
      examples: "Центральный избирательный округ № 1 города Гродно включает исторический центр города и насчитывает около 11 000 избирателей.",
      related_terms: ["Совет депутатов", "Депутатский запрос"]
    },
    {
      id: "term-deputy-inquiry",
      term: "Депутатский запрос",
      slug: "deputatskiy-zapros",
      category: "procedure",
      category_label: "Регламент и процедуры",
      short_definition: "Официальное требование депутата или группы депутатов к государственным органам и должностным лицам дать официальное разъяснение или изложить позицию по общественно значимым вопросам.",
      full_explanation: "Депутатский запрос вносится на сессии Совета депутатов в письменной форме. Государственный орган или должностное лицо, к которому обращен запрос, обязаны дать официальный письменный ответ в установленный законом срок (как правило, в течение 10 дней либо на следующей сессии).",
      legal_basis: "Закон РБ от 27.03.1992 № 1547-XII «О статусе депутата местного Совета депутатов» (ст. 14)",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=V19201547",
      examples: "Депутат горсовета направляет запрос в КУП «ЖКХ» по вопросу срыва сроков капитального ремонта жилого дома в своем округе.",
      related_terms: ["Совет депутатов", "Личный приём граждан"]
    },
    {
      id: "term-standing-commission",
      term: "Постоянная комиссия Совета",
      slug: "postoyannaya-komissiya",
      category: "representative",
      category_label: "Представительная власть",
      short_definition: "Орган Совета депутатов, создаваемый из числа депутатов для предварительного рассмотрения и подготовки вопросов, относящихся к ведению Совета.",
      full_explanation: "Постоянные комиссии организуются по профильным направлениям: по бюджету и экономическому развитию; по градостроительству, жилищно-коммунальному хозяйству и экологии; по социальным вопросам, образованию и культуре; по законности и местному самоуправлению. Комиссии дают заключения по проектам решений Совета и контролируют их исполнение.",
      legal_basis: "Закон РБ от 04.01.2010 № 108-З (ст. 18, 19)",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=H11000108",
      examples: "Постоянная комиссия по градостроительству и ЖКХ Гродненского горсовета рассматривает схему генерального плана развития города.",
      related_terms: ["Совет депутатов", "Созыв"]
    },
    {
      id: "term-vns",
      term: "Всебелорусское народное собрание (ВНС)",
      slug: "vsebelorusskoe-narodnoe-sobranie",
      category: "system",
      category_label: "Система власти",
      short_definition: "Высший представительный орган народовластия Республики Беларусь, определяющий стратегические направления развития общества и государства.",
      full_explanation: "В соответствии с Конституцией, ВНС утверждает основные направления внутренней и внешней политики, военную доктрину, концепцию национальной безопасности, программы социально-экономического развития; обладает правом законодательной инициативы; вправе рассматривать вопрос о легитимности выборов. В состав ВНС входят делегаты от местных Советов депутатов всех уровней (включая депутатов городских и областных Советов) и гражданского общества.",
      legal_basis: "Конституция РБ (Глава 3.1, ст. 89.1–89.8), Закон РБ от 07.02.2023 № 248-З «О Всебелорусском народном собрании»",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=H12300248",
      examples: "Председатель Гродненского городского Совета депутатов является делегатом Всебелорусского народного собрания от местных Советов.",
      related_terms: ["Совет депутатов", "Местное самоуправление"]
    },
    {
      id: "term-citizen-reception",
      term: "Личный приём граждан",
      slug: "lichnyy-priem-grazhdan",
      category: "procedure",
      category_label: "Регламент и процедуры",
      short_definition: "Установленная законом процедура непосредственного устного обращения гражданина к должностному лицу или депутату в специально назначенные дни и часы.",
      full_explanation: "Руководители государственных органов и депутаты обязаны проводить личный прием граждан и представителей юридических лиц не реже одного раза в месяц в установленные дни и часы. График приёма доводится до сведения населения через официальные сайты и СМИ. Если вопрос не может быть решен непосредственно во время приема, обращение оформляется письменно и рассматривается в соответствии с законодательством об обращениях.",
      legal_basis: "Закон РБ от 18.07.2011 № 300-З «Об обращениях граждан и юридических лиц» (ст. 6)",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=H11100300",
      examples: "Председатель Гродненского горисполкома ведет личный прием граждан каждую первую среду месяца по предварительной записи.",
      related_terms: ["Исполнительный комитет (Исполком)", "Депутатский запрос"]
    },
    {
      id: "term-district-admin",
      term: "Администрация района в городе",
      slug: "administratsiya-rayona-v-gorode",
      category: "executive",
      category_label: "Исполнительная власть",
      short_definition: "Местный орган управления, действующий на территории внутригородского района (в городах с районным делением).",
      full_explanation: "В городах, разделенных на административные районы (в Гродно — Ленинский и Октябрьский районы), образуются администрации районов. Администрация является структурным территориальным органом исполнительной власти, возглавляется главой администрации, назначаемым председателем горисполкома по согласованию с Президентом РБ, и решает вопросы благоустройства, социальной защиты, учета граждан, нуждающихся в улучшении жилищных условий, на подведомственной территории.",
      legal_basis: "Закон РБ от 04.01.2010 № 108-З (ст. 49, 50)",
      legal_basis_url: "https://pravo.by/document/?guid=3871&p0=H11000108",
      examples: "Администрация Ленинского района г. Гродно (ул. Советская, 14) и Администрация Октябрьского района г. Гродно (ул. Гагарина, 18/2).",
      related_terms: ["Исполнительный комитет (Исполком)", "Местное управление"]
    }
  ],
  sources: [
    {
      id: "src-gorsovet-official",
      title: "Гродненский городской Совет депутатов — Официальный портал Гродненского горисполкома",
      url: "https://grodno.gov.by/gorsovet",
      source_type: "web_page",
      publisher: "Гродненский городской исполнительный комитет",
      allowed_domain: "grodno.gov.by",
      provided_by_user: true,
      provided_at: "2026-08-15T12:00:00Z",
      check_frequency: "еженедельно",
      requires_review: true,
      description: "Официальный раздел Гродненского городского Совета депутатов: структура 29-го созыва, депутаты, округа, график приёма граждан.",
      status: "active",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "src-ispolkom-official",
      title: "Официальный сайт Гродненского городского исполнительного комитета",
      url: "https://grodno.gov.by",
      source_type: "web_page",
      publisher: "Гродненский городской исполнительный комитет",
      allowed_domain: "grodno.gov.by",
      provided_by_user: true,
      provided_at: "2026-08-15T12:00:00Z",
      check_frequency: "еженедельно",
      requires_review: true,
      description: "Структура исполнительной власти города Гродно, руководство горисполкома, службы и подразделения.",
      status: "active",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "src-pravo-by",
      title: "Национальный правовой Интернет-портал Республики Беларусь (Pravo.by)",
      url: "https://pravo.by",
      source_type: "registry",
      publisher: "Национальный центр правовой информации Республики Беларусь",
      allowed_domain: "pravo.by",
      provided_by_user: true,
      provided_at: "2026-08-15T12:00:00Z",
      check_frequency: "ежемесячно",
      requires_review: true,
      description: "Официальное опубликование правовых актов Республики Беларусь.",
      status: "active",
      created_at: "2026-08-15T12:00:00Z",
      updated_at: "2026-08-15T12:00:00Z"
    }
  ],
  source_snapshots: [
    {
      id: "snap-gorsovet-2026-08-15",
      source_id: "src-gorsovet-official",
      retrieved_at: "2026-08-15T12:00:00Z",
      content_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      parser_version: "1.0.0",
      raw_content_path: "snapshots/grodno_gov_by_gorsovet_20260815.html",
      content_type: "text/html",
      status: "success",
      created_at: "2026-08-15T12:00:00Z"
    }
  ],
  extracted_records: [],
  entity_sources: [
    {
      id: "es-1",
      entity_type: "institution",
      entity_id: "inst-grodno-soviet",
      field_name: null,
      source_id: "src-gorsovet-official",
      source_snapshot_id: "snap-gorsovet-2026-08-15",
      verified_at: "2026-08-15T12:00:00Z",
      status: "published",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "es-2",
      entity_type: "person",
      entity_id: "p-fedorov",
      field_name: "reception_schedule",
      source_id: "src-gorsovet-official",
      source_snapshot_id: "snap-gorsovet-2026-08-15",
      verified_at: "2026-08-15T12:00:00Z",
      status: "published",
      created_at: "2026-08-15T12:00:00Z"
    },
    {
      id: "es-3",
      entity_type: "district",
      entity_id: "dist-grodno-1",
      field_name: "boundaries_description",
      source_id: "src-gorsovet-official",
      source_snapshot_id: "snap-gorsovet-2026-08-15",
      verified_at: "2026-08-15T12:00:00Z",
      status: "published",
      created_at: "2026-08-15T12:00:00Z"
    }
  ],
  review_queue: [
    {
      id: "rq-sample-1",
      entity_type: "person",
      entity_id: "p-ivanov-okr1",
      change_type: "update",
      old_data: {
        reception_schedule: "Второй вторник месяца: 16.00 – 18.00"
      },
      new_data: {
        reception_schedule: "Второй и четвертый вторник месяца: 16.00 – 19.00"
      },
      diff_summary: {
        reception_schedule: {
          old: "Второй вторник месяца: 16.00 – 18.00",
          new: "Второй и четвертый вторник месяца: 16.00 – 19.00"
        }
      },
      source_id: "src-gorsovet-official",
      source_snapshot_id: "snap-gorsovet-2026-08-15",
      status: "pending",
      reviewed_by: null,
      reviewed_at: null,
      reviewer_notes: null,
      created_at: "2026-08-15T14:30:00Z"
    }
  ],
  audit_logs: [
    {
      id: "log-1",
      user_id: "system",
      action: "INITIAL_SEED_LOAD",
      entity_type: "all",
      entity_id: null,
      details: { count: 30 },
      created_at: "2026-08-15T12:00:00Z"
    }
  ],
  parser_logs: [
    {
      id: "plog-1",
      source_id: "src-gorsovet-official",
      source_snapshot_id: "snap-gorsovet-2026-08-15",
      status: "success",
      records_extracted: 35,
      records_queued: 1,
      duration_ms: 240,
      created_at: "2026-08-15T12:00:00Z"
    }
  ]
};
