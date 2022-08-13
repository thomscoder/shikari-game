import { ShCell, ShCellPosition, ShGrid } from '../utils/grid';

const playerStack: Array<ShCellPosition> = [];

export const toggleCell = (grid: ShGrid, i: number, j: number) => {
  const cell = grid[i][j];
  if (cell !== 'wall' && cell !== 'player') grid[i][j] = 'tempWalls';
  return grid;
};

export const resetCell = (grid: ShGrid, oldCellValue: ShCell, i: number, j: number) => {
  const cell = grid[i][j];
  if (cell === 'tempWalls') grid[i][j] = oldCellValue;
  return grid;
};

export const drawPlayer = (grid: ShGrid, i: number, j: number) => {
  // Remove previous player
  if (playerStack.length) {
    const [x, y] = playerStack.pop()!;
    grid[x][y] = 'visited';
  }

  grid[i][j] = 'player';
  playerStack.push([i, j]);

  return grid;
};
