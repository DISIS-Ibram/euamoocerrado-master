<template>
    <div >

        <div class='pointer' @click="showMarcarAvistamento=!showMarcarAvistamento"> Enviar Trilha </div>
        
        
          <div v-if="showMarcarAvistamento && especieSelecionada === false" class='loginform' >

               <form @submit.prevent="esqueceusenha" class="" @click.stop> 

                <h2 class='white font-title mb-2'> Enviar Trilha! </h2>
                <input type="text" name="name" placeholder="Nome">

              </form>
        </div>



         <div v-if="showMarcarAvistamento == false && especieSelecionada !== false" class='marcaavistamentoinfo' >

                <h3> Click no mapa o local do avistamento da {{especieSelecionada.nome}} ! </h3>

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
            esqueceuSenha:false,
            showRegister:false,
            esqueceuSenhaMsg:'',
            searchWord:'',
            categoria:"",
            especieSelecionada:false
        }
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
        login:async function(){
            var res = await this.$store.dispatch('login',{email:this.email, password:this.password})
            this.erro = !res
            console.log(res);
        },
        register:async function(){
            var res = await this.$store.dispatch('register',{username:this.username, password:this.password, email:this.email, first_name:this.name})
            console.log(res);
            if(res.error == true){
                        this.erro = true
                        this.erromsg = JSON.stringify(res.msg);
                        return false
            }else{
                this.login()
            }
            this.showRegister = false;
            
        },

        esqueceusenha:async function(){
            var res = await this.$store.dispatch('recoverPasswordRequest',{email:this.email})
            this.esqueceuSenhaMsg = res
        },


        marcaAvistamento: async function(item){
            this.especieSelecionada = item;
            this.showMarcarAvistamento = false;
            window.map.once('click',(e)=>{
                    
                    e.originalEvent.cancelBubble = true;
                    this.$store.dispatch('addAvistamento',{point:e.lngLat, id:item.id}) 
                    this.especieSelecionada = false
                    e.preventDefault();
                    return false;
            })



        },
    }

}
</script>

<style lang="stylus">

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

        }

    }


    .marcaavistamentoinfo{

        position:fixed;
        top:initial;
        bottom:0;
        left:0;
        right:0;
        background:rgba(black,0.6);
        display:flex;
        align-items: center;
        justify-content: center;
        height:60px;

    }


    .listavistamento{
        max-height 40vh;
        overflow auto

    }

</style>
