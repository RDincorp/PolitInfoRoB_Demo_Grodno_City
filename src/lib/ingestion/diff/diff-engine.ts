export interface FieldDiff {
  old: any;
  new: any;
}

export interface EntityDiffResult {
  hasChanges: boolean;
  changeType: 'create' | 'update' | 'delete' | 'none';
  diffSummary: Record<string, FieldDiff>;
}

export class DiffEngine {
  /**
   * Compares two objects and returns field-by-field differences.
   */
  public static compareEntities(
    oldData: Record<string, any> | null | undefined,
    newData: Record<string, any>
  ): EntityDiffResult {
    if (!oldData) {
      return {
        hasChanges: true,
        changeType: 'create',
        diffSummary: Object.entries(newData).reduce((acc, [key, value]) => {
          acc[key] = { old: null, new: value };
          return acc;
        }, {} as Record<string, FieldDiff>),
      };
    }

    const diffSummary: Record<string, FieldDiff> = {};
    const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]));

    let hasChanges = false;

    for (const key of allKeys) {
      // Ignore internal timestamps and ID fields during diffing
      if (['created_at', 'updated_at', 'id', 'source_snapshot_id'].includes(key)) {
        continue;
      }

      const oldVal = oldData[key] !== undefined ? oldData[key] : null;
      const newVal = newData[key] !== undefined ? newData[key] : null;

      // Handle JSON/Object comparison or primitive comparison
      const oldStr = typeof oldVal === 'object' ? JSON.stringify(oldVal) : String(oldVal ?? '');
      const newStr = typeof newVal === 'object' ? JSON.stringify(newVal) : String(newVal ?? '');

      if (oldStr !== newStr) {
        diffSummary[key] = { old: oldVal, new: newVal };
        hasChanges = true;
      }
    }

    return {
      hasChanges,
      changeType: hasChanges ? 'update' : 'none',
      diffSummary,
    };
  }

  /**
   * Evaluates whether two person names might be duplicates (e.g. case insensitive / ё->е / word order variations).
   */
  public static isDuplicateCandidate(nameA: string, nameB: string): boolean {
    const cleanA = nameA
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[\s\u00A0]+/g, ' ')
      .trim();
    const cleanB = nameB
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[\s\u00A0]+/g, ' ')
      .trim();

    if (cleanA === cleanB) return true;

    // Check sorted words comparison (e.g. "Иванов Иван" vs "Иван Иванов")
    const wordsA = cleanA.split(' ').sort().join(' ');
    const wordsB = cleanB.split(' ').sort().join(' ');

    return wordsA === wordsB;
  }
}
