import { ShCell, ShGrid } from './types';

export const toggleCell = (grid: ShGrid, i: number, j: number) => {
  const cell = grid[i][j];
  if (cell !== 'wall' && cell !== 'player') grid[i][j] = 'tempWall';
  return grid;
};

export const resetCell = (grid: ShGrid, oldCellValue: ShCell, i: number, j: number) => {
  const cell = grid[i][j];
  if (cell === 'tempWall') grid[i][j] = oldCellValue;
  return grid;
};
