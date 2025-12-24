
<template>
    <!-- <div class='menu-container'> -->
        
        <div class='icon-menu' :class="{active:active,disable:disable===true}" ref="menu" 
             @click.stop="goToUrl" >

            <div v-if="icon" class='icon'><i :class='icon'></i></div>
            <div class='label'>{{ label }}</div>
            
            <div class='submenu-container' v-if="$slots.default">
                <slot name="default" class="submenu-container">
                </slot>
            </div>
        </div>

    <!-- </div> -->
</template>


<script>

    export default {
        
        data(){
            return {
            }
        },
        
        props:['icon','label','submenu','to','disable','toogle', 'target'],

        computed:{
            active:function(){
                if(this.to === undefined){
                 return false;   
                }
                var path = this.$route.path;
                var lang = this.$route.params.lang;
                path = path.replace(`/${lang}/`,"/")
                if( path == this.to){
                    return true
                }
                return false
            }
        },

         mounted(){
            
        //   var last_position = {}
        //   // document.addEventListener('mousemove')
        //   document.addEventListener('mousemove', (event)=> {
        //      var item = this.$refs.menu;

        //     var rot = {
        //             x: (event.clientX - item.getBoundingClientRect().left) * 90 / window.innerWidth,
        //             y: -(event.clientY - item.getBoundingClientRect().top ) * 90 / window.innerHeight,
        //     }
        //     // item.style.transform = "rotateX(" + (rot.y/100) + "deg) rotateY(" + (rot.x/80) + "deg)";
        //     });

           
        },


        methods: {
            goToUrl:function(){
                if( this.to.match(/^http/g) || this.target=="_blank" ){
                        window.open(this.to);
                }else{
                    if(this.$route.path == this.to && this.toogle){
                        this.$router.push(this.toogle);
                    }else{
                        this.$router.push(this.to);
                    }
                }
            }
        }

    }

</script>



<style lang="stylus">
    @import "../css/variaveis"

    .menu-container{
        position:relative;
    }

    .icon-menu{
        position:relative;
        transform: translate3d(0,0,0);
        -webkit-perspective: 550px;
        perspective: 550px;
        perspective-origin: left;
        -webkit-perspective-origin: left;
        transform-style: preserve-3d

        transform-origin: center;

        width 100%;
        // border-top 1px solid rgba(white,0.2);
        // padding-top 1.1em;
        // padding-bottom 1.1em;
        cursor pointer !important
        // transition: all 300ms;
        display:block;
        margin-bottom 10px;

        .icon{
            font-size 1.2rem;
            text-align center;
            color white;
            opacity 1;
            transition: all 200ms;
            // display:none;
            display:inline-block;
            min-width: 2em;



        }    
        .label{
            font-family font-title;
            color white;
            font-size 1.1rem;
            text-transform uppercase;
            opacity 1;
            transition: all 200ms;
            display:inline-block;
            line-height 1;
        }

        &:hover,&.active{
                
            //   border-top 1px solid lighten(color-orange,0%);
             & > .icon, & > .label{
                    color: cor-amarelo;
                    opacity 1;
                    // transition: all 600ms;
            }  
        }
    }


    .submenu-container{
        position:absolute;
        top:0;
        left:calc( 100% + 0px );

         +between(1, 576px){
             position:relative;
             left:initial;
             margin-left:50px;
             margin-top:10px;

         }
    }

    .submenu-container  .icon-menu{
             +between(576px, 9000px){
                width 220px;
                border: 0;
                padding-top 0.2em;
                padding-bottom 0.4em;
                padding-left:1em;
                cursor pointer !important
                background hsl(21, 73%, 55%);
                color white
                margin-bottom:2px;
                border-left:0px solid color-orange;
               

                // transform: rotateY(30deg);
                transform-origin 0px 0px;
                // display:none;
                // visibility hidden;

                opacity 0
                height: 0px;
                // transition: opacity 300ms 20ms, transform 300ms 800ms, width 10ms 800ms, height 10ms 800ms;
                
                overflow: hidden;
                transform rotateY(15deg)

                for num in (1..5){
                    &:nth-child({num}){
                        opacity 0
                        height: 0px
                        width: 0px
                        transition overflow 10ms 700ms, height 10ms 700ms, width 0ms 500ms,  opacity 300ms 100ms +(100ms * num), transform 300ms 100ms+(100ms * num)
                    }
                }
                
                &:nth-child(1):before{
                    seta(10px,color-orange,"left",10px);
                    opacity 1
                    transition: opacity  200ms;                    
                }
                
                .icon{
                    display:inline-block;
                    font-size 1.4rem;
                    vertical-align middle
                    color white;
                    opacity 0.6;
                    transition: all 200ms;
                    margin:5px;

                }    
                .label{
                    margin:5px;
                    display:inline-block;
                    font-family font-subtitle;
                    color white;
                    font-size 14px;
                    text-align center; 
                    text-transform uppercase;
                    opacity 0.6;
                    transition: all 200ms;
                }


                &:hover{
                     background darken(color-gray,20%)
                    //   transition: transform 200ms 0ms;
                    //   transform rotateY(-0.1deg) !important
                      &:before{
                        opacity 1
                        transition: opacity  200ms; 
                      }
                }
                &.active{
                      background darken(color-orange,0%)
                 }
             }
        }


        .icon-menu:hover > .submenu-container .icon-menu{
            +between(576px, 9000px){
                height: 45px;
                width 160px;
                // visibility visible;
                // overflow: visible;
                // transition visibility 0ms, overflow 0ms, height 0ms
                transform rotateY(0deg)
                for num in (1..5){
                    &:nth-child({num}){
                        opacity 1
                        transition height 0ms 0ms, width 0ms 0ms,  opacity 300ms 100ms +(100ms * num), transform 300ms 100ms+(100ms * num)
                        // transition transform 300ms 100ms+(100ms * num)
                    }
                }
            }
        }

        .icon-menu.disable{
             *{
                 opacity 0.2 !important;
             }
        }





</style>