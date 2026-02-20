import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

/* =====================================================
   🔧 FIX GLOBAL NavigationDuplicated (Vue 2)
   ===================================================== */

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== "NavigationDuplicated") {
      throw err;
    }
  });
};

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => {
    if (err.name !== "NavigationDuplicated") {
      throw err;
    }
  });
};

/* =====================================================
   📦 IMPORTS DAS PÁGINAS
   ===================================================== */

// Públicas
import home from "./paginas/home.vue";
import Conteudo from "./paginas/conteudo.vue";
import Parque from "./paginas/parques.vue";
import Especies from "./paginas/especies.vue";
import Trilhas from "./paginas/trilhas.vue";
import Sobre from "./paginas/sobre.vue";
import Publicacoes from "./paginas/publicacoes.vue";
import recoverpassword from "./paginas/recoverpassword.vue";

// Privadas
import MinhasTrilhas from "./paginas/minhastrilhas.vue";
import MinhasEspecies from "./paginas/minhasespecies.vue";

/* =====================================================
   🛣 DEFINIÇÃO DAS ROTAS
   ===================================================== */

const routes = [
  // ================= PUBLIC =================

  {
    path: "/",
    component: home,
    meta: {
      camera: {
        center: [-47.85927131478161, -15.799714225713075],
        pitch: 55,
        zoom: 12.30769269135277,
        bearing: 0
      }
    }
  },

  { path: "/h", component: home },

  {
    path: "/conteudo/:id?",
    component: Conteudo,
    meta: {
      contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
      contentWidth: 400,
      name: "trecho",
      camera: false,
      root: true
    }
  },

  {
    path: "/parques/:id?",
    component: Parque,
    name: "parque",
    meta: {
      contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
      contentWidth: 400,
      camera: false
    }
  },

  {
    path: "/especies/:id?/:especieid?",
    component: Especies,
    name: "especie",
    meta: {
      contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
      contentWidth: 400,
      camera: false
    }
  },

  {
    path: "/trilhas/:id?",
    component: Trilhas,
    name: "trilha",
    meta: {
      contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
      contentWidth: 400,
      camera: false
    }
  },

  {
    path: "/sobre/:id?",
    component: Sobre,
    meta: {
      contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
      contentWidth: 400,
      camera: false
    }
  },

  {
    path: "/publicacoes/:id?",
    component: Publicacoes,
    meta: {
      contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
      contentWidth: 400,
      camera: false
    }
  },

  {
    path: "/recoverypassword/:id/:token",
    component: recoverpassword,
    meta: {
      withoutMap: true
    }
  },

  // ================= PRIVATE =================

  {
    path: "/minhastrilhas",
    component: MinhasTrilhas,
    meta: {
      requiresAuth: true,
      camera: false
    }
  },

  {
    path: "/minhasespecies/:tipo?",
    component: MinhasEspecies,
    meta: {
      requiresAuth: true,
      camera: false
    }
  },

  // ================= FALLBACK =================

  {
    path: "*",
    redirect: "/"
  }
];

/* =====================================================
   🚀 INSTÂNCIA DO ROUTER
   ===================================================== */

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

/* =====================================================
   🔐 NAVIGATION GUARD GLOBAL
   ===================================================== */

router.beforeEach((to, from, next) => {
  const store = window.$store;

  // se store ainda não carregou
  if (!store) {
    return next();
  }

  const user = store.getters?.user;

  if (to.matched.some(route => route.meta.requiresAuth)) {

    if (!user) {

      console.warn("🔒 Acesso negado - usuário não autenticado");

      // Abre modal de login se existir
      if (window.UIEvents) {
        window.UIEvents.$emit("showLogin");
      }

      return next("/");
    }

    return next();
  }

  next();
});

export default router;


// import Vue from "vue";
// import VueRouter from "vue-router";
// // import { setI18nLanguage } from "./in18-setup";

// import home from "./paginas/home.vue";
// import Conteudo from "./paginas/conteudo.vue";
// import Parque from "./paginas/parques.vue";
// import Especies from "./paginas/especies.vue";
// import Trilhas from "./paginas/trilhas.vue";
// import MinhasTrilhas from "./paginas/minhastrilhas.vue";
// import Sobre from "./paginas/sobre.vue";
// import Publicacoes from "./paginas/publicacoes.vue";
// import recoverpassword from "./paginas/recoverpassword.vue";

// Vue.use(VueRouter);

// const routes = [
//   {
//     path: "/",
//     component: home,
//     meta: {
//       camera: {
//         center: [-47.85927131478161, -15.799714225713075],
//         pitch: 55.00000000000001,
//         zoom: 12.30769269135277,
//         bearing: 0
//       }
//     }
//   },
//   { path: "/h", component: home }
// ];


// // function requireAll(requireContext) {
// //   var keys = requireContext.keys();
// //   _.forEach(keys, k => {
// //     var modulo = requireContext(k);
// //     var nome = k.match(/([^/]*).vue$/);
// //     // routes.push({ path: "/"+nome[1], component: modulo })
// //     routes.push({ path: "/" + nome[1] + "/:id?", component: modulo.default });
// //   });
// // }
// // requireAll(require.context("./paginas", true, /^\.\/.*\.vue$/));

// //fall back to conteudo page wha i never speifies
// routes.push({
//   path: "/conteudo/:id?",
//   component: Conteudo,
//   meta: {
//     contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
//     contentWidth: 400,
//     name: "trecho",
//     camera: false, //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
//     root: true
//   }
// });

// //fall back to conteudo page wha i never speifies
// routes.push({
//   path: "/parques/:id?",
//   component: Parque,
//   name: "parque",
//   meta: {
//     contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
//     contentWidth: 400,
//     name: "parque",
//     camera: false //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
//   }
// });
// //fall back to conteudo page wha i never speifies
// routes.push({
//   path: "/especies/:id?/:especieid?",
//   component: Especies,
//   name: "especie",
//   meta: {
//     contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
//     contentWidth: 400,
//     name: "especies",
//     camera: false //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
//   }
// });

// routes.push({
//   path: "/trilhas/:id?",
//   component: Trilhas,
//   name: "trilha",
//   meta: {
//     contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
//     contentWidth: 400,
//     name: "trilhas",
//     camera: false //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
//   }
// });

// routes.push({
//   path: "/minhastrilhas",
//   component: MinhasTrilhas,
//   meta: {
//     requiresAuth: true
//   }
// });

// routes.push({
//   path: "/sobre/:id?",
//   component: Sobre,
//   meta: {
//     contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
//     contentWidth: 400,
//     name: "trilhas",
//     camera: false //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
//   }
// });
// routes.push({
//   path: "/publicacoes/:id?",
//   component: Publicacoes,
//   meta: {
//     contentClass: "col-10 col-sm-4 col-md-4 col-lg-4",
//     contentWidth: 400,
//     name: "trilhas",
//     camera: false //{center:[-47.880458506715286,-15.801118965232092], pitch:60, zoom:16.418923313739327,bearing:28}
//   }
// });

// routes.push({
//   path: "/recoverypassword/:id/:token",
//   component: recoverpassword,
//   meta: {
//     withoutMap: true
//   }
// });

// const router = new VueRouter({
//   // Remover a # do endereço no navegador
//   mode: "history",
//   // Remover a # do endereço no navegador

//   routes: routes, // short for `routes: routes`,
//   scrollBehavior: function(to, from, savedPosition) {
//     return { x: 0, y: 0 };
//   }
// });

// export default router;
