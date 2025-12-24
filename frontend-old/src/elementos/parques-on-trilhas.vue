<template>
    <div>
        <h5 class="titulo"> Essa trilha passa pelos parques: </h5>
        <div class="parques-trilhas" v-for="(i, index) in parquesOnTrilhas" :key="index">
           {{ i.nome }}
        </div>
    </div>   

</template>

<script>
export default {
    props: ['parquesOnTrilhas']
}
</script>

<style>

.titulo{
    color: white;
}

</style>
