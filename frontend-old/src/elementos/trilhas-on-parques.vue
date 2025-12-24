<template>
    <div>
        <h5 class="titulo"> Esse parque possui as trilhas: </h5>
        <div class="trilhas-parques" v-for="(i, index) in trilhasOnParques" :key="index">
           {{ i.nome }}
        </div>
    </div>   

</template>

<script>
export default {
    props: ['trilhasOnParques']
}
</script>

<style>

.titulo{
    color: white;
}

</style>