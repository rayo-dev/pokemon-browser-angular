import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() initialPage: number = 1;
  @Input() disabled: boolean = false;
  @Output() changePage = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  changePageOutput() {
    this.changePage.emit(this.initialPage);
  }

  back(){
    if (this.initialPage > 1) {
      this.initialPage--;
      this.changePageOutput();
    }
  }

  next(){
    if (this.initialPage > 0) {
      this.initialPage++;
      this.changePageOutput();
    }
  }
}
