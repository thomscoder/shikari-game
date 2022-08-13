import { useEffect, useState } from "react"
import ShikariGrid, { ShGrid } from "../utils/grid"

// css
import "./Grid.css"

export type GridProps = {
	size: number;
	cellSize: number;
};

function Grid({size: GRID_SIZE, cellSize: CELL_SIZE}: GridProps): JSX.Element {
	const [grid, setGrid] = useState<ShGrid>([])
	
	useEffect(() => {
		const sGrid = new ShikariGrid(GRID_SIZE);
		setGrid(sGrid.generateGrid());
	}, [])

	return (
		<div className="grid">
			{grid.map((row, rowIndex) => {
				return (
					<div key={rowIndex} className="row">
							{row.map((cell, cellIndex) => {
								console.log(cell);
								return (
									<div key={cellIndex} className={`cell ${cell}`} style={{
										width: `${CELL_SIZE}px`,
										height: `${CELL_SIZE}px`,
									}}>
										{cell}
									</div>
								)
							})}
					</div>
				)
			})}
		</div>
	)
}

export default Grid;