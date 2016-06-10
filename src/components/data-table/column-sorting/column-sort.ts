/*
 * Define column sort types/models
 */

/**
 * Specifies sorting direction
 */
export enum SortDirection {
  ASCEND, DESCEND
}

/**
 * Sorting model.
 */
export interface IColumnSortingModel {
  column: string;
  direction: SortDirection;
}
