import React from 'react';

import Products from './testes/Products';
import Testes from './testes/Testes';
import Sidebar from './Sidebar';



const App = () => (
  <div style={{ padding: 50 }}>
    <h1 style={{ color: 'green' }}>React funcionando sem Redux nem Router</h1>
    <p>Esse é um teste simples com Webpack.</p>


    <Testes />


    <Products />


    <Sidebar />
  </div>
);

export default App;
