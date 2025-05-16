<template>

   <transition name="fade" appear>
        <div id="terrain-profile" class="row">
                <!-- <div class='w3 tc'>
                        <i class="fa white fa-2x fa-play"></i>
                </div> -->
                <div class="col h-100">
                    <elevation-plot :geoJSON="course" :steps="width*0.4" ></elevation-plot>       
                </div>
        </div>
    </transition>


</template>


<script>

    export default {

        data:function(){
            return { width:0 }
        },

        computed:{
            course:function(){
                return this.$store.getters.courses;
            },
        },

        

        created:function(){
            
            this.width = window.innerWidth;
            $(window).resize(()=>{
                      this.width = window.innerWidth;
            })
        
            this.$store.commit('altimetriaVisible', true); 
        },

    }

</script>

<style lang="stylus" >
    @import "../css/variaveis";

    #terrain-profile{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 180px;
        background: -webkit-linear-gradient(bottom,rgba(0,0,0,0.4), rgba(0,0,0,0));
        padding: 0em 0.5em;
        
    }

</style>