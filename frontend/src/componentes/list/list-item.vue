<template>
    <div class='list-item px-4 px-sm-4 px-lg-5 pv3'>
        <div :is="template" :item="item"></div>
    </div>
    
</template>


<script>
    export default{
        props:{
            item:{
                default:{}
            },
            template:{
                default:"list-item-default"
            }
        }
    }
</script>