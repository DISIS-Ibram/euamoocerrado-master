<template>
  <conteudo :ajax="false">
    <div v-show="!$route.params.especieid" class="list-wraper">
      <!-- <list-title class="mt5" :title="getTitle($route.params.id)" /> -->

      <div class="row mt5 mb3">
        <div class="col-12 col-md-7">
          <!-- <list-title :title="title + ' ' + getTitle($route.params.id)" /> -->
          <list-title :title="title + ' ' + getTitle(categoriaAtual)" />
        </div>
        <div class="col-12 col-md-5 ml-4">
          <b-button v-if="user && !userMode" variant="outline-warning" @click="showEnviaEspecie"> <i class='fa fa-arrow-up' /> Enviar Espécie </b-button>
        </div>
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

      <!-- <div v-if="this.userMode == false" class="pv2 ph4 d-flex"> -->
      <div class="pv2 ph4 d-flex">

        <router-link
          v-for="tipo in ['ave','mamifero','peixe','fruto','arvore']"
          :key="tipo"
          class="dib ph2 pv2 black"
          :to="categoriaPath(tipo)"
        >
          <i
            :class="[
              'vtl',
              'vtl-' + tipo,
              'fa-2x',
              { black: categoriaAtual === tipo }
            ]"
          ></i>
        </router-link>

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
      console.log('especies.vue - computed - usre: ', this.$store.getters.user)
      return this.$store.getters.user;
    },

    especiesItens() {

      let especiesAll

      if (!this.categoriaAtual) {
        especiesAll = this.$store.getters.especies
      } else {
        especiesAll =
          this.$store.getters.especiesByCategoria(this.categoriaAtual)
      }

      // 🔹 FILTRO POR USUÁRIO
      if (this.userMode) {

        if (!this.user) return []

        especiesAll = especiesAll.filter(item => {
          const itemUserId =
            item.user_id ??
            _.get(item, "user.id")

          return itemUserId === this.user.pk
        })
      }

      return especiesAll
    },

    categoriaAtual() {
      return this.$route.params.tipo ||
              this.$route.params.id ||
              null
    },
  },

  beforeDestroy: function() {
    console.log("ESPECIES DESTROYED")
    // this.$store.commit("actualCourseLeg", false);
  },

  created: function() {
    console.log("ESPECIES CREATED");
  },

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
    },

    categoriaPath(tipo) {
      if (this.userMode) {
        return `/minhasespecies/${tipo}`
      }
      return `/especies/${tipo}`
    },
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
