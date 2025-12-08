<template>
  <div>
    <vm-source
      v-if="hasFeatures"
      name="trilhaSource"
      type="geojson"
      :options="{ data: this.geoJSON }"
    >
      <vm-layer
        name="trilha-name"
        type="symbol"
		@featureselect="onClick"
        :layout="{
          'symbol-placement': 'line-center',
          'icon-image': ['get', 'tipo'],
          'icon-anchor': 'bottom',
          'icon-allow-overlap': false,
          'text-field': '{nome}',
          'text-anchor': 'bottom',
          'text-line-height': 1,
          'text-optional': true,
          'text-offset': {
            base: 1,
            stops: [[10, [0, 2]]]
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
              [11, 0.5],
              [18, 1]
            ]
          }
        }"
        :paint="{
          'text-color': ['get', 'color'],
          'text-halo-color': 'black',
          'text-halo-width': 0.4,
          'text-halo-blur': 0.2,
          'text-opacity': {
            base: 1,
            stops: [
              [6, 0],
              [7, 1],
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
      >
      </vm-layer>

      <vm-layer
        type="line"
        name="trilha-line-color"
        :layout="{
          'line-join': 'round',
          'line-cap': 'round'
        }"
        :paint="{
          'line-dasharray': {
            base: 1,
            stops: [
              [11, [1, 1]],
              [15, [1, 1]]
            ]
          },
          'line-color': ['get', 'color'],
          'line-width': {
            base: 1,
            stops: [
              [4, 1],
              [6, 3],
              [15, 4]
            ]
          },
          'line-opacity': {
            base: 1,
            stops: [
              [5, 0],
              [6, 1]
            ]
          }
        }"
      >
        
      </vm-layer>

      <vm-layer
        type="line"
        name="trilha-selected"
        :filter="['==', ['get', 'id'], currentTrilhaID]"
        :paint="{
          'line-color': 'yellow',

          'line-width': {
            base: 1,
            stops: [
              [4, 3],
              [15, 6]
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
        :layout="{
          'line-join': 'round',
          'line-cap': 'round'
        }"
      >
        
      </vm-layer>



	   <vm-layer
        name="trilha-name"
        type="symbol"
        :layout="{
          'symbol-placement': 'line-center',
          'icon-image': ['get', 'tipo'],
          'icon-anchor': 'bottom',
          'icon-allow-overlap': false,
          'text-field': '{nome}',
          'text-anchor': 'bottom',
          'text-line-height': 1,
          'text-optional': true,
          'text-offset': {
            base: 1,
            stops: [[10, [0, 2]]]
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
              [11, 0.5],
              [18, 1]
            ]
          }
        }"
        :paint="{
          'text-color': 'white',
          'text-halo-color': 'white',
          'text-halo-width': 0.4,
          'text-halo-blur': 0.2,
          'text-opacity': {
            base: 1,
            stops: [
              [6, 0],
              [7, 1],
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
      >
      </vm-layer>

      <vm-layer
        type="line"
        name="trilha-event-placeholder"
        @featureselect="onClick"
        
        :paint="{
          'line-color': ['get', 'color'],
          'line-width': {
            base: 1,
            stops: [
              [4, 3],
              [6, 9],
              [15, 10]
            ]
          },
          'line-opacity': 0
        }"
      >
        <template #popupHover="slotProps">
          <vm-popup :color="$get(slotProps, 'features[0].properties.color')">
            <small> <i class="vtl vtl-percurso"></i> TRILHA</small>
            <div>
              <b>{{ $get(slotProps, "features[0].properties.nome") }}</b>
            </div>
            <div>
              Distância: <b>{{  $get(slotProps, "features[0].properties.comprimento",0) }} km</b>
            </div>
          </vm-popup>
        </template>
		
      </vm-layer>

    </vm-source>

    <vm-image name="trilha-inicio">
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 44 44"
      >
        <title>trilha-inicio</title>
        <!-- <rect
          x="4.13"
          y="2.14"
          width="34.68"
          height="34.59"
          rx="17.3"
          ry="17.3"
          style="fill:#fff"
        /> -->
        <rect x="14.86" y="6.09" width="2.63" height="30.27" />
        <polygon
          points="38.31 17.73 18.96 29.23 18.96 6.23 38.31 17.73 38.31 17.73"
          style="fill:#00d1b2"
        />
        <polygon
          points="19.46 41.66 16.39 36.48 22.54 36.48 19.46 41.66 19.46 41.66"
          style="fill:#fff"
        /> 
      </svg>
    </vm-image>
    <vm-image name="trilha-fim">
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 44 44"
        width="44"
        height="44"
      >
        <title>trilha-fim</title>
        <!-- <rect
          x="4.13"
          y="2.64"
          width="34.68"
          height="34.59"
          rx="17.3"
          ry="17.3"
          style="fill:#fff"
        /> -->
        <rect x="14.86" y="6.59" width="2.63" height="30.27" />
        <polygon
          points="38.31 18.23 18.96 29.73 18.96 6.73 38.31 18.23 38.31 18.23"
          style="fill:#d1479c"
        />
        <polygon
          points="19.46 42.16 16.39 36.98 22.54 36.98 19.46 42.16 19.46 42.16"
          style="fill:#fff"
        />
      </svg>
    </vm-image>

    <vm-layer
      v-if="false && startEndGeoJSON.features.length > 0"
      name="trilha-start-end-points"
      :source="{
        type: 'geojson',
        data: startEndGeoJSON
      }"
      type="symbol"
      :minzoom="4"
      :layout="{
        'icon-image': ['get', 'tipo'],
        'icon-anchor': 'bottom',
        'icon-allow-overlap': true,
        'text-field': '{nome}',
        'text-anchor': 'top',
        'text-line-height': 1,
        'text-optional': true,
        'text-offset': {
          base: 1,
          stops: [[10, [0, 1]]]
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
            [11, 1],
            [18, 1]
          ]
        }
      }"
      :paint="{
        'text-color': 'white',
        'text-halo-color': 'white',
        'text-halo-width': 0.4,
        'text-halo-blur': 0.2,
        'text-opacity': {
          base: 1,
          stops: [
            [14, 0],
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
    ></vm-layer>
  </div>
</template>

<script>

console.log('trilha-layer.vue')

export default {
  data() {
    return {};
  },

  computed: {
    geoJSON: function() {
      return this.$store.getters.trilhasGeoJSON;
    },
    startEndGeoJSON: function() {
      let featureCollection = { type: "FeatureCollection", features: [] };
      if (
        this.geoJSON?.features?.[0]?.properties?.id &&
        this.currentTrilhaID !== 0
      ) {
        let selectedGeojson = this.geoJSON.features.find(
          item => item.properties.id === this.currentTrilhaID
        );
        if (selectedGeojson) {
          const coord = selectedGeojson.geometry.coordinates;

          featureCollection.features.push({
            properties: {
              nome: "Inicio Trilha",
              tipo: "trilha-inicio"
            },
            geometry: {
              type: "Point",
              coordinates: coord[0]
            },
            type: "Feature"
          });
          featureCollection.features.push({
            properties: {
              nome: "Fim Trilha",
              tipo: "trilha-fim"
            },
            geometry: {
              type: "Point",
              coordinates: coord[coord.length - 1]
            },
            type: "Feature"
          });
        }
      }
      return featureCollection;
    },

    hasFeatures: function() {
      return this.geoJSON?.features?.length > 0 || false;
    },
    currentTrilhaID: function() {
      const route = this.$route;
      if (route.name === "trilha" && route?.params?.id) {
        return Number(route.params.id);
      }
      return 0;
    }
  },

  methods: {
    onClick: function(features) {
      const trilhaId = features?.[0]?.properties?.id;
      if (trilhaId) {
        this.$router.push({ name: "trilha", params: { id: trilhaId } });
      }
    }
  }
};
</script>
