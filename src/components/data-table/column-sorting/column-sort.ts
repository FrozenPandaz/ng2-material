/*
 * Define column sort types/models
 */

/**
 * Specifies sorting direction
 */
export enum DataSortDirection {
  ASCEND, DESCEND
}

/**
 * Sorting model.
 */
export interface SortingColumn {
  column: number;
  direction: DataSortDirection;
}
