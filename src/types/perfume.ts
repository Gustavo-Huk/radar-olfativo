export type Category = 'original' | 'inspired';
export type Occasion = 'dia-a-dia' | 'escritorio' | 'academia' | 'encontros';
export type Climate = 'calor' | 'ameno' | 'frio';

export interface Source {
  id: string;
  label: string;
  url?: string;
  kind: 'official' | 'editorial' | 'community' | 'demo';
  checkedAt: string;
}

/** A ausência do campo significa desconhecido, nunca falso ou zero. */
export interface Claim<T> {
  value: T;
  sourceIds: string[];
  nature: 'factual' | 'editorial' | 'community' | 'demonstration';
}

export interface Brand { id: string; name: string; country: string }
export interface Note { id: string; name: string }
export interface Accord { id: string; name: string }
export interface Inspiration { name: string; brand: string; relationship: 'declared' | 'documented' | 'demo' }
export interface ExternalRating {
  provider: string;
  score: number;
  scale: number;
  votes: number;
  sourceId: string;
  redistribution: 'authorized';
}

export interface Perfume {
  id: string;
  slug: string;
  name: Claim<string>;
  brandId: string;
  category: Claim<Category>;
  description?: Claim<string>;
  family?: Claim<string>;
  accords?: Claim<string[]>;
  notes?: {
    top?: Claim<string[]>;
    heart?: Claim<string[]>;
    base?: Claim<string[]>;
    /** Só true quando a lista divulgada está integralmente cadastrada. */
    complete: boolean;
  };
  occasions?: Claim<Occasion[]>;
  climates?: Claim<Climate[]>;
  inspiration?: Claim<Inspiration>;
  price?: Claim<{ amount: number; currency: 'BRL'; volumeMl: number; observedAt: string }>;
  ratings: ExternalRating[];
  officialUrl?: string;
  dataset: 'demo' | 'verified';
  /** Cor da ilustração abstrata, sem implicação olfativa. */
  color: string;
}

export interface UserCollection {
  version: 1;
  perfumeIds: string[];
  favoriteIds: string[];
}
