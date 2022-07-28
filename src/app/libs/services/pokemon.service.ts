import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ResourceList } from '../entities/common/resource-list';
import { Pokemon, PokemonPaginable } from '../entities/pokemon';
import { PagingResource } from '../entities/common/paging-resource';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  constructor(private http: HttpClient) { }

  public getPokemons(pageNumber: number = 1, pageSize: number = 16): Observable<PokemonPaginable[]> {
    let offset = (pageNumber * pageSize) - pageSize;
    return this.http.get<ResourceList>(
      `https://pokeapi.co/api/v2/pokemon/?limit=${pageSize}&offset=${offset}`)
      .pipe(
        switchMap(res => {
          const resource = { count_rows: res.count, page_number: pageNumber, page_size: pageSize };
          const observables$ = res.results
            .map(pokemon => this.getPokemonByNameWithPageResources(pokemon.name, resource))
          return forkJoin(observables$);
        }),
        catchError(this.handleError<PokemonPaginable[]>('getPokemons', undefined))
      );
  }


  public getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .pipe(
        catchError(this.handleError<Pokemon>('getPokemonByName', undefined))
      );
  }

  private getPokemonByNameWithPageResources(name: string, resource: PagingResource): Observable<PokemonPaginable> {
    return this.getPokemonByName(name)
      .pipe(
        map((pokemon: Pokemon) => {
          let poke = pokemon as PokemonPaginable; // or Object.assign({}, item);
          poke.page_number = resource.page_number;
          poke.page_size = resource.page_size;
          poke.count_rows = resource.count_rows;
          return poke;
        }),
        catchError(this.handleError<PokemonPaginable>('getPokemonByNameWithPageResources', undefined))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
