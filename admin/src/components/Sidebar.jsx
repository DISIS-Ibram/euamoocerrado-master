import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Icon from './elements/S3Icon';

function Home() {
  return <h2>Página Inicial</h2>;
}

function Sobre() {
  return <h2>Sobre Nós</h2>;
}

const Sidebar = function () {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/sobre">Sobre</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Sidebar;
