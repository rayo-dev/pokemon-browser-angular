import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagingResource } from '../../../libs/entities/common/paging-resource';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() resource: PagingResource = { page_number: 0, page_size: 0, count_rows: 0 };
  @Input() disabled: boolean = false;

  @Output() changePage = new EventEmitter<PagingResource>();

  get totalPages(): number {
    const cantidadRegistros = this.resource.count_rows ?? 0;
    const pageSize = this.resource.page_size ?? 0;
    if (cantidadRegistros <= 0 || pageSize <= 0) {
      return 0;
    }
    return Math.ceil(cantidadRegistros / pageSize);
  }

  get currentPage(): number {
    return this.resource.page_number ?? 0;
  }

  get canGoBack(): boolean {
    return !this.disabled && this.totalPages > 0 && this.currentPage > 1;
  }

  get canGoNext(): boolean {
    return !this.disabled && this.totalPages > 0 && this.currentPage < this.totalPages;
  }

  back(): void {
    if (!this.canGoBack) {
      return;
    }
    this.emitPage(this.currentPage - 1);
  }

  next(): void {
    if (!this.canGoNext) {
      return;
    }
    this.emitPage(this.currentPage + 1);
  }

  private emitPage(pageNumber: number): void {
    this.changePage.emit({
      ...this.resource,
      page_number: pageNumber
    });
  }
}
