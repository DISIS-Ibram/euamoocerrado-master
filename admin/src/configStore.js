// import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
// import { reducer as formReducer } from 'redux-form';
// import thunk from 'redux-thunk';
// import _ from 'lodash';

// import config from './config';
// import { apiReducer, createApiMiddleware } from './bibliotecas/si3rc-api/';
// import { reducer as notifications } from 'react-notification-system-redux';

// //======================================================
// //     REDUCERS
// //======================================================

// function modalReducer(state = [], { type, payload }) {
//   switch (type) {
//     case 'MODAL_CREATE':
//       return [..._.filter(state, e => e.nome !== payload.nome), { ...payload }];
//     case 'MODAL_REMOVE':
//       return _.filter(state, e => e.nome !== payload.nome);
//     default:
//       return state;
//   }
// }

// const prefDefault = { tileSel: '' };
// const prefLocal = JSON.parse(localStorage.getItem('si3rcpreferences'));
// const initialprefs = _.defaultsDeep(prefLocal, prefDefault);

// function prefsReducer(state = initialprefs, { type, payload }) {
//   switch (type) {
//     case 'PREFERENCE_SET':
//       const prefs = { ...state, ...payload };
//       localStorage.setItem('si3rcpreferences', JSON.stringify(prefs));
//       return prefs;
//     default:
//       return state;
//   }
// }

// function userReducer(state = { id: false, _admin: false }, { type, payload }) {
//   switch (type) {
//     case 'USER_LOGIN':
//       const newpayload = { ...payload };
//       window.USER = newpayload;
//       window.PERM = newpayload.permissions;
//       return newpayload;
//     case 'USER_LOGOUT':
//       return { id: false };
//     default:
//       return state;
//   }
// }

// function tabelaReducer(state = {}, { type, payload }) {
//   switch (type) {
//     case 'TABELA_ADD':
//       return { ...state, [payload.nome]: { nome: payload.nome, filter: {} } };
//     case 'TABELA_ADD_FILTER':
//       return payload;
//     default:
//       return state;
//   }
// }

// //======================================================
// //     STORE CONFIGURATION
// //======================================================

// const reducer = combineReducers({
//   form: formReducer,
//   tabela: tabelaReducer,
//   api: apiReducer,
//   modal: modalReducer,
//   prefs: prefsReducer,
//   usuario: userReducer,
//   notifications,
// });

// const logger = store => next => action => {
//   return next(action);
// };

// const apiMiddleware = createApiMiddleware(window.SI3CONFIG.url, {
//   'Content-Type': 'application/json',
// });

// const middleware = applyMiddleware(logger, thunk, apiMiddleware);

// const composeEnhancers =
//   (process.env.NODE_ENV !== 'production' &&
//     typeof window === 'object' &&
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
//   compose;

// const enhancer = composeEnhancers(middleware);

// export const store = createStore(reducer, enhancer);

// window.STORE = store;

 // /////////////////////////////////////////////////////////////////////////////////


// // store.js (moderno)
// import { configureStore } from '@reduxjs/toolkit';

// // import { reducer as notifications } from 'react-notification-system-redux';
// // import { reducer as formReducer } from 'redux-form';


// import thunk from 'redux-thunk';
// import _ from 'lodash';

// import { apiReducer, createApiMiddleware } from './bibliotecas/si3rc-api/';


// // ... seus reducers definidos antes

// const reducer = {
//   form: formReducer,
//   tabela: tabelaReducer,
//   api: apiReducer,
//   modal: modalReducer,
//   prefs: prefsReducer,
//   usuario: userReducer,
//   notifications,
// };

// const apiMiddleware = createApiMiddleware(window.SI3CONFIG.url, {
//   'Content-Type': 'application/json',
// });

// export const store = configureStore({
//   reducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(thunk, apiMiddleware),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// window.STORE = store;

// //////////////////////////////////////////////////////////////////////

// store.js (moderno com React 18)
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import _ from 'lodash';

import { apiReducer, createApiMiddleware } from './bibliotecas/si3rc-api/';

// Seus reducers locais
function modalReducer(state = [], { type, payload }) {
  switch (type) {
    case 'MODAL_CREATE':
      return [..._.filter(state, e => e.nome !== payload.nome), { ...payload }];
    case 'MODAL_REMOVE':
      return _.filter(state, e => e.nome !== payload.nome);
    default:
      return state;
  }
}

const prefDefault = { tileSel: '' };
const prefLocal = JSON.parse(localStorage.getItem('si3rcpreferences'));
const initialprefs = _.defaultsDeep(prefLocal, prefDefault);

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

function userReducer(state = { id: false, _admin: false }, { type, payload }) {
  switch (type) {
    case 'USER_LOGIN':
      const newpayload = { ...payload };
      window.USER = newpayload;
      window.PERM = newpayload.permissions;
      return newpayload;
    case 'USER_LOGOUT':
      return { id: false };
    default:
      return state;
  }
}

function tabelaReducer(state = {}, { type, payload }) {
  switch (type) {
    case 'TABELA_ADD':
      return { ...state, [payload.nome]: { nome: payload.nome, filter: {} } };
    case 'TABELA_ADD_FILTER':
      return payload;
    default:
      return state;
  }
}

// Criar reducer unificado
const reducer = {
  tabela: tabelaReducer,
  api: apiReducer,
  modal: modalReducer,
  prefs: prefsReducer,
  usuario: userReducer,
  // notifications removido
  // form removido
};

// Middleware de API
const apiMiddleware = createApiMiddleware(window.SI3CONFIG.url, {
  'Content-Type': 'application/json',
});

// Criação da store
export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk, apiMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Expor globalmente (se necessário para debug)
window.STORE = store;


