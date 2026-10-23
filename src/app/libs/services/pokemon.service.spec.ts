import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PokemonService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should return an empty page without calling detail endpoints', () => {
    service.getPokemons(1, 10).subscribe(page => {
      expect(page.items).toEqual([]);
      expect(page.count_rows).toBe(0);
      expect(page.page_number).toBe(1);
    });

    const req = http.expectOne(`${environment.apiUrl}/pokemon/?limit=10&offset=0`);
    req.flush({ count: 0, next: '', results: [] });
  });

  it('should hydrate list results into a page object', () => {
    service.getPokemons(2, 10).subscribe(page => {
      expect(page.items.length).toBe(1);
      expect(page.items[0].name).toBe('ivysaur');
      expect(page.page_number).toBe(2);
      expect(page.count_rows).toBe(1118);
    });

    const listReq = http.expectOne(`${environment.apiUrl}/pokemon/?limit=10&offset=10`);
    listReq.flush({
      count: 1118,
      next: '',
      results: [{ name: 'ivysaur', url: `${environment.apiUrl}/pokemon/2/` }]
    });

    const detailReq = http.expectOne(`${environment.apiUrl}/pokemon/2/`);
    detailReq.flush({
      id: 2,
      name: 'ivysaur',
      url: `${environment.apiUrl}/pokemon/2/`,
      base_experience: 142,
      height: 10,
      is_default: true,
      moves: [],
      order: 2,
      past_types: [],
      types: [],
      weight: 130
    });
  });

  it('should return null when a pokemon is not found', () => {
    service.getPokemonByName('missing').subscribe(result => {
      expect(result).toBeNull();
    });

    const req = http.expectOne(`${environment.apiUrl}/pokemon/missing`);
    req.flush({ detail: 'Not found' }, { status: 404, statusText: 'Not Found' });
  });
});
