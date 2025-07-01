// // Modern Redux store configuration for React 18
// import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';
// import { reducer as formReducer } from 'redux-form'; // Optional: consider removing in future
// import { reducer as notifications } from 'react-notification-system-redux';
// import thunk from 'redux-thunk';
// import config from './config';
// import _ from 'lodash';
// import { apiReducer, createApiMiddleware } from './bibliotecas/si3rc-api/';

// // Initial preferences
// const prefDefault = {
//   tileSel: '',
// };
// const prefLocal = JSON.parse(localStorage.getItem('si3rcpreferences')) || {};
// const initialPrefs = _.defaultsDeep(prefLocal, prefDefault);

// const prefsSlice = createSlice({
//   name: 'prefs',
//   initialState: initialPrefs,
//   reducers: {
//     setPreference: (state, action) => {
//       const newPrefs = { ...state, ...action.payload };
//       localStorage.setItem('si3rcpreferences', JSON.stringify(newPrefs));
//       return newPrefs;
//     },
//   },
// });

// const modalSlice = createSlice({
//   name: 'modal',
//   initialState: [],
//   reducers: {
//     createModal: (state, action) => {
//       return [...state.filter(m => m.nome !== action.payload.nome), action.payload];
//     },
//     removeModal: (state, action) => {
//       return state.filter(m => m.nome !== action.payload.nome);
//     },
//   },
// });

// const userSlice = createSlice({
//   name: 'usuario',
//   initialState: { id: false, _admin: false },
//   reducers: {
//     login: (state, action) => {
//       const user = { ...action.payload };
//       window.USER = user;
//       window.PERM = user.permissions;
//       return user;
//     },
//     logout: () => ({ id: false }),
//   },
// });

// const tabelaSlice = createSlice({
//   name: 'tabela',
//   initialState: {},
//   reducers: {
//     addTabela: (state, action) => {
//       const { nome } = action.payload;
//       state[nome] = { nome, filter: {} };
//     },
//     addTabelaFilter: (state, action) => {
//       // You can customize this according to your logic
//       return action.payload;
//     },
//   },
// });

// const rootReducer = combineReducers({
//   form: formReducer, // Optional: consider removing in favor of react-hook-form
//   api: apiReducer,
//   notifications,
//   prefs: prefsSlice.reducer,
//   modal: modalSlice.reducer,
//   usuario: userSlice.reducer,
//   tabela: tabelaSlice.reducer,
// });

// const loggerMiddleware = store => next => action => {
//   // You can customize logging or add debugging info here if needed
//   return next(action);
// };

// const apiMiddleware = createApiMiddleware(window.SI3CONFIG.url, {
//   'Content-Type': 'application/json',
// });

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware().concat(loggerMiddleware, thunk, apiMiddleware),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// window.STORE = store;

// // Routing is now handled using react-router-dom v6 via <BrowserRouter> in your root component

// // Export actions if needed
// export const { setPreference } = prefsSlice.actions;
// export const { createModal, removeModal } = modalSlice.actions;
// export const { login, logout } = userSlice.actions;
// export const { addTabela, addTabelaFilter } = tabelaSlice.actions;
