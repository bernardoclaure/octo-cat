import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <h1>OctoCAT Purchase Order</h1>
          <nav>
            <Link to="/">Home</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
