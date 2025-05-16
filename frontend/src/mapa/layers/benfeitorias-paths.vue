<script>

    import layer from "@/mixins/mapboxLayer"

    export default{

        mixins:[layer],
        
        // name:"parques-outline",

        data(){
            return {
            }
        },

        computed:{
            geoJSON:function(){
                return  this.$store.getters.benfeitoriasGeoJSON;
            },
        },


        watch:{
            geoJSON:function(){
                // this.animateLine(3, true)
            }
        },

        methods:{

            onClick:function(e){
                // alert('clicou instancia')
                // this.$router.push("/trilhas/" + e.id)
            },

            popUp:function(e){
                console.log(e)
                return '<b>Benfeitoria:</b>:' + e.nome;
            },
        },

        style: function () {
            return {
                "type": "line",
                // "source": "percurso",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    
                    "line-color": "green",
                   
                    "line-width": {
                        "base": 1,
                        "stops": [
                            [11, 2],
                            [15, 4],
                        ]
                    },
                    "line-opacity": {
                        "base": 1,
                        "stops": [
                            [10, 0],
                            [14, 1]
                        ]
                    },
                }
            }
        }

    }


</script>