// import { store } from "configStore.js";
import validacao from "./util/validacoes";

function serialize(resource = {}) {
  return JSON.stringify(resource);
}

//pego o usuario a partir do token
export const getUserFromToken = async () => {
  //
  // verifico se tem token
  var token = getToken();
  // token = "ldb4xLTuKWjuIoZLkWI1RiGAq8t1QQEiJ9QkIHTG8OtsfDrT6QyHpreMmzMBcuKS";

  if (token) {
    //
    //se tenho pego o usuario
    var usuario = await getMeUser(token);
    //
    // store.dispatch({ type: "USER_LOGIN", payload: usuario });
    return usuario;
  } else {
    return false;
  }
};

export const getToken = () => {
  return localStorage.token;
};

export const saveToken = (token) => {
  localStorage.token = token;
};

export const logout = async (cb) => {
  console.log("🔐 Pedido de logout recebido");

  const token = localStorage.token;

  // 1️⃣ Se não houver token, apenas limpa e sai
  if (!token || token === "undefined" || token === "null") {
    console.log("⚠️ Nenhum token válido encontrado — limpando localStorage.");
    delete localStorage.token;
    // store.dispatch({ type: "USER_LOGOUT", payload: {} });
    if (cb) cb();
    return;
  }

  const logoutUrl = window.SI3CONFIG.logout;
  console.log("📤 Fazendo logout no backend:", logoutUrl);
  console.log("Token:", token);

  try {
    const response = await fetch(logoutUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
    });

    if (!response.ok) {
      // 2️⃣ Se o servidor responder 401, token expirou → apaga mesmo assim
      if (response.status === 401) {
        console.warn("⚠️ Token expirado — limpando localStorage.");
      } else {
        console.error("❌ Erro ao fazer logout:", response.status);
      }
    } else {
      await response.json();
    }
  } catch (err) {
    console.error("💥 Falha na requisição de logout:", err);
  } finally {
    // 3️⃣ Sempre remove o token local e atualiza o Redux
    delete localStorage.token;
    // store.dispatch({ type: "USER_LOGOUT", payload: {} });
    if (cb) cb();
  }
};

const loggedIn = () => {
  return !!localStorage.token;
};

//pego o usuario com a token atual
const getMeUser = async (token) => {
  var login = window.SI3CONFIG.meUser;
  //LETODO - vazer pegar real so subdominio
  var response = await fetch(login, {
    method: "GET",
    body: undefined,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    },
  });

  if (!response.ok) {
    return false;
  }

  var usuario = await response.json();
  //

  //salvo o token
  return usuario;
};
//ldb4xLTuKWjuIoZLkWI1RiGAq8t1QQEiJ9QkIHTG8OtsfDrT6QyHpreMmzMBcuKS

export const loginRequest = async ({ email, password }) => {
  var login = window.SI3CONFIG.login;
  var resources = { password: password };

  // verifico se estou logando com email ou usuario
  if (validacao.isEmail(email)) {
    resources.email = email;
  } else {
    resources.username = email;
  }

  var body = JSON.stringify(resources);
  var response = await fetch(login, {
    method: "POST",
    body: body,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  // Se falhou, retorna a resposta original
  if (!response.ok) {
    return { ok: false };
  }

  // Lê o JSON aqui (uma única vez!)
  var resFinal = await response.json();

  // salva o token
  saveToken(resFinal.key);

  // retorna os dados já processados
  return { ok: true, data: resFinal };
};
