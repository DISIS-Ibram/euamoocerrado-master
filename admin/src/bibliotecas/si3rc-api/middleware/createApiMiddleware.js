import queryString from "qs";
import { decamelize } from "humps";
import { Link } from "react-router";
import * as _ from "lodash";
import * as apiActions from "../modules/api";
import {
  SI3RC_MODELS,
  SI3RC_MODELS_API_MAP,
  getIDValue,
  getIDKey,
  getModel,
} from "models/models";

import Notifications from "react-notification-system-redux";
import ViewMore from "components/ViewMore";

import criaconsole from "util/myconsole";

const _debug = false;
const myconsole = criaconsole(
  _debug,
  " *** ApiMiddleware.js | ",
  "color:green;font-weight:bold"
);

function getDefaultHeaders() {
  const token = localStorage.token;
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };
}

function getDefaultHeadersFormData() {
  const token = localStorage.token;
  return {
    Authorization: `Token ${token}`,
  };
}

function serialize(resource) {
  return JSON.stringify(resource);
}

// funcao que lida com o erros do fetch. TODO
// Talvez colocar aqui erros do form-redux???

async function handleErrors(responseRef, method) {
  //

  var response = responseRef.clone();

  if (!response.ok) {
    // quando dou um trhow erro,
    // toda a minha cadeia do async para e vai para o catch
    // nesse caso estou lidando com o catch no HOC carrega modelo.
    // LETODO - verificar se continuamos assim ou não,
    // ou se vou passando o erro adiante.

    var respText = "";
    var elementos = "";
    var autoDismiss = 5;
    var dismissible = true;
    var mensagem;

    var methodName = {
      DELETE: "APAGAR",
      OPTIONS: "Carregar Opções do Modelo",
      POST: "SALVAR",
      PATCH: "ATUALIZAR",
    };

    var title = "Ocorreu um erro ao " + methodName[method];

    if (method === "DELETE") {
      title = "Erro ao remover item!";
    }

    if (method === "OPTIONS") {
      title = "Erro ao carregar as informações sobre o modelo!";
    }

    //LETODO
    //Verifico quando tem resposta ou nao
    if (response.status !== 500) {
      respText = await response.json().catch(function (erro) {
        console.log("Erro: ", erro);
      });
    }

    if (response.status === 500) {
      mensagem = (
        <b>
          Erro no Servidor. Entrar em contato com o administrador do sistema!
        </b>
      );
    } else if (response.status === 405) {
      if (_.has(respText, "deleteable")) {
        mensagem = <b>{respText.msg}</b>;
        //respText = (<pre>{JSON.stringify(respText,null,2)}</pre>)
        elementos = _.map(respText.deleteable, (elm) => {
          return _.map(elm, (v, k) => {
            return (
              <div>
                <Link to={"/form/" + k + "/" + v}>
                  {" "}
                  {k} (id:{v}){" "}
                </Link>
              </div>
            );
          });
        });
      }

      if (_.has(respText, "erro[0]")) {
        mensagem = <b>{respText.erro[0]}</b>;
      }
      if (_.has(respText, "detail")) {
        mensagem = <b>{respText.detail}</b>;
      }

      dismissible = false;
      autoDismiss = 15;

      //BAD REQUEST
    } else if (response.status === 400) {
      if (_.isObject(respText)) {
        elementos = [];
        _.forOwn(respText, (v, k) => {
          elementos.push(
            <li>
              <a
                style={{ cursor: "pointer", color: "red" }}
                onClick={(e) => {
                  if ($("input[name='" + k + "']").length > 0) {
                    $("input[name='" + k + "']").focus();
                  } else if ($("textarea[name='" + k + "']").length > 0) {
                    $("textarea[name='" + k + "']").focus();
                  } else if ($("input[name='" + k + "-search']").length > 0) {
                    $("input[name='" + k + "-search']").focus();
                  }
                }}
              >
                {" "}
                <strong>{k}</strong> - {v[0]}{" "}
              </a>
            </li>
          );
        });
      }

      mensagem = <b>{respText.msg}</b>;

      dismissible = false;
      autoDismiss = 10;
    } else {
      if (_.has(respText, "erro[0]")) {
        mensagem = <b>{respText.erro[0]}</b>;
      }
      if (_.has(respText, "detail")) {
        mensagem = <b>{respText.detail}</b>;
      }
    }

    const notificationOpts = {
      // uid: 'once-please', // you can specify your own uid if required
      title: title,
      message: (
        <div>
          {mensagem}
          <br />
          <div>
            <ul>{elementos}</ul>
          </div>
        </div>
      ),
      position: "tr",
      autoDismiss: 10,
      dismissible: dismissible,
      // action: {
      //   label: 'Click me!!',
      //   callback: () => alert('clicked!'),
      // },
    };

    //   // so pq é massa fazer ganbiarras. nada de import nao, ahuahuahuahauha
    window.STORE.dispatch(Notifications.error(notificationOpts));

    throw responseRef; // new Error(response);
    return responseRef;
  }

  return responseRef;
}

