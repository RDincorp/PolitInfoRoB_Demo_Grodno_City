import {
  Country,
  Region,
  Territory,
  Institution,
  Department,
  Person,
  Position,
  PersonPosition,
  ElectoralDistrict,
  PersonDistrict,
  Competence,
  LegalDocument,
  GlossaryTerm,
  Source,
  SourceSnapshot,
  ExtractedRecord,
  EntitySource,
  ReviewQueueItem,
  AuditLog,
  ParserLog,
  PersonFullDetails,
  InstitutionFullDetails,
  DistrictFullDetails,
  TerritoryFullDetails,
  SearchResultItem,
} from '@/types';
import { executeUniversalSearch } from '@/lib/search';

export interface DatabaseState {
  countries: Country[];
  regions: Region[];
  territories: Territory[];
  institutions: Institution[];
  departments: Department[];
  people: Person[];
  positions: Position[];
  person_positions: PersonPosition[];
  electoral_districts: ElectoralDistrict[];
  person_districts: PersonDistrict[];
  competences: Competence[];
  legal_documents: LegalDocument[];
  glossary_terms: GlossaryTerm[];
  sources: Source[];
  source_snapshots: SourceSnapshot[];
  extracted_records: ExtractedRecord[];
  entity_sources: EntitySource[];
  review_queue: ReviewQueueItem[];
  audit_logs: AuditLog[];
  parser_logs: ParserLog[];
}

function getFsModule(): any {
  if (typeof window === 'undefined') {
    try {
      const g = globalThis as any;
      const req = g.__non_webpack_require__ || eval('require');
      return req('fs');
    } catch {
      return null;
    }
  }
  return null;
}

function getPathModule(): any {
  if (typeof window === 'undefined') {
    try {
      const g = globalThis as any;
      const req = g.__non_webpack_require__ || eval('require');
      return req('path');
    } catch {
      return null;
    }
  }
  return null;
}

function getDbFilePath(): string {
  const pathMod = getPathModule();
  if (pathMod) {
    return pathMod.resolve(process.cwd(), 'data', 'db.json');
  }
  return 'data/db.json';
}

function getDefaultState(): DatabaseState {
  return {
    countries: [],
    regions: [],
    territories: [],
    institutions: [],
    departments: [],
    people: [],
    positions: [],
    person_positions: [],
    electoral_districts: [],
    person_districts: [],
    competences: [],
    legal_documents: [],
    glossary_terms: [],
    sources: [],
    source_snapshots: [],
    extracted_records: [],
    entity_sources: [],
    review_queue: [],
    audit_logs: [],
    parser_logs: [],
  };
}

class StorageEngine {
  private static instance: StorageEngine;
  private state: DatabaseState;

  private constructor() {
    this.state = this.load();
  }

  public static getInstance(): StorageEngine {
    if (!StorageEngine.instance) {
      StorageEngine.instance = new StorageEngine();
    }
    return StorageEngine.instance;
  }

  private load(): DatabaseState {
    const fsMod = getFsModule();
    const dbFile = getDbFilePath();

    if (fsMod) {
      try {
        if (fsMod.existsSync(dbFile)) {
          const raw = fsMod.readFileSync(dbFile, 'utf-8');
          return { ...getDefaultState(), ...JSON.parse(raw) };
        }
      } catch (e) {
        console.error('Error loading db.json:', e);
      }
    }
    const defaultState = getDefaultState();
    this.save(defaultState);
    return defaultState;
  }

