import { NamedApiResource } from './common/named-api-resource';

export interface Pokemon {
    base_experience: number;
    height: number;
    id: number;
    is_default: boolean;
    moves: Move[];
    name: string;
    order: number;
    past_types: unknown[];
    sprites: Sprites | null;
    types: PokemonType[];
    weight: number;
}

export interface Move {
    move: NamedApiResource;
}

export interface Sprites {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface PokemonType {
    slot: number;
    type: NamedApiResource;
}
