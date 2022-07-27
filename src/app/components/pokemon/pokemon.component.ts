import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  initialPage: number = 1;

  pokemonGetAllSuscription: Subscription | undefined;
  pokemonSuscription: Subscription | undefined;
  pokemonSpriteSuscription: Subscription | undefined;

  constructor(private pokemonservice: PokemonService) { }

  ngOnInit(): void {
    this.searchAll();
  }

  ngOnDestroy(): void {
    this.pokemonGetAllSuscription?.unsubscribe();
    this.pokemonSuscription?.unsubscribe();
    this.pokemonSpriteSuscription?.unsubscribe();
  }

  onKeyUpSearch = (event: any) => {
    let seachValue = this.searchValue?.toLowerCase() ?? '';
    if (seachValue.length > 2) {
      this.loadingData = true;
      if (!this.pokemonSuscription?.closed) {
        this.pokemonSuscription?.unsubscribe();
      }
      this.pokemonSuscription =
        this.pokemonservice.getPokemonByName(seachValue).subscribe(
          data => {
            if (data) {
              this.pokemonList = [];
              this.pokemonList.push(data);
            }
            this.loadingData = false;
          });
    }
  }

  searchAll() {
    this.searchValue = '';
    this.loadingData = true;
    this.pokemonGetAllSuscription =
      this.pokemonservice.getPokemons(this.initialPage).subscribe(
        data => {
          this.pokemonList = data;
          this.loadingData = false;
        });
  }

  onChangePage(pageNumber: number) {
    this.unselectPokemon();

    this.loadingData = true;
    if (!this.pokemonGetAllSuscription?.closed) {
      this.pokemonGetAllSuscription?.unsubscribe();
    }

    this.pokemonGetAllSuscription =
      this.pokemonservice.getPokemons(pageNumber).subscribe(
        data => {
          this.pokemonList = data;
          this.loadingData = false;
        });
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
