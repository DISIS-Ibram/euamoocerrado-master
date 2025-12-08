import Vue from "vue";

// IMPORTA OS STILOS
// import 'tachyons/css/tachyons.css';

// var bootstrapAndFontawasome = require('css/bootstrap.scss');

//importo o stylus
var mapacss = require("@/css/app.styl");

import VueMapbox from "@curupira/vue-mapbox";
Vue.use(VueMapbox);

//importo o lodash
import _ from "lodash";
// import * as svgicon from 'vue-svgicon'
import {urls} from "./api.js";

//Coloco o lodash global
window._ = _;

// import {i18n} from './in18-setup';
// Vue.use(i18n)

import App from "./App.vue";

import VuexStore from "./store/store";
import Elementos from "./elementos/index";
import "./helpers/index";

//usado no selector das corridas
// import BootstrapVue from "bootstrap-vue";
// import "bootstrap-vue/dist/bootstrap-vue.css";
// Vue.use(BootstrapVue);

import { DropdownPlugin } from 'bootstrap-vue'
Vue.use(DropdownPlugin)

// import VueDisqus from 'vue-disqus'

// Vue.use(VueDisqus)

// import 'vuetify/dist/vuetify.min.css'

// import {
//   VMenu,VButton,Vlist
// } from 'vuetify'

//ROUTER
import router from "./router";

// import VueTheMask from 'vue-the-mask'

// Vue.use(VueTheMask)

Vue.use(function(Vue) {
  Vue.prototype.$has = _.has;
  Vue.prototype.$get = _.get;
  Vue.prototype.$set = _.set;
});
//
window.vtl = {};

// Vue.component('chart', ECharts)

//IMPORTO TODAS A DIRECTIVES AUTOMATICAMENTE DA PASTA DIRECTIVES
function requireAll(requireContext) {
  var keys = requireContext.keys();
  _.forEach(keys, k => {
    var modulo = requireContext(k);
    var nome = k.match(/([^/]*).js$/);
    Vue.directive(nome[1], modulo.default || modulo);
  });
}
// requires and returns all modules that match
requireAll(require.context("./directives", true, /^\.\/.*\.js$/));

//IMPORTO TODAS OS ELEMENTOS como componentes
function requireAllComponents(requireContext) {
  var keys = requireContext.keys();

  _.forEach(keys, k => {
    var modulo = requireContext(k);
    var nome = k.match(/([^/]*).vue$/);
    Vue.component(nome[1], modulo.default || modulo);
  });
}
// requires and returns all modules that match
requireAllComponents(require.context("./elementos", true, /^\.\/.*\.vue$/));

requireAllComponents(require.context("./componentes", true, /^\.\/.*\.vue$/));

requireAllComponents(require.context("./mapa", true, /^\.\/.*\.vue$/));

requireAllComponents(require.context("./mapa/layers", true, /^\.\/.*\.vue$/));

Vue.filter("decode", function(value) {
  if (!value) return "";
  value = _.decode(value);
  return value;
});

Vue.filter("html", function(value) {
  if (!value) return "";
  value = _.decode(value);
  return value;
});

Vue.filter("striptags", function(value) {
  if (!value) return "";
  value = value.replace(/<\/?[^>]+(>|$)/g, "");
  return value;
});

Vue.filter("truncate", function(value, leng = 100) {
  if (!value) return "";
  if (value.length < leng) return value;
  return value.substring(0, leng) + "...";
});

// var VueTouch = require('vue-touch');
// Vue.use(VueTouch, { name: 'v-touch' });

Vue.use(Elementos);

Vue.config.debug = true;
Vue.config.devTools = true;

//cadastros globais de componentes vue
// Vue.use(ElementUI);
// Vue.use(KeenUI);
// Default tag name is 'svgicon'
// Vue.use(svgicon, {
//     tagName: 'svgicon'
// })

// Mixens apra ter acesso ao treebox
Vue.mixin({
  computed: {
    api: function() {
      return urls || {};
    }
  }
});

//Incluindo o event.path em browser que não suportam, como firefox etc
if (!("path" in MouseEvent.prototype))
  Object.defineProperty(MouseEvent.prototype, "path", {
    get: function() {
      var path = [];
      var currentElem = this.target;
      while (currentElem) {
        path.push(currentElem);
        currentElem = currentElem.parentElement;
      }
      if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
        path.push(document);
      if (path.indexOf(window) === -1) path.push(window);
      return path;
    }
  });

//crio um Bus event system utilizando o window.UIEvents.$emit ou window.UIEvents.$on
window.UIEvents = new Vue();

window.VTL_UI = {};

window.VTL_UI.start = function(data) {
  //inicio a store passando datas configuradas no html
  var store = VuexStore(data);
  window.store = store;
  window.$store = store;

  //inicio minha aplicação Vue
  new Vue({
    // data: data,
    el: "#app",
    store: store,
    router,
    // i18n,
    render: h => h(App)
  });

  //inicio minha aplicação Vuex Legendas
};

window.mobilecheck = function() {
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

//Inicio minha aplicacao quando tiver carregado o meu html
$(function() {
  if (mobilecheck) {
    $("html").addClass("mobile");
  }
  window.VTL_UI.start({});
});