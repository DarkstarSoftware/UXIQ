import { NextResponse } from 'next/server';

import { normalizePlan } from '@/lib/plan';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must sign in.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (normalizePlan(profile?.plan) !== 'pro') {
      return NextResponse.json(
        { error: 'Client management is available on Pro.' },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => ({}));

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const website = typeof body.website === 'string' ? body.website.trim() : '';
    const contactEmail = typeof body.contactEmail === 'string' ? body.contactEmail.trim() : '';
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Client name is required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        name,
        website: website || null,
        contact_email: contactEmail || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ client: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create client.' },
      { status: 500 },
    );
  }
}
