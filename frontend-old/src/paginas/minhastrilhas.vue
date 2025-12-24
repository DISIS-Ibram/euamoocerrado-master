<template>
    <minhastrilhas title="Minhas Trilhas" :userMode="true" />
</template>

<script>
import minhastrilhas from './trilhas'

export default {
    components:{
        'minhastrilhas': minhastrilhas,
    }
}
</script>