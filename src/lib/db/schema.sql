-- ====================================================================
-- Interactive Political Map of Belarus (Data Schema)
-- Compatible with PostgreSQL (Supabase) and SQLite with JSON1 support
-- ====================================================================

-- 1. Countries
CREATE TABLE IF NOT EXISTS countries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Regions
CREATE TABLE IF NOT EXISTS regions (
    id TEXT PRIMARY KEY,
    country_id TEXT NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    parent_id TEXT REFERENCES regions(id),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Territories
CREATE TABLE IF NOT EXISTS territories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    official_name TEXT,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL, -- country, region, district, city, urban_district, settlement, other
    parent_id TEXT REFERENCES territories(id) ON DELETE SET NULL,
    country_id TEXT REFERENCES countries(id) ON DELETE SET NULL,
    region_id TEXT REFERENCES regions(id) ON DELETE SET NULL,
    description TEXT,
    geometry TEXT, -- GeoJSON string
    status TEXT NOT NULL DEFAULT 'published', -- draft, pending_review, verified, published, outdated, archived, rejected
    valid_from TEXT,
    valid_to TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Institutions
CREATE TABLE IF NOT EXISTS institutions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    official_name TEXT,
    short_name TEXT,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL, -- executive, representative, judicial, law_enforcement, state_administration, other
    level TEXT NOT NULL, -- national, regional, city, district
    parent_institution_id TEXT REFERENCES institutions(id) ON DELETE SET NULL,
    territory_id TEXT NOT NULL REFERENCES territories(id) ON DELETE CASCADE,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    working_hours TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    valid_from TEXT,
    valid_to TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Departments
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    parent_department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    working_hours TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    valid_from TEXT,
    valid_to TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. People
CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    middle_name TEXT,
    slug TEXT NOT NULL UNIQUE,
    photo_url TEXT,
    biography TEXT,
    official_profile_url TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    valid_from TEXT,
    valid_to TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Positions
CREATE TABLE IF NOT EXISTS positions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    institution_id TEXT REFERENCES institutions(id) ON DELETE CASCADE,
    department_id TEXT REFERENCES departments(id) ON DELETE CASCADE,
    territory_id TEXT REFERENCES territories(id) ON DELETE CASCADE,
    description TEXT,
    is_leadership INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Person Positions (History and reception schedule)
CREATE TABLE IF NOT EXISTS person_positions (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    position_id TEXT NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
    start_date TEXT,
    end_date TEXT,
    reception_schedule TEXT,
    reception_address TEXT,
    reception_phone TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    source_id TEXT REFERENCES sources(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Electoral Districts
CREATE TABLE IF NOT EXISTS electoral_districts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    number INTEGER NOT NULL,
    slug TEXT NOT NULL,
    level TEXT NOT NULL, -- city_council, regional_council, parliament
    territory_id TEXT NOT NULL REFERENCES territories(id) ON DELETE CASCADE,
    description TEXT,
    boundaries_description TEXT,
    geometry TEXT, -- GeoJSON polygon
    status TEXT NOT NULL DEFAULT 'published',
    valid_from TEXT,
    valid_to TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (number, level, territory_id)
);

-- 10. Person Districts (Deputies)
CREATE TABLE IF NOT EXISTS person_districts (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    district_id TEXT NOT NULL REFERENCES electoral_districts(id) ON DELETE CASCADE,
    valid_from TEXT,
    valid_to TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    source_id TEXT REFERENCES sources(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Competences
CREATE TABLE IF NOT EXISTS competences (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT,
    institution_id TEXT REFERENCES institutions(id) ON DELETE CASCADE,
    department_id TEXT REFERENCES departments(id) ON DELETE CASCADE,
    territory_id TEXT REFERENCES territories(id) ON DELETE CASCADE,
    legal_basis TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Legal Documents
CREATE TABLE IF NOT EXISTS legal_documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL,
    number TEXT,
    date TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    url TEXT,
    description TEXT,
    institution_id TEXT REFERENCES institutions(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. Sources (Source Registry)
CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    source_type TEXT NOT NULL, -- web_page, official_document, dataset, registry, other
    publisher TEXT,
    allowed_domain TEXT NOT NULL,
    provided_by_user INTEGER NOT NULL DEFAULT 1,
    provided_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_frequency TEXT,
    requires_review INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- active, archived, error, parser_requires_maintenance
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. Source Snapshots
CREATE TABLE IF NOT EXISTS source_snapshots (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    retrieved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content_hash TEXT NOT NULL,
    parser_version TEXT NOT NULL,
    raw_content TEXT,
    raw_content_path TEXT,
    content_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'success',
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Extracted Records
CREATE TABLE IF NOT EXISTS extracted_records (
    id TEXT PRIMARY KEY,
    source_snapshot_id TEXT NOT NULL REFERENCES source_snapshots(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    raw_data TEXT NOT NULL, -- JSON
    extraction_status TEXT NOT NULL DEFAULT 'pending', -- pending, processed, failed
    confidence REAL NOT NULL DEFAULT 1.0,
    requires_review INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. Entity Sources (Data Provenance)
CREATE TABLE IF NOT EXISTS entity_sources (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    field_name TEXT,
    source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    source_snapshot_id TEXT REFERENCES source_snapshots(id) ON DELETE SET NULL,
    verified_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. Review Queue
CREATE TABLE IF NOT EXISTS review_queue (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    change_type TEXT NOT NULL, -- create, update, delete, conflict
    old_data TEXT, -- JSON
    new_data TEXT NOT NULL, -- JSON
    diff_summary TEXT, -- JSON
    source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    source_snapshot_id TEXT REFERENCES source_snapshots(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, deferred
    reviewed_by TEXT,
    reviewed_at TEXT,
    reviewer_notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 18. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details TEXT, -- JSON
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 19. Parser Logs
CREATE TABLE IF NOT EXISTS parser_logs (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    source_snapshot_id TEXT REFERENCES source_snapshots(id) ON DELETE SET NULL,
    status TEXT NOT NULL, -- started, success, failed
    records_extracted INTEGER NOT NULL DEFAULT 0,
    records_queued INTEGER NOT NULL DEFAULT 0,
    error_details TEXT,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_territories_slug ON territories(slug);
CREATE INDEX IF NOT EXISTS idx_institutions_slug ON institutions(slug);
CREATE INDEX IF NOT EXISTS idx_institutions_territory ON institutions(territory_id);
CREATE INDEX IF NOT EXISTS idx_people_slug ON people(slug);
CREATE INDEX IF NOT EXISTS idx_electoral_districts_territory ON electoral_districts(territory_id);
CREATE INDEX IF NOT EXISTS idx_electoral_districts_number ON electoral_districts(number);
CREATE INDEX IF NOT EXISTS idx_person_positions_person ON person_positions(person_id);
CREATE INDEX IF NOT EXISTS idx_person_districts_person ON person_districts(person_id);
CREATE INDEX IF NOT EXISTS idx_person_districts_district ON person_districts(district_id);
CREATE INDEX IF NOT EXISTS idx_competences_slug ON competences(slug);
CREATE INDEX IF NOT EXISTS idx_entity_sources_entity ON entity_sources(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_review_queue_status ON review_queue(status);
CREATE INDEX IF NOT EXISTS idx_source_snapshots_hash ON source_snapshots(content_hash);
