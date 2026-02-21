<!-- <template>
    <minhastrilhas title="Minhas Trilhas" :userMode="true" />
</template>

<script>
import minhastrilhas from './trilhas'

export default {
    components:{
        'minhastrilhas': minhastrilhas,
    }
}
</script> -->


<template>
  <Trilhas title="Minhas Trilhas" :userMode="true" />
  <!-- <Trilhas title="Minhas Trilhas"/> -->
</template>

<script>
import Trilhas from './trilhas'

export default {
  components: { Trilhas }
}
</script>