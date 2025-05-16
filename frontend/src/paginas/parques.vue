<template>
    
        <conteudo :ajax="false" color="hsl(28, 59%, 53%)">
                
                <div class="list-wraper" v-if="!$route.params.id" >

                       <list-title class="mt5" title="Parques e Unidades de Conservação" />
                       
                       <div class="row mx-0 mt4">
                        <div class="col-5">
                                <div class="ph4 mt1 mb3"> TOTAL: <b>{{ itens.length }}</b> </div>
                        </div>

                        <div class="col-6 filters d-flex justify-content-end">
                            

                                <div class="filter ">
                                    <div class='label'> FILTROS:</div>
                                    <div class='filter-button'>
                                      
                                        <i v-tooltip="'Mostrar Parques com Sede'" 
                                            class='fa fa-home' 
                                            :class="{active:sedeFilter ==true}"
                                            @click="sedeFilter = !sedeFilter"
                                            ></i>
                             
                                        <eac-dropdown :options="atrativoOptions" v-model="atrativoFilter"> 
                                                <i class="vtl vtl-atrativo" 
                                                :class="{active:atrativoFilter.value != ''}"> <span class='label-dificuldade'></span> </i>
                                        </eac-dropdown> 
                    
                                        <eac-dropdown :options="bemfeitoriaOptionsFilter" v-model="bemfeitoriaFilter"> 
                                                <i class="vtl vtl-benfeitoria" 
                                                :class="{active:bemfeitoriaFilter.value != ''}"> <span class='label-dificuldade'></span> </i>
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

                        
                    <list  :itens="itens" template="list-item-parque" > </list>
                    
                </div>

                

 
                 <parquesinfo  v-if="$route.params.id" :id="$route.params.id" />
    

        </conteudo>

</template>


<script>
      import Conteudo from './conteudo.vue'

    export default {
        
        components: {
            'conteudo': Conteudo,
        },
        
        data(){
            return {
                sortingCriteria: "noSorting",
                mudando:false,
              

                sortingCriteria: {label:'',value:''},
                atrativoFilter: {label:'',value:''},
                bemfeitoriaFilter: {label:'',value:''},
                oficialFilter: false,
                sedeFilter: false,
                sortingDirection:'asc', //['asc','desc']
                mudando: false,
                options:
                [
                    {value:'status.num_visitantes', label: 'Mais visitados'},
                    {value:'nome', label: 'Nome'},
                    {value:'status.area_km', label: 'Tamanho'},
                    {value:'status.num_avistamentos.length', label: 'Avistamentos'},
                    // {value:'oficial', label: 'Oficiais'}
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

            atrativoOptions:function(){
                     return this.$store.getters.atrativoOptionsFilter
            },
            
            bemfeitoriaOptionsFilter:function(){
                     return this.$store.getters.bemfeitoriaOptionsFilter
            },
            

            parques:function(){
      
                return this.$store.getters.parques
            },

             itens:function(){
                let itens =  this.$store.getters.parques;
                
                if(_.isArray(itens)){
                    if(this.sortingCriteria.value != ''){
                       itens = _.orderBy(itens,[this.sortingCriteria.value],[this.sortingDirection] )
                    }

                } else {
                    return []
                }
                let _t = this;

                 if(this.sedeFilter == true) {
                    itens = _.filter(itens, item => { 
                        if(item.possui_sede != true){
                            return false
                        }
                        return true
                    })
                }

                if(this.atrativoFilter.value !== '' ) {
                  itens = _.filter(itens, item => {   
                      if( _.some(item.status.atrativos,{id:this.atrativoFilter.value}) ){
                    //  if( item.atrativo_set.includes(this.atrativoFilter.value)){
                          return true; 
                       } 
                        return false
                    })
                }  

                if(this.bemfeitoriaFilter.value !== '' ) {
                  itens = _.filter(itens, item => { 
                      if( _.some(item.status.benfeitorias,{id:this.bemfeitoriaFilter.value}) ){
                    //    if( item.benfeitoria_set.includes(this.bemfeitoriaFilter.value) ){
                            return true;
                       }
                       return false
                  })
                }
              
                return itens
            }
    
        },

        methods:{    
            sortDropdownTrail: function(selectedOption)
            {
                switch(selectedOption.value)
                {
                    case 'Nome':
                        //alert('Nome');
                        this.sortingCriteria = 'nome';
                    break;
                    case 'Tipo':
                        //alert('Tipo');
                        this.sortingCriteria = 'tipo';
                    break;
                    case 'Categoria':
                        //alert('Categoria');
                        this.sortingCriteria = 'categoria';
                    break;
                    case 'Custo de entrada':
                        //alert('Custo de entrada');
                        this.sortingCriteria = 'custo_entrada';
                    break;
                    case 'Região Administrativa':
                        //alert('Região Administrativa');
                        this.sortingCriteria = 'regiao_administrativa';
                    break;
                    default:
                        //alert('Nenhum');
                    break;
                }
                this.dropdownOptions.placeholder = selectedOption.value;
            }
        },

    }
    
</script>



<style lang="stylus">
    @import "../css/variaveis"

   

</style>