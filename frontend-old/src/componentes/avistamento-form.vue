<template>
    <div>

         <div class="icon-menu d-none d-sm-block pv4" id='marcaAviatamentoButtom' @click="()=>showMarcaAvistamentoWindow()" > 
            <span class='icon'>  <i class='fa fa-binoculars'></i> </span>
            <div class='label pv1'> Marcar Avistamento </div>
        </div>

        
        
          <div v-if="showMarcarAvistamento && especieSelecionada === false" class='loginform' >

               <form @submit.prevent="esqueceusenha" class="" @click.stop> 

                <h2 class='white font-title mb-2'>  Marcar Avistamento? </h2>
                <small> Selecione uma espécie abaixo </small>

              
                     
                    <div class="mt2 ">
                            <busca v-model="searchWord" />
                    </div>

                    <div class="pv2 ph1 mb1 d-flex">
                        <a class="dib ph2 pv2 black" @click="categoria='ave'">
                            <i class='vtl vtl-ave fa-2x' :class="{black:categoria== 'ave'}"></i>
                        </a>
                        <a class="dib ph2 pv2 black" @click="categoria='mamifero'">
                            <i class='vtl vtl-mamifero fa-2x'  :class="{black:categoria== 'mamifero'}"></i>
                        </a>
                        <a class="dib ph2 pv2 black" @click="categoria='peixe'">
                            <i class='vtl vtl-peixe fa-2x'  :class="{black:categoria== 'peixe'}"></i>
                        </a>
                        <a class="dib ph2 pv2 black" @click="categoria='fruto'">
                            <i class='vtl vtl-fruto fa-2x'  :class="{black:categoria== 'fruto'}"></i>
                        </a>
                        <a class="dib ph2 pv2 black" @click="categoria='arvore'">
                            <i class='vtl vtl-arvore fa-2x'  :class="{black:categoria== 'arvore'}"></i>
                        </a>

                    </div>

                    <div class='list listavistamento'>
                        <list-item v-for="item in getItens" :item="item" template="list-item-especie-avis" :key="item.id+'list-item-especie-avis'"  @click.native.prevent="marcaAvistamento(item)">
                        </list-item>
                    </div>


                     <div>
                    <button class='btn pull-right mt-2' @click="showMarcarAvistamento=false"> FECHAR </button>
                </div>

              </form>
        </div>



         <div v-if="marcandoAvistamento === true" class='marcaavistamentoinfo' >

                <span> Click no mapa o local do avistamento da {{especieSelecionada.nome}} ! <a class='pointer btn btn-primary' @click="cancelaMarcarAvistamento"> cancelar</a>  </span>

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
            showMarcarAvistamento:false,
            marcandoAvistamento:false,
            esqueceuSenha:false,
            showRegister:false,
            esqueceuSenhaMsg:'',
            searchWord:'',
            categoria:"",
            especieSelecionada:false
        }
    },


    created:function(){
        window.UIEvents.$on('marcaAvistamento',this.showMarcaAvistamentoWindow)
    },

    watch:{
        email:function(){
            this.erro = false
        },
        password:function(){
            this.erro = false
        },
        marcandoAvistamento:function(val){
            if(val=== true){
                $('html').addClass('onlymap')
                 $('html').addClass('insertpoint')

            }else{
                setTimeout(()=>{
                        $('html').removeClass('onlymap')
                        $('html').removeClass('insertpoint')
                },200)
            }

            if(val===true){
                 window.map.once('click',this.clickMarcaAvistamento)
            }else{
                window.map.off('click',this.clickMarcaAvistamento)
                this.especieSelecionada = false;
                this.marcandoAvistamento = false;
            }

        },
        
    },

    computed:{
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
    },


    methods:{

        showMarcaAvistamentoWindow:function(item = false){
            if(this.user == false){
                alert("Faço o login para marcar os avistamentos")
                return
            }
            this.showMarcarAvistamento=true; 
            this.marcandoAvistamento = false;
            this.especieSelecionada = false;
      
            if(item){
                 this.marcaAvistamento(item)
            }
                

        },
      

       


        marcaAvistamento: async function(item){
            this.especieSelecionada = item;
            this.showMarcarAvistamento = false;
            this.marcandoAvistamento = true;

         
        },

        clickMarcaAvistamento: function(e){
                  if(this.marcandoAvistamento){
                    e.originalEvent.cancelBubble = true;
                    e.originalEvent.preventDefault();
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
        }
    }

}
</script>

<style lang="stylus">
     @import "../css/variaveis";

    .loginform{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:rgba(black,0.6);
        display:flex;
        align-items: center;
        justify-content: center;

        form{
            padding:2em;
            background hsl(21, 73%, 55%);
            min-height 350px;
            min-width:350px;
            max-width:450px;
            margin-bottom:5em;

             +between(1, 576px){
                
                padding:1em;
                background hsl(21, 73%, 55%);
                min-height calc(100% - 6px);
                min-width:initial;
                max-width:calc(100% - 6px);
                margin-bottom:0rem;

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
