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

  const data = products.find(
    (product) => product.slug === slug
  );

  if (!data) {
    notFound();
  }

  return <ProductPage data={data} />;
}