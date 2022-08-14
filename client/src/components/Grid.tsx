import { Fragment, useEffect, useState } from 'react';
import { INITIAL_POSITION, TEMP_WALLS_TIMER } from '../helpers/constants';
import { resetCell, toggleCell } from '../helpers/gridHelpers';
import { GridProps, ShCell, ShCellPosition, ShGrid } from '../helpers/types';
import ShikariGrid from '../utils/grid';
import Player from '../utils/player';

// css
import './Grid.css';

function Grid({ size: GRID_SIZE, cellSize: CELL_SIZE }: GridProps): JSX.Element {
  const sGrid = new ShikariGrid(GRID_SIZE);
  const [grid, setGrid] = useState<ShGrid>([]);
  const [playerPosition, setPlayerPosition] = useState<[number, number]>([...INITIAL_POSITION]);
  const [player, setPlayer] = useState<Player>(new Player(grid));
  const [lastMove, setLastMove] = useState<string>('');
  const [breakWallsCounter, setBreakWallsCounter] = useState<number>(0);

  useEffect(() => {
    const _grid = sGrid.generatePerfect();
    const [i, j] = INITIAL_POSITION;

    const player = new Player(_grid);
    player.drawPlayer(i, j);

    // Create random temp walls with a cadence of TEMP_WALLS_TIMER
    const randomlyClosePassages = setInterval(() => {
      const [i, j] = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)];
      shuffleWalls(_grid, i, j);
    }, 200);

    setPlayer(player);
    setGrid(_grid);
  }, []);

  useEffect(() => {
    if (grid.length) {
      const gr = player.movePlayer(playerPosition[0], playerPosition[1]);
      setGrid([...gr]);
    }
  }, [playerPosition]);

  const shuffleWalls = (grid: ShGrid, i: number, j: number) => {
    const oldCellValue = grid[i][j];
    const newGrid = toggleCell(grid, i, j);

    setGrid([...newGrid]);
    setTimeout(() => {
      const newGrid = resetCell(grid, oldCellValue, i, j);
      setGrid([...newGrid]);
    }, TEMP_WALLS_TIMER);
  };

  // keep moving the player in the direction of the last move
  const changePlayerPos = (nextCell: ShCell | undefined, direction: [number, number], shouldItBreakWalls: boolean = false) => {
    const [py, px] = playerPosition;
    const [dy, dx] = direction;

    // Bounds checking
    if (py + dy < 0 || px + dx < 0 || py + dy > GRID_SIZE - 1 || px + dx > GRID_SIZE - 1) return;

    nextCell = grid[py + dy][px + dx];
    if (nextCell !== 'wall' && nextCell !== 'tempWall' && !shouldItBreakWalls) {
      setPlayerPosition([py + dy, px + dx]);
      return;
    }
    if (nextCell !== 'wall' && nextCell === 'tempWall' && shouldItBreakWalls) {
      grid[py + dy][px + dx] = 'visited';
      setPlayerPosition([py, px]);
      console.log('wall');
      return;
    }
  };

  const keyEvaluator = (e: KeyboardEvent) => {
    e.stopImmediatePropagation();
    let nextCell;
    switch (e.key) {
      case 'ArrowUp':
        changePlayerPos(nextCell, [-1, 0]);
        setLastMove('up');
        break;
      case 'ArrowDown':
        changePlayerPos(nextCell, [1, 0]);
        setLastMove('down');
        break;
      case 'ArrowLeft':
        changePlayerPos(nextCell, [0, -1]);
        setLastMove('left');
        break;
      case 'ArrowRight':
        changePlayerPos(nextCell, [0, 1]);
        setLastMove('right');
        break;
      case ' ':
        setBreakWallsCounter(breakWallsCounter + 1);
        if (breakWallsCounter > 5) break;
        // Break temp walls
        switch (lastMove) {
          case 'up':
            changePlayerPos(nextCell, [-1, 0], true);
            break;
          case 'down':
            changePlayerPos(nextCell, [1, 0], true);
            break;
          case 'left':
            changePlayerPos(nextCell, [0, -1], true);
            break;
          case 'right':
            changePlayerPos(nextCell, [0, 1], true);
            break;
          default:
            break;
        }
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keyEvaluator);
    return () => window.removeEventListener('keydown', keyEvaluator);
  });

  return (
    <Fragment>
      <div className="grid">
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="row">
              {row.map((cell, cellIndex) => {
                return (
                  <div
                    key={cellIndex}
                    className={`cell ${cell}`}
                    style={{
                      width: `${CELL_SIZE}px`,
                      height: `${CELL_SIZE}px`,
                    }}
                  >
                    {cell === 'tempWall' && <strong>T</strong>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <p>{breakWallsCounter > 5 ? <strong>No more wall breaking</strong> : <strong>Break walls: {breakWallsCounter}</strong>}</p>
    </Fragment>
  );
}

export default Grid;
