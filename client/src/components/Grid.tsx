import { Fragment, useEffect, useState } from 'react';
import { CADENCE, INITIAL_POSITION, TEMP_WALLS_TIMER, TIMER, VICTORY_POINTS_BASELINE, WALL_GENERATION_SPEED } from '../helpers/constants';
import { resetCell, toggleCell } from '../helpers/gridHelpers';
import { GridProps, ShCell, ShGrid } from '../helpers/types';
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
  const [time, setTime] = useState<number>(TIMER);
  const [playerWon, setPlayerWon] = useState<boolean>(false);

  let timer: NodeJS.Timer;
  let randomlyClosePassages: NodeJS.Timer;

  useEffect(() => {
    const _grid = sGrid.generatePerfect();
    const [i, j] = INITIAL_POSITION;

    const player = new Player(_grid);
    player.drawPlayer(i, j);

    // Create random temp walls with a cadence of TEMP_WALLS_TIMER
    randomlyClosePassages = setInterval(() => {
      const [i, j] = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)];
      shuffleWalls(_grid, i, j);
    }, WALL_GENERATION_SPEED);

    setPlayer(player);
    setGrid(_grid);

    // Start timer and decrease it of 1000ms each second
    timer = setInterval(fn, CADENCE);

    function fn() {
      setTime((time) => {
        if (time <= CADENCE) {
          clearInterval(timer);
          clearInterval(randomlyClosePassages);
          return 0;
        }
        return time - CADENCE;
      });
    }
  }, []);

  useEffect(() => {
    if (grid.length) {
      // If player arrives at the end of the grid, he wins
      if (playerPosition[0] === GRID_SIZE - 1 && playerPosition[1] === GRID_SIZE - 1) {
        setPlayerWon(true);
      }

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
      return;
    }
  };

  const keyEvaluator = (e: KeyboardEvent) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    // if time's over stop the game
    if (time < CADENCE || playerWon) return;

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
      <div>
        {time < CADENCE ? (
          <div className="loosing-is-bad">
            <p>You lost</p>
            <button onClick={() => window.location.reload()}>RESTART</button>
          </div>
        ) : playerWon ? (
          <div className="winning-is-cool">
            <p>You won</p>
            <p>Points: {Math.floor((breakWallsCounter && VICTORY_POINTS_BASELINE / breakWallsCounter) || VICTORY_POINTS_BASELINE + VICTORY_POINTS_BASELINE / 2)}</p>
            <button onClick={() => window.location.reload()}>RESTART</button>
          </div>
        ) : (
          <span>Remaining time: 00:{time / 1000}</span>
        )}
      </div>
      <p>{breakWallsCounter > 5 ? <strong>No more wall breaking</strong> : <strong>Break walls: {breakWallsCounter}</strong>}</p>
    </Fragment>
  );
}

export default Grid;
