<template>
  <div>
    <div id="pagewrap">

      <mapbox v-if="!$route.meta.withoutMap"></mapbox>

      <cabecalho></cabecalho>
      <div
        v-if="
          $store.state.mapLoaded &&
            $store.state.initialAnimationFinish &&
            !$route.meta.withoutMap
        "
        id="conteudo-wraper"
        class="conteudo"
      >
        <router-view></router-view>
      </div>

      <div v-if="$route.meta.withoutMap" class="container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// require('./icons/index.js')

export default {
  name: "app",
  data() {
    return {
      open: false,
      secoes: {
        camada: true,
        regiaoestudo: true,
        mapabase: true,
        filtrosaude: true
      }
    };
  },

  created: function() {
    (async () => {
      await this.$store.dispatch("getUserFromToken");
      await this.$store.dispatch("loadParques");
      var to = this.$route;
      this.checkPageClass(to);
    })();
  },

  watch: {
    // call again the method if the route changes
    $route: function(to, from) {
      this.checkPageClass(to);
    }
  },

  computed: {
    user: function() {
      return this.$store.getters.user;
    }
  },

  mounted: function() {
    
  },

  methods: {
    openToogle: function() {
      this.$store.commit("barraToogle");
    },

    contrasteToogle: function() {
      $("html").hasClass("contraste");
    },

    secaoVisivel: function(nome) {
      return _.get(this.$store.state, `secoes.${nome}.exibir`, false);
    },

    checkPageClass: function(to) {
      if (to.path == "/") {
        $("html").addClass("home");
        $("html").removeClass("interna");
      } else {
        $("html").addClass("interna");
        $("html").removeClass("home");
      }
    }
  }
};
</script>

<style lang="stylus">

@import "css/variaveis";

#pagewrap{
    width 100%;
    height:100%;
    overflow:hidden;


    +mobile(){
         overflow initial;
    }
}
</style>
