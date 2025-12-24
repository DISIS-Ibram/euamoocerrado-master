<template>

        <conteudo :ajax="false">
            <div class="ph4">
               
                <!-- <list-title title="Sobre o projeto" /> -->

      


                <p><br></p><p><br></p><div style="text-align: center;">
                    <img class="" src="/images/euamocerrado.png" width="250" style="width: 214px; height: 181px;"></div><p style="text-align: center;"><br></p><div>
                </div>

                <p><i><b>Eu Amo Cerrado</b> – Conhecer para preservar: cuida quem ama e ama quem conhece</i></p>

                <p style="text-align: left;">O Cerrado é a Savana mais rica do mundo no quesito biodiversidade, abriga milhares de espécies vegetais e animais. Muitas delas exclusivas nesse bioma, várias em risco de extinção. Precisamos buscar estratégias mais eficientes para preservar o cerrado, mas primeiro precisamos conhecê-lo melhor. A coleção Eu Amo Cerrado é uma iniciativa da Unidade de Educação Ambiental – Educ do Instituto Brasília Ambiental - Ibram, órgão governamental que tem como missão juntamente com a população de proteger o patrimônio natural do Distrito Federal-DF. A coleção catalogou algumas espécies presentes nas Unidades de Conservação (tipo Parques) de: aves, mamíferos, árvores, frutos e peixes. Para enriquecer a experiência, nada melhor do que entrar em contato com as nossas belas unidades de conservação realizando trilhas em meio à natureza. O projeto parte da perspectiva de que só cuida quem ama e só ama quem conhece. Assim, espera-se que, por meio dessa ferramenta cada vez mais pessoas conheçam e dediquem a cuidar do meio ambiente e incentivem outras pessoas no contato com a natureza.
                </p>
                <p>
                <strong>Idealização e Coordenação Geral:</strong><br>
                Unidade de Educação Ambiental – Educ do Instituto Brasília Ambiental – Ibram<br>
             
                </p><p><br></p>
                
                <hr />
                                
                <email-contato></email-contato>

                <div class="mt4 mb-5">
                    <img src="/images/logo_att.png"/>
                </div>
</div>
        </conteudo>

</template>


<script>
    import Conteudo from './conteudo.vue'
    // import marked from 'marked'

    export default {
        data(){
            return {
                mudando:false
            }
        },

        components: {
            'conteudo':Conteudo
        },

        computed:{
        
        },




        watch:{
         
        },

       
        methods:{
        

        }


    }
    
</script>



<style lang="stylus">
    @import "../css/variaveis"


</style>