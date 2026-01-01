import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('logo_and_name')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching logo:', error);
        return NextResponse.json({ logo_url: null, company_name: null }, { status: 200 });
    }

    return NextResponse.json(data);
}