function replacePropertyValue(prevVal, newVal, object) {
  const newObject = _.clone(object);

  _.each(object, (val, key) => {
    if (val === prevVal) {
      newObject[key] = newVal;
    } else if (typeof val === "object" || typeof val === "array") {
      newObject[key] = replacePropertyValue(prevVal, newVal, val);
    }
  });

  return newObject;
}

// funcao que vai lidar com a resposta do fetch
async function handleResponse(response) {
  myconsole.log("handleResponse RAW ======= %o", response);

  const respostaTxt = await response.text();

  console.log("respostaTxt createApiMiddleware.js: ", respostaTxt);

  const respostaRepla = respostaTxt;

  myconsole.log("handleResponse Text ======= %o", respostaRepla);
  console.log("handleResponse Text ======= %o", respostaRepla);

  const pp = `${respostaTxt}    `;
  const res = JSON.parse(pp);

  myconsole.log("handleResponse Json ======= %o", JSON.parse(pp));

  myconsole.log("handleResponse Json ======= %o", { ...res });

  let { results, included = [], meta = {} } = res;

  if (!results) results = [res];

  if (res.resultado) results = res.resultado;

  if (results) {
    if (_.isArray(results)) {
    }

    return {
      resources: [
        ...(Array.isArray(results) ? results : [results]),
        ...included,
      ],
      result: Array.isArray(results) ? results.map((r) => r.id) : results.id,
      meta,
      response,
    };
  }
  return {
    resources: [],
    result: null,
    meta,
    response,
  };
}

