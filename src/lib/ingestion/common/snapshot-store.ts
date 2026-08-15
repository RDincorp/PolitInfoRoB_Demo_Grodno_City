import crypto from 'crypto';

export interface SnapshotResult {
  contentHash: string;
  isChanged: boolean;
  previousHash?: string;
}

export class SnapshotStore {
  /**
   * Generates SHA-256 hash from raw content string or buffer.
   */
  public static computeHash(content: string | Buffer): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Compares current content with previous hash to detect any modifications.
   */
  public static compare(currentContent: string | Buffer, previousHash?: string | null): SnapshotResult {
    const currentHash = this.computeHash(currentContent);
    const isChanged = !previousHash || currentHash !== previousHash;
    return {
      contentHash: currentHash,
      isChanged,
      previousHash: previousHash || undefined,
    };
  }
}
