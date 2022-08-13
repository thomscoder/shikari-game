import './App.css';
import Grid from './components/Grid';

function App() {
  const mediaQueryMobile = window.matchMedia('(max-width: 768px)').matches;
  const mediaQueryTablet = window.matchMedia('(max-width: 1024px)').matches;
  const mediaQueryDesktop = window.matchMedia('(min-width: 1024px)').matches;

  const gridSize = (mediaQueryMobile && 29) || (mediaQueryTablet && 29) || (mediaQueryDesktop && 29) || 15;
  const cellSize = (mediaQueryMobile && 12) || (mediaQueryTablet && 20) || (mediaQueryDesktop && 20) || 20;

  return (
    <div className="App">
      <Grid size={gridSize} cellSize={cellSize} />
    </div>
  );
}

export default App;
