import { NamedApiResource } from "./common/named-api-resource";
import { PagingResource } from "./common/paging-resource";

export interface Pokemon extends NamedApiResource {
    base_experience: number;
    height: number;
    id: number;
    is_default: boolean;
    moves: Move[];
    name: string;
    order: number;
    past_types: any[];
    sprites?: Sprites;
    types: PokemonType[];
    weight: number;
}

export interface PokemonPaginable extends Pokemon, PagingResource {
}

export interface Move {
    move: NamedApiResource;
}

export interface Sprites {
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
}

export interface PokemonType {
    slot: number;
    type: NamedApiResource;
}
