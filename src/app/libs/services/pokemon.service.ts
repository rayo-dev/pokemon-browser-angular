import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, from, map, Observable, of, mergeMap, switchMap, toArray, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PokemonPage } from '../entities/common/paging-resource';
import { ResourceList } from '../entities/common/resource-list';
import { Pokemon } from '../entities/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getPokemons(pageNumber: number = 1, pageSize: number = 16): Observable<PokemonPage> {
    const offset = (pageNumber * pageSize) - pageSize;
    return this.http.get<ResourceList>(
      `${this.apiUrl}/pokemon/?limit=${pageSize}&offset=${offset}`)
      .pipe(
        switchMap(res => {
          if (!res.results?.length) {
            return of({
              items: [],
              page_number: pageNumber,
              page_size: pageSize,
              count_rows: res.count
            });
          }

          return from(res.results).pipe(
            mergeMap((resource, index) => this.http.get<Pokemon>(resource.url).pipe(
              map(pokemon => ({ pokemon, index }))
            ), 4),
            toArray(),
            map(results => ({
              items: results.sort((a, b) => a.index - b.index).map(result => result.pokemon),
              page_number: pageNumber,
              page_size: pageSize,
              count_rows: res.count
            }))
          );
        })
      );
  }

  public getPokemonByName(name: string): Observable<Pokemon | null> {
    return this.http.get<Pokemon>(`${this.apiUrl}/pokemon/${name}`)
      .pipe(
        catchError((error: HttpErrorResponse) => error.status === 404
          ? of(null)
          : throwError(() => error))
      );
  }
}
