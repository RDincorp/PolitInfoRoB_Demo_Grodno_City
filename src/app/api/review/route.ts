import { NextRequest, NextResponse } from 'next/server';
import { DBRepository } from '@/lib/db';

export const dynamic = 'force-static';

export async function GET() {
  const queue = DBRepository.getReviewQueue('pending');
  return NextResponse.json({ queue });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, reviewerNotes, reviewedBy } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'id и action обязательны' }, { status: 400 });
    }

    if (action === 'approve') {
      const success = DBRepository.approveReviewItem(id, reviewedBy || 'admin');
      if (!success) {
        return NextResponse.json({ error: 'Элемент не найден в очереди' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Изменения утверждены и опубликованы' });
    }

    if (action === 'reject') {
      const success = DBRepository.rejectReviewItem(id, reviewerNotes || 'Отклонено', reviewedBy || 'admin');
      if (!success) {
        return NextResponse.json({ error: 'Элемент не найден в очереди' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Изменения отклонены' });
    }

    return NextResponse.json({ error: 'Неизвестное действие' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
