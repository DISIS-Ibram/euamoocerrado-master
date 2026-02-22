<template>
  <Especies title="Minhas Espécies" :userMode="true" />
</template>

<script>
import Especies from './especies.vue';

export default {
  components: { Especies }
}
</script>