import { Catalog } from '@/components/catalog';
import type { Query } from '@/lib/filters';
export const metadata = { title: 'Originais brasileiros' };
export default async function Page({ searchParams }: { searchParams: Promise<Query> }) {
  return <Catalog category="original" query={await searchParams} />;
}
