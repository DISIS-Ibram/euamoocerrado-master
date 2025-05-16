<template>
  <div class="infos">
    <div style="flex-grow:1">
      <div v-tooltip="'Distância'">
        <div v-if="$_.has(trilha, 'comprimento')" class="big-number">
          {{ trilha.comprimento }}
        </div>
        <!-- <div class="big-number"> {{ parseInt(item.status.area_km*100,10) }} </div> -->
        <div class="label">km</div>
      </div>
      <trilha-sinalizacao :sinalizacao="trilha.sinalizada" />
      <trilha-dificuldade :trilha="trilha" />

      <!-- LETODO - ver como fica layout das atividades -->
      <div class="trilha-atividade-list">
        <trilha-atividade :atividades="trilha.atividades"></trilha-atividade>
      </div>
    </div>

    <div style="align-self:end">
      <downloadTrilha :id="trilha.id" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["trilha"]
};
</script>

<style lang="stylus" scoped>


.infos {
    text-align: left;

    margin-top:5px;
    margin-bottom:5px;


        display:flex;
        font-size:1.35em;
        padding:0px;
       *{ 
        color: lighten(#EAAE40,90%);
       }
        // opacity:0.8;
        // margin-right:0.2em;

}
</style>
