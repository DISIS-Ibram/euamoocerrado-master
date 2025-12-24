import Vue from "vue";
import VueRouter from "vue-router";
// import { setI18nLanguage } from "./in18-setup";

import home from "./paginas/home.vue";
import Conteudo from "./paginas/conteudo.vue";
import Parque from "./paginas/parques.vue";
import Especies from "./paginas/especies.vue";
import Trilhas from "./paginas/trilhas.vue";
import Sobre from "./paginas/sobre.vue";
import Publicacoes from "./paginas/publicacoes.vue";
import recoverpassword from "./paginas/recoverpassword.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: home,
    meta: {
      camera: {
        center: [-47.85927131478161, -15.799714225713075],
        pitch: 55.00000000000001,
        zoom: 12.30769269135277,
        bearing: 0
      }
    }
  },
  { path: "/h", component: home }
];


// function requireAll(requireContext) {
//   var keys = requireContext.keys();
//   _.forEach(keys, k => {
//     var modulo = requireContext(k);
//     var nome = k.match(/([^/]*).vue$/);
//     // routes.push({ path: "/"+nome[1], component: modulo })
//     routes.push({ path: "/" + nome[1] + "/:id?", component: modulo.default });
//   });
// }
// requireAll(require.context("./paginas", true, /^\.\/.*\.vue$/));

//fall back to conteudo page wha i never speifies
routes.push({
  path: "/conteudo/:id?",
  component: Conteudo,
  meta: {
    contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
    contentWidth: 400,
    name: "trecho",
    camera: false, //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
    root: true
  }
});

//fall back to conteudo page wha i never speifies
routes.push({
  path: "/parques/:id?",
  component: Parque,
  name: "parque",
  meta: {
    contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
    contentWidth: 400,
    name: "parque",
    camera: false //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
  }
});
//fall back to conteudo page wha i never speifies
routes.push({
  path: "/especies/:id?/:especieid?",
  component: Especies,
  name: "especie",
  meta: {
    contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
    contentWidth: 400,
    name: "especies",
    camera: false //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
  }
});

routes.push({
  path: "/trilhas/:id?",
  component: Trilhas,
  name: "trilha",
  meta: {
    contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
    contentWidth: 400,
    name: "trilhas",
    camera: false //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
  }
});

routes.push({
  path: "/sobre/:id?",
  component: Sobre,
  meta: {
    contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
    contentWidth: 400,
    name: "trilhas",
    camera: false //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
  }
});
routes.push({
  path: "/publicacoes/:id?",
  component: Publicacoes,
  meta: {
    contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
    contentWidth: 400,
    name: "trilhas",
    camera: false //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
  }
});

routes.push({
  path: "/recoverypassword/:id/:token",
  component: recoverpassword,
  meta: {
    withoutMap: true
  }
});

const router = new VueRouter({
  routes: routes, // short for `routes: routes`,
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

export default router;
