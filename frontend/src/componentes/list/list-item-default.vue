<template>
    <div class='list-item-default'>
            {{item.nome}}
    </div>

</template>


<script>
    export default{
        props:{
            item:{
                default:{}
            },
        },

        methods:{
            click:function(){
                this.$emit('click',item)
            }
        }
    }
</script>