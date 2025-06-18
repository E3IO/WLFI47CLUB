import { useState } from 'react';
import './App.css';
import Trump from './components/Trump';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>$WLFI 47U HODL 俱乐部</h1>
      <Trump />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          HODL计数: {count}
        </button>
        <p>
          加入我们，一起"Make Crypto Great Again!"
        </p>
      </div>
    </div>
  );
}

export default App;