  public save(stateToSave?: DatabaseState): void {
    const fsMod = getFsModule();
    const pathMod = getPathModule();
    const dbFile = getDbFilePath();

    if (fsMod && pathMod) {
      try {
        const dir = pathMod.dirname(dbFile);
        if (!fsMod.existsSync(dir)) {
          fsMod.mkdirSync(dir, { recursive: true });
        }
        fsMod.writeFileSync(dbFile, JSON.stringify(stateToSave || this.state, null, 2), 'utf-8');
      } catch (e) {
        console.error('Error saving db.json:', e);
      }
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public setState(newState: DatabaseState): void {
    this.state = newState;
    this.save();
  }
}

export class DBRepository {
  private static get engine() {
    return StorageEngine.getInstance();
  }

  public static getDashboardStats() {
    const s = this.engine.getState();
    return {
      peopleCount: s.people.filter((p) => p.status === 'published').length,
      institutionsCount: s.institutions.filter((i) => i.status === 'published').length,
      districtsCount: s.electoral_districts.filter((d) => d.status === 'published').length,
      sourcesCount: s.sources.length,
      pendingReviewsCount: s.review_queue.filter((r) => r.status === 'pending').length,
      snapshotsCount: s.source_snapshots.length,
    };
  }

  // --- Search ---
  public static search(query: string, typeFilter?: string): SearchResultItem[] {
    const s = this.engine.getState();
    return executeUniversalSearch(s, query, typeFilter);
  }

  // --- Territories ---
  public static getTerritories(): Territory[] {
    return this.engine.getState().territories.filter((t) => t.status === 'published');
  }

  public static getTerritoryBySlug(slug: string): TerritoryFullDetails | null {
    const s = this.engine.getState();
    const territory = s.territories.find((t) => t.slug === slug && t.status === 'published');
    if (!territory) return null;

    const parent = territory.parent_id ? s.territories.find((t) => t.id === territory.parent_id) || null : null;
    const children = s.territories.filter((t) => t.parent_id === territory.id && t.status === 'published');
    const institutions = s.institutions.filter((i) => i.territory_id === territory.id && i.status === 'published');

    const districts = s.electoral_districts
      .filter((d) => d.territory_id === territory.id && d.status === 'published')
      .sort((a, b) => a.number - b.number)
      .map((d) => {
        const pd = s.person_districts.find((rel) => rel.district_id === d.id && rel.status === 'published');
        const deputy = pd ? s.people.find((p) => p.id === pd.person_id && p.status === 'published') || null : null;
        return {
          ...d,
          deputy,
        };
      });

    const entitySources = s.entity_sources.filter(
      (es) => es.entity_type === 'territory' && es.entity_id === territory.id
    );

    const sources = entitySources.map((es) => {
      const source = s.sources.find((src) => src.id === es.source_id);
      const snapshot = es.source_snapshot_id
        ? s.source_snapshots.find((snap) => snap.id === es.source_snapshot_id) || null
        : null;
      return {
        source: source!,
        snapshot,
        field_name: es.field_name,
        verified_at: es.verified_at,
      };
    }).filter((item) => Boolean(item.source));

    return {
      ...territory,
      parent_territory: parent,
      child_territories: children,
      institutions,
      districts,
      sources,
    };
  }

  // --- People ---
  public static getPeople(): Person[] {
    return this.engine.getState().people.filter((p) => p.status === 'published');
  }

  public static getPersonBySlug(slug: string): PersonFullDetails | null {
    const s = this.engine.getState();
    const person = s.people.find((p) => p.slug === slug && p.status === 'published');
    if (!person) return null;

    const personPositions = s.person_positions.filter((pp) => pp.person_id === person.id && pp.status === 'published');
    const positions = personPositions.map((pp) => {
      const pos = s.positions.find((p) => p.id === pp.position_id)!;
      const institution = pos?.institution_id ? s.institutions.find((i) => i.id === pos.institution_id) || null : null;
      const department = pos?.department_id ? s.departments.find((d) => d.id === pos.department_id) || null : null;
      const source = pp.source_id ? s.sources.find((src) => src.id === pp.source_id) || null : null;

      return {
        person_position_id: pp.id,
        position: pos,
        institution,
        department,
        start_date: pp.start_date,
        end_date: pp.end_date,
        reception_schedule: pp.reception_schedule,
        reception_address: pp.reception_address,
        reception_phone: pp.reception_phone,
        source,
      };
    }).filter((item) => Boolean(item.position));

    const personDistricts = s.person_districts.filter((pd) => pd.person_id === person.id && pd.status === 'published');
    const districts = personDistricts.map((pd) => {
      const district = s.electoral_districts.find((d) => d.id === pd.district_id)!;
      const territory = district?.territory_id ? s.territories.find((t) => t.id === district.territory_id) || null : null;
      const source = pd.source_id ? s.sources.find((src) => src.id === pd.source_id) || null : null;

      return {
        person_district_id: pd.id,
        district,
        territory,
        source,
      };
    }).filter((item) => Boolean(item.district));

    const entitySources = s.entity_sources.filter(
      (es) => es.entity_type === 'person' && es.entity_id === person.id
    );

    const sources = entitySources.map((es) => {
      const source = s.sources.find((src) => src.id === es.source_id);
      const snapshot = es.source_snapshot_id
        ? s.source_snapshots.find((snap) => snap.id === es.source_snapshot_id) || null
        : null;
      return {
        source: source!,
        snapshot,
        field_name: es.field_name,
        verified_at: es.verified_at,
      };
    }).filter((item) => Boolean(item.source));

    return {
      ...person,
      positions,
      districts,
      sources,
    };
  }

  // --- Institutions ---
  public static getInstitutions(): Institution[] {
    return this.engine.getState().institutions.filter((i) => i.status === 'published');
  }

  public static getInstitutionBySlug(slug: string): InstitutionFullDetails | null {
    const s = this.engine.getState();
    const inst = s.institutions.find((i) => i.slug === slug && i.status === 'published');
    if (!inst) return null;

    const territory = s.territories.find((t) => t.id === inst.territory_id) || null;
    const parent = inst.parent_institution_id
      ? s.institutions.find((i) => i.id === inst.parent_institution_id) || null
      : null;
    const subInstitutions = s.institutions.filter(
      (i) => i.parent_institution_id === inst.id && i.status === 'published'
    );
    const departments = s.departments.filter((d) => d.institution_id === inst.id && d.status === 'published');

    // Leadership
    const instPositions = s.positions.filter((pos) => pos.institution_id === inst.id);
    const leadership = instPositions.flatMap((pos) => {
      const pps = s.person_positions.filter((pp) => pp.position_id === pos.id && pp.status === 'published');
      return pps.map((pp) => {
        const person = s.people.find((p) => p.id === pp.person_id && p.status === 'published');
        if (!person) return null;
        return {
          person,
          position: pos,
          reception_schedule: pp.reception_schedule,
          reception_address: pp.reception_address,
          reception_phone: pp.reception_phone,
        };
      }).filter(Boolean);
    }) as Array<{
      person: Person;
      position: Position;
      reception_schedule?: string | null;
      reception_address?: string | null;
      reception_phone?: string | null;
    }>;

    const competences = s.competences.filter((c) => c.institution_id === inst.id && c.status === 'published');
    const legalDocuments = s.legal_documents.filter((d) => d.institution_id === inst.id && d.status === 'published');

    const entitySources = s.entity_sources.filter(
      (es) => es.entity_type === 'institution' && es.entity_id === inst.id
    );

    const sources = entitySources.map((es) => {
      const source = s.sources.find((src) => src.id === es.source_id);
      const snapshot = es.source_snapshot_id
        ? s.source_snapshots.find((snap) => snap.id === es.source_snapshot_id) || null
        : null;
      return {
        source: source!,
        snapshot,
        field_name: es.field_name,
        verified_at: es.verified_at,
      };
    }).filter((item) => Boolean(item.source));

    return {
      ...inst,
      territory,
      parent_institution: parent,
      sub_institutions: subInstitutions,
      departments,
      leadership,
      competences,
      legal_documents: legalDocuments,
      sources,
    };
  }

  // --- Electoral Districts ---
  public static getDistricts(): ElectoralDistrict[] {
    return this.engine.getState().electoral_districts.filter((d) => d.status === 'published');
  }

  public static getDistrictBySlug(slug: string): DistrictFullDetails | null {
    const s = this.engine.getState();
    const district = s.electoral_districts.find((d) => d.slug === slug && d.status === 'published');
    if (!district) return null;

    const territory = s.territories.find((t) => t.id === district.territory_id) || null;

    const pd = s.person_districts.find((rel) => rel.district_id === district.id && rel.status === 'published');
    let deputy = null;
    if (pd) {
      const person = s.people.find((p) => p.id === pd.person_id && p.status === 'published');
      if (person) {
        const pps = s.person_positions.filter((pp) => pp.person_id === person.id && pp.status === 'published');
        const positions = pps.map((pp) => s.positions.find((pos) => pos.id === pp.position_id)!).filter(Boolean);
        const primaryPp = pps[0];

        deputy = {
          person,
          positions,
          reception_schedule: primaryPp?.reception_schedule || null,
          reception_address: primaryPp?.reception_address || null,
          reception_phone: primaryPp?.reception_phone || null,
        };
      }
    }

    const entitySources = s.entity_sources.filter(
      (es) => es.entity_type === 'district' && es.entity_id === district.id
    );

    const sources = entitySources.map((es) => {
      const source = s.sources.find((src) => src.id === es.source_id);
      const snapshot = es.source_snapshot_id
        ? s.source_snapshots.find((snap) => snap.id === es.source_snapshot_id) || null
        : null;
      return {
        source: source!,
        snapshot,
        verified_at: es.verified_at,
      };
    }).filter((item) => Boolean(item.source));

    return {
      ...district,
      territory,
      deputy,
      sources,
    };
  }

  // --- Competences ---
  public static getCompetences(): Competence[] {
    return this.engine.getState().competences.filter((c) => c.status === 'published');
  }

  public static getCompetenceBySlug(slug: string) {
    const s = this.engine.getState();
    const comp = s.competences.find((c) => c.slug === slug && c.status === 'published');
    if (!comp) return null;

    const institution = comp.institution_id ? s.institutions.find((i) => i.id === comp.institution_id) || null : null;
    const department = comp.department_id ? s.departments.find((d) => d.id === comp.department_id) || null : null;
    const territory = comp.territory_id ? s.territories.find((t) => t.id === comp.territory_id) || null : null;

    return {
      ...comp,
      institution,
      department,
      territory,
    };
  }

  // --- Glossary ---
  public static getGlossaryTerms(): GlossaryTerm[] {
    return this.engine.getState().glossary_terms || [];
  }

  public static getGlossaryTermBySlug(slug: string): GlossaryTerm | null {
    const terms = this.engine.getState().glossary_terms || [];
    return terms.find((t) => t.slug === slug) || null;
  }

  // --- Sources & Registry ---
  public static getSources(): Source[] {
    return this.engine.getState().sources;
  }

  public static getSourceById(id: string): (Source & { snapshots: SourceSnapshot[] }) | null {
    const s = this.engine.getState();
    const src = s.sources.find((src) => src.id === id);
    if (!src) return null;
    const snapshots = s.source_snapshots.filter((snap) => snap.source_id === id);
    return {
      ...src,
      snapshots,
    };
  }

  public static createSource(source: Omit<Source, 'id' | 'created_at' | 'updated_at'>): Source {
    const s = this.engine.getState();
    const newSource: Source = {
      ...source,
      id: `src-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    s.sources.push(newSource);
    this.engine.save(s);
    return newSource;
  }

  // --- Snapshots ---
  public static createSnapshot(snapshot: Omit<SourceSnapshot, 'id' | 'created_at'>): SourceSnapshot {
    const s = this.engine.getState();
    const newSnapshot: SourceSnapshot = {
      ...snapshot,
      id: `snap-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      created_at: new Date().toISOString(),
    };
    s.source_snapshots.push(newSnapshot);
    this.engine.save(s);
    return newSnapshot;
  }

  // --- Review Queue ---
  public static getReviewQueue(status: string = 'pending'): (ReviewQueueItem & { source?: Source | null })[] {
    const s = this.engine.getState();
    return s.review_queue
      .filter((r) => r.status === status)
      .map((r) => {
        const source = s.sources.find((src) => src.id === r.source_id) || null;
        return {
          ...r,
          source,
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public static createReviewItem(item: Omit<ReviewQueueItem, 'id' | 'created_at'>): ReviewQueueItem {
    const s = this.engine.getState();
    const newItem: ReviewQueueItem = {
      ...item,
      id: `rq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      created_at: new Date().toISOString(),
    };
    s.review_queue.push(newItem);
    this.engine.save(s);
    return newItem;
  }

  public static approveReviewItem(id: string, reviewedBy: string = 'admin'): boolean {
    const s = this.engine.getState();
    const itemIndex = s.review_queue.findIndex((r) => r.id === id);
    if (itemIndex === -1) return false;

    const item = s.review_queue[itemIndex];
    const data = item.new_data;

    // Apply entity creation / update
    if (item.entity_type === 'person') {
      const existingIndex = s.people.findIndex((p) => p.id === data.id || p.slug === data.slug);
      if (existingIndex >= 0) {
        s.people[existingIndex] = {
          ...s.people[existingIndex],
          ...data,
          status: 'published',
          updated_at: new Date().toISOString(),
        };
      } else {
        s.people.push({
          ...data,
          id: data.id || `p-${Date.now()}`,
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Person);
      }

      // Add provenance
      s.entity_sources.push({
        id: `es-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        entity_type: 'person',
        entity_id: data.id || s.people[s.people.length - 1].id,
        source_id: item.source_id,
        source_snapshot_id: item.source_snapshot_id || null,
        verified_at: new Date().toISOString(),
        status: 'published',
        created_at: new Date().toISOString(),
      });
    }

    s.review_queue[itemIndex].status = 'approved';
    s.review_queue[itemIndex].reviewed_by = reviewedBy;
    s.review_queue[itemIndex].reviewed_at = new Date().toISOString();

    this.engine.save(s);
    return true;
  }

  public static rejectReviewItem(id: string, reviewerNotes: string, reviewedBy: string = 'admin'): boolean {
    const s = this.engine.getState();
    const itemIndex = s.review_queue.findIndex((r) => r.id === id);
    if (itemIndex === -1) return false;

    s.review_queue[itemIndex].status = 'rejected';
    s.review_queue[itemIndex].reviewer_notes = reviewerNotes;
    s.review_queue[itemIndex].reviewed_by = reviewedBy;
    s.review_queue[itemIndex].reviewed_at = new Date().toISOString();

    this.engine.save(s);
    return true;
  }

  // --- Seed Database ---
  public static seed(seedData: Partial<DatabaseState>): void {
    const s = this.engine.getState();
    const updatedState: DatabaseState = {
      ...s,
      ...seedData,
    };
    this.engine.setState(updatedState);
  }
}
