<template>
    

    <div>
              
        <div v-if="status" v-tooltip=" title+' Oficial' ">   <i class="vtl  vtl-oficial"></i>  </div>
        <!-- <div v-else v-tooltip=" 'Trilha Não Oficial' "> <i class="fa fa-square-o" aria-hidden="true"><span>  Não Oficial </span> </i> </div> -->
  
    </div>

</template>

<script>

    export default {
        props: ['status','title'],
    }

</script>

<style>

</style>