import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { PagingResource } from '../../../libs/entities/common/paging-resource';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() resource: PagingResource = { page_number: 0, page_size: 0, count_rows: 0 };
  @Input() disabled: boolean = false;

  @Output() changePage = new EventEmitter<PagingResource>();

  constructor() { }

  ngOnInit() {
  }

  changePageOutput() {
    this.changePage.emit(this.resource);
  }

  cantidadPaginas() {
    const cantidadRegistros = this.resource.count_rows ?? 0;
    const pageSize = this.resource.page_size ?? 0;
    return (cantidadRegistros > 0) ? Math.round(cantidadRegistros / pageSize) : 0;
  }

  back() {
    this.resource.page_number = this.resource.page_number ?? 0;
      if (this.resource.page_number > 1) {
        this.resource.page_number--;
        this.changePageOutput();
      }
  }

  next() {
    this.resource.page_number = this.resource.page_number ?? 0;
    if (this.resource.page_number > 0) {
      this.resource.page_number++;
      this.changePageOutput();
    }
  }
}
