<template>
     <div class="bemfeitoria-icon" v-tooltip="item.nome" > 
         <img :src="getIcone()" />
         <div v-if="item.quantidade > 1" class="quantidade">{{item.quantidade}}</div>
    </div>
</template>

<script>
export default {
        props:{
            'item':{
                default:{},
            },
            'showtext':{
                default:false
            },
        },
        
        methods:{
            getIcone:function(){
                if(this.item.icone.indexOf('http') > -1) return this.item.icone
                return this.api.apibase+'media/'+this.item.icone;
            }
        }
}
</script>

<style lang="stylus">
    @import "../css/variaveis"

    .bemfeitoria-icon{

        position:relative;
        display:inline-block;
        width: icontam = 2em;
        height:icontam;
        line-height:icontam;
        padding: 0.2em;
        border-radius:8px;
        background:rgba(black,0.2);
        text-align:center;
        margin:2px;

        img{
            max-width: icontam;
            max-height: icontam;
        }
       
       .quantidade{
            width: larg = 20px;
            position:absolute;
            top: -(larg/2);
            right: -(larg/2);
            height larg;
            background:orange;
            text-align:center;
            line-height: larg;
            color:white;
            font-size:10px;
            border-radius:50%;
        }
    }

</style>
