<template>
  <vm-source
    v-if="hasFeatures"
    name="parquesSource"
    type="geojson"
    :options="{ data: this.geoJSON }"
  >
    <vm-layer
      type="fill"
      name="parque-fill-color"
      @featureselect="clickparque"
      :paint="{
        'fill-color': ['coalesce', ['get', 'color'], '#65938B'],
        'fill-opacity': {
          base: 1,
          stops: [
            [12, 1],
            [14, 0.3],
            [20, 0.1]
          ]
        }
      }"
    />

    <vm-layer
      type="fill"
      name="parque-fill-texture"
      :images="icons"
      @featureselect="clickparque"
      :paint="{
        'fill-pattern': {
          base: 1,
          stops: [
            [10, 'parque_extrapequeno'],
            [12, 'parque_normal'],
            [13, 'parque_normal']
          ]
        },
        'fill-opacity': {
          base: 1,
          stops: [
            [12, 1],
            [13.5, 0]
          ]
        }
      }"
    >
      <template #popupHover="slotProps">
        <vm-popup :color="$get(slotProps, 'features[0].properties.color')">
          <small> <i class="vtl vtl-parques"></i> PARQUE</small>
          <div>
            <b>{{ $get(slotProps, "features[0].properties.nome") }}</b>
          </div>
        </vm-popup>
      </template>
    </vm-layer>

    <vm-layer
      type="line"
      name="parque-lines"
      :layout="{
        'line-join': 'round',
        'line-cap': 'round'
      }"
      :paint="{
        'line-color': ['get', 'color'],
        'line-width': {
          base: 1,
          stops: [
            [11, 1],
            [15, 2]
          ]
        },
        'line-opacity': {
          base: 1,
          stops: [
            [10, 1],
            [14, 1]
          ]
        }
      }"
    />
    <vm-layer
      type="line"
      name="parque-select-line"
      :filter="['==', ['get', 'id'], currentParqueID]"
      :layout="{
        'line-join': 'round',
        'line-cap': 'round'
      }"
      :paint="{
        'line-dasharray': {
          base: 1,
          stops: [
            [11, [5, 3]],
            [15, [1, 2]]
          ]
        },
        'line-color': 'yellow',
        'line-width': {
          base: 1,
          stops: [
            [11, 2],
            [15, 2]
          ]
        },
        'line-opacity': {
          base: 1,
          stops: [
            [10, 1],
            [14, 1]
          ]
        }
      }"
    >
    </vm-layer>

    <vm-layer
      type="symbol"
      name="parque-centroide"
      :source="{
        type: 'geojson',
        data: parquesCentroidesGeoJSON
      }"
      :images="{ icon_parque: '/images/icon-parque.png' }"
      :paint="{
        'text-color': 'white',
        'text-halo-color': 'white',
        'text-halo-width': 0.4,
        'text-halo-blur': 0.2,
        'text-opacity': {
          base: 1,
          stops: [
            [10, 0],
            [11, 1],
            [15, 1]
          ]
        },
        'icon-opacity': {
          base: 1,
          stops: [
            [14, 1],
            [15, 1]
          ]
        }
      }"
      :layout="{
        'icon-image': 'icon_parque',
        'icon-anchor': 'bottom',
        'icon-allow-overlap': false,
        'text-field': '{nome}',
        'text-anchor': 'top',
        'text-line-height': 1,
        'text-optional': true,
        'text-offset': {
          base: 1,
          stops: [
            [17, [0, 1.5]],
            [19, [0, 3]]
          ]
        },
        'text-padding': 0,
        'text-size': {
          base: 1,
          stops: [
            [10, 12],
            [14, 12]
          ]
        },
        'icon-size': {
          base: 1,
          stops: [
            [11, 0.3],
            [14, 0.5]
          ]
        }
      }"
    />
  </vm-source>
</template>

<script>

export default {
  data() {
    return {
      icons: {
        parque_normal: "/images/arvores.png",
        parque_pequeno: "/images/arvores-peq.png",
        parque_extrapequeno: "/images/arvores-extrapeq.png"
      }
    };
  },

  computed: {
    geoJSON: function() {
      return this.$store.getters.parquesGeoJSON;
    },
    parquesCentroidesGeoJSON: function() {
      return this.$store.getters.parquesCentroidesGeoJSON;
    },
    hasFeatures: function() {
      return this.geoJSON?.features?.length > 0 || false;
    },
    currentParqueID: function() {
      // return this.$store.getters.currentParqueID ?? 0;
      const route = this.$route;
      if (route.name === "parque" && route?.params?.id) {
        return Number(route.params.id);
      }
      return 0;
    }
  },

  methods: {
    clickparque: function(features) {
      const parqueId = features?.[0]?.properties?.id;
      if (parqueId) {
        this.$router.push({ name: "parque", params: { id: parqueId } });
      }
    }
  }
};
</script>
