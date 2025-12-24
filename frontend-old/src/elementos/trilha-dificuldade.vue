<template>
    <div v-tooltip="'Dificuldade:' +getDificuldade">
          <i class="vtl  vtl-dificuldade"> <span class='label-dificuldade'>{{getDificuldade}}</span> </i>
    </div>
</template>




<script>
export default {

    props:['trilha'],
    computed:{
        getDificuldade:function(){
            var map = ['Facíl','Moderado','Difícil','Especialista']
            return map[ _.get(this.trilha,'categoria',0) ]
        },
    }

}
</script>

<style scoped>
    .label-dificuldade{
        font-size:0.6em;
    }

</style>