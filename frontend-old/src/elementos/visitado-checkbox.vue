<template>
    <span  class="fa-stack fa-lg visitado-checkbox" :class="{active:value===true}">
        <i class="fa fa-circle fa-stack-2x"></i>
        <i class="fa fa-check fa-stack-1x fa-inverse"></i>
    </span>
</template>

<script>
export default {
    data(){
        return {}
    },
    props:{
        value:{
            default:false,
        }
    }

}
</script>

<style lang="stylus">
     @import "../css/variaveis"

    .visitado-checkbox{
        transform:scale(0.8);
        opacity:0.2;
        .fa-circle{
            opacity 0.5;
            color:rgba(black,1);
        }
        .fa-check{
            opacity 0.1;
        }

        &.active{
            opacity:1;
            .fa-circle{
                opacity 1;
                color:lighten(cor-amarelo,30%);
            }
            .fa-check{
                opacity 1;
            }
            
        }

        &:hover{
            .fa-circle{
                opacity 0.7;
                color:lighten(cor-amarelo,30%);
            }
            .fa-check{
                opacity 0.9 !important;
            }

        }
    }

</style>
