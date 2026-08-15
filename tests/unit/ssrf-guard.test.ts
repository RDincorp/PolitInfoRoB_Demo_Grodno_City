import { describe, it, expect } from 'vitest';
import { SSRFGuard } from '@/lib/ingestion/common/ssrf-guard';

describe('SSRF Guard Module', () => {
  it('blocks private IP addresses and localhost', () => {
    expect(SSRFGuard.isPrivateIP('127.0.0.1')).toBe(true);
    expect(SSRFGuard.isPrivateIP('10.0.0.1')).toBe(true);
    expect(SSRFGuard.isPrivateIP('192.168.1.1')).toBe(true);
    expect(SSRFGuard.isPrivateIP('172.16.0.1')).toBe(true);
    expect(SSRFGuard.isPrivateIP('localhost')).toBe(true);
    expect(SSRFGuard.isPrivateIP('::1')).toBe(true);
  });

  it('allows safe public hostnames matching allowed domain', () => {
    const res = SSRFGuard.isSafeUrl('https://grodno.gov.by/gorsovet/deputies', 'grodno.gov.by');
    expect(res.safe).toBe(true);
  });

  it('blocks non-matching domain when domain constraint is set', () => {
    const res = SSRFGuard.isSafeUrl('https://evil-site.com/hack', 'grodno.gov.by');
    expect(res.safe).toBe(false);
    expect(res.reason).toContain('не совпадает с разрешенным доменом');
  });

  it('blocks dangerous schemes like file:// or gopher://', () => {
    const res = SSRFGuard.isSafeUrl('file:///etc/passwd');
    expect(res.safe).toBe(false);
    expect(res.reason).toContain('Недопустимый протокол');
  });
});
