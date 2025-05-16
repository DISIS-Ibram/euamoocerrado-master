<template>

<div>
    <div class="atividade-trilha" v-for="(atvdd, index) in atividades" :key="index" v-tooltip="atvdd.nome">
        <img class="icones" style="width:25px;height:auto;" :src="atvdd.icone">
    </div>
</div>

</template>

<script>

    export default {
        props: ['atividades'],
        }

</script>

<style lang="stylus">
    @import "../css/variaveis"

    .atividade-trilha {
        display: inline-block;
        padding-right:10px;
        margin-bottom 10px
    }

    .img.icones {
        opacity:0.65;
    }

</style>