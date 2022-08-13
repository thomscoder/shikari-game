export type ShCell = 'unvisited' | 'wall' | 'start' | 'end' | 'path' | 'visited' | 'current';
export type ShGrid = ShCell[][];

export default class ShikariGrid {
    private GRID_SIZE: number;
    private grid: ShCell[][];

    constructor(public size: number) {
        this.GRID_SIZE = size;
        this.grid = [...Array(this.GRID_SIZE)]
            .map(() => [...Array(this.GRID_SIZE)].map(() => 'unvisited'))
    }

    public generateGrid(): ShGrid {
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
        return this.grid;
    }
}