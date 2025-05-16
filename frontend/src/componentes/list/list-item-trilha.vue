<template>
    <div class='row list-item-default d-flex align-items-center' v-to="'/trilhas/'+item.id">
       
        <div class='oficial-icon'>
            <is-oficial :status="item.oficial" />
        </div>


    




           
                <div class="col-12">
                    <h4 class="nome">{{item.nome}}</h4>

                    <trilhas-info-icones :trilha="item" />

                     <!-- <div class="infos">

                        <trilha-sinalizacao :sinalizacao="item.sinalizada" />
                        <trilha-dificuldade :trilha="item" />

                        
                        <div class="trilha-atividade-list">
                            <trilha-atividade :atividades="item.atividades"></trilha-atividade>
                        </div>

                    </div> -->

                    <!-- <div class="visitado"> -->
                        <!-- <visitadotrilha :item="item" /> -->
                    <!-- </div>  -->
                </div>

    

                <div class="col-9">
                    <!-- <h4 class="nome">{{item.nome}}</h4> -->

                   

                    <div class="description" v-html="item.descricao.replace(/<[^>]*>?/gm, '').substring(0,125)"></div>
                    <!-- <div class="d-flex align-items-center avistamentos ">
               <div v-tooltip="'Nº Trilhas'" class="pr3"> <i class="vtl vtl-percurso"/><small> {{item.status.num_trilhas}} </small></div>
               <div v-tooltip="'Nº Aves Avistadas'" class="pr3"> <i class="vtl vtl-ave"/><small> {{ $_.get(item,'status.num_avistamentos.ave',0) }} </small></div>
               <div v-tooltip="'Nº Mamíferos Avistados'" class="pr3"> <i class="vtl vtl-mamifero"/><small> {{ $_.get(item,'status.num_avistamentos.mamifero',0) }} </small></div>
               <div v-tooltip="'Nº Frutos Avistadas'" class="pr3"> <i class="vtl vtl-fruto"/><small> {{ $_.get(item,'status.num_avistamentos.fruto',0) }} </small></div>
               <div v-tooltip="'Nº Arvores Avistadas'" class="pr3"> <i class="vtl vtl-arvore"/><small> {{ $_.get(item,'status.num_avistamentos.arvore',0) }} </small></div>
           </div> -->

                    <div class="d-flex align-items-center avistamentos " v-if="$_.has(item.status,'num_avistamentos')">
                        <!-- <div v-tooltip="'Nº Trilhas'" class="pr3"> <i class="vtl vtl-percurso"/><small> {{item.status.num_trilhas}} </small></div> -->
                        <div v-tooltip="'Nº Aves Avistadas'" class="pr3"> <i class="vtl vtl-ave" /><small>
                                {{ $_.get(item,'status.num_avistamentos.ave',0) }} </small></div>
                        <div v-tooltip="'Nº Mamíferos Avistados'" class="pr3"> <i class="vtl vtl-mamifero" /><small>
                                {{ $_.get(item,'status.num_avistamentos.mamifero',0) }} </small></div>
                        <div v-tooltip="'Nº Frutos Avistados'" class="pr3"> <i class="vtl vtl-fruto" /><small>
                                {{ $_.get(item,'status.num_avistamentos.fruto',0) }} </small></div>
                        <div v-tooltip="'Nº Árvores Avistadas'" class="pr3"> <i class="vtl vtl-arvore" /><small>
                                {{ $_.get(item,'status.num_avistamentos.arvore',0) }} </small></div>
                    </div>

                </div>

                <div class="col-3 tc">
                    <div v-if="$_.has(item,'status.comprimento')" class="big-number"> {{ item.status.comprimento }}
                    </div>
                    <!-- <div class="big-number"> {{ parseInt(item.status.area_km*100,10) }} </div> -->
                    <div class="label"> km </div>
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
        user:function(){
            return this.$store.getters.user
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

   

    .infos {
        text-align: left;
        
        margin-top:5px;
        margin-bottom:5px;
       
        div{
            display:inline;
            font-size:1.1em;
            padding:0px;
            color: lighten(#EAAE40,30%);
            // opacity:0.8;
            margin-right:0.2em;
        }
    }


    

    .is-oficial-list-trilha {
        margin-bottom: 5px;
    }

    .trilha-dificuldade-list {
        width: 50%;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .trilha-atividade-list {
        display: inline-block;
        margin-top: 5px;
        margin-bottom: 5px;
    }

</style>