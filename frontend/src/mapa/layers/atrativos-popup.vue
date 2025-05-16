<template>
  <div>
    <div :class="'atrativocontent ' + size">
      <div>
        <b>{{ $get(item, "nome", "") }}</b>
      </div>
      <div
        v-if="item.descricao !== 'null'"
        v-html="$get(item, 'descricao', '')"
      ></div>

      <div v-if="size === 'small'" class="galeria-icons">
        <div
          class="galeria-item"
          v-for="item in imagens"
          :key="item.url"
          :style="{
            backgroundSize: 'cover',
            backgroundImage: `url(${api.thumb}?url=${item.imagem}&w=200&h=200)`
          }"
        ></div>

        <div class="galeria-item" v-for="video in videos" :key="video.url">
          <div class="embed-responsive embed-responsive-16by9">
            <!-- <iframe class="embed-responsive-item" :src="video.url" allowfullscreen></iframe> -->
            <iframe
              class="embed-responsive-item"
              :src="$_.getYoutubeUrl(video.url)"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            ></iframe>
            {{ video.url }}
          </div>
        </div>
      </div>

      <div v-else-if="!$_.isEmpty(imagens) || !$_.isEmpty(videos)">
        <div :class="'galeria ' + size" v-pan="{ adaptiveHeight: false, cellAlign:'center'}">
          <div class="galeria-item" v-for="item in imagens" :key="item.url">
            <img
              style="
								max-width: 100% !important;
								max-height: 400px;
							"
              :src="`${api.thumb}?url=${item.imagem}&w=800&h=600`"
            />
          </div>

          <div class="galeria-item" v-for="video in videos" :key="video.url">
            <div class="embed-responsive embed-responsive-16by9">
              <!-- <iframe class="embed-responsive-item" :src="video.url" allowfullscreen></iframe> -->
              <iframe
                class="embed-responsive-item"
                :src="$_.getYoutubeUrl(video.url)"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
              ></iframe>
              {{ video.url }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["size", "item"],

  computed: {
    myWidth: function() {
      if (this.size === "small") {
        return "300px";
      } else {
        return "650px";
      }
    },
    myHeight: function() {
      if (this.size === "small") {
        return "200px";
      } else {
        return "450px";
      }
    },
    myColor: function() {
      return "#292929";
    },
    videos: function() {
      if (this.item?.videos?.constructor?.name === "String") {
        return JSON.parse(this.item?.videos);
      } else if (this.item?.videos?.constructor?.name === "Array") {
        return this.item.videos;
      }
      return [];
    },
    imagens: function() {
      if (this.item?.imagens?.constructor?.name === "String") {
        return JSON.parse(this.item?.imagens);
      } else if (this.item?.imagens?.constructor?.name === "Array") {
        return this.item.imagens;
      }
      return [];
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../css/variaveis';

.atrativocontent.small {
	max-width: 300px;
	max-height: 400px;

	.galeria-icons {
		display: grid;
		grid-template-columns: 50px 50px;
		// grid-template-rows: 50px 50px 50px 50px 50px 50px 50px 50px 50px 50px;
		gap: 5px;

		.galeria-item {
			min-width: 50px;
			min-height: 50px;
			max-width: 50px;
			max-height: 50px;
			border-radius: 4px;
			overflow: hidden;
			border: 2px solid #ffffff80;
			box-shadow: 2px 2px 4px 0px #3b00a975;
		}
	}
}




.atrativocontent.big {
	max-width: 550px;
	max-height: 400px;
  +mobile(){
          max-width: 350px;
  }

	.galeria {
		max-width: 550px;
		max-height: 300px;
		min-width: 550px;
		min-height: 300px;

    +mobile(){
          max-width: 320px;
          min-width: 320px;
    }

		// +mobile() {
		// margin-top: 75vh;
		// min-width: 100%; // para subscrever o setilo que passo tipo col-5
		// border-top: 3px solid color-orange;
		// position: relative;
		// }
	}

	.galeria-item {
		width: 550px;
		height: 300px;
    text-align:center

    & img{
      max-width: 100%
    }

    +mobile(){
          width: 320px;
    }

	}





}
</style>
