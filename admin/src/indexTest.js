import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
//Pages
import App from './components/App';
import Home from './pages/Home';
import Admin from './pages/Admin';

import Pessoas from './pages/Pessoas';
import PessoasPageForm from './pages/PessoasPageForm';

import RelatosPageForm from './pages/RelatosPageForm';

import RegistroPageForm from './pages/RegistroPageForm';

import Login from './pages/Login';

import Relatos from './pages/Relatos';

import Registros from './pages/Registros';

import AutoFormPage from './pages/AutoFormPage';
import AutoTabelaPage from './pages/AutoTabelaPage';

import NotFound from './pages/NotFound';

//Story
import { store, history } from "configStore.js"

