import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  inject,
  injectAsync,
  it,
  async
} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from "@angular/compiler/testing";
import {Component, DebugElement, ViewChildren, QueryList} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {By} from "@angular/platform-browser";
import {
  MdDataColumnSortingService,
  MdDataSortColumnDirective,
  DataSortDirection,
  SortingColumn
} from './index';

export function main() {

  @Component({
    selector: 'test-cmp',
    providers: [MdDataColumnSortingService],
    directives: [CORE_DIRECTIVES, MdDataSortColumnDirective],
    template: `<tr>
      <td md-data-sort-column="1">Wine</td>
      <td md-data-sort-column="2">Cheese</td>
      <td md-data-sort-column="3">Crackers</td>
    </tr>`
  })
  class TestComponent {
    defaultModel: SortingColumn = {
      column: 1,
      direction: DataSortDirection.DESCEND
    };

    /**
     * Constructor.
     * @param sortingService - reference to the service for this area.
     */
    constructor(public sortingService: MdDataColumnSortingService) {
      sortingService.setSorting(this.defaultModel);
    }

    @ViewChildren(MdDataSortColumnDirective) columns: QueryList<MdDataSortColumnDirective>;

  }

  describe('MdDataSortColumnDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let service: MdDataColumnSortingService;
    let testCmp: TestComponent;

    // service not mocked because it is tightly coupled to the functionality in this case.
    beforeEachProviders(() => [
      TestComponentBuilder
    ]);

    beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
      return tcb
        .createAsync(TestComponent)
        .then(f => {
          fixture = f;
          testCmp = fixture.componentInstance;
        })
        .catch(console.error.bind(console));
    }));

    //inherit service from TestComponent context.
/*    beforeEach(inject([MdDataColumnSortingService], (serv) => {
      service = serv;
    }));*/

    it('listens to MdDataColumnSortingService', done => {
      let firstColumn: MdDataSortColumnDirective = testCmp.columns.first;

      testCmp.sortingService.sortingColumn.subscribe(col => {
        expect(firstColumn.sortingSubscription).toBeDefined();
        expect(firstColumn.sortingColumn).toEqual(col);
        done();
      });

    });

    it('notifies the MdDataColumnSortingService on click', done => {
      let updatedSorting: SortingColumn = {
        column: 2,
        direction: DataSortDirection.ASCEND
      },
      secondColumn:MdDataSortColumnDirective = testCmp.columns.toArray[1];
      let secondHost = fixture.nativeElement.querySelector('td[md-data-sort-column="2"]');
      let clickSpy = spyOn(secondColumn, 'sortBy');
      let changeSpy = spyOn(testCmp.sortingService, 'changeSorting');

      secondHost.click();
      expect(clickSpy).toHaveBeenCalled();
      expect(changeSpy).toHaveBeenCalledWith(2, updatedSorting);

    });

    it('styles it\'s host according to sorting state', done => {
      done();
    });



  });
}
