<template>
  <div id="mapaBaseLayer" class="map-layer">
    <VueMapbox
      accessToken="pk.eyJ1IjoibGVjZWxlcyIsImEiOiJjajUyZXBzbXEwZjYxMnFwOWFxeHd5ZDY3In0.dftZ4LdgXBkdZI0_l7pcNA"
      :mapStyle="MAPBASESTYLE"
      height="100%"
      width="100%"
      ref="map"
      key="map"
      :maxZoom="20"
      :layersCanRaname="true"
      @load="mapHasLoaded"
      :attributionControl="false"
      :dev="true"
    >
      <template #loader>
        <div class="loader">
          <div>
            <i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i> <br />
            Carregando...
          </div>
        </div>
      </template>

      <!-- <vm-layer type="background" backgroundColor="#819869">

    </vm-layer> -->

      <satelite-layer />
      <parques-layer />
      <trilha-layer v-if="trilha"  />
      <atrativos-layer v-if="atrativo" />
      <!-- <avistamentos /> -->

      <!-- <avistamentos />
        <benfeitorias />
        <benfeitorias-paths /> 
        <trilhas-markers />
        -->
    </VueMapbox>

    <div
      id="layers"
      @click="goToMyLocation"
 
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.4839 7.12499L12.4619 2.12499C12.3137 2.04332 12.1472 2.00049 11.9779 2.00049C11.8087 2.00049 11.6422 2.04332 11.4939 2.12499L2.51594 7.08499C2.35998 7.17136 2.22994 7.29785 2.13929 7.45136C2.04864 7.60487 2.00067 7.77983 2.00037 7.95811C2.00006 8.13639 2.04742 8.31151 2.13754 8.46534C2.22767 8.61916 2.35727 8.7461 2.51294 8.83299L11.5349 13.873C11.6835 13.9564 11.8509 14.0004 12.0213 14.0005C12.1917 14.0007 12.3592 13.9571 12.5079 13.874L21.4859 8.87399C21.6419 8.78726 21.7718 8.66037 21.8622 8.50649C21.9526 8.35262 22.0001 8.17736 21.9999 7.9989C21.9997 7.82045 21.9518 7.6453 21.861 7.49163C21.7703 7.33796 21.6401 7.21137 21.4839 7.12499V7.12499Z"
          fill="white"
        />
        <path
          d="M12 15.856L3.48504 11.126L2.51404 12.874L11.514 17.874C11.6626 17.9565 11.8296 17.9997 11.9995 17.9997C12.1694 17.9997 12.3365 17.9565 12.485 17.874L21.485 12.874L20.514 11.126L12 15.856Z"
          fill="white"
        />
        <path
          d="M12 19.856L3.48504 15.126L2.51404 16.874L11.514 21.874C11.6626 21.9565 11.8296 21.9997 11.9995 21.9997C12.1694 21.9997 12.3365 21.9565 12.485 21.874L21.485 16.874L20.514 15.126L12 19.856Z"
          fill="white"
        />
      </svg>

        <vtl-menu class='main' label=" " icon="vtl  vtl-camadas " to="">
        <vtl-menu @click.native.capture="atrativo = !atrativo"  label="Atrativos" icon="vtl " > </vtl-menu>
        <vtl-menu @click.native.capture="trilha = !trilha" label="Trilha" icon="vtl "  > </vtl-menu>
        <!-- <vtl-menu label="Peixes" icon="vtl " > </vtl-menu>
        <vtl-menu label="Árvores" icon="vtl " > </vtl-menu>
        <vtl-menu label="Frutos" icon="vtl " > </vtl-menu> -->
		</vtl-menu>

    </div>

    <div
           v-tooltip="'Minha Localização Atual'"
      id="gotToMyLocation"
    >
      <i class="fa fa-location-arrow"></i>

    
    </div>
  </div>
</template>

<script>
// import mapa from './mapa.js';

import MAPBASESTYLE from "./styles/mapabase_style";
import elevationControl from "./iControl/elevation";

