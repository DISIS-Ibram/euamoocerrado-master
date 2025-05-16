<template>
    <div class='list-item-default row d-flex align-items-center' v-to="'/parques/'+item.id" @mouseover="hoverParque(item.id)"  @mouseout="hoverParque(false)"   >
       
        <!-- <div class="visitado d-block d-sm-none d-md-none d-lg-block">
            <visitadoparque :item="item" />
         </div>    -->
        <div class="col-8 col-sm-12 col-lg-9  ">
            <h4 class="nome">{{item.nome}}</h4>
            <div class='info'>
                <i v-if="item.possui_sede" v-tooltip="'Com Sede'" class='fa fa-home'></i>
            </div>
            <div class="description"><i>{{item.nome_decreto}}</i></div>
            <!-- <div class="description"><i>{{item.status.num_visitas}}</i></div> -->
        
           <!-- <div class="description">{{item.descricao | truncate(125) }}</div> -->
           <!-- <div class="d-flex align-items-center avistamentos " v-if="$_.has(item.status,'num_avistamentos')">
               <div v-tooltip="'Nº Trilhas'" class="pr3"> <i class="vtl vtl-percurso"/><small> {{item.status.num_trilhas}} </small></div>
               <div v-tooltip="'Nº Aves Avistadas'" class="pr3"> <i class="vtl vtl-ave"/><small> {{ $_.get(item,'status.num_avistamentos.ave',0) }} </small></div>
               <div v-tooltip="'Nº Mamíferos Avistados'" class="pr3"> <i class="vtl vtl-mamifero"/><small> {{ $_.get(item,'status.num_avistamentos.mamifero',0) }} </small></div>
               <div v-tooltip="'Nº Frutos Avistados'" class="pr3"> <i class="vtl vtl-fruto"/><small> {{ $_.get(item,'status.num_avistamentos.fruto',0) }} </small></div>
               <div v-tooltip="'Nº Árvores Avistadas'" class="pr3"> <i class="vtl vtl-arvore"/><small> {{ $_.get(item,'status.num_avistamentos.arvore',0) }} </small></div>
           </div> -->

        </div>
        <div class="col-3 col-lg-3 d-block d-sm-none d-md-none d-lg-block tc">
            <div v-if="$_.has(item,'status.area_km')" class="big-number"> {{ parseInt(item.status.area_km*100,10) }} </div>
            <div class="label"> ha </div>
        </div>

        

    </div>
</template>


<script>
    export default{
        props:{
            item:{
                default:{}
            },
        },
        computed:{
            visita:function(){
                return this.item.visitado
            },
        },
        methods:{
            selected:function(){

            },
            hoverParque:function(parqueID){
                // this.$store.dispatch('currentParque',parqueID)
            },
            
          

        }
    }
</script>