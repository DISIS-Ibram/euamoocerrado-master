// var apiurlBase = "//"+window.location.hostname+":8585/";
// var apiurlBase =  process.env.VUE_APP_BACKEND_URL || "//api.euamocerrado.com.br/";

// Ela é definida no Index.html
// Depois podemos alterar so la na hora de iniciar o container, sem ter que recompilar toda hora
var apiurlBase = window.____BACKEND_URL;
const axios = require("axios");

var urls = {
  apibase: apiurlBase,
  apiurl: apiurlBase + "rest_api/",
  comentarios: apiurlBase + "rest_api/administracao/comentario/",
  obtergeojson: apiurlBase + "obtergeojson/",
  mapaincorporados: apiurlBase + "mapaspaineis/mapa1.php",
  server: apiurlBase, //'http://189.6.18.55:5000/',
  login: apiurlBase + "login/",
  register: apiurlBase + "register/",
  logout: apiurlBase + "logout/",
  user: apiurlBase + "user/",
  resetPassword: apiurlBase + "password/reset/",
  // tracker: 'http://192.168.0.10:3000/api/',
  thumb: apiurlBase + "thumb/",
  convertGeoFileToGeoJson: apiurlBase + "conversaogeo/"
};

// /obtergeojson/parquecenter - obter centroide
// /obtergeojson/pargue - obter poligno
// /obtergeojson/benfeitoria - obter poligno
// /obtergeojson/ocorrencia - obter poligno
// /obtergeojson/atrativo - obter poligno

let graphqlurl = window.____GRAPHQL_URL;
// let graphqlurl = `//${window.location.hostname}:${window.location.port}/graphql`;

let graphQL = async function(query, variables = {}) {
  if (query?.query) query = query?.query;

  // debugger;
  console.log("---------------");
  console.log('graphQL em api.js')
  console.log('graphqlurl: ', graphqlurl);
  console.log("---------------");

  return new Promise((resolve, reject) => {
    axios({
      url: graphqlurl,
      method: "post",
      data: {
        query: query,
        variables
      },
      headers: {
        "x-hasura-admin-secret": "myadminsecretkey"
      }
    })
      .then(response => {
        if (response?.data?.errors) {
          reject(response?.data?.errors);
        }
        resolve(response.data.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

let axiosServer = axios.create({
  // baseURL: process.env.baseUrl,
  timeout: 30000
});

let getServer = axiosServer.get;
let postServer = axiosServer.post;

export { urls, axiosServer, graphQL, getServer, postServer };

// let MyPlugin = {

//     install: function (Vue, options) {

//         let axiosServer = axios.create({
//             baseURL: process.env.baseUrl,
//             timeout: 30000,
//         });
//         let axiosServerInterno = axios.create({
//             baseURL: process.env.backendAddress,
//             timeout: 30000,
//         });

//         Vue.prototype.$qs = qs
//         Vue.prototype.$serverURL = process.env.baseUrl

//         Vue.$getServer = axiosServerInterno.get
//         Vue.$postServer = axiosServerInterno.post

//         Vue.prototype.$getServer = axiosServer.get
//         Vue.prototype.$postServer = axiosServer.post

//         Vue.prototype.$get = axios.get

//         Vue.prototype.$dev = process.env.NODE_ENV == "development"
//         Vue.prototype.$prod = process.env.NODE_ENV == "production"
//         Vue.prototype.$gql = gql;

//         let graphQl = async function( query, variables={} ){

//             let url = (process.client) ? process.env.baseUrl : process.env.backendAddress
//             console.log(url)
//             console.log(process.env.fromDocker)
//             // if( !process.env.fromDocker ){
//             //     url = process.env.baseUrl
//             // }
//             return axios({
//                 url:  url+'/graphql',
//                 method: 'post',
//                 data: {
//                     query: query,
//                     variables
//                 }
//             })

//         }

//         Vue.prototype.$graphQL = graphQl
//         Vue.$graphQL = graphQl

//     }

// }

// Vue.use(MyPlugin)

// window.API = api;
// window.api = api;

// export default api;
