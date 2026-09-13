'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import ProductPage from '../ProductPage';
import { products } from '../shop-data';

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const product = products.find(
    (product) => product.href === `/shop/${slug}`
  );

  if (!product) {
    notFound();
  }

  return <ProductPage data={product} />;
}