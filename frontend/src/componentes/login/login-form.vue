<template>
  <div v-if="user === false">

    <!-- Botão Fazer Login -->
    <div class="icon-menu d-none d-sm-block" @click="handleLoginClick">
      <span class="icon">
        <i class="fa fa-user"></i>
      </span>
      <div class="label">
        <span class="label fw-1">Fazer Login</span>
      </div>
    </div>

    <!-- MODAL LOGIN -->
    <div v-if="showLogin" class="loginform" @click="showLogin = false">
      <form @submit.prevent="login" @click.stop>

        <h2 class="white font-title mb-2">Login</h2>

        <!-- Mensagem de manutenção -->
        <div v-if="sistemaEmManutencao" class="alert alert-warning mb-3">
          ⚠️ Sistema em manutenção. O login está temporariamente indisponível.
        </div>

        <div class="form-group row">
          <div class="col-sm-12 mt-2">
            <input
              type="text"
              class="form-control"
              placeholder="Email"
              v-model="email"
              :disabled="sistemaEmManutencao"
            >
          </div>
        </div>

        <div class="form-group row">
          <div class="col-sm-12">
            <input
              type="password"
              class="form-control"
              placeholder="Senha"
              v-model="password"
              :disabled="sistemaEmManutencao"
            >
            <div class="mt2 fw1" @click="!sistemaEmManutencao && (esqueceuSenha = true)">
              Esqueceu sua senha?
            </div>
          </div>
        </div>

        <div v-show="erro" class="alert alert-danger ph1 pv1">
          Credenciais inválidas!
        </div>

        <div>
          <span class="white o-70 fw1" @click="showLogin = false">cancelar</span>
          <button class="btn pull-right" :disabled="sistemaEmManutencao">
            entrar
          </button>
        </div>

      </form>
    </div>

    <!-- MODAL ESQUECEU SENHA -->
    <div v-if="esqueceuSenha" class="loginform" @click="esqueceuSenha = false">
      <form @submit.prevent="esqueceusenha" @click.stop>

        <h2 class="white font-title mb-2">
          Esqueceu <br> sua senha?
        </h2>

        <div class="form-group row">
          <div class="col-sm-12 mt2">
            <input
              type="text"
              class="form-control"
              placeholder="Digite seu Email"
              v-model="email"
            >
          </div>
        </div>

        <div class="form-group row">
          <div class="col-sm-12 mt2">
            {{ esqueceuSenhaMsg }}
          </div>
        </div>

        <div>
          <span class="white o-70 fw1" @click="esqueceuSenha = false">
            cancelar
          </span>
          <button class="btn pull-right">Recuperar</button>
        </div>

      </form>
    </div>

  </div>

  <!-- USUÁRIO LOGADO -->
  <div v-else>
    <div class="icon-menu d-none d-sm-block">
      <b-dropdown
        id="dropdown-1"
        class="dropdownlink white"
        size="sm"
        toggle-tag="span"
      >
        <template #button-content>
          <span class="fa-stack">
            <i class="fa fa-circle fa-stack-2x" style="color: gray"></i>
            <i class="fa fa-user fa-stack-1x fa-inverse"></i>
          </span>
          {{ (user.first_name || user.email) | truncate(20) }}
        </template>

        <b-dropdown-item v-to="'/minhastrilhas'">Minhas Trilhas</b-dropdown-item>
        <b-dropdown-item v-to="'/minhasespecies/ave'">Minhas Espécies</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click.native="$store.dispatch('logout')">
          <i class="fa fa-sign-out"></i> Sair
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      email: '',
      name: '',
      password: '',
      erro: false,
      erromsg: '',
      showLogin: false,
      esqueceuSenha: false,
      esqueceuSenhaMsg: '',
      sistemaEmManutencao: true
    }
  },

  computed: {
    user () {
      return this.$store.getters.user
    }
  },

  watch: {
    email () {
      this.erro = false
    },
    password () {
      this.erro = false
    }
  },

  methods: {
    handleLoginClick () {
      this.showLogin = true
    },

    async login () {
      if (this.sistemaEmManutencao) return
      const res = await this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      })
      this.erro = !res
    },

    async esqueceusenha () {
      const res = await this.$store.dispatch('recoverPasswordRequest', {
        email: this.email
      })
      this.esqueceuSenhaMsg = res
    }
  }
}
</script>

<style lang="stylus">
@import "../../css/variaveis";

.loginform {
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(black, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    padding: 2em;
    background: hsl(21, 73%, 55%);
    min-height: 350px;
    min-width: 350px;
    max-width: 450px;
    margin-bottom: 5em;
  }
}
</style>