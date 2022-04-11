export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}

export type CellTypes = 'code' | 'text';
