import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'

import { Router, Route, IndexRoute, browserHistory } from 'react-router';



// Componentes
import App from './components/App';
import Home from './pages/Home';

//Story
// import { store, history } from "./configStore"
import {store} from './configStore.js';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
