import { Catalog } from '@/components/catalog';
import type { Query } from '@/lib/filter-query';
export const metadata = { title: 'Originais brasileiros' };
export default async function Page({ searchParams }: { searchParams: Promise<Query> }) {
  return <Catalog category="original" query={await searchParams} />;
}
