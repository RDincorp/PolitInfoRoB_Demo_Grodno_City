import { DBRepository } from '../db';
import { SSRFGuard } from './common/ssrf-guard';
import { SnapshotStore } from './common/snapshot-store';
import { HtmlSourceAdapter } from './parsers/html-adapter';
import { normalizeFullName, slugify } from './normalizers';
import { DiffEngine } from './diff/diff-engine';
import { SourceSnapshot } from '@/types';

export interface IngestionOptions {
  sourceId: string;
  rawContent?: string;
  fetchLive?: boolean;
}

export interface IngestionResult {
  success: boolean;
  sourceId: string;
  snapshotId?: string;
  recordsExtracted: number;
  recordsQueued: number;
  changesDetected: number;
  message: string;
  error?: string;
}

export class IngestionPipeline {
  /**
   * Runs the complete ingestion workflow from fetch/input to snapshot, extraction, diffing, and review queue.
   */
  public static async processSource(options: IngestionOptions): Promise<IngestionResult> {
    const startTime = Date.now();
    const source = DBRepository.getSourceById(options.sourceId);

    if (!source) {
      return {
        success: false,
        sourceId: options.sourceId,
        recordsExtracted: 0,
        recordsQueued: 0,
        changesDetected: 0,
        message: 'Источник не найден в Source Registry',
        error: 'SOURCE_NOT_FOUND',
      };
    }

    let contentToProcess = options.rawContent || '';

    // 1. Fetch live if requested
    if (options.fetchLive) {
      const ssrfCheck = SSRFGuard.isSafeUrl(source.url, source.allowed_domain);
      if (!ssrfCheck.safe) {
        return {
          success: false,
          sourceId: source.id,
          recordsExtracted: 0,
          recordsQueued: 0,
          changesDetected: 0,
          message: `Ошибка безопасности: ${ssrfCheck.reason}`,
          error: 'SSRF_BLOCKED',
        };
      }

      try {
        const response = await fetch(source.url, {
          headers: {
            'User-Agent': 'Belarus-Civic-Map-Ingestion-Bot/1.0 (+official-provenance-verifier)',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        contentToProcess = await response.text();
      } catch (err: any) {
        return {
          success: false,
          sourceId: source.id,
          recordsExtracted: 0,
          recordsQueued: 0,
          changesDetected: 0,
          message: `Не удалось загрузить источник: ${err.message}`,
          error: 'FETCH_ERROR',
        };
      }
    }

    if (!contentToProcess) {
      return {
        success: false,
        sourceId: source.id,
        recordsExtracted: 0,
        recordsQueued: 0,
        changesDetected: 0,
        message: 'Контент источника пуст',
        error: 'EMPTY_CONTENT',
      };
    }

    // 2. Snapshot creation and hashing
    const latestSnapshot = source.snapshots && source.snapshots.length > 0 ? source.snapshots[source.snapshots.length - 1] : null;
    const snapResult = SnapshotStore.compare(contentToProcess, latestSnapshot?.content_hash);

    const snapshot = DBRepository.createSnapshot({
      source_id: source.id,
      retrieved_at: new Date().toISOString(),
      content_hash: snapResult.contentHash,
      parser_version: '1.0.0',
      raw_content: contentToProcess.slice(0, 500000), // Limit storage size in memory/json
      content_type: 'text/html',
      status: 'success',
      error_message: null,
    });

    // 3. Extraction
    const extractedDeputies = HtmlSourceAdapter.parseDeputiesPage(contentToProcess);

    let recordsQueued = 0;
    let changesDetected = 0;

    const allPeople = DBRepository.getPeople();

    for (const dep of extractedDeputies) {
      const normName = normalizeFullName(dep.deputyName);
      const slug = slugify(normName.fullName);

      const existingPerson = allPeople.find(
        (p) => p.slug === slug || DiffEngine.isDuplicateCandidate(p.full_name, normName.fullName)
      );

      const newPersonPayload = {
        id: existingPerson?.id || `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        full_name: normName.fullName,
        first_name: normName.firstName,
        last_name: normName.lastName,
        middle_name: normName.middleName,
        slug,
        reception_schedule: dep.receptionSchedule,
        reception_phone: dep.receptionPhone,
      };

      const diff = DiffEngine.compareEntities(existingPerson as any, newPersonPayload);

      if (diff.hasChanges) {
        changesDetected++;

        if (source.requires_review) {
          DBRepository.createReviewItem({
            entity_type: 'person',
            entity_id: existingPerson?.id || null,
            change_type: diff.changeType === 'none' ? 'update' : diff.changeType,
            old_data: existingPerson ? (existingPerson as any) : null,
            new_data: newPersonPayload,
            diff_summary: diff.diffSummary,
            source_id: source.id,
            source_snapshot_id: snapshot.id,
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            reviewer_notes: null,
          });
          recordsQueued++;
        } else {
          // Auto publish if review is not required by source policy
          DBRepository.approveReviewItem(snapshot.id);
        }
      }
    }

    const duration = Date.now() - startTime;

    return {
      success: true,
      sourceId: source.id,
      snapshotId: snapshot.id,
      recordsExtracted: extractedDeputies.length,
      recordsQueued,
      changesDetected,
      message: `Парсинг успешно завершен. Извлечено записей: ${extractedDeputies.length}, на проверку направлено: ${recordsQueued}.`,
    };
  }
}
