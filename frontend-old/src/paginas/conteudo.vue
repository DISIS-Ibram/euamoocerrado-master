<template>
    <transition name="slide"
        v-on:enter="enter"
        v-on:beforeLeave="beforeLeave"
        v-bind:css="false"
        duration="400" apper>

        <div id='conteudo-container' ref="conteudo" class="col-12 col-sm-6  col-md-6 col-lg-4" :style="{backgroundColor:color}" >
                <div class="close" @click="goBack"> <i class='fa fa-times'></i> </div>
                
                    <div class='scroll-content'> 

                        <ul class='nav compartilhar'>
                            <li v-tooltip="'Compartilhar no Facebook'"><a target="_blank" :href="'http://www.facebook.com/sharer.php?u='+urllocal"> <i class='fa fa-facebook'></i></a></li>
                            <!-- <li><a target="_blank" href="https://instagram.com/euamoocerrado/"> <i class='fa fa-instagram'></i></a></li> -->
                            <li v-tooltip="'Compartilhar no Twitter'"><a target="_blank" :href="`http://twitter.com/share?text=Eu amo o Cerrado&url=${urllocal}&hashtags=#euamocerrado`"> <i class='fa fa-twitter'></i></a></li>
                            <li v-tooltip="'Compartilhar no WhatsApp'"><a target="_blank" :href="`whatsapp://send?text=${urllocal}`" data-action="share/whatsapp/share" > <i class='fa fa-whatsapp'></i></a></li>
                        </ul>

                        <hr class='my-0'>

                        <div v-if="ajax" class='px-5'>
                            <ajaxcontent :url="getContentURL()"></ajaxcontent>
                        </div>
                        <slot></slot>
                    </div>
                 </div>


    </transition>
</template>


<script>

   export default {
    data () {
        return {
            open:false,
            loading: false,
            post: null,
            error: null,
            className:'col-4',
            html:''
        }

    },

    props:{
        ajax:{
            default:true,
        },
        url:{
            default:false,
        },
        color:{
            default:"hsl(64, 100%, 34%)"
        }
        

    },


    created () {
    },

    mounted:function(){
        this.$nextTick(
            // ()=>this.show()
        )
    },

    beforeRouteEnter(to, from, next) {
        console.log("***************** route beforeRouteEnter")
        setTimeout(next,1000)
    },

    beforeRouteUpdate(to, from, next) {
        console.log("*****************route beforeRouteUpdate")
        next();
    },
 
    beforeRouteLeave(to, from, next) {
        console.log("*****************route beforeRouteLeave")
        this.hide();
        setTimeout(next,1000)
        // next();
    },

    computed:{
        urllocal:function(){
            return window.location.href
        }
    },

    watch: {
        // call again the method if the route changes
        '$route':function (to, from) {
            console.log('***********************router watch');
            console.log(from);
            var className = _.get(to,'meta.contentClass','col-11 col-md-4');
            this.className = className;
            var $conteudo = $(this.$refs.conteudo);
            // $conteudo.attr('class',className);
            this.show();
        },
    },



    methods: {

        enter: function (el, done) {
            console.log("***************** transition enter")
            console.log(el)
            setTimeout(()=>this.show(),500);
            done()
        },

        beforeLeave: function (el, done) {
            console.log("***************** transition before leave")
            //  console.log(el)
            this.hide()
            // done()
        },

        getContentURL:function(){

            var id = this.$route.params.id;

            let url = id //`${window.API.apiurl}administracao/textohome/${id}/`
            
            return url;

           
        },
        
        goBack:function(){
            var path = this.$route.path;
            path = path.replace(/\/$/,'').split('/').slice(0,-1).join("/")
            if(_.isEmpty(path)) path="/";
            if(this.$route.meta.root) path="/"; //
            this.$router.push(path);
        },

        show:function(){

            this.$nextTick( ()=>{
                //pego a classe do elemento
                var className = this.$route.meta.contentClass;
                this.className = className;
                var $conteudo = $(this.$refs.conteudo);
                $conteudo.attr('class',className);
                var width = $conteudo.width();

                var time = 0.9
                var delay = 0.2

                if(this.open ===false){
                    this.open = true

                    // TweenMax.fromTo( "#menu-wrap" ,time, {x:0,rotateY:90}, {width: 90, rotationY:0, transformOrigin:"left top", x:width, delay:(delay+0.3), ease: Back.easeOut.config(1) } )                        
                    // TweenMax.fromTo( "#backgroundOrange" ,time-0.2, {width:4}, {width: "100%", delay:(delay-0.03), ease: Back.easeOut.config(1.7) } )

                    TweenMax.fromTo( this.$refs.conteudo,time, {x: +width,autoAlpha:1}, {x:0,delay:delay, autoAlpha:1, ease: Back.easeOut.config(1) } )
                
                    // TweenMax.to( "#mapaBaseLayer", time, {right: (width), left:0, delay:delay+0.5, autoAlpha:1, ease: Back.easeOut.config(0.2), onUpdate:()=>{
                    //     UIEvents.$emit('resizeMapContainer')
                    // } } )
                        
                
                }
            })
        },


                
        hide:function(){
             if(this.open === true){
                this.open = false
                var $conteudo = $(this.$refs.conteudo);
                var width = $conteudo.width();
                var time = 0.8
             
                TweenMax.to( this.$refs.conteudo,time, {x: +width,autoAlpha:0, delay:0, autoAlpha:1, ease: Back.easeOut.config(1)} )
            
                // TweenMax.to( "#mapaBaseLayer", time, {left: 0, right:0, delay:0, autoAlpha:1, ease: Back.easeOut.config(1), onUpdate:()=>{
                //         UIEvents.$emit('resizeMapContainer')
                // } } )
                // TweenMax.to( "#menu-wrap" ,time, {width: 115, x:0, rotationY:0, transformOrigin:"left top", delay:0.02, ease: Back.easeOut.config(1) } )
                // TweenMax.to( "#backgroundOrange" ,time/2, {width:4, delay:(time-0.4), ease: Back.easeOut.config(1) } )
              
             
             }
        },


    }
    }

</script>


<style lang="stylus">
    @import "../css/variaveis"
    #conteudo-container{
        box t 0 b 0 r 0 


        .compartilhar{
            padding:0.3em 1em;
            a{
                color:white;
                font-size:14px;
            }
            li{
                padding :0.5em;
            }
        }

        +mobile(){
            margin-top:75vh;
            min-width: 100%; //para subscrever o setilo que passo tipo col-5
            border-top:3px solid color-orange;
            position:relative;
        }


        // transform translate3d(+1000px,0,0)
        background  hsl(64, 100%, 34%);
        overflow auto;
        // visibility hidden;

        color:#cfd0cf;
        font-family font-text;
        padding:0;


        .close{
            box abs r 0 t 0 w 35 h 35
            background color-orange 
            line-height 35px
            text-align center 
            color white
            z-index 100
            opacity 1
            margin 0
            padding 0
            i{
                line-height: 35px;
            }
        }

        // padding 100px 20px
        // border-right:115px solid color-gray;
        .scroll-content{
            // padding:20px 35px;    
            min-height calc(100% - 54px);

           
        }
    }


</style>
