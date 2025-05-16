<template>

    <div>
 
          <div  class='enviatrilhaform'  v-if="showEnviaTrilhaWindow "    >

               <form @submit.prevent="enviarTrilha" class="inline" @click.stop> 

                <h2 class='white font-title mb-2'>  Enviar uma trilha? </h2>
                    
                     
                     <!-- <map-select-feature v-model="feature" class='mapa-selected mb-2' type="Line" /> -->
                    
                                
                      <div v-show="erro===true" class="alert alert-danger ph1 pv1" role="alert">
                          Erro {{erromsg}}
                      </div>

                        <b-form-group label="Nome da trilha*" label-size="sm" label-cols-sm="2" label-align-sm="right">
                            <b-form-input size="sm" required trim v-model="trilha.nome" placeholder="Nome da Trilha" :state="state" ></b-form-input>
                    </b-form-group>

                        <b-form-group label="Descrição da trilha*" label-size="sm"  label-cols-sm="2" label-align-sm="right">
                            <b-form-textarea required size="sm"  rows="1" max-rows="2" v-model="trilha.descricao" placeholder="Descrição" :state="state" trim> </b-form-textarea>
                    </b-form-group>

                    <b-form-group label="Dificuldade*" label-size="sm"  label-cols-sm="2" label-align-sm="right">
                        <b-form-select size="sm"  v-model="trilha.categoria" :options="[ {value:0,text:'Facíl'},{value:1,text:'Moderado'}, {value:2,text:'Difícil'}, {value:3,text:'Especialista'},]"></b-form-select>
                    </b-form-group>
                    
                    <b-form-group label="Atividades" label-size="sm"  label-cols-sm="2" label-align-sm="right">
                            <b-form-checkbox-group  id="checkbox-group-2" v-model="trilha.atividade" name="flavour-2">

                                    <b-form-checkbox  size="sm"  v-for="(atividade,id) in atividades" :value="atividade.id" :key='"atividade"+id'> {{atividade.nome}} </b-form-checkbox >
                            
                            </b-form-checkbox-group>
                        </b-form-group>

                    </b-form-group>
                        
                     <div class='tc flex align-center justify-center'>

                            <button class='btn  mr-2' @click="showEnviaTrilhaWindow=false"> CANCELAR </button>
                     
                            <button v-if='totalFeatures>0' class='btn btn-primary '  >  <span v-if='loading'> <i v-if='loading' class='fa fa-spinner fa-pulse fa-1x fa-fw'>  </i>  ENVIANDO </span> <span v-else> ENVIAR </span> </button>
                            <button   class="btn disable" style="" v-else> - SELECIONE UMA TRILHA NO MAPA - </button>
                        
                    </div>

              </form>
        </div>



    </div>
  
</template>

<script>

