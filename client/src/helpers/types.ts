// Components
export type GridProps = {
  size: number;
  cellSize: number;
};

// Grid/Cell
export type ShCell = 'unvisited' | 'wall' | 'start' | 'end' | 'path' | 'visited' | 'player' | 'tempWalls';
export type ShGrid = ShCell[][];
export type ShCellPosition = [number, number];