export default {
  name: "mapbox",

  map: false,

  data: function() {
    return {
      MAPBASESTYLE,
      atrativo: true,
      trilha: true,
    };
  },

  computed: {
    mapLoaded: function() {
      return this.$store.state.mapLoaded;
    },

    map: function() {
      return this.$options.map;
    }
  },

  watch: {
    // call again the method if the route changes
    $route: function(to, from) {
      if (this.mapLoaded) {
        //just fly if map is loaded. If not it will fly automatic when map is loaded
        setTimeout(() => {
          // this.flyToPage(to,3000)
        }, 800);
      }
      //check for altimetria
      if (to.path.match(/altimetria/g)) {
        console.log("%%%%%% show altimetria");
        this.showAltimetria();
      } else if (from.path.match(/altimetria/g)) {
        console.log("%%%%% saindo de altimetria %%%%%");
        this.hideAltimetria();
      }
    },

    altimetriaVisible: function() {
      // if(this.altimetriaVisible){
      //     window.percurso.emit('showAltimetria')
      // }else{
      //     window.percurso.emit('hideAltimetria')
      // }
    }
  },

  methods: {


    
    mapHasLoaded: function(e, map) {
      this.$options.map = map;

      setTimeout(() => {
        this.$store.commit("mapLoaded", true);

        this.flyToPage(null, 2000, true);
      }, 1000);

      window.map = map;

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      // this.map.addControl(new elevationControl(this.$store), "top-right");

      map.jumpTo({
        center: _.util.inverseMercator(1865.6 / 2, 2057.6 / 2),
        zoom: 9,
        pitch: 0,
        bearing: 0
      });
    },

    goToMyLocation: function() {
      navigator.geolocation.getCurrentPosition(location => {
        console.log(location.coords.latitude);
        console.log(location.coords.longitude);
        window.map.flyTo({
          center: [location.coords.longitude, location.coords.latitude],
          zoom: 17
        });
        // console.log(location.coords.accuracy);
      });
    },

    flyToPage: function(to, duration = 2000, force = false) {
      to = to || this.$route;
      var camera = _.get(to, "meta.camera", false);
      var id = _.get(to, "params.id", false);

      var cameraSet = _.get(camera, id, camera);

      if (this.$store.state.initialAnimationFinish === false)
        cameraSet = {
          center: [-47.85927131478161, -15.799714225713075],
          pitch: 0,
          zoom: 11,
          bearing: 0
        };

      if (!cameraSet) {
        return;
      }

      setTimeout(() => {
        //make sure we have a delay to finish any initial setup
        if (this.map) {
          this.map.resize(); //resize because the first time container may be change and the map note
          //just change if it is not moving
          if (this.map.isMoving() && force == false) {
            //   console.log("Map Moving, will not go to ");
            return;
          } else {
            // console.log("Map will fly");
            this.map.flyTo({ ...cameraSet, duration: duration });
          }

          //tell the map has finish it first animation
          setTimeout(() => {
            if (this.$store.state.initialAnimationFinish == false)
              this.$store.commit("initialAnimationFinish", true);
          }, duration);
        }
      }, 100);
    }
  }
};
</script>

<style lang="stylus">
@import "../css/variaveis"

.loader{
    position:fixed;
    top:50%;
    left:50%;
    text-align:center;
}


#gotToMyLocation{
    position:absolute;
    top:40%;
    left:2px;
    width larg = 35px;
    height: larg
    background:#e07337
    color:white;
    font-size:24px;
    text-align:center;
    z-index:1;
    border-radius:25% 0 25% 0;
   i{
        line-height:larg;
   }
}


#layers{
    position:absolute;
    top:calc(40% + 40px);
    left: 2px;
    width larg = 35px;
    height: larg
    background:#e07337
    color:white;
    font-size:24px;
    text-align:center;
    z-index:1;
    border-radius:25% 0 25% 0;
   i{
        line-height:larg;
   }


   svg{
     position:absolute
     left: 8px;
     top: 8px;
   }

.submenu-container .icon-menu{
      padding-left:10px !important;
     
     }
}
</style>
