import {Component} from '@angular/core';
import {MATERIAL_DIRECTIVES/*, MdDataColumnSortingService*/} from 'ng2-material';

@Component({
  moduleId: module.id,
  selector: 'data-table-basic-usage',
  templateUrl: 'data-table-sorting.component.html',
  // providers: [MdDataColumnSortingService],
  directives: [MATERIAL_DIRECTIVES]
})
export class DataTableSortingComponent {
  pinicItems: Array<any> = [
    {'id': 1, 'name': 'Wine', 'quantity': '5', 'price': '$22.90'},
    {'id': 2, 'name': 'Cheese', 'quantity': '10', 'price': '$32.25'},
    {'id': 3, 'name': 'Crackers', 'quantity': '50', 'price': '$2.35'}
  ]
}
