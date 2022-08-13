export type ShCell = 'unvisited' | 'wall' | 'start' | 'end' | 'path' | 'visited' | 'player' | 'tempWalls';
export type ShGrid = ShCell[][];
export type ShCellPosition = [number, number];

export default class ShikariGrid {
  private GRID_SIZE: number;
  private grid: ShCell[][];
  private stack: Array<ShCellPosition> = [];

  constructor(public size: number) {
    this.GRID_SIZE = size;
    this.grid = [...Array(this.GRID_SIZE)].map(() => [...Array(this.GRID_SIZE)].map(() => 'wall'));
  }

  public generatePerfectMaze(): ShGrid {
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
    this.getRandomNeighbor(0, 0);
    return this.grid;
  }

  public generateMaze(): ShGrid {
    this.getRandomNeighbor(0, 0);
    return this.grid;
  }

  private getNeighbors(i: number, j: number) {
    const neighbors: Map<string, ShCellPosition> = new Map();

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

    return neighbors;
  }

  private getRandomNeighbor(i: number, j: number) {
    const neighbors = this.getNeighbors(i, j);

    if (neighbors) {
      const randomNeighbor = Array.from(neighbors.keys())[Math.floor(Math.random() * neighbors.size)];
      const cellPos = neighbors.get(randomNeighbor)!;

      this.grid[cellPos[0]][cellPos[1]] = 'visited';

      this.breakWalls(randomNeighbor, i, j)!;
      this.stack.push([...cellPos]);

      this.getRandomNeighbor(...cellPos);
    } else {
      if (this.stack.length) {
        const lastCell = this.stack.pop()!;
        this.getRandomNeighbor(...lastCell);
      }
    }
  }

  private breakWalls(cellLabel: string, i: number, j: number): ShCellPosition | undefined {
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
