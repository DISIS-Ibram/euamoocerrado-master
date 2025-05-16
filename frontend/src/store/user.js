// Regiao de Estudo
// import Fuse from 'fuse.js'
import { urls } from "@/api.js";

export default function(data) {
  var state = {
    user: false
  };

  return {
    state: state,

    //--MUTATIONS
    mutations: {
      setMutation: function(state, data) {
        _.each(data, (v, k) => {
          state[k] = v;
        });
      }
    },

    //--ACTIONS
    actions: {
      register: async function(ctx, data) {
        var register = urls.register;

        var body = JSON.stringify(data);
        var response = await fetch(register, {
          method: "POST",
          body: body,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          var resFinal = await response.json();
          return { error: true, msg: resFinal }; //await response.json();
        }
        var resFinal = await response.json();
        //make login if all is ok
        return { error: false };
      },

      login: async function(ctx, { email, password }) {
        var login = urls.login;
        var resources = { password: password };
        resources.email = email;

        var body = JSON.stringify(resources);
        const token = getToken();
        var response = await fetch(login, {
          method: "POST",
          body: body,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          return false; //await response.json();
        }
        var resFinal = await response.json();
        //salvo o token
        saveToken(resFinal.key);
        ctx.dispatch("getUserFromToken");
        //recarrego todo o conteudo para incluir agora o que é visivel somente para mim
        ctx.dispatch("loadParques", true);
        return true;
      },

      logout: async ctx => {
        var logout = urls.logout;
        const token = getToken();
        var response = await fetch(logout, {
          method: "POST",
          body: null, //e sem credenciais para funcionar
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Token " + token
          }
        });
        if (!response.ok) {
          return response;
        }
        var resFinal = await response.json();
        delete localStorage.token;
        ctx.commit("setMutation", { user: false });
        //recarrego todo o conteudo para incluir agora o que é visivel para o publico
        ctx.dispatch("loadParques", true);
      },

      getUserFromToken: async ctx => {
        var token = getToken();
        // token = "0dde4893b0ec5b61955a5fd3362f7d8ae5147482";
        if (token) {
          //se tenho pego o usuario
          var usuario = await getMeUser(token);
          if (usuario == false) {
            localStorage.removeItem("token");
          }
          ctx.commit("setMutation", { user: usuario });
          ctx.dispatch("loadUserInfo");
          return usuario;
        } else {
          return false;
        }
      },

      recoverPasswordRequest: async (ctx, { email }) => {
        //
        var resetPassword = urls.resetPassword;
        var resources = { email: email };

        var body = JSON.stringify(resources);
        var response = await fetch(resetPassword, {
          method: "POST",
          body: body,
          // credentials: 'include',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          return false;
        }

        var resFinal = await response.json();
        return resFinal;
      },

      newPasswordRequest: async (ctx, { id, token, password }) => {
        //
        var url =
          urls.apibase + "password-reset/confirm/" + id + "/" + token + "/";
        var resources = {
          new_password1: password,
          new_password2: password
        };
        var body = JSON.stringify(resources);
        var response = await fetch(url, {
          method: "POST",
          body: body,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          return false;
        }

        var resFinal = await response.json();
        return resFinal;
      }
    },

    //--GETTERS
    getters: {
      user: state => {
        if (state.user.user) return state.user.user;
        else return false;
      }
    }
  };
}

const getMeUser = async token => {
  var url = urls.user;
  var response = await fetch(url, {
    method: "GET",
    body: undefined,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Token " + token
    }
  });

  if (!response.ok) {
    return false;
  }
  var usuario = await response.json();

  //salvo o token
  return usuario;
};

const getToken = () => {
  return localStorage.token;
};

const saveToken = token => {
  localStorage.token = token;
};
