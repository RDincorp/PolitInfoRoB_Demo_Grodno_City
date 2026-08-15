import * as cheerio from 'cheerio';
import { normalizeFullName, normalizePhoneNumber, cleanText, slugify } from '../normalizers';

export interface ExtractedDeputy {
  districtNumber: number;
  districtName: string;
  deputyName: string;
  position?: string | null;
  receptionSchedule?: string | null;
  receptionAddress?: string | null;
  receptionPhone?: string | null;
  officialUrl?: string | null;
}

export class HtmlSourceAdapter {
  /**
   * Generic HTML parser for Council / Deputy pages.
   * Extracts deputy cards, tables, reception schedules and districts.
   */
  public static parseDeputiesPage(html: string): ExtractedDeputy[] {
    const $ = cheerio.load(html);
    const deputies: ExtractedDeputy[] = [];

    // 1. Table structure extraction (common on .gov.by sites)
    $('table tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const text0 = $(cells[0]).text().trim();
        const text1 = $(cells[1]).text().trim();
        const text2 = cells.length > 2 ? $(cells[2]).text().trim() : '';
        const text3 = cells.length > 3 ? $(cells[3]).text().trim() : '';

        const districtMatch = text0.match(/№?\s*(\d+)/);
        if (districtMatch && text1.length > 5) {
          const number = parseInt(districtMatch[1], 10);
          const normName = normalizeFullName(text1);

          deputies.push({
            districtNumber: number,
            districtName: cleanText(text0) || `Округ №${number}`,
            deputyName: normName.fullName,
            position: cleanText(text2),
            receptionSchedule: cleanText(text3),
            receptionPhone: normalizePhoneNumber(text3),
          });
        }
      }
    });

    // 2. Card/Div structure extraction (if tables aren't used)
    if (deputies.length === 0) {
      $('.deputy-card, .person-item, .council-member').each((_, card) => {
        const title = $(card).find('.name, h3, h4, .title').first().text();
        const districtText = $(card).find('.district, .okrug').text();
        const scheduleText = $(card).find('.schedule, .reception, .priem').text();
        const phoneText = $(card).find('.phone, .tel').text();

        const districtMatch = districtText.match(/№?\s*(\d+)/);
        const number = districtMatch ? parseInt(districtMatch[1], 10) : deputies.length + 1;

        if (title) {
          const norm = normalizeFullName(title);
          deputies.push({
            districtNumber: number,
            districtName: cleanText(districtText) || `Округ №${number}`,
            deputyName: norm.fullName,
            receptionSchedule: cleanText(scheduleText),
            receptionPhone: normalizePhoneNumber(phoneText),
          });
        }
      });
    }

    return deputies;
  }
}
