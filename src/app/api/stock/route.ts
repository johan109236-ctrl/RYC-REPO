import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

  const stock = (variants ?? []).map((v: any) => ({
    color: v.color ?? '',
    size: v.size,
    stock: v.stock,
  }));

  return NextResponse.json({ stock });
}