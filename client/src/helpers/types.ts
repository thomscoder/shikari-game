// Components
export type GridProps = {
  size: number;
  cellSize: number;
};

// Grid/Cell
export type ShCell = 'unvisited' | 'wall' | 'start' | 'end' | 'visited' | 'player' | 'tempWall' | 'tempVisited';
export type ShGrid = ShCell[][];
export type ShCellPosition = [number, number];
