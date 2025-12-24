<template>

   <b-button variant="outline-warning" @click="marcarAvistamento">   <i class="fa fa-binoculars" /> Marcar Avistamento </b-button>
  
</template>

<script>
export default {

    props:['item'],
    methods: {
        marcarAvistamento:function(){
             window.UIEvents.$emit('marcaAvistamento',this.item)
        }
    }

}
</script>

<style>

</style>
