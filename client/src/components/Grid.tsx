import { Fragment, useEffect, useState } from 'react';
import { Joystick } from 'react-joystick-component';
import { CADENCE, INITIAL_POSITION, TEMP_WALLS_TIMER, TIMER, WALL_GENERATION_SPEED } from '../helpers/constants';
import { resetCell, toggleCell } from '../helpers/gridHelpers';
import { GridProps, ShCell, ShGrid } from '../helpers/types';
import ShikariGrid from '../utils/grid';
import Player from '../utils/player';

// css
import './Grid.css';

function Grid({ size: GRID_SIZE, cellSize: CELL_SIZE, mobile: IS_MOBILE }: GridProps): JSX.Element {
  const sGrid = new ShikariGrid(GRID_SIZE);

  const [start, setStart] = useState<boolean>(false);
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
  }, []);

  function fn() {
    setStart(true);
    setTime((time) => {
      if (time <= CADENCE) {
        clearInterval(timer);
        clearInterval(randomlyClosePassages);
        return 0;
      }
      return time - CADENCE;
    });
  }

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

  const keyEvaluator = (e: KeyboardEvent | string) => {
    if (e && typeof e !== 'string') {
      (e as KeyboardEvent).preventDefault();
      (e as KeyboardEvent).stopImmediatePropagation();
    }

    const key = typeof e === 'string' ? e : e!.key;

    // if time's over stop the game
    if (time < CADENCE || playerWon || !start) return;

    let nextCell;
    switch (key) {
      case 'ArrowUp':
      case 'FORWARD':
        changePlayerPos(nextCell, [-1, 0]);
        setLastMove('up');
        break;
      case 'ArrowDown':
      case 'BACKWARD':
        changePlayerPos(nextCell, [1, 0]);
        setLastMove('down');
        break;
      case 'ArrowLeft':
      case 'LEFT':
        changePlayerPos(nextCell, [0, -1]);
        setLastMove('left');
        break;
      case 'ArrowRight':
      case 'RIGHT':
        changePlayerPos(nextCell, [0, 1]);
        setLastMove('right');
        break;
      case ' ':
      case 'BREAK':
        if (breakWallsCounter === 5) {
          setTime(0);
          break;
        }
        setBreakWallsCounter(breakWallsCounter + 1);
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
      <div
        className="grid"
        style={{
          border: `${CELL_SIZE}px solid #a00`,
        }}
      >
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
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
      {IS_MOBILE && !playerWon && time >= CADENCE && (
        <div className="joystick" onClick={() => keyEvaluator('BREAK')}>
          <Joystick baseColor={'#fff2'} stickColor={'#a00'} move={(e) => keyEvaluator(e.direction!)} />
        </div>
      )}
      <div>
        {time < CADENCE && !playerWon ? (
          <div className="loosing-is-bad">
            <p>You lost</p>
            <button onClick={() => window.location.reload()}>RESTART</button>
          </div>
        ) : playerWon ? (
          <div className="winning-is-cool">
            <p>You won</p>
            <button onClick={() => window.location.reload()}>RESTART</button>
          </div>
        ) : !start ? (
          <button
            className="start-btn"
            onClick={() => {
              // Start timer and decrease it of 1000ms each second
              return (timer = setInterval(fn, CADENCE));
            }}
          >
            Start
          </button>
        ) : (
          <span>Remaining time: 00:{time / CADENCE}</span>
        )}
      </div>
      <p>{breakWallsCounter < 6 && start && <strong>Break walls: {breakWallsCounter}</strong>}</p>
    </Fragment>
  );
}

export default Grid;
