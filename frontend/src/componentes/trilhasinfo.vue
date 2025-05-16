<template>


<div v-if="trilha && trilha.nome" class="ph4 mt-4">
    
    <i class="fa fa-2x fa-arrow-left" v-to="'/trilhas'"></i>
    
    <div class='mt-2'>
        TRILHA
        <h2 class='white f1 mt-0'>{{ trilha.nome }}</h2>
        
    </div>
    <div style="color:white; ">

        <trilhas-info-icones :trilha="trilha" />
    </div>

    <!-- <downloadTrilha :id="trilha.id" /> -->


    <div> <visitadotrilha :item="trilha" :showtext="true" /> </div>
    
    <div class='white' v-if="trilha.descricao != null" v-html="trilha.descricao" > </div>
    
    <p class='white mt1'> <b>Regiões Administrativas:</b> {{ trilha.regiao_administrativa }}</p>

    

    <hr>

    <div>

        <p  v-if=" !$_.isEmpty(trilha.imagemtrilha_set) " class='white mt5 '> <b>Fotografias:</b>
        
            <div class="galeria mb5" v-if=" !$_.isEmpty(trilha.imagemtrilha_set)"  v-pan>
                <div class='galeria-item' v-for="item in trilha.imagemtrilha_set">
                    <img style="max-width:initial!important; max-height:400px;" :src="`${api.thumb}?url=${item.imagem}&w=800&h=600`">
                </div>
            </div>    
        </p>
    

        <p  v-if=" !$_.isEmpty(trilha.videoyoutubetrilha_set) " class='white mt1'> <b>Vídeos:</b>
            <div v-for="video in trilha.videoyoutubetrilha_set" :key="video.url">
                <div class="embed-responsive embed-responsive-16by9">
                        <!-- <iframe class="embed-responsive-item" :src="video.url" allowfullscreen></iframe> -->
                        <iframe class="embed-responsive-item" :src="$_.getYoutubeUrl(video.url)" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                            {{video.url}}
                </div>
            </div>
        </p>


        <div class='mt-4' v-if="!$_.isEmpty(parques_set)">
            <p class='white mt3' style='font-size:18px; color:#f0c679'> <b> <i class="vtl vtl-parques "></i> Parque em que essa trilha passa: </b> </p>
            <!-- <pre>{{ trilha.parques }}</pre> -->
            <list :itens="parques_set" :search="false" template="list-item-parque-compact"> </list>
        </div>

    </div>


</div>

</template>


<script>
import bbox from "@turf/bbox";

export default {
	data() {
		return {
			mudando: false,
		};
	},
	props: ["id"],

	mounted: function () {
        this.$nextTick(()=>{
            this.zoomParque();
        })
	},

	watch: {
		trilha: function (val) {
			this.zoomParque();
		},
	},

	computed: {
		trilha: function () {
			return this.$store.getters.trilhaByID(this.id);
		},

		parques_set: function () {
			// try{
			let listparques = _.get(this.trilha, "parques", []);
			let parqueMontado = [];

			listparques.forEach((parque) => {
				let parqueComInfos = this.$store.getters["parqueByID"](
					_.get(parque, "id", parque)
				);
				parqueMontado.push(parqueComInfos);
			});

			return parqueMontado;
			// }catch(e){
			//     console.error(e);
			//     return []
			// }
		},
	},

	destroyed() {
		this.$store.dispatch("trilhaSelectedID", false);
	},

	methods: {
		zoomParque: function () {
            if(!this.trilha?.geom) return

			var bboxparque = bbox(this.trilha.geom);
			// this.$store.dispatch("trilhaSelectedID", this.trilha.id);

			let padding = {
				top: 10,
				bottom: 10,
				left: 10,
				right: 10,
			};

			let container = document.getElementById("conteudo-container");
			const containerBBOX = container.getBoundingClientRect();
			// esta na lateral
			if (containerBBOX.x > 0) {
				padding.right = containerBBOX.width;
			} else {
				padding.bottom = 300;
			}

			// console.log(bboxparque);
			window.map.fitBounds(
				[
					[bboxparque[0], bboxparque[1]],
					[bboxparque[2], bboxparque[3]],
				],
				{
					padding: padding,
				}
			);
		},
	},
};
</script>
