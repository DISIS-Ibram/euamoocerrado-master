<template>

        <conteudo :ajax="false">


            <div class="ph4">

                <div class="text-box">
                   <h3> Veja o que é possível fazer por aqui </h3>
                </div>

                <div>
                    <h3> Conhecer o Cerrado! </h3>
                        <p>
                                           Nas abas Árvores, Aves, Frutos, Mamíferos ou Peixes você encontra informações gerais sobre as espécies mais avistadas nos Parques do DF e os locais onde são frequentemente avistadas pelos usuários do site.
                        </p>

                    <h3> Descobrir os Parques do DF </h3>
                        <p>
                        No link Parques você encontra fotos, localização, limites aproximados, horário de funcionamento, informações gerais, atrativos e benfeitorias dos parques geridos pelo Brasília Ambiental e outras unidades abertas ao público no DF. Também vai ver quais os locais mais visitados pelos demais usuários.
                        </p>

                    <h3 class="header"> Explorar as Trilhas de caminhada </h3>
                        <p>
Navegue pelas trilhas de caminhada já sinalizadas nos Parques e trilhas enviadas pela comunidade. Aqui você pode ver os comentários e avaliações feitos por outros usuários e também deixar suas marcas! Fez uma trilha legal? Compartilhe no site e deixe seus comentários para que outras pessoas possam ver as belezas que você viu!                         </p>

                    <h3 class="header">Acessar nosso acervo</h3>
                        <p>
 No menu do no canto esquerdo do site é possível ter mais informações sobre projeto, enviar mensagem, ter acesso às publicações da coleção em em PDF e navegar clicando nos assuntos do menu.                        </p>

                    <h3>Pronto para amar o cerrado?</h3>
                        <p>
Faça seu login para ter acesso às funções de marcar os locais visitados e espécies avistadas. E comece sua aventura!                        </p>
                </div>

                <div class="link-ibram"> <b>Visite Também:</b>
                    <a class="white" href="http://www.ibram.df.gov.br/" target="_blank">Brasília Ambiental</a>
                </div>
                <hr>
                <p>
                <b>Idealização e Coordenação Geral:</b><br>
                Unidade de Educação Ambiental – Educ do Instituto Brasília Ambiental – Ibram<br>
             
                </p><br>

                <div class="mt4 mb-5">
                    <img class='' src="/images/logo_att.png" />
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

    .text-box {
            z-index 1;        
            text-align left;
            padding 0.3em 0.5em;
            color white;

            p{
                font-family Sans-Serif;
                font-weight bold;
                color white;           
            }         
        }

    .links {
        color white;
        font-size 1em;        
        font-style italic;
    }

</style>