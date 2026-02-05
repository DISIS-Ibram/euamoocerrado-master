-<template> 
   
    <div class="row">

        <div class="col-6 col-offset-3">
            <div class='loginform'>
                <form @submit.prevent="newPasswordRequest" class="" @click.stop>

                    <h2 class='white font-title mb-2'> Redefinição de Senha </h2>
                    <div class="form-group row">
                        <div class="col-sm-12 mt2">
                            <input type="password" class="form-control" id="staticEmail" placeholder="Digite sua nova enha"
                                v-model="password1">
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-12 mt2">
                            <input type="password" class="form-control" id="staticEmail" placeholder="Confirme sua nova senha"
                                v-model="password2">
                        </div>
                    </div>

                    <div class="form-group row" v-if="error">
                    <div class="col-sm-12 mt2 text-danger">
                        {{ error }}
                    </div>
                    </div>

                    <div>
                        <button class='btn pull-right' @click="newPasswordRequest"> Alterar Senha </button>
                    </div>

                </form>
            </div>

        </div>
    </div>


</template>



<script>
 
 export default {
    name: 'home',

    data(){
        return{
            password1:"",
            password2:"",
            error:false,
        }
    },

    // methods:{
    //     newPasswordRequest:async function(){
    //         this.error = false
    //         if(this.password1 != this.password2){
    //             this.error = "Senhas não são identicas"
    //             return false;
    //         }
         
    //         var res = await this.$store.dispatch('newPasswordRequest',{id:this.$route.params.id, token:this.$route.params.token,password:this.password1})

    //         if(!res)
    //             this.error = "Ocorreu um erro"

    //         this.$router.push('/')
    //     },
    // }

    methods: {
        async newPasswordRequest() {
            this.error = false

            if (this.password1 !== this.password2) {
                this.error = "Senhas não são idênticas"
            return
            }

            try {
            await this.$store.dispatch('newPasswordRequest', {
                id: this.$route.params.id,
                token: this.$route.params.token,
                password: this.password1
            })

            // sucesso
            this.$router.push('/')

            } catch (err) {
            // erro vindo do backend
            if (err.response && err.response.data) {
                this.error = err.response.data.detail || "Erro ao redefinir a senha"
            } else {
                this.error = "Erro ao redefinir a senha"
            }
            }
        }
    }


 }

</script>

<style lang="stylus" >

    @import "../css/variaveis";


</style>