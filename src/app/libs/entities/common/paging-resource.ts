import { Pokemon } from '../pokemon';

export interface PagingResource {
    page_number?: number;
    page_size?: number;
    count_rows?: number;
}

export interface PokemonPage {
    items: Pokemon[];
    page_number: number;
    page_size: number;
    count_rows: number;
}