function createMiddleware(host, defaultHeaders) {
  // constante que contem os actions
  // que o middleware processa
  const requestActionsCall = {
    [apiActions.GET]: (options) => requestAction("GET", options),
    [apiActions.POST]: (options) => requestAction("POST", options),
    [apiActions.PATCH]: (options) => requestAction("PATCH", options),
    [apiActions.DELETE]: (options) => requestAction("DELETE", options),
    [apiActions.OPTIONS]: (options) => requestAction("OPTIONS", options),
  };

  //= =====================================================
  //     FUNCAO QUE FAZ O FETCH
  //= =====================================================

  // func que efetiva a requisizao ao servidor
  const requestAction = async (
    method,
    { resources = {}, modeloSchema = {}, payload = {} }
  ) => {
    const params = payload.param || {};

    const options = modeloSchema.options || {};

    let url = payload.url || {};

    const headers = payload.headers || {};

    let isNew = false;
    if (resources._new) {
      delete resources._new;
      isNew = true;
    }

    if (!modeloSchema.include) {
      if (method === "GET" && modeloSchema.includeOnLoad) {
        options.includes = modeloSchema.includeOnLoad;
      }
    }
    //sertifico que se nao tive include eu nao passo na url
    if (options.includes) {
      if (_.isEmpty(options.includes)) delete options.includes;
    }

    myconsole.log("requestAction METHOD:", method);

    url = getURL(method, resources, modeloSchema, options, url, isNew);

    // if( method === 'OPTIONS')
    // url += "?format=json"

    myconsole.log("url:", url);

    // if(method === 'DELETE' || method === 'POST' || method === 'PATCH' ) url = url+'/';

    // se estou atualizando,eu removo oo id do objeto pq ele já esta definido na URL
    if (method === "PATCH") {
      const idKey = getIDKey(resources, modeloSchema);
      try {
        delete resources[idKey];
      } catch (e) {}
    }

    let response;

    // Vejo se tem envio de arquivos junto ou não
    if (!checkForFile(resources)) {
      // Se não tenho é normal

      console.log("URL recebida", url);

      response = await fetch(url, {
        method,
        credentials: "include",
        body: ["POST", "PATCH"].includes(method)
          ? serialize(resources)
          : undefined,
        headers: {
          ...getDefaultHeaders(),
          ...defaultHeaders,
          ...headers,
        },
      });
    } else {
      const objectToFormData = (obj, form, namespace) => {
        var fd = form || new FormData();
        var formKey;

        for (var property in obj) {
          if (obj.hasOwnProperty(property)) {
            if (namespace) {
              formKey = namespace; //+ '[' + property + ']';
            } else {
              formKey = property;
            }

            // if the property is an object, but not a File,
            // use recursivity.
            if (
              typeof obj[property] === "object" &&
              !(obj[property] instanceof File)
            ) {
              objectToFormData(obj[property], fd, property);
            } else {
              // if it's a string or a File object
              fd.append(formKey, obj[property]);
            }
          }
        }

        return fd;
      };

      //   // Se tenho preciso fazer outro tipo de envio
      let formData = objectToFormData(resources);

      // for (name in resources) {
      //     formData.append(name, resources[name]);
      // }

      response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          ...getDefaultHeadersFormData(),
        },
        body: formData,
      });
    }

    // LETODO - Aqui qualquer error eu para a execução.
    // vou passar o erro para frente para os views lidarem com ele
    // por exemplo, modelos que ja tem key retorna erro 400, acho que erro igual do http;

    response = await handleErrors(response, method);

    myconsole.log("response raw");
    myconsole.log(response);

    myconsole.log("dataFinalMontado - RAW response: %o", response);

    if (response.ok === true) {
      //o response recebe um promisse que paso para a frente
      response =
        response.status === 204 ? { resources } : handleResponse(response);

      if (method === "DELETE") {
        let notificationOpts = {
          title: "Item Removido com sucesso !",
          message: (
            <div>
              {modeloSchema.type} - {resources.nome || resources.id} <br />
            </div>
          ),
          position: "tr",
          autoDismiss: 10,
          dismissible: true,
        };
        window.STORE.dispatch(Notifications.info(notificationOpts));
      }

      if (method === "POST") {
        let notificationOpts = {
          title: "Item CRIADO com Sucesso !",
          message: (
            <div>
              {modeloSchema.type} - {resources.nome || resources.id} <br />
            </div>
          ),
          position: "tr",
          autoDismiss: 15,
          dismissible: true,
        };
        window.STORE.dispatch(Notifications.success(notificationOpts));
      }

      if (method === "PATCH") {
        let notificationOpts = {
          title: "Item ATUALIZADO com Sucesso !",
          message: (
            <div>
              {modeloSchema.type} - {resources.nome || resources.id} <br />
            </div>
          ),
          position: "tr",
          autoDismiss: 15,
          dismissible: true,
        };
        window.STORE.dispatch(Notifications.success(notificationOpts));
      }
    }

    // console.groupEnd()

    return response;
  };

  // GERA A URL CONFORME
  const getURL = (
    method,
    resources,
    modeloSchema = {},
    options = {},
    url = "",
    isNew = false
  ) => {
    myconsole.log("geURL arguments %o", resources, modeloSchema);
    let urlParts = "";

    //Se comeca com / a url uso relativo a api, senao uso relativo ao rest_api
    if (modeloSchema.url) {
      if (modeloSchema.url.match(/^\//)) {
        urlParts = window.SI3CONFIG.url;
      } else {
        urlParts = window.SI3CONFIG.urlAPI;
      }
    }

    if (modeloSchema.url) {
      urlParts = [...urlParts, "/", modeloSchema.url];
    }

    const IDVal = getIDValue(resources, modeloSchema);
    const IDKey = getIDKey(resources, modeloSchema);

    // so gero url com o id de objeto se não for novo.
    // se for nome so pego o caminho do modelo mesmo pois vou dar um post para la
    if (IDVal != 0 && IDVal != "new" && isNew == false) {
      // se id é um array, quer dizer que temos que carregar de outra url
      if (_.isArray(IDVal) && modeloSchema.type) {
        let modeloNome = modeloSchema.type;

        if (SI3RC_MODELS_API_MAP[modeloNome]) {
          modeloNome = SI3RC_MODELS_API_MAP[modeloNome];
        }

        urlParts = [
          window.SI3CONFIG.modelsByID,
          "?modelo=",
          modeloNome,
          "&id=",
          IDVal.join(","),
        ];
      } else {
        urlParts = urlParts = [...urlParts, "/", IDVal, "/"];
      }
    }

    // vejo o que tenho de options e appendo na url
    if (method === "GET") {
      let first = true;
      _.forOwn(options, (v, k) => {
        if (!_.isNil(v)) {
          let appendSTR = first ? "?" : "&";
          first = false;
          urlParts.push(`${appendSTR + k}=${encodeURI(v)}`);
        }
      });
    }

    // urlParts = urlParts = [...urlParts, '/', IDVal,'/'];

    let urlfinal = urlParts.join("").replace(/([^:])\/\//g, "$1/");

    //verifico se tem parametro, se tiver removo a barra urlfinal
    if (urlfinal.match(/\?/g)) {
      urlfinal = urlfinal.replace(/\/$/, "");
    }

    return urlfinal;
  };

  const checkForFile = (resources) => {
    let temimage = false;
    // LETODO - fazer loop se for array e tb em nested objects ou arrays
    _.forOwn(resources, (value, key) => {
      if (Object.prototype.toString.call(value) == "[object File]") {
        temimage = true;
        return true;
      }
    });
    return temimage;
  };

  //= =====================================================
  //     O MIDDLEWARE
  //= =====================================================

  // aqui o middleware de verdade, que fica escutando os actions do redux
  // uso async na funcao, apra pausar ela na parte que preciso.

  // action.type = acao
  // action.payload.modeloSchema = MODELO
  // action.payload.resources = obj passado na requisicao
  // action.payload.url = se defino uma url manualmente
  return (store) => (next) => async (action) => {
    if (requestActionsCall.hasOwnProperty(action.type)) {
      next(action); // passo para o proximo middleware

      // checo o que é para incluir

      // if(action.type == apiActions.GET && model.includeOnLoad.length >0){
      //     action.payload.modeloSchema.includeOnLoad =
      // }

      // pego a data, a funcao ja vai processar os dados
      const data = await requestActionsCall[action.type](action.payload);

      const model = action.payload.modeloSchema;

      // ai dispacho que a Action recevi com os dados
      store.dispatch(
        apiActions.receive(
          data.resources,
          action.type,
          model,
          action.payload.resources
        )
      );

      // retorno os dados (verificar para quem é retornado)
      return data.resources;
    } // fim se sao as acoes que o middleware le

    return next(action);
  };
}

export default createMiddleware;
