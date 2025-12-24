<template>

    <div class="busca" :class='state'>
        <div class="input-group">
             <span class="input-group-addon"><i class='fa fa-search'></i></span>
             <input :placeholder="placeholder" :value="value" class="form-control" type="search" @input="change"  @focus="state='focus'" @blur="state=''">
             <span class="input-group-addon"><i v-if="value!=''" id="limpa" @click="limpa" class='fa fa-times'></i> </span>
        </div>
    </div>

</template>




<script>

    import Vue from 'vue';

     export default {
        name: 'busca',
        
        data () {
            return {
                palavra:'',
                state:''
            }
        },

        props:{
            placeholder:{
                type:String,
                default:'Buscar'
            },
            value:{
                default:"",
            }
        },

        computed:{

        },

        methods:{

            change:function(ev){
                        var filtroWord = _.trim(ev.currentTarget.value);
                        this.palavra = filtroWord;
                        clearTimeout( this.filtrando )
                        this.filtrando =  setTimeout( ()=>{
                            this.$emit('change',this.palavra )
                            this.$emit('input',this.palavra )
                        },300 )
           
           },

           limpa:function(){
                this.palavra = "";
                this.$emit('change','')
                this.$emit('input','')
           }

        }
     }

</script>


<style lang="stylus" >
    
    @import "../css/variaveis";


    .busca{
        
        // width:100px;

        .input-group-addon{
            background:rgba(black,0.2);
            border:none;
            
            display: flex;
            align-items: center;
            padding-left: 10px;
        }

        ::-webkit-input-placeholder { 
            font-size:1.2rem;
            color:rgba(black,0.2);
        }

        input{
                border:none !important;
                box-shadow: initial !important;
                font-size:1.2rem;
                background:rgba(black,0.2);
                color:cor-azul !important;
                font-weight:600 !important;
                &:focus{
                    
                }
        }

        &:hover,&.focus{
            background:rgba(cor-azul,0.4);
        }
    }

</style>