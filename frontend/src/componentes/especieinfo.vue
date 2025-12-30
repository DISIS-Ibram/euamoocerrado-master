<template>
  <div v-if="especie.nome" class="ph4 pv5">
    <i
      class="fa fa-2x fa-arrow-left"
      v-to="'/especies/' + this.$route.params.id"
    ></i>

    <div class="row mt4">
      <div class="col-12 col-sm-12 tc pv2">
        <div
          class="carrocel"
          v-pan="{ contain: false, prevNextButtons: false }"
        >
          <div class="carrocel-cell" v-for="item in especie.imagemespecie_set" :key="item.imagem">
            <img
              style="max-width:90% !important; max-height:400px;"
              :src="`${api.thumb}?url=${item.imagem}&w=800&h=600`"
            />
          </div>
        </div>
      </div>

      <div class="col-12">
        <h2 class="white f1">{{ especie.nome }}</h2>
        <p class="white f4">
          <i>{{ especie.nome_cientifico }}</i>
        </p>

        <div class="oficial-icon f3">
          <is-oficial :status="especie.oficial" title="Espécie" />
        </div>

        <div>
          <div class="row">
            <!-- <div class="col-8">
              <marcaravistamento :item="especie"/>
            </div> -->
            <div class="col-4 tc">
              <div class="big-number" v-tooltip="'avistamentos'">
                {{ especie.ocorrencia_set.length }}
              </div>
              <div class="label" style="font-size:10px;">avistamentos</div>
            </div>
          </div>
        </div>

        <div class="white mt5" v-html="especie.descricao"></div>

        <p v-if="especie.link" class="white f4 mt-1 mb-2">
          <i class="fa fa-link"></i>
          <a class="white" :href="especie.link" target="_blank">Saiba Mais</a>
        </p>


        <hr />
        <p class="white mt1"><b>Parques onde a espécie foi avistada:</b></p>

        <list
          :itens="parques"
          :search="false"
          template="list-item-parque-compact"
        ></list>

        <!-- <pre> {{ especie.parques}} </pre> -->
      </div>
    </div>
  </div>
</template>

<script>
import bbox from "@turf/bbox";

export default {
  data() {
    return {
      mudando: false
    };
  },

  props: ["id"],

  created: function() {
    this.zoomEspecie();
    //    window.map.flyTo( {center:this.parque.center.coordinates, zoom:14.5, duration:2000 })
  },

  watch: {
    parque: function(val) {
      this.zoomEspecie();
      //  window.map.flyTo( {center:this.parque.center.coordinates, zoom:14.5, duration:2000 })
    },

    item(newVal) {
      console.log('especieinfo - Item recebido:', newVal)
    }

  },

  computed: {
    especie: function() {
      console.log('Antes de computar o componentes especieinfo.vue');
      var especie = this.$store.getters.especieByID(this.id);
      console.log('Espécie recebida no componente: ', especie);
      //    delete parque.geom;
      return especie;
    },
    parques: function() {
      let itens = this.$store.getters.parques;
      var parques = _.filter(itens, parque => {
        return this.especie.parques.includes(parque.id);
      });

      return parques;
    }
  },

  methods: {
    zoomEspecie: function() {
      this.$store.dispatch("especieSelectedID", this.especie.id);
      // var bboxparque = bbox(this.parque.geom)
      // console.log(bboxparque);
      // window.map.fitBounds([[ bboxparque[0], bboxparque[1] ], [ bboxparque[2], bboxparque[3] ]]);
    }
  }
};
</script>

<style lang="stylus">
@import "../css/variaveis"

.carrocel {
  width: 100%;
}

.carrocel-cell {
  width: 100%;
}

.isoficial{
  color:rgba(black,0.5)

  }
</style>
