// src/app/api/stock/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const MAX_QTY_PER_ORDER = 3;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product = searchParams.get('product');

  if (!product) {
    return NextResponse.json({ error: 'Missing product name' }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase env variables are missing');
    return NextResponse.json(
      { error: 'Stock service is not configured.' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: variants, error } = await supabase
    .from('product_variants')
    .select('color, size, stock, products!inner(name)')
    .eq('products.name', product);

  if (error) {
    console.error('Could not load stock:', error);
    return NextResponse.json({ error: 'Could not load stock' }, { status: 500 });
  }

  // Same response shape as before (color, size, stock) so ProductPage.tsx
  // keeps working untouched. The number is capped at the per-order limit,
  // so real inventory (e.g. 17) is never revealed: 0 = sold out,
  // 1-2 = "Only N left", 3 = "Limit of 3 per order".
  const stock = (variants ?? []).map((v: any) => ({
    color: v.color ?? '',
    size: v.size,
    stock: Math.min(Math.max(Number(v.stock) || 0, 0), MAX_QTY_PER_ORDER),
  }));

  return NextResponse.json({ stock });
}