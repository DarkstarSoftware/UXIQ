import { NextResponse } from 'next/server';

import { normalizeAuditUrl, slugFromUrl } from '@/lib/audit-engine';

export const runtime = 'nodejs';

async function readUrl(request: Request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => null);
    return typeof body?.url === 'string' ? body.url : '';
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData().catch(() => null);
    const url = formData?.get('url');
    return typeof url === 'string' ? url : '';
  }

  const formData = await request.formData().catch(() => null);
  const url = formData?.get('url');
  return typeof url === 'string' ? url : '';
}

export async function POST(request: Request) {
  const rawUrl = await readUrl(request);
  const url = normalizeAuditUrl(rawUrl);

  if (!url) {
    return NextResponse.json({ error: 'A website URL is required.' }, { status: 400 });
  }

  const reportId = slugFromUrl(url);
  const redirectTo = `/reports/${reportId}?url=${encodeURIComponent(url)}`;

  const accept = request.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  return NextResponse.json({
    ok: true,
    reportId,
    url,
    redirectTo,
  });
}
