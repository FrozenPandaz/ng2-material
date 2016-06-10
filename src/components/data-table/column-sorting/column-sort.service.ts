import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {
  SortDirection,
  IColumnSortingModel
} from './column-sort';

/**
 * Service handling column sort change events as an observable stream.
 */
@Injectable()
export class MdDataColumnSortingService {
  public sortingColumn:Subject<IColumnSortingModel>

  constructor() {
    this.sortingColumn = new Subject();
  }

  /**
   * Programatically set the column / direction of sorting
   * @param sorting - column & direction to sort by.
   */
  public setSorting(sorting: IColumnSortingModel) {
    this.sortingColumn.next(sorting);
  }

  /**
   * Change sorting based on user action on on a particular column heading.
   * Inputting the currently sorted-by column will invert the sort direction.
   * @param id - identifier of column to sort by
   * @param sorting - current sorting information
   */
  public changeSorting(fromId:string, sorting:IColumnSortingModel) {
    let newSort: IColumnSortingModel = {
      column: fromId,
      direction: SortDirection.ASCEND
    };

    if (sorting.column === fromId) {
      // invert currently selected column
      newSort.direction = sorting.direction === SortDirection.DESCEND ?
          SortDirection.ASCEND : SortDirection.DESCEND;
    } else {
      //sort by new column
      newSort.direction = SortDirection.ASCEND;
    }

    this.setSorting(newSort);
  }
}
