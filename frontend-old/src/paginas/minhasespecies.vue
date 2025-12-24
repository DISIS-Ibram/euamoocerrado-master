<template>
    <minhastrilhas title="Minhas " :userMode="true" />
</template>

<script>
import minhastrilhas from './especies'

export default {
    components:{
        'minhastrilhas': minhastrilhas,
    }
}
</script>