<template>
  <conteudo :ajax="false">
    <div v-show="!$route.params.especieid" class="list-wraper">
      <!-- <list-title class="mt5" :title="getTitle($route.params.id)" /> -->

      <div class="row mt5 mb3">
        <div class="col-12 col-md-7">
          <list-title :title="title + ' ' + getTitle($route.params.id)" />
        </div>
        <!-- <div class="col-12 col-md-5 ml-4"> -->
        <!-- <b-button variant="outline-warning" @click="showEnviaEspecie"> <i class='fa fa-arrow-up' /> Enviar Espécie </b-button> -->
        <!-- </div> -->
      </div>

      <div class="row mx-0">
        <div class="col-6">
          <div class="ph4 mt1 mb3">
            TOTAL: <b>{{ especiesItens.length }}</b>
          </div>
        </div>

        <div class="col-6 filters d-flex justify-content-end">
          <div class="filter ">
            <div class="label">FILTROS:</div>
            <div class="filter-button">
              <i
                v-tooltip="'Mostrar só Espécies Oficiais'"
                class="vtl vtl-oficial"
                :class="{ active: oficialFilter == true }"
                @click="oficialFilter = !oficialFilter"
              ></i>
              <!--                     
                                        <eac-dropdown :options="filterOptions" v-model="dificuldadeFilter"> 
                                                <i class="vtl vtl-dificuldade" 
                                                :class="{active:dificuldadeFilter.value != ''}"> <span class='label-dificuldade'></span> </i>
                                        </eac-dropdown> -->
            </div>
          </div>
          <div class="sort ">
            <eac-dropdown :options="options" v-model="sortingCriteria">
              <i
                v-if="sortingDirection == 'asc'"
                @click="sortingDirection = 'desc'"
                class="fa fa-sort-amount-asc sort-icon"
              ></i>
              <i
                v-if="sortingDirection == 'desc'"
                @click="sortingDirection = 'asc'"
                class="fa fa-sort-amount-desc sort-icon"
              ></i>
              <div class="sortname">{{ sortingCriteria.label }}</div>
            </eac-dropdown>
          </div>
        </div>
      </div>

      <div v-if="this.userMode == false" class="pv2 ph4 d-flex">
        <a class="dib ph2 pv2 black" v-to="'/especies/ave'">
          <i
            class="vtl vtl-ave fa-2x"
            :class="{ black: $route.path == '/especies/ave' }"
          ></i>
        </a>
        <a class="dib ph2 pv2 black" v-to="'/especies/mamifero'">
          <i
            class="vtl vtl-mamifero fa-2x"
            :class="{ black: $route.path == '/especies/mamifero' }"
          ></i>
        </a>
        <a class="dib ph2 pv2 black" v-to="'/especies/peixe'">
          <i
            class="vtl vtl-peixe fa-2x"
            :class="{ black: $route.path == '/especies/peixe' }"
          ></i>
        </a>
        <a class="dib ph2 pv2 black" v-to="'/especies/fruto'">
          <i
            class="vtl vtl-fruto fa-2x"
            :class="{ black: $route.path == '/especies/fruto' }"
          ></i>
        </a>
        <a class="dib ph2 pv2 black" v-to="'/especies/arvore'">
          <i
            class="vtl vtl-arvore fa-2x"
            :class="{ black: $route.path == '/especies/arvore' }"
          ></i>
        </a>
      </div>

      <list :itens="especiesItens" template="list-item-especie"> </list>
    </div>

    <especieinfo v-if="$route.params.especieid" :id="$route.params.especieid" />
  </conteudo>
</template>

<script>
import Conteudo from "./conteudo.vue";
// import marked from 'marked'

export default {
  props: {
    title: {
      default: ""
    },
    userMode: {
      default: false
    }
  },
  data() {
    return {
      mudando: false,
      sortingCriteria: { label: "", value: "" },
      dificuldadeFilter: { label: "", value: "" },
      oficialFilter: false,
      sinalizadaFilter: false,
      sortingDirection: "asc", //['asc','desc']
      mudando: false,
      options: [
        //LETODO - fazer os mais avistados
        // {value:'status.num_visitantes', label: 'Mais avistados'},
        { value: "nome", label: "Nome" },
        { value: "oficial", label: "Oficiais" }
      ],
      filterOptions: [
        { value: "", label: "Todas" },
        { value: "0", label: "Fácil" },
        { value: "1", label: "Moderado" },
        { value: "2", label: "Difícil" },
        { value: "3", label: "Especialista" }
      ]
    };
  },

  components: {
    conteudo: Conteudo
  },

  computed: {
    user: function() {
      return this.$store.getters.user;
    },
    especiesItens: function() {
      var categoria = this.$route.params.id;
      let especiesAll;

      if (_.isEmpty(categoria)) {
        especiesAll = this.$store.getters.especies;
      } else {
        especiesAll = this.$store.getters.especiesByCategoria(categoria);
      }

      especiesAll = _.filter(especiesAll, item => {
        let res = true;
        if (this.userMode == true) {
          if (
            _.get(item, "user", _.get(item, "user.id")) !=
            _.get(this.user, "pk")
          )
            return false;
        }

        return res;
      });

      return especiesAll;
    }
  },

  beforeDestroy: function() {
    this.$store.commit("actualCourseLeg", false);
  },

  created: function() {},

  watch: {},

  methods: {
    getTitle: function(title) {
      var mapping = {
        ave: { nome: "Aves" },
        mamifero: { nome: "Mamíferos" },
        arvore: { nome: "Árvores Protegidas" },
        fruto: { nome: "Frutos" },
        peixe: { nome: "Peixes" }
      };
      let a = _.get(mapping, title + ".nome", title);
      if (!a) a = "Espécies";
      return a;
    },

    showEnviaEspecie: function() {
      window.UIEvents.$emit("enviaEspecie");
    }
  }
};
</script>

<style lang="stylus">
@import "../css/variaveis"

.trecho-info{

    .descripition{
        b,strong{
            color lighten(color-orange,40%)
        }
    }

}

    .slide-enter-to, .slide-leave{
           transform: translateX(10px);
           opacity: 0.5;
            transition: all .6s ease;
    }
     .slide-enter, .slide-leave-to{
           transform: translateX(10px);
           opacity: 0;
           transition: all .6s ease;
    }


.navegationTrechos{
    text-align right;
    // position:absolute;
    margin-top:1em;
    left:1em;
    user-select: none;
    a{
        cursor: pointer;
        display:inline-block;
        background rgba(black,0.5);
        padding:8px;
        border-radius 50%;
        font-size:1.2em;
        margin-top:-0.5em;

    }
}
</style>
