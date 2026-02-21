<template>
    <conteudo :ajax="false" color="rgb(113, 158, 3)">
        <div v-show="!$route.params.id" class='list-wraper'>
            <div class="row mt5 mb3">
                <div class="col-12 col-md-7">
                    <list-title  :title="title" />
                </div>
                
                <div class="col-12 col-md-5">
                    <b-button v-if="user" variant="outline-warning" @click="showtrilha">
                        <i class='fa fa-arrow-up'> Enviar trilha </i>
                    </b-button>
                </div>
                
                <!-- <div class="col-12 col-md-5">
                    <b-button variant="outline-warning" @click="showtrilha"> <i class='fa fa-arrow-up' /> Enviar trilha </b-button>
                </div> -->
            </div>

            <div class="row mx-0">
                <div class="col-5">
                        <div class="ph4 mt1 mb3"> TOTAL: <b>{{ itens.length }}</b> </div>
                </div>

                <div class="col-6 filters d-flex justify-content-end">
                    <div class="filter ">
                        <div class='label'>
                            FILTROS:
                        </div>

                        <div class='filter-button'>
                            <i v-tooltip="'Mostrar só Trilhas Sinalizadas'" 
                                class='fa fa-map-signs' 
                                :class="{active:sinalizadaFilter ==true}"
                                @click="sinalizadaFilter = !sinalizadaFilter"
                            ></i>
                            <i v-tooltip="'Mostrar só Trilhas Oficiais'" 
                                class='vtl vtl-oficial' 
                                :class="{active:oficialFilter ==true}"
                                    @click="oficialFilter = !oficialFilter"
                                ></i>
            
                                <eac-dropdown :options="filterOptions" v-model="dificuldadeFilter"> 
                                        <i class="vtl vtl-dificuldade" 
                                            :class="{active:dificuldadeFilter.value != ''}"
                                        > 
                                            <span class='label-dificuldade'></span> 
                                        </i>
                                    </eac-dropdown>
                                </div>

                        </div>

                        <div class="sort ">
                            <eac-dropdown :options="options" v-model="sortingCriteria"> 
                                <i  v-if="sortingDirection == 'asc'" @click="sortingDirection='desc'" class='fa fa-sort-amount-asc sort-icon'></i>
                                <i  v-if="sortingDirection == 'desc'" @click="sortingDirection='asc'" class='fa fa-sort-amount-desc sort-icon'></i>
                                <div class='sortname'>  {{ sortingCriteria.label }} </div>
                            </eac-dropdown>
                        </div>
                    </div>
                </div>
                <list :itens="itens" template="list-item-trilha" > </list>
            </div>
        <trilhasinfo v-if="$route.params.id" :id="$route.params.id" />
        <!-- Renderiza o conteúdo do formulário de adicionar uma nova trilha -->
        <envia-trilha-form />
        <!-- Renderiza o conteúdo do formulário de adicionar uma nova trilha -->
    </conteudo>
</template>


<script>
    import Conteudo from './conteudo.vue'
    import EnviaTrilhaForm from '../componentes/envia-trilha-form.vue'

    export default {
        props:{
            title:{
                default:"Trilhas"
            },
            userMode:{
                default:false
            }
        },
        data(){
            return {
                sortingCriteria: {label:'',value:''},
                dificuldadeFilter: {label:'',value:''},
                oficialFilter: false,
                sinalizadaFilter: false,
                sortingDirection:'asc', //['asc','desc']
                mudando: false,
                options:
                [
                    {value:'status.num_visitantes', label: 'Mais visitados'},
                    {value:'nome', label: 'Nome'},
                    {value:'status.comprimento', label: 'Tamanho'},
                    {value:'status.num_avistamentos.length', label: 'Avistamentos'},
                    {value:'oficial', label: 'Oficiais'}
                ],
                filterOptions:
                [
                    {value:'', label: 'Todas'},
                    {value:'0', label: 'Fácil'},
                    {value:'1', label: 'Moderado'},
                    {value:'2', label: 'Difícil'},
                    {value:'3', label: 'Especialista'},
                ],
            }
        },

        computed:{
            user:function(){
                console.log('User - trilhas: ', this.$store.getters.user)
                return this.$store.getters.user
            },

            itens:function(){
                let itens =  this.$store.getters.trilhas;

                if (!_.isArray(itens)) return []
                console.log('itens trilhas: ', itens)
                
                // sorting
                if(_.isArray(itens)){
                    if(this.sortingCriteria.value != ''){
                       itens = _.orderBy(itens,[this.sortingCriteria.value],[this.sortingDirection] )
                    }

                } else {
                    return []
                }

                // filtros
                itens = _.filter(itens, item => {                    
                    let res = true

                    // 🔹 FILTRO USUÁRIO (minhas trilhas)
                    if (this.userMode && this.user) {
                        console.log('Item - trilhas: ', item)
                        if (item.user_id !== this.user.pk) return false
                    }
                    
                    // 🔹 DIFICULDADE
                    if(this.dificuldadeFilter.value != '' ) {
                       res = (this.dificuldadeFilter.value == item.categoria)
                    }
                    if(res == false) return false

                    // 🔹 OFICIAL
                    if(this.oficialFilter){
                         if(item.oficial != true ) return false 
                    }

                    // 🔹 SINALIZADA
                    if(this.sinalizadaFilter == true) {
                        if(item.sinalizada != true) return false
                    }

                    // if( this.userMode == true){
                    //       if( _.get(item,'user',  _.get(item,'user.id' ))  != _.get(this.user,'pk') ) return false
                    // }



                    return res

                })
                return itens
            },

            trilhas:function(){
                if (this.userMode) {
                    return this.$store.getters.minhasTrilhas
                }
                return this.$store.state.trilhas
            },

        },

        components: {
            'conteudo': Conteudo,
            EnviaTrilhaForm
        },

        methods: {
            showtrilha:function(){
                window.UIEvents.$emit('enviaTrilha');
            }
           
        }
    }
    
</script>

<style lang="stylus">
    @import "../css/variaveis"
</style>
