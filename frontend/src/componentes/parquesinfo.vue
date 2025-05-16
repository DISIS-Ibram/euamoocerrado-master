<template>

    <div>

        <div v-if="parque && parque.nome" class="ph4">

            <i class="fa fa-2x fa-arrow-left" v-to="'/parques'"></i>


            <div class='mt-2'>
                PARQUE
                <h2 class='white f1 mt-0'>{{ parque.nome }}</h2>
            </div>


            <p class='white f4'><i>{{ parque.nome_decreto }}</i></p>

            <div class="sede">
                <possui-sede :sede="parque.possui_sede" />
            </div>
            <p></p>
            <div>
                <a class="white btn btn-success o-50">
                    <visitadoparque :item="parque" :showtext="true" />
                </a>
            </div>


            <p class="white mt-2 mt4">
                <a class=' white btn btn-dark o-50' :href="destination" target="_blank">
                    <i class="fa fa-exchange "></i>
                    <b>Como Chegar</b>
                </a>
            </p>

            <p class='white'> <b>Custo da Entrada:</b> {{ parque.custo_entrada }}</p>
            <p class='white'> <b>Horário de funcionamento:</b> {{ parque.periodo_abertura }}</p>
            <p class='white' v-html="parque.descricao"> </p>

            <p class='white mt1'> <b>Regiões Administrativas:</b> {{ parque.regiao_administrativa }}</p>



            <div class="white mt1" v-if="parque.contatoparque">
                <div v-if="!$_.isEmpty(parque.contatoparque.endereco)" class='white'> <b>Endereço</b>
                    {{ parque.contatoparque.endereco }}</div>
                <div v-if="!$_.isEmpty(parque.contatoparque.email)" class='white'> <b>Email:</b> <a
                        :href="'mailto:'+parque.contatoparque.email">{{ parque.contatoparque.email }}</a></div>
                <div v-if="!$_.isEmpty(parque.contatoparque.telefone)" class='white'> <b>Telefone:</b>
                    {{ parque.contatoparque.telefone }}</div>
            </div>

            <p class='white mt1' v-if="!$_.isEmpty(parque.status.benfeitorias) || !$_.isEmpty(parque.status.atrativos) "> <b>Atrativos e benfeitorias:</b>
                <div class="">
                    <benfeitoria-icon v-if="$_.has(parque,'status.benfeitorias')" class="icone" v-for="bem in parque.status.benfeitorias" :item="bem">
                    </benfeitoria-icon>
                    <benfeitoria-icon v-if="$_.has(parque,'status.atrativos')" class="icone" v-for="bem in parque.status.atrativos" :item="bem">
                    </benfeitoria-icon>
                </div>
            </p>



            <p v-if=" !$_.isEmpty(parque.imagemparque_set) " class='white mt5 '> <b>Fotografias:</b>

                <div class="galeria mb5" v-if=" !$_.isEmpty(parque.imagemparque_set)" v-pan>
                    <div class='galeria-item' v-for="item in parque.imagemparque_set">
                        <img style="max-width:initial!important; max-height:400px;"
                            :src="`${api.thumb}?url=${item.imagem}&w=800&h=600`">
                    </div>
                </div>

            </p>


            <p v-if=" !$_.isEmpty(parque.videoyoutubeparque_set) " class='white mt1'> <b>Vídeos:</b>
                <div v-for="video in parque.videoyoutubeparque_set">
                    <div class="embed-responsive embed-responsive-16by9">
                        <pre>{{video}}</pre>
                        <iframe v-if="video.url" class="embed-responsive-item" :src="$_.getYoutubeUrl(video.url)"
                            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                        {{video.url}}
                    </div>
                </div>
            </p>

            <hr />

            <div class='mt-4' v-if="!$_.isEmpty(especiesItens)">
                <p class='white mt1'> <b>Espécies Avistadas:</b> </p>
                <list :itens="especiesItens" :search="false" template="list-item-especie"> </list>
            </div>



            <div class='mt-4' v-if="!$_.isEmpty(parque.trilha_set)">
                <p class='white mt1'> <b> Trilhas que passam no parque: </b> </p>



                <list :itens="parque.trilha_set" :search="false" template="list-item-trilha"> </list>
            </div>



            <!-- <comentarios></comentarios> -->



        </div>
    </div>

</template>


<script>
import bbox from "@turf/bbox";
import center from "@turf/center-of-mass";

export default {
	data() {
		return {
			mudando: false,
		};
	},

	props: ["id"],

	created: function () {
		this.zoomParque();
		//    window.map.flyTo( {center:this.parque.center.coordinates, zoom:14.5, duration:2000 })
	},

	watch: {
		parque: function (val) {
			this.zoomParque();
			//  window.map.flyTo( {center:this.parque.center.coordinates, zoom:14.5, duration:2000 })
		},
	},

	computed: {
		especiesItens: function () {
			let itens = this.$store.getters.especies;
			var especiesAll = _.filter(itens, (especie) => {
				return this.parque.avistamentos.includes(especie.id);
			});

			return especiesAll;
		},

		parque: function () {
			var parque = this.$store.getters.parqueByID(this.id);
			//    delete parque.geom;
			return parque;
		},

		destination: function () {
			// if( !this.parque.geom ) return ''
			// var point = center(this.parque.geom).geometry.coordinates;
			// console.log(point)

			// return `https://www.google.com.br/maps/dir/?api=1&destination=${point[1]},${point[0]}`
			return "";
		},
	},

	methods: {
		zoomParque: function () {
			if (!this.parque?.geom) return;
			var bboxparque = bbox(this.parque.geom);
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

		addAtrativo: function (bem) {
			window.map.once("click", (e) => {
				console.log(bem);
				console.log(e);
				this.$store.dispatch("addAtrativo", {
					point: e.lngLat,
					id: bem.id,
				});
			});
		},

		addBenfeitoria: function (bem) {
			window.map.once("click", (e) => {
				console.log(bem);
				console.log(e);
				this.$store.dispatch("addBenfeitoria", {
					point: e.lngLat,
					id: bem.id,
				});
			});
		},
	},
};
</script>



<style lang="stylus">
@import '../css/variaveis';
</style>