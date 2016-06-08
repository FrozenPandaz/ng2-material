import {Directive, Output, Input, EventEmitter, Inject, Optional, forwardRef, ElementRef, AfterContentInit, Injectable} from "angular2/core";
// import {isPresent} from "angular2/src/facade/lang";
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
// import {MdCheckbox} from "../checkbox/checkbox";
// import {MdDataTable} from './data_table';

export enum ColumnSort {
  ASCEND, DESCEND
}

export interface Sorting {
  column: number;
  direction: ColumnSort;
}

export interface DataSortEvent {
  column: number;
  direction: ColumnSort;
  event: Event;
}

@Directive({
  selector: '[md-data-sort-column]',
  host: {
    '[class.sortable]': 'true',
    '[class.sorted-ascending]': 'sorting.column == index && sorting.direction === columnSort.ASCEND',
    '[class.sorted-descending]': 'sorting.column == index && sorting.direction === columnSort.DESCEND',
    '(click)': 'sortBy($event)'
  }
})
export class MdDataSortColumn {
  @Input() sorting: Sorting;
  @Output() sort: EventEmitter<DataSortEvent> = new EventEmitter(false);
  index: number = 0;
  columnSort: typeof ColumnSort = ColumnSort;

  constructor(private _element: ElementRef) {
    // this.index = this._element.nativeElement. //lookup how to get my index
  }

  sortBy(clickEvent: Event) {
    if (this.sorting.column === this.index) {
      this.sorting.direction = this.sorting.direction === ColumnSort.DESCEND ?
          ColumnSort.ASCEND : ColumnSort.DESCEND;
    } else {
      this.sorting.direction = ColumnSort.ASCEND;
    }

    this.sort.emit({
      column: this.index,
      direction: this.sorting.direction,
      event: clickEvent
    });
  }
}

@Injectable
export class ColumnSortingService {

}
