<template>
  <vm-source
    name="atrativos-source"
    v-if="hasFeatures"
    type="geojson"
    :options="{ data: geoJSON }"
    :minzoom="11"
  >
    <vm-image name="atrativo_dump" url="/images/atrativo_dump.svg"></vm-image>
    <vm-image v-for="(v, k) in computedIcons" :key="k" :name="k" :url="v" />

    <vm-layer
      name="atrativos"
      :filter="['==', '$type', 'Point']"
      type="symbol"
      :paint="{
        'text-color': 'white',
        'text-halo-color': 'white',
        'text-halo-width': 0.4,
        'text-halo-blur': 0.2,
        'text-opacity': {
          base: 1,
          stops: [
            [16, 0],
            [17.5, 1]
          ]
        },
        'icon-opacity': {
          base: 1,
          stops: [
            [9, 0],
            [11, 0],
            [11.1, 1],
            [14, 1],
            [15, 1]
          ]
        }
      }"
      :layout="{
        'icon-image': [
          'coalesce',
          ['image', ['get', 'imagemnome']],
          ['image', 'atrativo_dump']
        ],
        'icon-anchor': 'bottom',
        'icon-allow-overlap': false,
        'text-field': '{nome}',
        'text-anchor': 'top',
        'text-line-height': 1,
        'text-optional': true,
        'text-offset': {
          base: 1,
          stops: [[14, [0, 1.5]]]
        },
        'text-padding': 0,
        'text-size': {
          base: 1,
          stops: [[10, 11]]
        },
        'icon-size': {
          base: 1,
          stops: [
            [10, 0.1],
            [11, 0.2],
            [13, 0.3],
            [18, 0.4]
          ]
        }
      }"
    >
      <template #popupHover="slotProps">
        <vm-popup
          color="#292929"
          text-color="#ffffff"
          max-width="350px"
          max-height="300px"
        >
          <atrativos-popup
            size="small"
            :item="$get(slotProps, 'features[0].properties')"
          />
        </vm-popup>
      </template>

      <template #popupClick="slotProps">
        <vm-popup
          anchor="bottom"
          color="#292929"
          text-color="#ffffff"
          max-width="90vw"
          max-height="90vh"
          id="popup-full"
        >
          <atrativos-popup
            size="big"
            :item="$get(slotProps, 'features[0].properties')"
          />
        </vm-popup>
      </template>
    </vm-layer>
  </vm-source>
</template>

<script>

console.log('atrativos-layer.vue')

export default {
  data() {
    return {
      iconSize: 45,
      image: { atrativo_dump: "/images/atratico_dump" }
    };
  },

  computed: {
    geoJSON: function() {
      return this.$store.getters.benfeitoriasGeoJSON;
    },
    hasFeatures: function() {
      return this.geoJSON?.features?.length > 0 || false;
    },
    computedIcons: function() {
      if (this.hasFeatures === false) return;
      let obj = {};
      this.geoJSON.features.forEach(item => {
        let id = item.properties.imagemnome;
        let url = item.properties.imagemurl;
        if (!obj[id]) {
          obj[id] = url;
        }
      });
      return obj;
    }
  },

  methods: {}
};
</script>
