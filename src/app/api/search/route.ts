import { NextResponse } from 'next/server';
import { DBRepository } from '@/lib/db';

export const dynamic = 'force-static';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url || 'http://localhost/api/search');
    const q = url.searchParams.get('q') || '';
    const type = url.searchParams.get('type') || undefined;

    if (!q.trim()) {
      return NextResponse.json({ results: [] });
    }

    const results = DBRepository.search(q, type);
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ results: [] });
  }
}
