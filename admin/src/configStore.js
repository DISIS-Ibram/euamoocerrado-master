import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from "redux-thunk";
import _ from 'lodash';

import config from './config';
import { apiReducer, createApiMiddleware, apiActions } from './bibliotecas/si3rc-api/';
import { reducer as notifications } from 'react-notification-system-redux';

//======================================================
//     REDUCERS
//======================================================

// modalReducer
function modalReducer(state = [], { type, payload }) {
  switch (type) {
    case 'MODAL_CREATE':
      return [..._.filter(state, e => e.nome !== payload.nome), { ...payload }];
    case 'MODAL_REMOVE':
      return [..._.filter(state, e => e.nome !== payload.nome)];
    default:
      return state;
  }
}

// prefsReducer
const prefDefault = { tileSel: '' };
let prefLocal = JSON.parse(localStorage.getItem('si3rcpreferences'));
let initialprefs = _.defaultsDeep(prefLocal, prefDefault);

function prefsReducer(state = initialprefs, { type, payload }) {
  switch (type) {
    case 'PREFERENCE_SET':
      const prefs = { ...state, ...payload };
      localStorage.setItem('si3rcpreferences', JSON.stringify(prefs));
      return prefs;
    default:
      return state;
  }
}

// userReducer
function userReducer(state = { id: false, _admin: false }, { type, payload }) {
  switch (type) {
    case 'USER_LOGIN':
      var newpayload = { ...payload };
      window.USER = newpayload;
      window.PERM = newpayload.permissions;
      return newpayload;
    case 'USER_LOGOUT':
      return { id: false };
    default:
      return state;
  }
}

// tabelaReducer
function tabelaReducer(state = {}, { type, payload }) {
  switch (type) {
    case 'TABELA_ADD':
      var obj = { nome: payload.nome, filter: {} };
      return { ...state, [payload.nome]: obj };
    case 'TABELA_ADD_FILTER':
      // Ajuste conforme seu caso: aqui só retorna o payload?
      return payload;
    default:
      return state;
  }
}

//======================================================
//     REDUX STORE
//======================================================

const reducer = combineReducers({
  form: formReducer,
  tabela: tabelaReducer,
  api: apiReducer,
  modal: modalReducer,
  prefs: prefsReducer,
  usuario: userReducer,
  notifications: notifications,
});

// Middleware logger
const logger = store => next => action => {
  // console.group(action.type);
  // console.info('dispatching', action);
  // console.groupEnd();
  return next(action);
};

// Middleware API
const apiMiddleware = createApiMiddleware(window.SI3CONFIG.url, { "Content-Type": "application/json" });

// Configure middleware
let middleware = applyMiddleware(logger, thunk, apiMiddleware);

// Redux DevTools Extension
const composeEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const enhancer = composeEnhancers(middleware);

// Cria a store
export const store = createStore(reducer, enhancer);

window.STORE = store;