export default {

    data(){
        return{
            username:"",
            email:"",
            name:'',
            password:"",
            erro:false,
            erromsg:"",
            showEnviaTrilhaWindow:false,
            marcandoAvistamento:false,
            esqueceuSenha:false,
            showRegister:false,
            esqueceuSenhaMsg:'',
            searchWord:'',
            categoria:"",
            especieSelecionada:false,
            feature:[],
            loading:false,
            trilha:{
                nome:'',
                categoria:0,
                sinalizada:true,
                geom:'',
                atividades:[],
                descricao:' ',
            }
        }
    },


    created:function(){
        
        window.UIEvents.$on('enviaTrilha',this.showMarcaAvistamentoWindow);

        
    },

    watch:{
        email:function(){
            this.erro = false
        },
        password:function(){
            this.erro = false
        },
       
        
    },

    computed:{

        atividades:function(){
            return this.$store.getters.trilhasAtividades
        },
        user:function(){
            return this.$store.getters.user
        },
        itens:function(){
                if(_.isEmpty(this.categoria)) return this.$store.getters.especies;
                var especiesAll = this.$store.getters.especiesByCategoria(this.categoria);
                return especiesAll;
        },
        getItens: function(){

                var word = this.searchWord;
                if( _.isEmpty(word)) return this.itens;
                return _.fuzzyFilter(word,[...this.itens],100);
        },

        totalFeatures:function(){
            return this.feature.length    
        }

    },


    methods:{

        showMarcaAvistamentoWindow:function(){
            if(this.user === false){
                alert("Faço login para poder enviar uma trilha")
            }else{
                this.showEnviaTrilhaWindow=true; 
                this.marcandoAvistamento = false;
            }
        },

    


        marcaAvistamento: async function(item){
            this.especieSelecionada = item;
            this.showEnviaTrilhaWindow = false;
            this.marcandoAvistamento = true;

            // window.map.once('click',(e)=>{
            //     // if(this.marcandoAvistamento){
            //     //     e.originalEvent.cancelBubble = true;
            //     //     this.$store.dispatch('addAvistamento',{point:e.lngLat, id:item.id}) 
            //     //     this.especieSelecionada = false;
            //     //     this.marcandoAvistamento = false;
            //     //     e.preventDefault();
            //     //     return false;
            //     // }
            // })
        },

        clickMarcaAvistamento: function(e){
                  if(this.marcandoAvistamento){
                    e.originalEvent.cancelBubble = true;
                    this.$store.dispatch('addAvistamento',{point:e.lngLat, id:this.especieSelecionada.id}) 
                    this.especieSelecionada = false;
                    this.marcandoAvistamento = false;
                    e.preventDefault();
                    return false;
                }
        },
        
        cancelaMarcarAvistamento:function(){
                this.especieSelecionada = false;
                this.marcandoAvistamento = false;
        },


        enviarTrilha:async function(){
            let trilha = {...this.trilha};

            // debugger;
            let processpoints = function(theArray,bag){
               for (let i = 0; i < theArray.length; i++) {
                   const elm = theArray[i];
                   if(_.isArray(elm)){
                       processpoints(elm, bag)
                   }else{
                       bag.push(elm)
                   }
               }
            }
            let bag = []
            processpoints( _.map(this.feature, f=>f.geometry.coordinates), bag)
            console.log(bag)
            let coords = [];
            for (let i = 0; i < bag.length; i=i+2) {
                coords.push(bag[i]+" "+bag[i+1])
            }

            let geom = "LINESTRING ("+coords.join(',')+")"; 
            console.log(geom)
            // trrilha.geom = 'LINESTRING (2.043350 41.979704, 12.502334 42.597372, -1.164658 48.701654)'
            trilha.geom = geom


            this.erro = false;
            this.loading = true

            let res = await this.$store.dispatch('enviarTrilha', trilha )

            
            
            if( _.has(res,'error') ){
                this.loading = false;
                this.erro = true
                this.erromsg = JSON.stringify(res.msg);
            }else{
                this.loading = false;
                this.showEnviaTrilhaWindow = false; 
                this.$router.replace("/minhastrilhas/"+res.id)
              
            }

        },
    }

}
</script>

<style lang="stylus" scoped>
     @import "../css/variaveis";

    .enviatrilhaform{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:rgba(black,0.6);
        display:flex;
        align-items: center;
        justify-content: center;
        z-index:100;

        form{
            position:absolute;
            overflow:auto;
            padding:2em;
            background hsl(21, 73%, 55%);
            min-height 350px;
            min-width:350px;
            // max-width:950px;
            top:40px;
            left:20px;
            right:20px;
            bottom:20px;

            display: flex;
            flex-direction: column;

             +between(1, 576px){
                
                padding:1em;
                background hsl(21, 73%, 55%);
                min-height calc(100% - 6px);
                min-width:initial;
                max-width:calc(100% - 6px);
                margin-bottom:0rem;

                top:5px;
                left:5px;
                right:5px;
                bottom:5px;

             }


             .mapa-selected{
                   flex-grow: 1;
                   min-height: 250px;
            
              }

        }

    }


    .marcaavistamentoinfo{

        position:fixed;
        top:initial;
        bottom:10px;
        left:10px;
        right:10px;
        border-radius:4px;
        background:rgba(#e07337,1);
        display:flex;
        align-items: center;
        justify-content: center;
        height:50px;
        font-size:32px;
        box-shadow 4px 4px 6px 7px rgba(0,0,0,0.4)

        +between(1, 576px){
            // h3{
                font-size:12px;
            // }
        }


    }


    .listavistamento{
        max-height 40vh;
        +between(1, 576px){
            max-height 60vh;
        }
        overflow auto

    }

</style>
