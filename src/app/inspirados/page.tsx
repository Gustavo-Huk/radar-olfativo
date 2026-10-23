import { Catalog } from '@/components/catalog';
import type { Query } from '@/lib/filters';
export const metadata = { title: 'Contratipos brasileiros' };
export default async function Page({ searchParams }: { searchParams: Promise<Query> }) {
  return <Catalog category="inspired" query={await searchParams} />;
}
