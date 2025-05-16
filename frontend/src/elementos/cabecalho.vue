<template>
  <transition name="fade" appear>
    <div>
      <div id="logowrap">
        <router-link to="/" id="logo">
          <img src="/images/euamocerrado.png" />
        </router-link>
        <div class="slogan">
          Conhecer para preservar:<br />cuida quem ama e ama quem conhece
        </div>
      </div>

      <div class="menu-bars">
        <i class="fa fa-bars" @click="mobileOpen = !mobileOpen"></i>
      </div>

      <div class="top-menu-wrap">
        <div class="login top-menu-item">
          <login-form />
        </div>

        <div class="top-menu-item">
          <!-- <avistamento-form v-if="user !== false" /> -->
          <!-- <envia-trilha-form /> -->
          <!-- <envia-especie /> -->
        </div>
      </div>

      <div id="menu-wrapmenu" :class="{ mobileOpen: mobileOpen }">
        <vtl-menu label="O Projeto" icon="vtl  vtl-oficial " to="/sobre">
          <vtl-menu label="Sobre o Projeto" to="/sobre"> </vtl-menu>
          <vtl-menu label="Tutorial" to="/tutorial"> </vtl-menu>
          <vtl-menu label="Publicações" to="/publicacoes"> </vtl-menu>
          <vtl-menu label="Links Cerrado" to="/conteudo/linkscerrado"> </vtl-menu>
        </vtl-menu>

        <vtl-menu label="Parques e UCs" icon="vtl vtl-parques " to="/parques"> </vtl-menu>
        <vtl-menu label="Trilhas" icon="vtl vtl-percurso" to="/trilhas/"> </vtl-menu>

		 <vtl-menu label="Biodiversidade" icon="vtl  vtl-ave " to="/especies">
			<vtl-menu label="Aves" icon="vtl vtl-ave" to="/especies/ave"> </vtl-menu>
			<vtl-menu label="Mamíferos" icon="vtl vtl-mamifero" to="/especies/mamifero" > </vtl-menu>
			<vtl-menu label="Peixes" icon="vtl vtl-peixe" to="/especies/peixe"> </vtl-menu>
			<vtl-menu label="Árvores" icon="vtl vtl-arvore" to="/especies/arvore"> </vtl-menu>
			<vtl-menu label="Frutos" icon="vtl vtl-fruto" to="/especies/fruto"> </vtl-menu>
		</vtl-menu>

        <div class="d-block d-sm-none top-section-menu-small">
          <div v-if="user !== false" class="">
            <!-- <vtl-menu
              label="Marcar Avistamento "
              icon="fa fa-binoculars"
              to="/"
              @click.native="openAvistamento"
            >
            </vtl-menu>

            <vtl-menu
              label="Minhas Trilhas "
              icon="fa fa-binoculars"
              to="/minhastrilhas"
            >
            </vtl-menu>

            <vtl-menu
              label="Minhas Espécies "
              icon="fa fa-binoculars"
              to="/minhastrilhas"
            >
            </vtl-menu> -->

            <vtl-menu
              :label="'SAIR'"
              icon="fa fa-sign-out"
              to="/"
              @click.native="$store.dispatch('logout')"
            >
            </vtl-menu>
            <!-- <avistamento-form /> -->
          </div>

          <div v-if="user === false">
            <vtl-menu
              label="Fazer Login "
              icon="fa fa-user"
              @click.native="openLogin"
            >
            </vtl-menu>
          </div>
        </div>
      </div>
      <div
        class="fade-menu-mobile d-block d-sm-none"
        :class="{ mobileOpen: mobileOpen }"
        @click="mobileOpen = false"
      ></div>

      <!-- <div id="grandientHeader"></div>  -->
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      mobileOpen: false
    };
  },

  computed: {
    currentLang: function() {
      return this.$store.getters.currentLang;
    },

    user: function() {
      return this.$store.getters.user;
    }
  },

  watch: {
    // call again the method if the route changes
    $route: function(to, from) {
      this.mobileOpen = false; //fecho o menu
      //vejo se tem meta de conteudo, e o tamanho do conteudo ou a sua classe
    }
  },

  created: function() {
    $(window).resize(() => {
      var conteudoWidth = $("#conteudo-container").width() || 0;
      TweenMax.to("#menu-wrap", 0.02, { x: conteudoWidth });
    });
  },

  methods: {
    changeLanguage: function(lang) {
      this.$store.dispatch("setCurrentLang", lang);
      //mudo a url
      if (this.$route.params.lang) {
        var langActual = this.$route.params.lang;
        if (langActual != lang) {
          var path = this.$route.path;
          path = path.replace(`/${langActual}/`, `/${lang}/`);
          this.$router.push(path);
        }
      }
    },
    openAvistamento: function() {
      window.UIEvents.$emit("marcaAvistamento");
      this.mobileOpen = false;
    },
    openLogin: function() {
      window.UIEvents.$emit("showLogin");
      this.mobileOpen = false;
    }
  }
};
</script>

