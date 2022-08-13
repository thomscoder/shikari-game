import { useEffect, useState } from 'react';
import { drawPlayer, resetCell, toggleCell } from '../helpers/gridHelpers';
import ShikariGrid, { ShGrid } from '../utils/grid';

// css
import './Grid.css';

export type GridProps = {
  size: number;
  cellSize: number;
};

export const TEMP_WALLS_TIMER = 5000;

function Grid({ size: GRID_SIZE, cellSize: CELL_SIZE }: GridProps): JSX.Element {
  const sGrid = new ShikariGrid(GRID_SIZE);
  const [grid, setGrid] = useState<ShGrid>([]);
  const [playerPosition, setPlayerPosition] = useState([0, 0]);

  useEffect(() => {
    const _grid = sGrid.generateMaze();
    drawPlayer(_grid, 0, 0);
    setGrid(_grid);
  }, []);

  useEffect(() => {
    if (grid.length) {
      const gr = drawPlayer(grid, playerPosition[0], playerPosition[1]);
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
