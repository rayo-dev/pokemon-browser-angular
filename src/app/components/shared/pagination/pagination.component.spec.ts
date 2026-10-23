import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should use ceil for the last partial page', () => {
    component.resource = { page_number: 1, page_size: 10, count_rows: 25 };
    fixture.detectChanges();
    expect(component.totalPages).toBe(3);
  });

  it('should not go past the last page', () => {
    component.resource = { page_number: 3, page_size: 10, count_rows: 25 };
    fixture.detectChanges();

    const emitted: number[] = [];
    component.changePage.subscribe(resource => emitted.push(resource.page_number ?? 0));

    component.next();
    expect(emitted).toEqual([]);
    expect(component.resource.page_number).toBe(3);
  });

  it('should emit the previous page without mutating the input', () => {
    component.resource = { page_number: 2, page_size: 10, count_rows: 25 };
    fixture.detectChanges();

    let emittedPage: number | undefined;
    component.changePage.subscribe(resource => emittedPage = resource.page_number);

    component.back();
    expect(emittedPage).toBe(1);
    expect(component.resource.page_number).toBe(2);
  });
});
