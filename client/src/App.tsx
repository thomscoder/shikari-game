import './App.css';
import Grid from './components/Grid';

function App() {
  const mediaQuerySmallMobile = window.matchMedia('(max-width: 480px)').matches;
  const mediaQueryMobile = window.matchMedia('(max-width: 768px)').matches;
  const mediaQueryTablet = window.matchMedia('(max-width: 1024px)').matches;
  const mediaQueryDesktop = window.matchMedia('(min-width: 1024px)').matches;

  const gridSize = (mediaQuerySmallMobile && 29) || (mediaQueryMobile && 29) || (mediaQueryTablet && 29) || (mediaQueryDesktop && 29) || 15;
  const cellSize = (mediaQuerySmallMobile && 8) || (mediaQueryMobile && 12) || (mediaQueryTablet && 20) || (mediaQueryDesktop && 20) || 20;

  return (
    <div className="App">
      <h1>Shikari</h1>
      <Grid size={gridSize} cellSize={cellSize} mobile={mediaQueryTablet} />
    </div>
  );
}

export default App;
