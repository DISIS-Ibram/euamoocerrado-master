<template>
   
   
    <div v-if="user===false">
        
        <div  class="icon-menu d-none d-sm-block" @click="showLogin=!showLogin"> 
          <span class='icon'>  <i class='fa fa-user'></i> </span>
          <div class='label'>  <span class='label  fw-1'> Fazer Login</span> </div>
        </div>
        
        <div v-if="esqueceuSenha" class='loginform' >
               <form @submit.prevent="esqueceusenha" class="" @click.stop> 

                <h2 class='white font-title mb-2'> Esqueceu <br />sua senha? </h2>
                    <div class="form-group row">  
                        <div class="col-sm-12 mt2">
                            <input type="text"  class="form-control" id="staticEmail" placeholder="Digite seu Email" v-model="email">
                        </div>
                    </div>
                    <div class="form-group row">  
                        <div class="col-sm-12 mt2">
                           {{ esqueceuSenhaMsg }}
                        </div>
                    </div>

                     <div>
                    <span class='white o-70 fw1' @click="esqueceuSenha=false"> cancelar </span>
                    <button class='btn pull-right'> Recuperar </button>
                </div>

        

              </form>
        </div>

        <div v-else-if="showLogin" class='loginform' @click="showLogin=!showLogin">
            <form @submit.prevent="login" class="" @click.stop> 
              
                <h2 class='white font-title mb-2'> Login </h2>
              
                <div class="form-group row">  
                    <div class="col-sm-12 mt-2">
                         <input type="text"  class="form-control" id="staticEmail" placeholder="Email" v-model="email">
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-12">
                      <input type="password" class="form-control" id="inputPassword" placeholder="Senha" v-model="password" >
                      <div class='mt2 fw1' @click="esqueceuSenha=true"> Esqueceu sua senha?</div>
                    </div>
                </div>

                <div v-show="erro===true" class="alert alert-danger ph1 pv1" role="alert">
                       Credenciais inválidas!
                </div>

                <div>
                    <span class='white o-70 fw1' @click="showLogin=false"> cancelar </span>
                    <button class='btn pull-right'> entrar </button>
                </div>

                <hr  class='mt-2'/>
    
                <div class='mt-4 tc'>
                    <a class='btn btn-secundary' @click="()=>{showLogin=false;showRegister=true}"> Ou Registre-se </a>
                </div>
    
            </form>
        </div>






         <div v-else-if="showRegister" class='loginform' @click="showRegister=!showRegister">
            <form @submit.prevent="register" class="" @click.stop> 
              
                <h2 class='white font-title mb2'> Registre-se <img class='pull-right' src="/images/euamocerrado.png" width="50" /></h2>
              
                <div class="form-group row">  
                    <div class="col-sm-12">
                         <input type="text"  required class="form-control" id="staticEmail" placeholder="Seu Nome" v-model="name">
                    </div>
                </div>
                <!-- <div class="form-group row">  
                    <div class="col-sm-12">
                         <input type="text"  class="form-control" id="staticEmail" placeholder="Usuário" v-model="username">
                    </div>
                </div> -->
                <div class="form-group row">  
                    <div class="col-sm-12">
                         <input type="email"  required class="form-control" id="staticEmail" placeholder="Email" v-model="email">
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-12">
                      <input type="password" required class="form-control" id="inputPassword" placeholder="Senha" v-model="password" >
                    </div>
                </div>

                  <div v-show="erro===true" class="alert alert-danger ph1 pv1" role="alert">
                       Erro {{erromsg}}
                </div>
             
                <span class='white' @click="showLogin=false"> cancelar </span>
                <button class='btn pull-right'> cadastrar </button>

            </form>
        </div>

    </div>
    
    <!-- IF USER LOGIN -->
    <div v-else>
         <div class="icon-menu d-none d-sm-block" @click="showLogin=!showLogin"> 
       
             

       
             <span>
            <b-dropdown id="dropdown-1" class='dropdownlink white'  size="sm" toggle-tag="span"   >
                <template slot="button-content">   
                    <span class="fa-stack ">
                        <i style="color:gray" class="fa fa-circle fa-stack-2x"></i>
                        <i class="fa fa-user fa-stack-1x fa-inverse"></i>
                    </span> 
                    {{ (user.first_name && user.first_name  || user.email) | truncate(20) }}  
                </template>

                <!-- <b-dropdown-item v-to="'/meusavistamentos'">Meus Avistamentos</b-dropdown-item> -->
                <b-dropdown-item v-to="'/minhastrilhas'"> Minhas Trilhas </b-dropdown-item>
                <b-dropdown-item v-to="'/minhasespecies/ave'" > Minhas Espécies </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item @click.native="$store.dispatch('logout')" > <i class='fa fa-sign-out'></i>  Sair </b-dropdown-item>
            </b-dropdown>

            </span> 
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
            showLogin:false,
            esqueceuSenha:false,
            showRegister:false,
            esqueceuSenhaMsg:'',
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


    created:function(){
        window.UIEvents.$on('showLogin',this.showLoginWindow)
    },


    computed:{
        user:function(){
            return this.$store.getters.user
        }
    },

    methods:{
        showLoginWindow:function(){
            this.showLogin = true;
        },
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
    }

}
</script>

<style lang="stylus">
     @import "../../css/variaveis";

    .loginform{
        position:fixed;
        z-index:1000;
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
                
                padding: 1em;
                background: hsl(21, 73%, 55%);
                min-height: 350px;
                min-width: initial;
                max-width: calc(100% - 6px);
                margin-bottom: 0rem;

            }

        }

    }

</style>
