<template>
    

    <div>
              
        <div v-if="sinalizacao"  v-tooltip=" 'Trilha Sinalizada' "> <i class="signe fa fa-map-signs " aria-hidden="true"> </i> </div>
        <!-- <div v-else v-tooltip=" 'Trilha Não Sinalizada' "> <i class="fa fa-exclamation-triangle" aria-hidden="true"> <span>  Trilha não Sinalizada </span> </i> </div> -->
  
    </div>

</template>

<script>

    export default {
        props: ['sinalizacao'],
    }

</script>

