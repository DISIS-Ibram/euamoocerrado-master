<template>

    <div class="sede">
        <div v-if="sede"> <i class="fa fa-home" aria-hidden="true"></i></div>
        <div v-else> Não possui sede </div>
    </div>

</template>

<script>
export default {
    props: ['sede']
}
</script>