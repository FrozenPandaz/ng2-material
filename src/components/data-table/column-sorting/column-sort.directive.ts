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
} from "angular2/core";
// import {isPresent} from "angular2/src/facade/lang";
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Subscription} from 'rxjs/Subscription';
import {
  DataSortDirection,
  SortingColumn
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
 *    <td md-data-sort-column="1">Cheese</td>
 *    <td md-data-sort-column="2">Crackers</td>
 *    <td md-data-sort-column="3">Wine</td>
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
  sortingColumn: SortingColumn;
  sortingSubscription: Subscription;

  /** Unique column identifier */
  @Input() mdDataSortColumn: number;

  /** Applies 'sortable' CSS class to host */
  @HostBinding('class.sortable') get sortable() { return true; }

  /** Conditionally applies 'sort-ascending' CSS class to host */
  @HostBinding('class.sort-ascending') get sortingAscending() {
    return this.sortingColumn.column == this.mdDataSortColumn && this.sortingColumn.direction === DataSortDirection.ASCEND
  }

  /** Conditionally applies 'sorted-descending' CSS class to host */
  @HostBinding('class.sorted-descending') get sortingDescending() {
    return this.sortingColumn.column == this.mdDataSortColumn && this.sortingColumn.direction === DataSortDirection.DESCEND;
  }

  /**
   * Click handler on host element to tell service to sort by this column
   * @param clickEvent - the clickEvent.
   */
  @HostListener('click', ['$event']) sortBy(clickEvent: Event) {
    this.sortingService.changeSorting(this.mdDataSortColumn, this.sortingColumn);
  }

  // @Output() sort: EventEmitter<Sorting> = new EventEmitter(false);

  constructor(private sortingService: MdDataColumnSortingService) { }

  ngOnInit() {
    this.sortingSubscription = this.sortingService.sortingColumn.subscribe(
        (sorting: SortingColumn) => this.sortingColumn = sorting);
  }

  //TODO remove if not needed.
  onSortChange(sorting: SortingColumn) {
    // Do I need a callback such as this in the above subscription,
    // or can I update the property and let change detection do it's thing?
    // Is there an 'async property' akin to async pipe in a template?
    this.sortingColumn = sorting;
  }


  ngOnDestroy() {
    this.sortingSubscription.unsubscribe();
  }

}
