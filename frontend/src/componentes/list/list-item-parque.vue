<template>
    <div v-if="item.nome" class='list-item-default row d-flex align-items-center' v-to="'/parques/'+item.id" @mouseover="hoverParque(item.id)"  @mouseout="hoverParque(false)"   >
       
        <!-- <div class="visitado d-block d-sm-none d-md-none d-lg-block">
            <visitadoparque :item="item" />
         </div>    -->
        <div class="col-9 col-lg-10 ">
            <h4 class="nome">{{item.nome}}</h4>
            <div class='info'>
            </div>
            <div class="description"><i>{{item.nome_decreto}}</i></div>
           <div class="benfeitorias" >
                <i v-if="item.possui_sede" v-tooltip="'Com Sede'"  style="font-size:16px;color:black; opacity:0.8; line-height:0.7;" class='fa fa-home'></i>
                
                <!-- <pre>{{item.status.atrativos}}</pre> -->
                <benfeitoria-icon v-if="$_.has(item,'status.benfeitorias')"  v-for="bem in $_.get(item,'status.benfeitorias',[])" :item="bem" class="icone"  > </benfeitoria-icon>
                <benfeitoria-icon  v-if="$_.has(item,'status.atrativos')"  v-for="bem in $_.get(item,'.status.atrativos',[])" :item="bem" class="icone" > </benfeitoria-icon>
           </div>

           <!-- <div class='small-label'> Avistamentos </div> -->
           <div class="d-flex align-items-center avistamentos " v-if="$_.has(item.status,'num_avistamentos')">
               <div v-if="$_.get(item,'status.num_trilhas') > 0" v-tooltip="'Nº Trilhas'" class="pr3"> <i class="vtl vtl-percurso"/><small> {{item.status.num_trilhas}} </small></div>
               <div v-if="$_.has(item,'status.num_avistamentos.ave')" v-tooltip="'Nº Aves Avistadas'" class="pr3"> <i class="vtl vtl-ave"/><small> {{ $_.get(item,'status.num_avistamentos.ave',0) }} </small></div>
               <div v-if="$_.has(item,'status.num_avistamentos.mamifero')" v-tooltip="'Nº Mamíferos Avistados'" class="pr3"> <i class="vtl vtl-mamifero"/><small> {{ $_.get(item,'status.num_avistamentos.mamifero',0) }} </small></div>
               <div v-if="$_.has(item,'status.num_avistamentos.fruto')" v-tooltip="'Nº Frutos Avistados'" class="pr3"> <i class="vtl vtl-fruto"/><small> {{ $_.get(item,'status.num_avistamentos.fruto',0) }} </small></div>
               <div v-if="$_.has(item,'status.num_avistamentos.arvore')" v-tooltip="'Nº Árvores Avistadas'" class="pr3"> <i class="vtl vtl-arvore"/><small> {{ $_.get(item,'status.num_avistamentos.arvore',0) }} </small></div>
           </div>

        </div>
        <div class="col-3 col-lg-2 d-block d-sm-none d-md-none d-lg-block tc">
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

<style lang="stylus">

    .benfeitorias{
        margin-bottom:15px;
        font-size:11px;

        .quantidade{
            display:none;
        }

        .bemfeitoria-icon{
            background none;
            padding:0;
            opacity:0.8;
        }


    }

</style>