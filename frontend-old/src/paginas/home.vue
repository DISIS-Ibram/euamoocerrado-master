-<template> 
   
    <transition name="fade" appear>

    <div v-if="$store.state.mapLoaded">

            <div id='widget-home'  class="fadein" :class='{fadeout:$store.getters.zoom > 12.7  }'>
                
                <!-- <div class='headline-top'>
                   <a href="https://largadaesportiva.com.br/#/event/1" target="_blank">Inscreva-se</a><br/>
                   <small><a  href="https://largadaesportiva.com.br/myregistrations" target="_blank">Acesse sua equipe</a></small>
              
                </div>  -->

                <!-- <div class='text-box'>
                   <p> Eu Amo Cerrado – Conhecer para preservar: cuida quem ama e ama quem conhece </p> 
                </div> -->

                <div class="widgets" v-pan>
                        <!-- <div class='widget'>
                            <div class="header">{{$t('Faltam')}}</div>
                            <div class="body "> {{days}}</div>
                            <div class="footer">{{$t('dias')}}</div>
                        </div> -->                    
                        
                        <div class='widget'>                     


                                <div class="body"> 
                                    <div>
                                        <h3 class="header"> Veja o que é possível fazer por aqui </h3>
                                        <p>
                                            Esse site faz parte do programa Eu Amo Cerrado, uma campanha de Educação Ambiental do Instituto Brasília Ambiental para a valorização desse bioma espetacular e de seus tesouros nos Parques do Distrito Federal.
                                        </p>

                                        <div class="link-ibram"> Visite Também:
                                            <a class="white" href="http://www.ibram.df.gov.br/" target="_blank">Brasília Ambiental</a>
                                        </div>

                                    </div>
                                </div>
                            
                        </div>

                       <div class='widget'>
                                
                                <div class="body"> 
                                    <div>
                                        <h3 class="header"> Conhecer o Cerrado! </h3>
                                        <p>
                                           Nas abas Árvores, Aves, Frutos, Mamíferos ou Peixes você encontra informações gerais sobre as espécies mais avistadas nos Parques do DF e os locais onde são frequentemente avistadas pelos usuários do site.
                                        </p>
                                    </div>
                                </div>
                            
                        </div>
                       <div class='widget'>
                                
                                <div class="body"> 
                                    <div>
                                        <h3 class="header"> Descobrir os Parques do DF </h3>

                                        <p>
                                          No link Parques você encontra fotos, localização, limites aproximados, horário de funcionamento, informações gerais, atrativos e benfeitorias dos parques geridos pelo Brasília Ambiental e outras unidades abertas ao público no DF. Também vai ver quais os locais mais visitados pelos demais usuários.

                                        </p>
                                    </div>
                                </div>
                            
                        </div>
                       <div class='widget'>
                                
                                <div class="body"> 
                                    <div>
                                        <h3 class="header"> Explorar as Trilhas de caminhada </h3>
                                        <p>
                                          Navegue pelas trilhas de caminhada já sinalizadas nos Parques e trilhas enviadas pela comunidade. Aqui você pode ver os comentários e avaliações feitos por outros usuários e também deixar suas marcas! Fez uma trilha legal? Compartilhe no site e deixe seus comentários para que outras pessoas possam ver as belezas que você viu! 
                                        </p>
                                    </div>
                                </div>
                            
                        </div>

                       <div class='widget'>
                                
                                <div class="body"> 
                                    <div>
                                        <h3 class="header">Acessar nosso acervo</h3>
                                        <p>
                                         No menu do no canto esquerdo do site é possível ter mais informações sobre projeto, enviar mensagem, ter acesso às publicações da coleção em em PDF e navegar clicando nos assuntos do menu.

                                        </p>
                                    </div>
                                </div>
                            
                        </div>

                         <div class='widget'>
                                
                                <div class="body"> 
                                    <div>
                                        <h3 class="header">Pronto para amar o cerrado?</h3>
                                        <p>
Faça seu login para ter acesso às funções de marcar os locais visitados e espécies avistadas. E comece sua aventura!
                                        </p>
                                    </div>
                                </div>
                            
                        </div>
                        
                </div>
                
            
            <div class='assinaturas mt1 '  :class='{fadeout:$store.getters.zoom > 12.7  }'>
                <!-- <ajaxcontent url="logos" :showLoader="false"></ajaxcontent> -->

                <div class="row">
                    <div class="col-6 col-sm-12">
                        <div class="logo-home tr">
                        <img src="/images/logo_nova_brasao.png"/>
                        </div>
                    </div>
                    <div class="col-6 col-sm-12">
                        <div class='f6 tr'>
                            <i>*Os limites dos parques são meramente ilustrativos</i><br/>
                            <i>*As informações de avistamentos são colaborativos e não validados pelo Ibram</i>
                            <i>v0.5.0</i>
                        </div>
                    </div>
                </div>
            </div>


            </div>


   </div>
        </transition>



</template>



<script>
 
 export default {
    name: 'home',

    data(){
        return{
            cpf:"06989062177",
            cd_equipe:"3048",

        }
    },

    created:function(){
       
        setTimeout(()=> UIEvents.$emit('resizeMapContainer'),400);


        // var watchID = navigator.geolocation.watchPosition(function(position) {
        //             do_something(position.coords.latitude, position.coords.longitude);
        // });

    },

    destroyed:function(){
         $('html').removeClass('home');
         setTimeout(()=> UIEvents.$emit('resizeMapContainer'),400)
    },

    computed:{
        days:function(){
            var date1 = new Date();
            var date2 = new Date('2018-06-10');
            // The number of milliseconds in one day
            var ONE_DAY = 1000 * 60 * 60 * 24
            // Convert both dates to milliseconds
            var date1_ms = date1.getTime()
            var date2_ms = date2.getTime()
            // Calculate the difference in milliseconds
            var difference_ms = Math.abs(date1_ms - date2_ms)
            // Convert back to days and return
            return Math.round(difference_ms/ONE_DAY)
        },

        // course:function(){
        //     return this.$store.getters.courses
        // },
        // stats:function(){
        //     return _.courseStats(this.course)
        // },
        // elevationUp:function(){
        //     return this.stats.dist_up;
        // },

        // elevationDown:function(){
        //     return this.stats.dist_down;
        // }


    },
 }

