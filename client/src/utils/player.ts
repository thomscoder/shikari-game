import { INITIAL_POSITION } from '../helpers/constants';
import { ShCellPosition, ShGrid } from '../helpers/types';

export default class Player {
  private playerLastPosition: ShCellPosition = INITIAL_POSITION;

  constructor(public grid: ShGrid) {
    this.grid = grid;
  }

  public drawPlayer(i: number, j: number) {
    this.grid[i][j] = 'player';
    this.playerLastPosition = [i, j];
    return this.grid;
  }

  public movePlayer(i: number, j: number) {
    // Remove previous player
    if (this.playerLastPosition) {
      const [py, px] = this.playerLastPosition;
      this.grid[py][px] = 'visited';
    }

    this.grid[i][j] = 'player';
    this.playerLastPosition = [i, j];

    return this.grid;
  }
}
