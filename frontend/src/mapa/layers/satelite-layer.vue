<template>
  <vm-layer
    :source="source"
    type="raster"
    name="satelite"
    :paint="style.paint"
    :minzoom="1"
  >
  </vm-layer>
</template>

<script>
// import layer from "@/mixins/mapboxLayer";

console.log('satelite-layer.vue')

export default {
  //   mixins: [layer],

  data() {
    return {};
  },

  computed: {
    geoJSON: function() {
      return false;
    },
    style: function() {
      return {
        id: "percurso",
        type: "raster",
        minzoom: 12.5,
        paint: {
          "raster-opacity": {
            base: 1,
            stops: [
              [14, 0],
              [15.1, 1]
            ]
          },
          "raster-hue-rotate": {
            base: 1,
            stops: [
              [14, 90],
              [14.2, 0],
              [16, 0]
            ]
          },
          "raster-contrast": {
            base: 1,
            stops: [
              [14, -0.1],
              [14.2, 0.1],
              [16, 0.1]
            ]
          },
          "raster-saturation": 0,
          "raster-resampling": "nearest"
        }
      };
    },

    source: function() {
      return {
        type: "raster",
        minzoom:13.5,
        tiles: [
          //   'https://geodata.state.nj.us/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015'
          //   'https://geodata.state.nj.us/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015'
          //   'http://ortofoto.mapa.codeplan.df.gov.br/?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=mosaico_df_2015'
          //   'http://ortofoto.mapa.codeplan.df.gov.br/wms?LAYERS=mosaico_df_2013&SERVICE=WMS&VERSION=1.1.1&WIDTH=256&HEIGHT=256&bbox={bbox}&srs=EPSG:4674&transparent=true'
          // 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        ],
        tileSize: 256
        //  'bounds':[-48.241307603, -16.050, -47.583847157, -15.59721696],
      };
    }
  },

};
</script>
