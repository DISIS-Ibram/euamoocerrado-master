<script>

    import layer from "@/mixins/mapboxLayer"

    export default{

        mixins:[layer],
        
        name:"hillshading",

        data(){
            return {
            }
        },

        computed:{
            geoJSON:function(){
                return false;
            },
        },

        methods:{
        },
        
        style: function () {
            return {
                "type": "hillshade",
                "paint":{
                    "hillshade-exaggeration":1,
                    "hillshade-highlight-color":"rgb(255, 196, 104)",
                    "hillshade-shadow-color":"rgb(51, 35, 70)",
                },
                "maxzoom":13.5
            }
        },

        source: function () {
            return {
                "type": "raster-dem",
                "url": "mapbox://mapbox.terrain-rgb"
            }

        }

    }


</script>