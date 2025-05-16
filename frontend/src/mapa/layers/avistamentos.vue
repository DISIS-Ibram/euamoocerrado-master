<script>

    import layer from "@/mixins/mapboxLayer"

    export default{

        mixins:[layer],

        data(){
            return {
                  icons:{icon_parque:"/images/icon-parque.png"}
            }
        },

        computed:{
            geoJSON:function(){
                return this.$store.getters.avistamentosGeoJSON;
            },
        },


        watch:{
            geoJSON:function(){
                // this.animateLine(3, true)
            }
        },

       methods:{

            onClick:function(e){
                console.log(e)
                this.$router.push("/especies/" + e.categoria+'/' + e.id)
            },

            popUp:function(e){
                console.log(e)
                return '<b>Avistamento</b>:'+e.nome;
            },
        },
        

       
        style: function () {
            return {
                "type": "symbol",
                "layout": {
                    "icon-image": ["get","categoria"],
                    "icon-anchor": "bottom",
                    "icon-allow-overlap": false,
                    "text-field": "{nome}",
                    "text-anchor": "bottom",
                    "text-line-height": 1,
                    "text-optional": true,
                    "text-offset": {
                        "base": 1,
                        "stops": [
                            [17, [0, 1.5]],
                            [19, [0, 3]]
                        ],
                    },
                    "text-padding": 0,
                    "text-size": {
                        "base": 1,
                        "stops": [
                            [10, 11],
                        ],
                    },
                    "icon-size": {
                        "base": 1,
                        "stops": [
                            [11, 0.3],
                            [14, 0.4],
                            [15, 0.4],
                            [16, 0.7],
                            [17, 0.8],
                        ],
                    },
                },
                "paint": {
                    "text-color": "white",
                    "text-halo-color": "white",
                    "text-halo-width": 0.4,
                    "text-halo-blur": 0.2,
                    "text-opacity": {
                        "base": 1,
                        "stops": [
                            [10, 0],
                            [11, 1],
                            [15, 1]
                        ],
                    },
                    "icon-opacity": {
                        "base": 1,
                        "stops": [
                            [14, 1],
                            [15, 1]
                        ],
                    },
                }
            }
        }

        

    }


</script>