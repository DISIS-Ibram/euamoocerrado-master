<template>
  <div class="list">
    <div v-if="search" class="ph4 mt4 mb3">
      <busca v-model="searchWord" />
    </div>

    <list-item
      v-for="item in getItens"
      :item="item"
      :template="template"
      :key="$get(item, 'id') + template"
    >
    </list-item>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchWord: ""
    };
  },

  props: {
    itens: {
      default: () => []
    },
    template: {
      default: ""
    },
    search: {
      default: true
    }
  },

  computed: {
    getItens: function() {
      var word = this.searchWord;
      if (_.isEmpty(word)) return this.itens;
      return _.fuzzyFilter(word, [...this.itens], 100);
    }
  }
};
</script>