<style lang="stylus">
@import '../css/variaveis';

// LOGO
// ================================
// LOGOWRAP
logowrap-xs() {
	width: 155px !important;
	height: 76px !important;
	left: 0 !important;

	#logo {
		width: 42%;
		margin-left: -50px;

		img {
			transition: all 400ms;
		}
	}

	.slogan {
		display: none;
	}
}

#logowrap {
	position: fixed;
	top: 0px;
	z-index: 10;
	background: url('/images/fundo.png');
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 400ms;

	+between(1, 960px) {
		logowrap-xs();
	}

	.slogan {
		display: block;
		position: absolute;
		font-size: 12px;
		font-style: italic;
		color: white;
		padding: 0px 10px;
		bottom: 7px;
		text-align: center;
	}
}

.home #logowrap {
	width: 284px;
	height: 244px;
	left: 7%;

	+between(1, 960px) {
		logowrap-xs();
	}
}

.interna #logowrap {
	logowrap-xs();
}

// MENU
// ================================
.menu-bars {
	position: fixed;
	top: 10px;
	left: 92px;
	color: white;
	cursor: pointer;
	border-radius: 50%;
	text-align: center;
	z-index: 100;
	width: larg = 55px;
	height: larg;

	i {
		line-height: larg;
		font-size: 1.5em;
	}

	display: none;

	+between(1, 960px) {
		display: block;
	}
}

.interna .menu-bars {
	display: block;
}

#menu-wrapmenu {
	position: absolute;
	top: 30px;
	width: initial;
	height: 244px;
	z-index: 100;
	display: block;
	height: auto;
	left: calc(7% + 295px);

	+between(1, 960px) {
		display: none;
	}
}

.interna #menu-wrapmenu {
	display: none;
}

#menu-wrapmenu.mobileOpen {
	z-index: 100000;
	display: block;
	left: 155px;
	background: hsl(28, 60%, 53%);
	width: auto;
	position: fixed;
	padding: 1em;
	top: 0;

	+between(1, 576px) {
		display: block;
		right: 0;
		left: initial;
		width: 70%;
		top: 0;
		height: 100%;
		box-shadow: -5px 2px 5px 2px rgba(0, 0, 0, 0.5);
	}
}

.fade-menu-mobile.mobileOpen {
	+between(1, 576px) {
		position: fixed;
		background: rgba(0, 0, 0, 0.6);
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 1;
	}
}

.top-menu-wrap {
	position: fixed;
	display: flex;
	top: 0px;
	z-index: 1000;
	right: initial;
	left: 162px;

	.top-menu-item {
		margin-right: 10px;
		display: inline-block;

		.icon-menu {
			min-height: 35px;
			background: #e26433; // url('/images/fundo.png');
			z-index: 100;
			padding: 0.6em 1.5em;
			border-radius: 0 0 10px 10px;
			color: white;
			font-weight: 200;
			font-size: 14px;

			.icon-menu .label {
				font-size: 16px;
			}

			.icon-menu .icon {
				font-size: 16px;
			}
		}
	}
}

.top-section-menu-small {
	margin-top: 1.5em;
	padding-top: 1em;
	border-top: 1px dotted black;
	font-size: 14px;

	.icon-menu .label {
		font-size: 16px;
	}

	.icon-menu .icon {
		font-size: 16px;
	}
}

.home .top-menu-wrap {
	right: 98px;
	left: initial;
	// +between(1, 960px){
	// left:240px;
	// }
}

#grandientHeader {
	// content ''
	box: t 0 l 0 r 0 h 350px;
	background-image: linear-gradient(180deg, rgba(color-purple, 0.9), rgba(color-purple, 0) 100%);
	pointer-events: none;
	z-index: 0;
	transform: translate3d(0, 0, 0);
	opacity: 0.7;
	transition: all 400ms;

	+mobile() {
		display: none !important;
	}
}
</style>
