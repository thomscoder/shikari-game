import { useEffect, useState } from 'react';
import { INITIAL_POSITION, TEMP_WALLS_TIMER } from '../helpers/constants';
import { resetCell, toggleCell } from '../helpers/gridHelpers';
import { GridProps, ShGrid } from '../helpers/types';
import ShikariGrid from '../utils/grid';
import Player from '../utils/player';

// css
import './Grid.css';

function Grid({ size: GRID_SIZE, cellSize: CELL_SIZE }: GridProps): JSX.Element {
  const sGrid = new ShikariGrid(GRID_SIZE);
  const [grid, setGrid] = useState<ShGrid>([]);
  const [playerPosition, setPlayerPosition] = useState([...INITIAL_POSITION]);
  const [player, setPlayer] = useState<Player>(new Player(grid));

  useEffect(() => {
    const _grid = sGrid.generatePerfect();
    const [i, j] = INITIAL_POSITION;

    const player = new Player(_grid);
    player.drawPlayer(i, j);

    setPlayer(player);
    setGrid(_grid);
  }, []);

  useEffect(() => {
    if (grid.length) {
      const gr = player.movePlayer(playerPosition[0], playerPosition[1]);
      setGrid([...gr]);
    }
  }, [playerPosition]);

  const clickedCell = (i: number, j: number) => {
    const oldCellValue = grid[i][j];
    const newGrid = toggleCell(grid, i, j);

    setGrid([...newGrid]);
    setTimeout(() => {
      const newGrid = resetCell(grid, oldCellValue, i, j);
      setGrid([...newGrid]);
    }, TEMP_WALLS_TIMER);
  };

  const keyEvaluator = (e: KeyboardEvent) => {
    e.stopImmediatePropagation();
    let cacheCell;
    switch (e.key) {
      case 'ArrowUp':
        cacheCell = grid[playerPosition[0] - 1][playerPosition[1]];
        if (cacheCell !== 'wall' && playerPosition[0] > 0 && cacheCell !== 'tempWalls') {
          setPlayerPosition([playerPosition[0] - 1, playerPosition[1]]);
          playerPosition[0]--;
        }
        break;
      case 'ArrowDown':
        cacheCell = grid[playerPosition[0] + 1][playerPosition[1]];
        if (cacheCell !== 'wall' && playerPosition[0] < GRID_SIZE - 1 && cacheCell !== 'tempWalls') {
          setPlayerPosition([playerPosition[0] + 1, playerPosition[1]]);
          playerPosition[0]++;
        }
        break;
      case 'ArrowLeft':
        cacheCell = grid[playerPosition[0]][playerPosition[1] - 1];
        if (cacheCell !== 'wall' && playerPosition[1] > 0 && cacheCell !== 'tempWalls') {
          setPlayerPosition([playerPosition[0], playerPosition[1] - 1]);
          playerPosition[1]--;
        }
        break;
      case 'ArrowRight':
        cacheCell = grid[playerPosition[0]][playerPosition[1] + 1];
        if (cacheCell !== 'wall' && playerPosition[1] < GRID_SIZE - 1 && cacheCell !== 'tempWalls') {
          setPlayerPosition([playerPosition[0], playerPosition[1] + 1]);
          playerPosition[1]++;
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keyEvaluator);
    return () => window.removeEventListener('keydown', keyEvaluator);
  });

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => {
              return (
                <div
                  key={cellIndex}
                  className={`cell ${cell}`}
                  onClick={() => clickedCell(rowIndex, cellIndex)}
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
  );
}

export default Grid;
