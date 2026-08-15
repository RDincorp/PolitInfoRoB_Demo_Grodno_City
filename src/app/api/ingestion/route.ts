import { NextRequest, NextResponse } from 'next/server';
import { IngestionPipeline } from '@/lib/ingestion/pipeline';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ status: 'Ingestion API ready' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceId, rawContent, fetchLive } = body;

    if (!sourceId) {
      return NextResponse.json({ error: 'sourceId обязателен' }, { status: 400 });
    }

    const result = await IngestionPipeline.processSource({
      sourceId,
      rawContent,
      fetchLive: Boolean(fetchLive),
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