</script>

<style lang="stylus" >

    @import "../css/variaveis";

   
    
    .info{
        +mobile(){
            display:none !important;
        }
    }

    .logo-home {
        min-width: 60px;
    }


    #widget-home{
        box r 100px t 60px 
        width 450px;
        text-align center;

        .text-box{
            position: absolute;
            z-index: 1;            
            text-align: center;                                    
            background: #8d894d;
            padding 0.3em 0.5em;
            width 100%;

            p{
                font-family Sans-Serif;
                font-weight: bold;
                font-size: 14px;
                color: white;
            }         
            }


        .social{
            margin-top:0.3em;
            text-align:center;
            width 100%;
            ul{
                width 100%;
            }
            li{
                display:inline-block !important;
            }
            a{
                color:white;
                font-size:1.3em;
            }

        }
        
        

       +mobile(){
              background #cac46e;
            top: initial;
            bottom:initial;
            top:80vh;
            right: 5px;
            left: 5px;
            // top:60%;
            // height initial;
            width:initial;
            opacity 1 !important; //para o zoom nao desaparecer os widgets como acontece no desktop
        }


        .headline-top{
            background  color-orange;
            color white;
            text-transform uppercase;
            font-family font-title;
            padding 0.6em 1em;
            width 100%;
            a{
                color:white;
                font-weight 600;
                font-family font-subtitle;
                font-size:1.1rem;
            }

            &.azul{
                     background  color-dark-gray;
            }
        }

        .widgets{
            overflow:hidden;
            
            background #cac46e; //white; //color-dark-gray;
            width 100%;
            height 310px;
            margin-top:3px;
            // border-top 5px solid color-orange;
            color:darken(color-dark-gray,40%);

            font-size:1rem;

            +mobile(){
                //   height 100px;
                  font-size:0.7rem;
            }
        }

        .widget{

            font-size:0.8rem;
            bordercolor = lighten(color-dark-gray,20%);
            height 100%;
            display:block;
            float:left;
            width 100%;
            border-right:1px dotted bordercolor
            text-align left;
            color: white;
            position:relative;
            line-height:1;

            .header{    
                // box t 10 h 20% r 10 l 10
                // text-transform uppercase;
                font-family font-subtitle;
                font-size:2.4em;
                width:100%;
                padding-right:20%;
                color:white;
                // font-size:0.7em;
            }

            .body{
                box t 20% b 20% r 10 l 10;
                padding: 1rem 3rem;

                display: flex;
                -webkit-box-align: center!important;
                -ms-flex-align: center!important;
                align-items: center!important;
                justify-content: center;
                

                font-family font-subtitle;
                font-size:1em;
                font-weight 400;
                color:darken(#cac46e,60%);
                line-height:1.2;

                .link-ibram a{
                    display bottom;
                    font-size 15px
                    color grey
                }

                i{
                     font-size:1.2em;
                }
                
            }

            .footer{
                box b 5px h 20% r 10 l 10
                font-family font-subtitle;
                font-size:1em;
                font-weight 900;
                color:lighten(color-dark-gray,50%);
                text-transform uppercase;

                 display: flex;
                -webkit-box-align: center!important;
                -ms-flex-align: center!important;
                align-items: center!important;
                justify-content: center;

            }
        }


        .fotter-widget{
            background  color-dark-gray;
            width 100%;
            color:lighten(color-dark-gray,40%);
            border-top: 1px solid lighten(color-dark-gray,20%);
            font-family font-subtitle;
            font-size:1.1em;
            font-weight 900;
            padding: 0.5em 0em;

        }

    }


  .secao{
        text-align:center;
        padding-top:3em;
        padding-bottom:5em;
        position:relative;
        cursor:pointer;

        img{
            margin-bottom:2.5em;
            
        }

        h5{
            color: cor-azul;
            font-size:0.8rem;
            margin:0;
        }
        h2{
            color:cor-verde;
            font-weight: 600;
            font-size:2.0rem;
            margin-bottom:2rem;
        }

        .descricao,.desc{
            font-size:0.85rem;
            line-height:1.5;
            color:lighten(black,45%);
            text-align:left;
            p{
                color:inherit;
            }
        }

        &:nth-child(2){
            border-left: tipo = 1px solid lighten(black,85%);;
            border-right:tipo;
        }

        .seta{
            box abs b 20px r 40px
            color:cor-verde;
            font-size:3em;
            opacity:0.2;
            transition: 200ms;
        }

        &:hover{
            .seta{
                opacity:0.8;
                transition: 200ms;
            }
        }
    }
    .disable-gray {
        -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
        filter: grayscale(100%);
            
    }


    .assinaturas{

        color:white;
        text-align:center;
        position: fixed;
        bottom: 1em;
        right: 2em;

        .row .col{
            text-align: right;
        
        
        }
        

        .img-2x{
            img{
                // scale 110%;
            }
        }

        +mobile(){
            .f6{
                font-size:7px;
            }

            position: relative;
            margin:10px;
            bottom: 0em;
            right: 0em;
        }
    
        .secaologo{
            // text-algin:left;
            .apoio-type{
                text-align:left;
            }
        }
    }


</style>