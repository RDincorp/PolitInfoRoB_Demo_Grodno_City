import { z } from 'zod';

export const DataStatusSchema = z.enum([
  'draft',
  'pending_review',
  'verified',
  'published',
  'outdated',
  'archived',
  'rejected',
]);

export const TerritoryTypeSchema = z.enum([
  'country',
  'region',
  'district',
  'city',
  'urban_district',
  'settlement',
  'other',
]);

export const InstitutionTypeSchema = z.enum([
  'executive',
  'representative',
  'judicial',
  'law_enforcement',
  'state_administration',
  'other',
]);

export const InstitutionLevelSchema = z.enum([
  'national',
  'regional',
  'city',
  'district',
]);

export const SourceTypeSchema = z.enum([
  'web_page',
  'official_document',
  'dataset',
  'registry',
  'other',
]);

// --- Entity Validation Schemas ---

export const CountrySchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().min(1, 'Название страны обязательно'),
  code: z.string().min(2).max(10),
  description: z.string().nullable().optional(),
});

export const TerritorySchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().min(1, 'Название территории обязательно'),
  official_name: z.string().nullable().optional(),
  slug: z.string().min(1),
  type: TerritoryTypeSchema,
  parent_id: z.string().nullable().optional(),
  country_id: z.string().nullable().optional(),
  region_id: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  geometry: z.any().nullable().optional(),
  status: DataStatusSchema.default('published'),
  valid_from: z.string().nullable().optional(),
  valid_to: z.string().nullable().optional(),
});

export const InstitutionSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().min(1, 'Название органа обязательно'),
  official_name: z.string().nullable().optional(),
  short_name: z.string().nullable().optional(),
  slug: z.string().min(1),
  type: InstitutionTypeSchema,
  level: InstitutionLevelSchema,
  parent_institution_id: z.string().nullable().optional(),
  territory_id: z.string().min(1, 'Территория обязательна'),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().or(z.string().nullable()).optional(),
  website: z.string().url().nullable().or(z.string().nullable()).optional(),
  working_hours: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: DataStatusSchema.default('published'),
  valid_from: z.string().nullable().optional(),
  valid_to: z.string().nullable().optional(),
});

export const DepartmentSchema = z.object({
  id: z.string().uuid().or(z.string()),
  institution_id: z.string().min(1),
  parent_department_id: z.string().nullable().optional(),
  name: z.string().min(1, 'Название подразделения обязательно'),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  working_hours: z.string().nullable().optional(),
  status: DataStatusSchema.default('published'),
  valid_from: z.string().nullable().optional(),
  valid_to: z.string().nullable().optional(),
});

export const PersonSchema = z.object({
  id: z.string().uuid().or(z.string()),
  full_name: z.string().min(1, 'ФИО обязательно'),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  middle_name: z.string().nullable().optional(),
  slug: z.string().min(1),
  photo_url: z.string().nullable().optional(),
  biography: z.string().nullable().optional(),
  official_profile_url: z.string().url().nullable().or(z.string().nullable()).optional(),
  status: DataStatusSchema.default('published'),
  valid_from: z.string().nullable().optional(),
  valid_to: z.string().nullable().optional(),
});

export const PositionSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().min(1, 'Название должности обязательно'),
  institution_id: z.string().nullable().optional(),
  department_id: z.string().nullable().optional(),
  territory_id: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  is_leadership: z.boolean().default(false),
});

export const PersonPositionSchema = z.object({
  id: z.string().uuid().or(z.string()),
  person_id: z.string().min(1),
  position_id: z.string().min(1),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  reception_schedule: z.string().nullable().optional(),
  reception_address: z.string().nullable().optional(),
  reception_phone: z.string().nullable().optional(),
  status: DataStatusSchema.default('published'),
  source_id: z.string().nullable().optional(),
});

export const ElectoralDistrictSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().min(1, 'Название округа обязательно'),
  number: z.number().int().positive('Номер округа должен быть положительным'),
  slug: z.string().min(1),
  level: z.string().default('city_council'),
  territory_id: z.string().min(1),
  description: z.string().nullable().optional(),
  boundaries_description: z.string().nullable().optional(),
  geometry: z.any().nullable().optional(),
  status: DataStatusSchema.default('published'),
  valid_from: z.string().nullable().optional(),
  valid_to: z.string().nullable().optional(),
});

export const PersonDistrictSchema = z.object({
  id: z.string().uuid().or(z.string()),
  person_id: z.string().min(1),
  district_id: z.string().min(1),
  valid_from: z.string().nullable().optional(),
  valid_to: z.string().nullable().optional(),
  status: DataStatusSchema.default('published'),
  source_id: z.string().nullable().optional(),
});

export const CompetenceSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().min(1, 'Название компетенции обязательно'),
  slug: z.string().min(1),
  description: z.string().min(1, 'Описание компетенции обязательно'),
  category: z.string().nullable().optional(),
  institution_id: z.string().nullable().optional(),
  department_id: z.string().nullable().optional(),
  territory_id: z.string().nullable().optional(),
  legal_basis: z.string().nullable().optional(),
  status: DataStatusSchema.default('published'),
});

export const SourceSchema = z.object({
  id: z.string().uuid().or(z.string()),
  title: z.string().min(1, 'Название источника обязательно'),
  url: z.string().url('URL источника должен быть валидным'),
  source_type: SourceTypeSchema,
  publisher: z.string().nullable().optional(),
  allowed_domain: z.string().min(1, 'Разрешенный домен обязателен'),
  provided_by_user: z.boolean().default(true),
  provided_at: z.string(),
  check_frequency: z.string().nullable().optional(),
  requires_review: z.boolean().default(true),
  description: z.string().nullable().optional(),
  status: z.enum(['active', 'archived', 'error', 'parser_requires_maintenance']).default('active'),
});
