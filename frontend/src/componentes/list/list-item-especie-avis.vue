<template>
    <div class='list-item-default row d-flex align-items-center'  v-to="'/especies/'+this.$route.params.id+'/'+item.id" >
       
        <div class="col-3 col-sm-4 col-md-3 col-lg-3">
            <img style="max-height:115px;" :src="`${api.thumb}?url=${item.imagemespecie_set[0].imagem}&w=120&h=120`" />
        </div>
        <div class=" col-9 col-sm-8  col-md-9  col-lg-9 ">
           <h5 class="nome">{{item.nome}}</h5>
           <div class="description"><i>{{item.nome_cientifico | truncate(125) }}</i></div>
        </div>

        <!-- <div class=" col-3 col-lg-2 d-block d-sm-none d-md-none d-lg-block tc">
            <div class="big-number" v-tooltip="'avistamentos'"> {{ item.ocorrencia_set.length }} </div>
            <div class="label"> avis. </div>
        </div> -->

        

    </div>
</template>


<script>
export default{
    props:{
        item:{
            default:{}
        },
    },

    mounted() {
        console.log('list-item-especie-avis - Item no mounted:', this.item)
    },
    watch: {
        item(newVal) {
        console.log('list-item-especie-avis - Item atualizado:', newVal)
        }
    },

    methods:{
        selected:function(){
        },
        hoverParque:function(parqueID){
            this.$store.dispatch('currentParque',parqueID)
        },
    },
} 
</script>