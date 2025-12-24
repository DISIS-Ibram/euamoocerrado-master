<template>
     <div v-tooltip="'Marcar visita parque'" @click.stop.prevent="visitado" class="dib">
         
        <visitado-checkbox :value="item.visitado" />
        
        <span v-if="showtext"> 
            <span v-if="item.visitado===false"> Não </span> Visitado
        </span> 

    </div>
</template>

<script>
export default {
        props:{
            'item':{
                default:{},
            },
            'showtext':{
                default:false
            },
        },
        
        methods:{
              visitado:function(){
                if(this.$store.getters.user === false){
                    alert("Faça a login para poder marcar um parque como visitado")
                }
                this.$store.dispatch('setParqueVisitado',this.item) 
            }
        }
}
</script>

<style>

</style>
