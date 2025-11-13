import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerMiddleware } from "react-router-redux";
import { reducer as formReducer } from "redux-form";
import thunk from "redux-thunk";
import { routerReducer } from "react-router-redux";
import _ from "lodash";

import config from "./config";
import {
  apiReducer,
  createApiMiddleware,
  apiActions,
} from "./bibliotecas/si3rc-api/";

import { reducer as notifications } from "react-notification-system-redux";

//======================================================
//     REDUCERS
//======================================================

// MODAL REDUCER
//---------------------------

function modalReducer(state = [], { type, payload }) {
  switch (type) {
    case "MODAL_CREATE":
      //vejo se tem algum modal com o nome, se tiver removo
      const newstate = _.filter(state, (e) => e.nome != payload.nome);
      return [...newstate, { ...payload }];

    case "MODAL_REMOVE":
      return [..._.filter(state, (e) => e.nome != payload.nome)];

    default:
      return state;
  }
}

// PreferencesReducer REDUCER
//---------------------------

//as preferencias iniciais
const prefDefault = {
  tileSel: "",
};

//carrego tb do localstorage se tiver
let prefLocal = JSON.parse(localStorage.getItem("si3rcpreferences"));

//mergo eles
let initialprefs = _.defaultsDeep(prefLocal, prefDefault);

function prefsReducer(state = initialprefs, { type, payload }) {
  switch (type) {
    case "PREFERENCE_SET":
      const prefs = { ...state, ...payload };

      //salvo no localstorage
      localStorage.setItem("si3rcpreferences", JSON.stringify(prefs));

      return prefs;

    default:
      return state;
  }
}

//============================================
//      User Reducer
//============================================
function userReducer(state = { id: false, _admin: false }, { type, payload }) {
  switch (type) {
    case "USER_LOGIN":
      //
      //vejo se tem algum modal com o nome, se tiver removo
      // const newstate = _.filter(state, (e)=> e.nome != payload.nome )
      var newpayload = { ...payload };
      window.USER = newpayload;
      window.PERM = newpayload.permissions;
      return newpayload;

    case "USER_LOGOUT":
      return { id: false };

    default:
      return state;
  }
}

//============================================
//      Tabela Reducer
//============================================
//   tabelaNome:{filter:{}
//               keyword:'',
//               sortBy:
//}
function tabelaReducer(state = {}, { type, payload }) {
  switch (type) {
    case "TABELA_ADD":
      var obj = {};
      obj.nome = payload.nome;
      obj.filter = {};
      state[payload.nome] = obj;

      return { ...state };

    case "TABELA_ADD_FILTER":
      //
      //vejo se tem algum modal com o nome, se tiver removo
      // const newstate = _.filter(state, (e)=> e.nome != payload.nome )
      var newpayload = { ...payload };
      return newpayload;

    // case 'TABELA_REMOVE_FILTER':
    //     return {id:false}

    default:
      return state;
  }
}

//======================================================
//     REDUX STORE
//======================================================

var reducer = combineReducers({
  routing: routerReducer,
  form: formReducer,
  tabela: tabelaReducer,
  api: apiReducer,
  modal: modalReducer,
  prefs: prefsReducer,
  usuario: userReducer,
  notifications: notifications,
});

// MIddleware Setup
//---------------------------

//logger middleware
const logger = (store) => (next) => (action) => {
  // console.group(action.type);
  // console.info('dispatching', action);
  // console.groupEnd();

  //@@redux-form/INITIALIZE
  if (action.type == "@@redux-form/INITIALIZE") {
  }

  if (action.type == "@@redux-form/CHANGE") {
    //se for um formulario novo seu id, salvo no localstorage
  } else if (
    action.type == "@@redux-form/SET_SUBMIT_SUCCEEDED" ||
    action.type == "@@redux-form/RESET"
  ) {
    //se enviei, deleto do localstorage
  }

  return next(action);
};

//crio o middleware de requisicoes api
const apiMiddleware = createApiMiddleware(window.SI3CONFIG.url, {
  "Content-Type": "application/json",
});

//crio os MIddleware
let middleware = applyMiddleware(
  routerMiddleware(browserHistory),
  logger,
  thunk,
  apiMiddleware
);
// ;
if (process.env.NODE_ENV !== "production") {
  // middleware = compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}
// middleware = compose(middleware, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

//Crio o redux Story
export const store = createStore(reducer, middleware);

window.STORE = store;

//verificar
export const history = syncHistoryWithStore(browserHistory, store);
// const history = createHistory();
