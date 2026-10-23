import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subject, Subscription, merge } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs/operators';
import { PagingResource } from '../../libs/entities/common/paging-resource';
import { Pokemon } from '../../libs/entities/pokemon';
import { PokemonService } from '../../libs/services/pokemon.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit, OnDestroy {
  pokemonList: Pokemon[] = [];
  pokemonSelected?: Pokemon;
  selectedTypes = '';
  selectedMoves = '';
  searchValue: string = '';
  loadingData: boolean = false;
  loadError: boolean = false;
  emptyResult: boolean = false;
  searchTooShort: boolean = false;

  static readonly INITIAL_PAGE: number = 1;
  static readonly PAGE_SIZE: number = 10;
  static readonly MIN_SEARCH_LENGTH: number = 3;
  readonly minSearchLength = PokemonComponent.MIN_SEARCH_LENGTH;

  pagingResource: PagingResource = {
    page_number: PokemonComponent.INITIAL_PAGE,
    page_size: PokemonComponent.PAGE_SIZE
  };

  private readonly searchTerm$ = new Subject<string>();
  private readonly pageLoad$ = new Subject<string>();
  private readonly subscriptions: Subscription[] = [];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    const searchRequests$ = this.searchTerm$.pipe(
      debounceTime(300),
      map(value => value.trim().toLowerCase()),
      distinctUntilChanged()
    );

    this.subscriptions.push(
      merge(
        this.pageLoad$,
        searchRequests$
      ).pipe(
        switchMap(term => {
          if (!term) return this.fetchPage();
          if (term.length < PokemonComponent.MIN_SEARCH_LENGTH) {
            this.resetForShortSearch();
            return EMPTY;
          }
          return this.fetchByName(term);
        })
      ).subscribe()
    );

    this.searchAll();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSearchInput(): void {
    this.searchTerm$.next(this.searchValue);
  }

  clearSearch(): void {
    this.searchValue = '';
    this.searchTerm$.next('');
  }

  searchAll(): void {
    this.pageLoad$.next(this.searchValue.trim().toLowerCase());
  }

  onChangePage(pagingResource: PagingResource): void {
    this.searchValue = '';
    this.pagingResource = pagingResource;
    this.searchAll();
  }

  selectPokemon(pokemon: Pokemon): void {
    this.pokemonSelected = pokemon;
    this.selectedTypes = pokemon.types.map(pokemonType => pokemonType.type.name).join(', ');
    this.selectedMoves = pokemon.moves.map(move => move.move.name).join(', ');
  }

  unselectPokemon(): void {
    this.pokemonSelected = undefined;
    this.selectedTypes = '';
    this.selectedMoves = '';
  }

  trackByPokemonId(_index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

  private beginLoad(): void {
    this.loadingData = true;
    this.loadError = false;
    this.emptyResult = false;
    this.searchTooShort = false;
    this.unselectPokemon();
  }

  private resetForShortSearch(): void {
    this.pokemonList = [];
    this.unselectPokemon();
    this.loadingData = false;
    this.loadError = false;
    this.emptyResult = false;
    this.searchTooShort = true;
    this.pagingResource = {
      page_number: PokemonComponent.INITIAL_PAGE,
      page_size: PokemonComponent.PAGE_SIZE,
      count_rows: 0
    };
  }

  private fetchPage() {
    this.beginLoad();
    return this.pokemonService.getPokemons(
      this.pagingResource.page_number,
      this.pagingResource.page_size
    ).pipe(
      tap(page => {
        this.pokemonList = page.items;
        this.pagingResource = {
          page_number: page.page_number,
          page_size: page.page_size,
          count_rows: page.count_rows
        };
        this.emptyResult = page.items.length === 0;
        this.unselectPokemon();
        this.loadingData = false;
      }),
      catchError(() => {
        this.pokemonList = [];
        this.pagingResource = {
          ...this.pagingResource,
          count_rows: 0
        };
        this.loadError = true;
        this.unselectPokemon();
        this.loadingData = false;
        return EMPTY;
      })
    );
  }

  private fetchByName(term: string) {
    this.beginLoad();
    return this.pokemonService.getPokemonByName(term).pipe(
      tap(data => {
        this.pokemonList = data ? [data] : [];
        this.emptyResult = !data;
        this.pagingResource = {
          page_number: PokemonComponent.INITIAL_PAGE,
          page_size: PokemonComponent.PAGE_SIZE,
          count_rows: this.pokemonList.length
        };
        if (!data) {
          this.unselectPokemon();
        }
      }),
      catchError(() => {
        this.pokemonList = [];
        this.emptyResult = false;
        this.loadError = true;
        this.unselectPokemon();
        return EMPTY;
      }),
      finalize(() => this.loadingData = false)
    );
  }
}
