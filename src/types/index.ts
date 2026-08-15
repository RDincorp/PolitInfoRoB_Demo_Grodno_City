export type DataStatus =
  | 'draft'
  | 'pending_review'
  | 'verified'
  | 'published'
  | 'outdated'
  | 'archived'
  | 'rejected';

export type TerritoryType =
  | 'country'
  | 'region'
  | 'district'
  | 'city'
  | 'urban_district'
  | 'settlement'
  | 'other';

export type InstitutionType =
  | 'executive'
  | 'representative'
  | 'judicial'
  | 'law_enforcement'
  | 'state_administration'
  | 'other';

export type InstitutionLevel =
  | 'national'
  | 'regional'
  | 'city'
  | 'district';

export type SourceType =
  | 'web_page'
  | 'official_document'
  | 'dataset'
  | 'registry'
  | 'other';

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'deferred';
export type ChangeType = 'create' | 'update' | 'delete' | 'conflict';

// --- Database Entities ---

export interface Country {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  created_at: string;
}

export interface Region {
  id: string;
  country_id: string;
  name: string;
  type: string;
  parent_id?: string | null;
  created_at: string;
}

export interface Territory {
  id: string;
  name: string;
  official_name?: string | null;
  slug: string;
  type: TerritoryType;
  parent_id?: string | null;
  country_id?: string | null;
  region_id?: string | null;
  description?: string | null;
  geometry?: any | null; // GeoJSON
  status: DataStatus;
  valid_from?: string | null;
  valid_to?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Institution {
  id: string;
  name: string;
  official_name?: string | null;
  short_name?: string | null;
  slug: string;
  type: InstitutionType;
  level: InstitutionLevel;
  parent_institution_id?: string | null;
  territory_id: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  working_hours?: string | null;
  description?: string | null;
  status: DataStatus;
  valid_from?: string | null;
  valid_to?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  institution_id: string;
  parent_department_id?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  working_hours?: string | null;
  status: DataStatus;
  valid_from?: string | null;
  valid_to?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  full_name: string;
  first_name?: string | null;
  last_name?: string | null;
  middle_name?: string | null;
  slug: string;
  photo_url?: string | null;
  biography?: string | null;
  official_profile_url?: string | null;
  status: DataStatus;
  valid_from?: string | null;
  valid_to?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Position {
  id: string;
  name: string;
  institution_id?: string | null;
  department_id?: string | null;
  territory_id?: string | null;
  description?: string | null;
  is_leadership?: boolean;
  created_at: string;
}

export interface PersonPosition {
  id: string;
  person_id: string;
  position_id: string;
  start_date?: string | null;
  end_date?: string | null;
  reception_schedule?: string | null;
  reception_address?: string | null;
  reception_phone?: string | null;
  status: DataStatus;
  source_id?: string | null;
  created_at: string;
}

export interface ElectoralDistrict {
  id: string;
  name: string;
  number: number;
  slug: string;
  level: 'city_council' | 'regional_council' | 'parliament' | string;
  territory_id: string;
  description?: string | null;
  boundaries_description?: string | null;
  geometry?: any | null; // GeoJSON
  status: DataStatus;
  valid_from?: string | null;
  valid_to?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonDistrict {
  id: string;
  person_id: string;
  district_id: string;
  valid_from?: string | null;
  valid_to?: string | null;
  status: DataStatus;
  source_id?: string | null;
  created_at: string;
}

export interface Competence {
  id: string;
  name: string;
  slug: string;
  description: string;
  category?: string | null;
  institution_id?: string | null;
  department_id?: string | null;
  territory_id?: string | null;
  legal_basis?: string | null;
  status: DataStatus;
  created_at: string;
  updated_at: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  document_type: string;
  number?: string | null;
  date?: string | null;
  status: DataStatus;
  url?: string | null;
  description?: string | null;
  institution_id?: string | null;
  created_at: string;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  source_type: SourceType;
  publisher?: string | null;
  allowed_domain: string;
  provided_by_user: boolean;
  provided_at: string;
  check_frequency?: string | null;
  requires_review: boolean;
  description?: string | null;
  status: 'active' | 'archived' | 'error' | 'parser_requires_maintenance';
  created_at: string;
  updated_at: string;
}

export interface SourceSnapshot {
  id: string;
  source_id: string;
  retrieved_at: string;
  content_hash: string;
  parser_version: string;
  raw_content?: string | null;
  raw_content_path?: string | null;
  content_type: string;
  status: 'success' | 'failed' | 'empty';
  error_message?: string | null;
  created_at: string;
}

export interface ExtractedRecord {
  id: string;
  source_snapshot_id: string;
  entity_type: string;
  raw_data: Record<string, any>;
  extraction_status: 'pending' | 'processed' | 'failed';
  confidence: number;
  requires_review: boolean;
  created_at: string;
}

export interface EntitySource {
  id: string;
  entity_type: 'person' | 'institution' | 'department' | 'district' | 'position' | 'competence' | 'territory';
  entity_id: string;
  field_name?: string | null; // If provenance is tied to a specific field e.g. "phone", "reception_schedule"
  source_id: string;
  source_snapshot_id?: string | null;
  verified_at: string;
  status: DataStatus;
  created_at: string;
}

export interface ReviewQueueItem {
  id: string;
  entity_type: string;
  entity_id?: string | null;
  change_type: ChangeType;
  old_data?: Record<string, any> | null;
  new_data: Record<string, any>;
  diff_summary?: Record<string, { old: any; new: any }> | null;
  source_id: string;
  source_snapshot_id?: string | null;
  status: ReviewStatus;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  reviewer_notes?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string | null;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  details?: Record<string, any> | null;
  created_at: string;
}

export interface ParserLog {
  id: string;
  source_id: string;
  source_snapshot_id?: string | null;
  status: 'started' | 'success' | 'failed';
  records_extracted: number;
  records_queued: number;
  error_details?: string | null;
  duration_ms: number;
  created_at: string;
}

// --- Aggregate DTOs for Full Details Views ---

export interface PersonFullDetails extends Person {
  positions: Array<{
    person_position_id: string;
    position: Position;
    institution?: Institution | null;
    department?: Department | null;
    start_date?: string | null;
    end_date?: string | null;
    reception_schedule?: string | null;
    reception_address?: string | null;
    reception_phone?: string | null;
    source?: Source | null;
  }>;
  districts: Array<{
    person_district_id: string;
    district: ElectoralDistrict;
    territory?: Territory | null;
    source?: Source | null;
  }>;
  sources: Array<{
    source: Source;
    snapshot?: SourceSnapshot | null;
    field_name?: string | null;
    verified_at: string;
  }>;
}

export interface InstitutionFullDetails extends Institution {
  territory?: Territory | null;
  parent_institution?: Institution | null;
  sub_institutions: Institution[];
  departments: Department[];
  leadership: Array<{
    person: Person;
    position: Position;
    reception_schedule?: string | null;
    reception_address?: string | null;
    reception_phone?: string | null;
  }>;
  competences: Competence[];
  legal_documents: LegalDocument[];
  sources: Array<{
    source: Source;
    snapshot?: SourceSnapshot | null;
    field_name?: string | null;
    verified_at: string;
  }>;
}

export interface DistrictFullDetails extends ElectoralDistrict {
  territory?: Territory | null;
  deputy?: {
    person: Person;
    positions: Position[];
    reception_schedule?: string | null;
    reception_address?: string | null;
    reception_phone?: string | null;
  } | null;
  sources: Array<{
    source: Source;
    snapshot?: SourceSnapshot | null;
    verified_at: string;
  }>;
}

export interface TerritoryFullDetails extends Territory {
  parent_territory?: Territory | null;
  child_territories: Territory[];
  institutions: Institution[];
  districts: Array<ElectoralDistrict & { deputy?: Person | null }>;
  sources: Array<{
    source: Source;
    snapshot?: SourceSnapshot | null;
    verified_at: string;
  }>;
}

export interface SearchResultItem {
  id: string;
  type: 'person' | 'institution' | 'department' | 'territory' | 'district' | 'competence';
  title: string;
  subtitle?: string | null;
  description?: string | null;
  url: string;
  badge?: string | null;
}
