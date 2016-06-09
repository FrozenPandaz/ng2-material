import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {
  DataSortDirection,
  SortingColumn
} from './column-sort';

/**
 * Service handling column sort change events as an observable stream.
 */
@Injectable()
export class MdDataColumnSortingService {
  public sortingColumn:Subject<SortingColumn>

  constructor() {
    this.sortingColumn = new Subject();
  }

  /**
   * Programatically set the column / direction of sorting
   * @param sorting - column & direction to sort by.
   */
  public setSorting(sorting: SortingColumn) {
    this.sortingColumn.next(sorting);
  }

  /**
   * Change sorting based on user action on on a particular column heading.
   * Inputting the currently sorted-by column will invert the sort direction.
   * @param id - identifier of column to sort by
   * @param sorting - current sorting information
   */
  public changeSorting(fromId:number, sorting:SortingColumn) {

    let newSort: SortingColumn = {
      column: fromId,
      direction: DataSortDirection.ASCEND
    };

    if (sorting.column === fromId) {
      // invert currently selected column
      sorting.direction = sorting.direction === DataSortDirection.DESCEND ?
          DataSortDirection.ASCEND : DataSortDirection.DESCEND;
    } else {
      //sort by new column
      sorting.direction = DataSortDirection.ASCEND;
    }

    this.setSorting(newSort);
  }
}
