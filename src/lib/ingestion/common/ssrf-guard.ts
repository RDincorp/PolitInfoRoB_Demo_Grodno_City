import { URL } from 'url';

/**
 * SSRF Guard ensures that requests are only made to allowed domains
 * explicitly configured in the Source Registry and blocks private IP ranges.
 */
export class SSRFGuard {
  private static BLOCKED_IP_PREFIXES = [
    '127.',
    '10.',
    '192.168.',
    '172.16.',
    '172.17.',
    '172.18.',
    '172.19.',
    '172.20.',
    '172.21.',
    '172.22.',
    '172.23.',
    '172.24.',
    '172.25.',
    '172.26.',
    '172.27.',
    '172.28.',
    '172.29.',
    '172.30.',
    '172.31.',
    '169.254.', // Link-local
    '0.',
    '::1',
    'localhost',
  ];

  /**
   * Checks if an IP or hostname is in the private/loopback address space.
   */
  public static isPrivateIP(ipOrHost: string): boolean {
    const clean = ipOrHost.toLowerCase().trim();
    for (const prefix of this.BLOCKED_IP_PREFIXES) {
      if (clean === prefix || clean.startsWith(prefix)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validates if a given URL is safe and permitted by the allowed domain whitelist.
   */
  public static isSafeUrl(targetUrl: string, allowedDomain?: string): { safe: boolean; reason?: string } {
    try {
      const parsed = new URL(targetUrl);

      // 1. Only allow HTTP and HTTPS protocols
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { safe: false, reason: `Недопустимый протокол: ${parsed.protocol}` };
      }

      const hostname = parsed.hostname.toLowerCase();

      // 2. Block loopback and private network targets
      if (this.isPrivateIP(hostname)) {
        return { safe: false, reason: `Обращение к локальным/приватным адресам (${hostname}) запрещено политикой безопасности SSRF` };
      }

      // 3. Domain Whitelist Verification
      if (allowedDomain) {
        const cleanAllowed = allowedDomain.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
        if (hostname !== cleanAllowed && !hostname.endsWith(`.${cleanAllowed}`)) {
          return { safe: false, reason: `Домен ${hostname} не совпадает с разрешенным доменом источника (${cleanAllowed})` };
        }
      }

      return { safe: true };
    } catch (err: any) {
      return { safe: false, reason: `Некорректный URL: ${err.message}` };
    }
  }
}
