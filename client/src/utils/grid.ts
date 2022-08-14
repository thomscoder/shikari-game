import { INITIAL_POSITION } from '../helpers/constants';
import { ShCellPosition, ShGrid } from '../helpers/types';

export default class ShikariGrid {
  private GRID_SIZE: number;
  private grid: ShGrid;
  private stack: Array<ShCellPosition> = [];

  constructor(public size: number) {
    this.GRID_SIZE = size;
    this.grid = [...Array(this.GRID_SIZE)].map(() => [...Array(this.GRID_SIZE)].map(() => 'wall'));
  }

  public generatePerfect(): ShGrid {
    const len = this.grid.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (i === 0 && j === 0) {
          this.grid[i][j] = 'start';
        } else if (i === len - 1 && j === len - 1) {
          this.grid[i][j] = 'end';
        }
      }
    }
    const [i, j] = INITIAL_POSITION;
    this.getRandomNeighbor(i, j);
    return this.grid;
  }

  public generate(): ShGrid {
    const [i, j] = INITIAL_POSITION;
    this.getRandomNeighbor(i, j);
    return this.grid;
  }

  private getNeighbors(i: number, j: number) {
    const neighbors: Map<string, ShCellPosition> = new Map();

    // Get neighbors and check if they are already visited
    // consider the the walls between them by moving by two cells
    const top = this.grid[i - 1] && this.grid[i - 2][j];
    const right = this.grid[i] && this.grid[i][j + 2];
    const bottom = this.grid[i + 1] && this.grid[i + 2][j];
    const left = this.grid[i] && this.grid[i][j - 2];

    if (top && top !== 'visited' && top !== 'start') {
      neighbors.set('top', [i - 2, j]);
    }

    if (right && right !== 'visited' && right !== 'start') {
      neighbors.set('right', [i, j + 2]);
    }

    if (bottom && bottom !== 'visited' && bottom !== 'start') {
      neighbors.set('bottom', [i + 2, j]);
    }

    if (left && left !== 'visited' && left !== 'start') {
      neighbors.set('left', [i, j - 2]);
    }

    if (neighbors.size === 0) return;

    // Return the list of neighbors that are not visited yet
    return neighbors;
  }

  private getRandomNeighbor(i: number, j: number) {
    const neighbors = this.getNeighbors(i, j);

    // if the list of neighbors is not empty then pick a random neighbor and visit it
    if (neighbors) {
      const randomNeighbor = Array.from(neighbors.keys())[Math.floor(Math.random() * neighbors.size)];
      const cellPos = neighbors.get(randomNeighbor)!;

      this.grid[cellPos[0]][cellPos[1]] = 'visited';

      this.breakWalls(randomNeighbor, i, j)!;
      this.stack.push([...cellPos]);

      this.getRandomNeighbor(...cellPos);
    } else {
      // if the list of neighbors is empty then backtrack
      if (this.stack.length) {
        const lastCell = this.stack.pop()!;
        this.getRandomNeighbor(...lastCell);
      }
    }
  }

  private breakWalls(cellLabel: string, i: number, j: number): ShCellPosition | undefined {
    // break the wall between the current cell and the neighbor cell
    switch (cellLabel) {
      case 'top':
        this.grid[i - 1][j] = 'visited';
        return [i - 1, j];
      case 'right':
        this.grid[i][j + 1] = 'visited';
        return [i, j + 1];
      case 'bottom':
        this.grid[i + 1][j] = 'visited';
        return [i + 1, j];
      case 'left':
        this.grid[i][j - 1] = 'visited';
        return [i, j - 1];
      default:
        return;
    }
  }
}
