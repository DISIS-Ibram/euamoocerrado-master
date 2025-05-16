<template>
    <div class="mt-5">
        <h4> Envie uma mensagem: </h4>
        <p><a href="mailto:ibram.educ@gmail.com">ibram.educ@gmail.com</a></p>
        <!-- <form  class='contato' @submit.prevent="enviaEmail">
            <div class="form-group">
                <label for="exampleInputEmail1">Nome</label>
                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="name" v-model="form.name" >
            </div>

            <div class="form-group">
                <label for="exampleInputPassword1">Email</label>
                <input type="email" class="form-control" id="exampleInputPassword1" name="email"  v-model="form.email">
            </div>

            <div class="form-group ">
                <label for="exampleInputEmail1">Mensagem</label>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"  v-model="form.message"></textarea>
            </div>
            
            <div class="alert alert-success" v-if="send===true"> Mensagem enviada com sucesso! </div>
            <button type="submit" class="btn btn-primary">Enviar</button>
            


        </form> -->
    </div>


</template>

<script>
export default {
    data(){
        return {
            form:{
                name:'',
                email:'',
                message:''
            },
            send:false,
        }
    },

    methods:{
        enviaEmail:function(ev){  
            ev.preventDefault();
            
             _.postJSON( this.api.apiurl+"administracao/contact/", { ...this.form }, data=>{
                   
                    this.send=true;

                    this.form.email = ''
                    this.form.name = ''
                    this.form.email = ''
                    this.form.message = ''
                    


             })

        }
    }

}
</script>

<style lang="stylus">

    .contato{
        label{
            color:white
        }

    }

</style>
