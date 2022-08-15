import { Fragment } from 'react';
import './App.css';
import Grid from './components/Grid';

function App() {
  const mediaQuerySmallMobile = window.matchMedia('(max-width: 480px)').matches;
  const mediaQueryMobile = window.matchMedia('(max-width: 768px)').matches;
  const mediaQueryTablet = window.matchMedia('(max-width: 1024px)').matches;
  const mediaQueryDesktop = window.matchMedia('(min-width: 1024px)').matches;

  const gridSize = (mediaQuerySmallMobile && 27) || (mediaQueryMobile && 27) || (mediaQueryTablet && 27) || (mediaQueryDesktop && 27) || 15;
  const cellSize = (mediaQuerySmallMobile && 8) || (mediaQueryMobile && 12) || (mediaQueryTablet && 18) || (mediaQueryDesktop && 18) || 20;

  return (
    <div className="App">
      <h1>Shikari</h1>
      <div className="tooltip">
        How to play?
        <span className="tooltiptext">
          {mediaQueryTablet ? (
            <>
              <strong>Joystick</strong> - to move
              <br />
              <strong>Click on joystick</strong> - to break the wall
            </>
          ) : (
            <>
              <strong>Arrow keys</strong> - to move
              <br />
              <strong>Spacebar</strong> - to break the wall (to break a wall point in the direction of the wall and hit the spacebar)
            </>
          )}
        </span>
      </div>
      <Grid size={gridSize} cellSize={cellSize} mobile={mediaQueryTablet} />
    </div>
  );
}

export default App;
