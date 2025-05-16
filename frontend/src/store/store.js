import Vue from "vue";
import Vuex from "vuex";

// import percurso from './percurso'
// import planejamento from './planejamento'
// import tracker from './tracker'

import parques from "./parques";
import user from "./user";
// import comentarios from './comentario'

// import {i18n, setI18nLanguage} from '@/in18-setup';

Vue.use(Vuex);

export default function(data = {}) {
  // root state object.
  // each Vuex instance is just a single state tree.
  var state = {
    contentOpen: false,
    mapLoaded: false,
    initialAnimationFinish: false,
    contentRight: 0,
    map: {},
    layers: [],
    percurso: [],
    trechos: [],
    trechoOpen: false, //false or number
    trechoIndex: 0, //false or number
    altimetriaVisible: false,
    currengLang: "pt",
    terrainProfile: {},
    minAltimetry: 0,
    maxAltimetry: 0,
    minSlop: 0,
    maxSlop: 0,
    zoom: false
  };

  //check language definition
  var currentLang = localStorage.getItem("currentLang");
  if (currentLang) {
    state.currengLang = currentLang;
  } else {
    var browserLang = navigator.languages
      ? navigator.languages[0]
      : navigator.language || navigator.userLanguage;
    if (browserLang.match(/ˆpt/)) {
      state.currengLang = "pt";
    }
    state.currengLang = "pt";
  }
  //  setI18nLanguage(state.currengLang)

  // var secao = state.secoes;
  // var secaoPassada = _.get(data, 'secoes', {})

  // data.secoes = Object.assign({}, secao, secaoPassada);

  // // state = _.extend(state,data)
  // state = Object.assign({}, state, data);

  // mutations are operations that actually mutates the state.
  // each mutation handler gets the entire state tree as the
  // first argument, followed by additional payload arguments.
  // mutations must be synchronous and can be recorded by plugins
  // for debugging purposes.
  const mutations = {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
    barraToogle(state) {
      state.barraOpen = !state.barraOpen;
    },

    contentRight(state, right) {
      state.contentRight = right;
    },

    contentOpen(state, value) {
      var v = value || true;
      state.contentOpen = v;
    },
    contentClose() {
      state.contentOpen = false;
    },
    contentToogle() {
      state.contentOpen = !state.contentOpen;
    },

    addTrechos(state, trechoArray) {
      var trecho = _.filter(trechoArray, t => _.has(t, "properties"));
      state.trechos = trecho; //["a","b"]
    },

    trechoOpen(state, open) {
      state.trechoOpen = open;
    },

    trechoIndex(state, index) {
      state.trechoIndex = index;
    },

    setMap(state, map) {
      state.map = map;
    },

    altimetriaVisible(state, vis) {
      state.altimetriaVisible = vis;
    },

    setCurrentLang(state, lang) {
      //    Vue.set(state,'currengLang',lang)
      state.currengLang = lang;
      // setI18nLanguage(lang)
    },

    terrainProfile(state, valor) {
      state.terrainProfile = valor;
    },

    mapLoaded(state, valor) {
      state.mapLoaded = valor;
    },

    initialAnimationFinish(state, valor) {
      state.initialAnimationFinish = valor;
    },

    addLayer(state, valor) {
      state.layers.push(valor);
    },
    zoom(state, valor) {
      state.zoom = valor;
    }
  };

  // actions are functions that cause side effects and can involve
  // asynchronous operations.
  const actions = {
    increment: ({ commit }) => commit("increment"),
    decrement: ({ commit }) => commit("decrement"),
    incrementIfOdd({ commit, state }) {
      if ((state.count + 1) % 2 === 0) {
        commit("increment");
      }
    },
    incrementAsync({ commit }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit("increment");
          resolve();
        }, 1000);
      });
    },

    setCurrentLang(ctx, lang) {
      if (ctx.state.currengLang != lang) {
        ctx.commit("setCurrentLang", lang);
      }
    }
  };

  // getters are functions
  const getters = {
    evenOrOdd: state => (state.count % 2 === 0 ? "even" : "odd"),
    contentRight: state => state.contentRight,
    contentOpen: state => state.contentOpen,
    trechos: state => state.trechos,
    trechoOpen: state => state.trechoOpen,
    trechoIndex: state => state.trechoIndex,
    currentLang: state => state.currengLang,
    zoom: state => state.zoom
  };

  // A Vuex instance is created by combining the state, mutations, actions,
  // and getters.
  return new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
      parques: parques(data),
      user: user(data)
      // comentarios: comentarios(data)
    }
  });
}
