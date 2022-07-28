import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PagingResource } from '../..//libs/entities/common/paging-resource';
import { Move, Pokemon, PokemonType } from '../../libs/entities/pokemon';
import { PokemonService } from '../../libs/services/pokemon.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css'],
  providers: [PokemonService]
})
export class PokemonComponent implements OnInit, OnDestroy {
  pokemonList?: Pokemon[];
  pokemonSelected?: Pokemon;
  searchValue: string = '';

  loadingData: boolean = false;

  static readonly INITIAL_PAGE: number = 1;
  static readonly PAGE_SIZE: number = 10;

  pagingResource: PagingResource = { page_number: PokemonComponent.INITIAL_PAGE, page_size: PokemonComponent.PAGE_SIZE };

  private subscriptions: Subscription[] = [];

  constructor(private pokemonservice: PokemonService) { }

  ngOnInit(): void {
    this.searchAll();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onKeyUpSearch = (event: any) => {
    let seachValue = this.searchValue?.toLowerCase() ?? '';
    if (seachValue.length > 2) {
      this.loadingData = true;
      this.subscriptions.push(this.pokemonservice.getPokemonByName(seachValue).subscribe(
        data => {
          this.pokemonList = [];
          if (data) {
            this.pokemonList.push(data);
            this.pagingResource = { page_number: PokemonComponent.INITIAL_PAGE, page_size: PokemonComponent.PAGE_SIZE, count_rows: this.pokemonList.length };
          } else {
            this.pagingResource = { page_number: 0, page_size: 0, count_rows: 0 };
            this.unselectPokemon();
          }

          this.loadingData = false;
        })
      );
    }
  }

  searchAll() {
    this.loadingData = true;
    this.subscriptions.push(this.pokemonservice.getPokemons(this.pagingResource?.page_number, this.pagingResource?.page_size).subscribe(
      data => {
        this.pokemonList = data as Array<Pokemon>;
        this.pagingResource.count_rows = data[0].count_rows;
        this.unselectPokemon();

        this.loadingData = false;
      })
    );
  }

  onChangePage(padingResource: PagingResource) {
    this.pagingResource = padingResource;
    this.searchAll();
  }

  selectPokemon = (pokemon: Pokemon) => {
    this.pokemonSelected = pokemon;
  }

  getTypes(types: PokemonType[]): string {
    return types.map(m => m.type.name).join(' ');
  }

  getMoves(moves: Move[]): string {
    return moves.map(m => m.move.name).join(' ');
  }

  unselectPokemon = () => {
    this.pokemonSelected = undefined;
  }
}
