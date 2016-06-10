import {
  Directive,
  Output,
  Input,
  EventEmitter,
  Inject,
  Optional,
  forwardRef,
  HostBinding,
  HostListener,
  ElementRef,
  AfterContentInit,
  Injectable,
  OnDestroy,
  OnInit
} from "@angular/core";
import {
  beforeEach,
  describe,
  expect,
  inject,
  it,
  async
} from "@angular/core/testing";
import {ComponentFixture, TestComponentBuilder} from "@angular/compiler/testing";
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Subscription} from 'rxjs/Subscription';
import {
  SortDirection,
  IColumnSortingModel
} from './column-sort';
import {MdDataColumnSortingService} from './column-sort.service';
export * from './column-sort.service';


/**
 * @name mdDataSortColumnDirective
 *
 * @description
 * A directive that styles its host with sorting class names, and calls
 * {@link MdDataColumnSortingService.changeSorting} to the service instance in its
 * execution context.
 *
 * @usage
 *
 * <hljs lang="html">
 *  <tr>
 *    <th md-data-sort-column="1">Cheese</th>
 *    <th md-data-sort-column="2">Crackers</th>
 *    <th md-data-sort-column="3">Wine</th>
 *  <tr>
 * </hljs>
 */
@Directive({
  selector: '[md-data-sort-column]'
})
export class MdDataSortColumnDirective implements OnDestroy, OnInit {

  /**
   * Sorting value of the group of columns.
   * The group is defined by the injection scope of the {@link MdDataColumnSortingService} in the parent component.
   */
  sortingColumn: IColumnSortingModel;
  sortingSubscription: Subscription;

  /** Unique column identifier */
  @Input('md-data-sort-column') mdDataSortColumn: string;

  /** Applies 'sortable' CSS class to host */
  @HostBinding('class.sortable') get sortable() { return true; }

  /** Conditionally applies 'sort-ascending' CSS class to host */
  @HostBinding('class.sort-ascending') get sortingAscending() {
    return this.isCurrentColumn() && this.sortingColumn.direction === SortDirection.ASCEND;
  }

  /** Conditionally applies 'sorted-descending' CSS class to host */
  @HostBinding('class.sorted-descending') get sortingDescending() {
    return this.isCurrentColumn() && this.sortingColumn.direction === SortDirection.DESCEND;
  }

  /**
   * Click handler on host element to tell service to sort by this column
   * @param clickEvent - the clickEvent.
   */
  @HostListener('click', ['$event']) sortBy(clickEvent: Event) {
    this.sortingService.changeSorting(this.mdDataSortColumn, this.sortingColumn);
  }

  // @Output() sort: EventEmitter<Sorting> = new EventEmitter(false); //need?

  constructor(private sortingService: MdDataColumnSortingService) {
    this.sortingSubscription = this.sortingService.sortingColumn.subscribe(
        (sorting: IColumnSortingModel) => this.sortingColumn = sorting);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.sortingSubscription.unsubscribe();
  }

  private isCurrentColumn():boolean {
    return this.sortingColumn && this.sortingColumn.column == this.mdDataSortColumn
  }

}
