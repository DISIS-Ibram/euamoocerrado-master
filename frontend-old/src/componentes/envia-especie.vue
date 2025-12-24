<template>

    <div>
 
          <div  class='enviatrilhaform'  v-if="showEnviaTrilhaWindow "    >

               <form @submit.prevent="enviarEspecie" class="inline" @click.stop> 

                <h2 class='white font-title mb-2'>  Enviar uma Espécie? </h2>
                    
                     
                    
                                
                    <div v-show="erro===true" class="alert alert-danger ph1 pv1" role="alert">
                          Erro {{erromsg}}
                    </div>
                    

                     <b-form-group label="Imagens*" label-size="sm" label-cols-sm="2" label-align-sm="right">
                            <b-form-file v-model="especie.imagens" accept="image/jpeg, image/png, image/gif" multiple></b-form-file>
                            <small> Selecione uma ou mais imagens. Dê preferência com fundo transparente. </small>
                            <b-form-input size="sm" placeholder="Autor das imagens" v-model="especie.autor" ></b-form-input>
                     </b-form-group>

                    <b-form-group label="Nome*" label-size="sm" label-cols-sm="2" label-align-sm="right">
                            <b-form-input size="sm" required trim v-model="especie.nome" placeholder="" :state="state" ></b-form-input>
                    </b-form-group>

                    <b-form-group label="Nome Cientifico*" label-size="sm" label-cols-sm="2" label-align-sm="right">
                            <b-form-input size="sm" required trim v-model="especie.nome_cientifico" placeholder="" :state="state" ></b-form-input>
                    </b-form-group>

                    <b-form-group label="Categoria*" label-size="sm"  label-cols-sm="2" label-align-sm="right">
                        <b-form-select size="sm"  v-model="especie.categoria" :options="[ {value:'ave',text:'Ave'},{value:'arvore',text:'Árvore'},{value:'fruto',text:'Fruto'}, {value:'mamifero',text:'Mamífero'}, {value:'peixe',text:'Peixe'} ]"></b-form-select>
                    </b-form-group>

                    <b-form-group label="Descrição*" label-size="sm"  label-cols-sm="2" label-align-sm="right">
                            <b-form-textarea required size="sm"  rows="1" max-rows="2" v-model="especie.descricao" placeholder="Descrição" :state="state" trim> </b-form-textarea>
                    </b-form-group>

                    <b-form-group label="Link com mais informações*" label-size="sm" label-cols-sm="2" label-align-sm="right">
                            <b-form-input size="sm" required trim v-model="especie.link" placeholder="" :state="state" ></b-form-input>
                    </b-form-group>


                    
                   
                        
                     <div class='tc'>

                            <button class='btn  mt-2' @click="showEnviaTrilhaWindow=false"> CANCELAR </button>

                     
                            <button class='btn btn-primary mt-2'  >  <span v-if='loading'> <i v-if='loading' class='fa fa-spinner fa-pulse fa-1x fa-fw'>  </i>  ENVIANDO </span> <span v-else> ENVIAR </span> </button>
                        
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
            especie:{
                nome:'',
                nome_cientifico:'',
                categoria:'',
                sinalizada:true,
                geom:'',
                atividades:[],
                descricao:' ',
                imagens:[],
                autor:''
            }
        }
    },


    created:function(){
        
        window.UIEvents.$on('enviaEspecie',this.showMarcaAvistamentoWindow);

        
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
        user:function(){
            return this.$store.getters.user
        },


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


        enviarEspecie:async function(){
            let especie = {...this.especie};

            this.erro = false;
            this.loading = true

            let res = await this.$store.dispatch('enviarEspecie', especie )

            
            
            if( _.has(res,'error') ){
                this.loading = false;
                this.erro = true
                this.erromsg = JSON.stringify(res.msg);
            }else{
                this.loading = false;
                this.showEnviaTrilhaWindow = false; 
                this.$router.replace("/minhasespecies/")
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
