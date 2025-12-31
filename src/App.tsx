import { Game } from './game';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1 className="title">Boat Bash</h1>
      <p className="subtitle">Navigate your boat to the shore!</p>
      <div className="game-container">
        <Game />
      </div>
    </div>
  );
}

export default App;
