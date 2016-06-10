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
import {Component, DebugElement, ViewChildren, QueryList, OnInit} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {By} from "@angular/platform-browser";
import {
  MdDataColumnSortingService,
  MdDataSortColumnDirective,
  SortDirection,
  IColumnSortingModel
} from './index';

export function main() {

  @Component({
    selector: 'test-cmp',
    providers: [MdDataColumnSortingService],
    directives: [CORE_DIRECTIVES, MdDataSortColumnDirective],
    template: `
    <table>
      <thead>
        <tr>
          <th mdDataSortColumn="1">Wine</th>
          <th mdDataSortColumn="2">Cheese</th>
          <th mdDataSortColumn="3">Crackers</th>
        </tr>
      </thead>
    </table>`
  })
  class TestComponent implements OnInit {
    defaultModel: IColumnSortingModel = {
      column: '1',
      direction: SortDirection.DESCEND
    };
    @ViewChildren(MdDataSortColumnDirective) columns: QueryList<MdDataSortColumnDirective>;

    /**
     * Constructor.
     * @param sortingService - reference to the service for this area.
     */
    constructor(public sortingService: MdDataColumnSortingService) { }

    ngOnInit() {
      this.sortingService.setSorting(this.defaultModel);
    }
  }

  let fixture: ComponentFixture<TestComponent>;
  let service: MdDataColumnSortingService;
  let testCmp: TestComponent;

  beforeEachProviders(() => [
    TestComponentBuilder
  ]);

  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
      .createAsync(TestComponent)
      .then(f => {
        f.detectChanges();
        fixture = f;
        testCmp = fixture.componentInstance;
      })
      .catch(console.error.bind(console));
  }));

  describe('MdDataSortColumnService', () => {
    describe('sortingColumn', () => {

      it('is observable sorting state', () => {
        expect(testCmp.sortingService.sortingColumn.subscribe).toBeDefined();
      });

    });

    describe('setSorting', () => {
      it('sets sorting programatically', done => {
        let testSort = { column: '1', direction: SortDirection.ASCEND };
        expect(testCmp.sortingService.sortingColumn).toBeDefined();

        testCmp.sortingService.sortingColumn.subscribe(col => {
          expect(col).toEqual(testSort);
          done();
        });

        testCmp.sortingService.setSorting(testSort);
      });
    });

    describe('changeSorting', () => {
      it('updates sorting based on column interaction', done => {
        let clicks = 0,
          currentSort = { column: '1', direction: SortDirection.DESCEND },
        	firstSort = { column: '3', direction: SortDirection.ASCEND },
        	secondSort = { column: '3', direction: SortDirection.DESCEND },
          thirdSort = firstSort;

        testCmp.sortingService.sortingColumn.subscribe(col => {
          switch (clicks) {
            case 1:
              //change to clicked column ASCENDING
              expect(col).toEqual(firstSort);
              break;
            case 2:
              // click same column inverts direction:
              expect(col).toEqual(secondSort);
              break;
            case 3:
              // click same column inverts back:
              expect(col).toEqual(thirdSort);
              done();
              break;
          }

          currentSort = col;
        });

        while (clicks < 4) {
          clicks ++;
          testCmp.sortingService.changeSorting('3', currentSort);
        }

      });
    });
  });

  describe('MdDataSortColumnDirective', () => {

    it('listens to MdDataColumnSortingService', done => {
      let firstColumn: MdDataSortColumnDirective = testCmp.columns.first;

      testCmp.sortingService.sortingColumn.subscribe(col => {
        expect(firstColumn.sortingSubscription).toBeDefined();
        expect(firstColumn.sortingColumn).toEqual(col);
        done();
      });

      testCmp.sortingService.setSorting({ column: '1', direction: SortDirection.ASCEND });

    });

    it('notifies the MdDataColumnSortingService on click', () => {
      let secondColumn:MdDataSortColumnDirective = testCmp.columns.toArray()[1],
        secondHost = fixture.nativeElement.querySelector('th[mdDataSortColumn="2"]'),
        clickSpy = spyOn(secondColumn, 'sortBy').and.callThrough(),
        changeSpy = spyOn(testCmp.sortingService, 'changeSorting').and.callThrough();

      expect(changeSpy).not.toHaveBeenCalled();

      secondHost.click();

      expect(clickSpy).toHaveBeenCalled();
      expect(changeSpy.calls.argsFor(0)[0]).toEqual('2');
      expect(changeSpy.calls.argsFor(0)[1]).toEqual(testCmp.defaultModel);

    });

    it('styles it\'s host according to sorting state', () => {
      let el = fixture.nativeElement,
        first = el.querySelector('th[mdDataSortColumn="1"]'),
        seconnd = el.querySelector('th[mdDataSortColumn="2"]'),
        third = el.querySelector('th[mdDataSortColumn="3"]');

      //it finds class "sortable on it's host elements:
      expect(first.classList.contains('sortable')).toBe(true);;
      expect(seconnd.classList.contains('sortable')).toBe(true);;
      expect(third.classList.contains('sortable')).toBe(true);

      third.click();
      fixture.detectChanges();
      expect(third.classList.contains('sort-ascending')).toBe(true);
      expect(third.classList.contains('sorted-descending')).toBe(false);

      third.click();
      fixture.detectChanges();
      expect(third.classList.contains('sort-ascending')).toBe(false);
      expect(third.classList.contains('sorted-descending')).toBe(true);
    });

  });

}
