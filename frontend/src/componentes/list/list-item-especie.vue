<template>
  <div
    class="list-item-default row d-flex align-items-center"
    v-to="'/especies/' + this.$route.params.id + '/' + item.id"
  >
    <div class="oficial-icon">
      <is-oficial :status="item.oficial" />
    </div>
    <div class="col-2 col-sm-4 col-md-3 col-lg-3">
      <img
        style="max-height:115px;"
        :src="
          `${api.thumb}?url=${item.imagemespecie_set[0].imagem}&w=120&h=120`
        "
      />
    </div>
    <div class=" col-7 col-sm-8  col-md-9  col-lg-7 ">
      <h4 class="nome">{{ item.nome }}</h4>
      <div class="description">
        <i>{{ item.nome_cientifico | truncate(125) }}</i>
      </div>
      <!-- <code>{{item}}</code> -->
      <!-- <div class="description">{{item.descricao | truncate(125) }}</div> -->
      <!-- <div class="d-flex align-items-center avistamentos ">
               <div v-tooltip="'Nº Trilhas'" class="pr3"> <i class="vtl vtl-percurso"/><small> {{item.status.num_trilhas}} </small></div>
               <div v-tooltip="'Nº Aves Avistadas'" class="pr3"> <i class="vtl vtl-ave"/><small> {{ $_.get(item,'status.num_avistamentos.ave',0) }} </small></div>
               <div v-tooltip="'Nº Mamíferos Avistados'" class="pr3"> <i class="vtl vtl-mamifero"/><small> {{ $_.get(item,'status.num_avistamentos.mamifero',0) }} </small></div>
               <div v-tooltip="'Nº Frutos Avistadas'" class="pr3"> <i class="vtl vtl-fruto"/><small> {{ $_.get(item,'status.num_avistamentos.fruto',0) }} </small></div>
               <div v-tooltip="'Nº Arvores Avistadas'" class="pr3"> <i class="vtl vtl-arvore"/><small> {{ $_.get(item,'status.num_avistamentos.arvore',0) }} </small></div>
           </div> -->
    </div>

    <div class=" col-3 col-lg-2 d-block d-sm-none d-md-none d-lg-block tc">
      <div v-if="item.ocorrencia_set.length > 0">
        <div class="big-number" v-tooltip="'avistamentos'">
          {{ item.ocorrencia_set.length }}
        </div>
        <div class="label">avis.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      default: {}
    }
  },

  methods: {
    selected: function() {},
    hoverParque: function(parqueID) {
      this.$store.dispatch("currentParque", parqueID);
    }
  }
};
</script>
