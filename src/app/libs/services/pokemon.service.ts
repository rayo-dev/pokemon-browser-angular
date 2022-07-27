import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, of, switchMap } from 'rxjs';
import { ResourceList } from '../entities/common/resource-list';
import { Pokemon, Sprites } from '../entities/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  constructor(private http: HttpClient) {}

  getPokemons(pageNumber: number = 1, pageSize: number = 15) : Observable<Pokemon[]> {
    let offset = (pageNumber * pageSize) - pageSize;
    return this.http.get<ResourceList>(
      `https://pokeapi.co/api/v2/pokemon/?limit=${pageSize}&offset=${offset}`)
      .pipe(
        switchMap(res => {
          const observables$ = res.results
            .map(pokemon => this.getPokemonByName(pokemon.name));
            
            return forkJoin(observables$);                        
        }),
        catchError(this.handleError<Pokemon[]>('getPokemons', undefined))
    );
  }

  getPokemonByName(name : string) : Observable<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .pipe(
      catchError(this.handleError<Pokemon>('getPokemonByName', undefined))
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
