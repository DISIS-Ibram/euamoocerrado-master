// Regiao de Estudo
// import Fuse from 'fuse.js'
import Vue from "vue";
import { urls, axiosServer, graphQL, getServer, postServer } from "@/api.js";
import { QUERYES } from "../querys.js";

// import * as turf from '@turf/turf'

import nearestPointToLine from "@turf/nearest-point-on-line";
import length from "@turf/length";
import lineSliceAlong from "@turf/line-slice-along";
import lineSlice from "@turf/line-slice";
import bbox from "@turf/bbox";
// import lineDistance from '@turf/distance'
// import {featureCollection} from '@turf/feature-collection'
import { featureCollection } from "@turf/helpers";

var turf = {
  bbox,
  length,
  lineSliceAlong,
  lineSlice,
  nearestPointToLine,
  lineDistance: length,
  featureCollection
};

export default function(data) {
  var state = {
    geoJSON: false,

    parques: false,
    parquesStats: [],

    benfeitorias: null, //[]
    atrativos: null, //[]
    atrativosTrilhas: null, //[]

    trilhas: [],
    trilhasAtividades: [],
    trilhasStats: [],
    trilhaSelectedID: false,

    ocorrencias: [],
    especieSelectedID: false,

    tipo_atrativo: [],
    tipo_benfeitoria: [],

    avistamentosTotais: {},

    currentParqueID: false,

    parquesCentroidesGeoJSON: false,

    especies: [],
    especiesStats: [],

    especiesByID: [],
    especiesSelecionadaID: false,
    avistamentos: [],

    parquesvisitados: [],
    trilhasvisitados: []
  };

  return {
    state: state,

    //--MUTATIONS
    mutations: {
      setMutation: function(state, data) {
        _.each(data, (v, k) => {
          Vue.set(state, k, v); //state[k] = v;
        });
      },

      setMutationAdd: function(state, data) {
        _.each(data, (v, k) => {
          let atual = state[k];
          if (_.isArray(atual)) {
            //LETODO - se tiver id nos elementos recebidos, substituir
            if (_.isArray(v)) {
              atual = _.concat(atual, v);
            } else {
              atual.push(v);
            }
          }
          state[k] = atual;
          if (k == "especies") {
            state["especiesByID"] = _.keyBy(atual, "id");
          }
        });
      },

      setCurrentParque: function(state, id) {
        state.currentParqueID = id;
      },
      geoJSON: function(state, geoJSON) {
        state.geoJSON = geoJSON;
      },
      parquesCentroidesGeoJSON: function(state, parquesCentroidesGeoJSON) {
        state.parquesCentroidesGeoJSON = parquesCentroidesGeoJSON;
      },

      parques: function(state, parques) {
        state.parques = parques;
      }
    },

    //--ACTIONS
    actions: {

      loadParques: async function(ctx, force = false) {
        //return if alreade loaded and not set force tru to update
        if (_.isEmpty(ctx.state.parques) === false && force === false) {
          return;
        }

        var status = [];
        var parques = [];

        try {
          // await _.getJSON(urls.apibase+"obterstatsparque/",{},data=>{

          //     status = _.keyBy(data,'parque_id')
          //     ctx.commit('setMutation', { parquesstats:status });
          // })

          // await _.getJSON(urls.apiurl + "parque/parque/", {}, data => {
          //   console.log("parquesapi");
          //   console.log(data.results);
          //   // parques = data.results;
          // });

          let queryFinal = QUERYES["parques"];
          let res = await graphQL(queryFinal.query, queryFinal.variables);
          parques = res.parques;
          console.log("parques graphql");
          console.log(parques);

          // ctx.commit('setData', res)
          // return { error:false, data:res }
        } catch (e) {
          console.error(e);
          //LETODO - incluir erro sem ser alert para exibir em todos os casos
          alert("Error connecting to the service!");
        }

        // TODO !important - TEMP, so para lidar com hassura bem rapidinho, depois alterar
        parques.forEach(parque => {
          let trilha_set = [];
          parque.trilha_set.forEach(trilha => {
            if (trilha.deleted_at === null) trilha_set.push(trilha);
          });
          parque.trilha_set = trilha_set;
        });


        // TODO - Daniel ERRO Resolver
        graphQL(QUERYES["tipo_atrativos_benfeitorias"], {}).then(data => {
            // console.log('tipo_atrativos_benfeitorias: ', tipo_atrativos_benfeitorias)
            ctx.commit("setMutation", {
                tipo_atrativo: _.keyBy(data.tipo_atrativo, "id"),
                tipo_benfeitoria: _.keyBy(data.tipo_benfeitoria, "id"),
              });
            });
        // TODO - Daniel ERRO Resolver

        // graphQL(QUERYES["tipo_benfeitorias"], {}).then(data => {
        //   ctx.commit("setMutation", {
        //     tipo_benfeitoria: _.keyBy(data.tipo_benfeitoria, "id")
        //   });
        // });
        // _.getJSON(urls.apiurl + "parque/tipoatrativo/", {}, data => {
        //   ctx.commit("setMutation", {
        //     tipo_atrativo: _.keyBy(data.results, "id")
        //   });
        // });
        // });
        // _.getJSON(urls.apiurl + "parque/tipobenfeitoria/", {}, data => {
        //   ctx.commit("setMutation", {
        //     tipo_benfeitoria: _.keyBy(data.results, "id")
        //   });
        // });


        graphQL(QUERYES["atrativos_benfeitorias_parques"], {}).then(data => {
          ctx.commit("setMutation", {
            benfeitorias: _.keyBy(data.parque_benfeitoria, "id"),
            atrativos: _.keyBy(data.parque_atrativo, "id"),
          });
        });


        // _.getJSON(urls.apiurl + "parque/benfeitoria/", {}, data => {
        // let benfeitorias = []
        // parques.forEach(parque => parque.benfeitoria_set.forEach(benfitoria=>benfeitorias.push(benfitoria)))
        // ctx.commit("setMutation", {
        //   benfeitorias: _.keyBy(benfeitorias, "id")
        // });

        // // _.getJSON(urls.apiurl + "parque/benfeitoria/", {}, data => {
        // let atrativos = []
        // parques.forEach(parque => parque.atrativo_set.forEach(atrativo=>atrativos.push(atrativo)))
        // ctx.commit("setMutation", {
        //   atrativos: _.keyBy(atrativos, "id")
        // });
        // });
        // _.getJSON(urls.apiurl + "parque/atrativo/", {}, data => {
        //   ctx.commit("setMutation", {
        //     atrativos: _.keyBy(data.results, "id")
        //   });
        // });


        graphQL(QUERYES["trilhas"], {}).then(data => {
          let trilhas = data?.trilhas ?? [];
          trilhas = trilhas.map( trilha => {
            trilha.color = "hsl(" + _.random(0, 255, false) + ", 100%, 90%)";
            trilha.visitado = false;
            trilha.visitadoObj = false;
            return trilha;
          });

          ctx.commit("setMutation", {
            trilhas: trilhas
          });

          // let atrativos = []
          // trilhas.forEach(trilha => trilha.atrativotrilha_set.forEach(i=>atrativos.push(i)))
          // ctx.commit("setMutation", {
          //   atrativosTrilhas: _.keyBy(atrativos, "id")
          // });
          let atividades = []
          trilhas.forEach(trilha => trilha.atividades.forEach(i=>atividades.push(i)))
          
          ctx.commit("setMutation", {
            trilhasAtividades: _.keyBy(atividades, "id")
          });
        });

         
        graphQL(QUERYES["atrativos_trilhas"], {}).then(data => {
          ctx.commit("setMutation", {
            atrativosTrilhas: _.keyBy(data.trilha_atrativotrilha, "id"),
 
          });
        });



        // _.getJSON(
        //   urls.apiurl + "trilha/trilha/",
        //   { includes: "parques,atividades" },
        //   data => {
        //     var trilhas = _.map(data.results, trilha => {
        //       trilha.color =
        //         "hsl(" + _.random(0, 255, false) + ", 100%, 90%)";
        //       trilha.visitado = false;
        //       trilha.visitadoObj = false;
        //       return trilha;
        //     });
        //     ctx.commit("setMutation", { trilhas: trilhas });
        //   }
        // );

        // _.getJSON(urls.apiurl + "trilha/atrativo/", {}, data => {
        //   ctx.commit("setMutation", {
        //     atrativosTrilhas: _.keyBy(data.results, "id")
        //   });
        // });

        // _.getJSON(urls.apiurl + "trilha/atividade/", {}, data => {
        //   ctx.commit("setMutation", {
        //     trilhasAtividades: _.keyBy(data.results, "id")
        //   });
        // });

        graphQL(QUERYES["especies_tipo"], {}).then(data => {
          // const benfeitorias = parques.map(parque => parque.parque_benfeitoria);
          const especies = data.especies.map( item=>({...item,ocorrencia_set:item.ocorrencia_set.map(i=>i.id)}))
          ctx.commit("setMutation", { especies });
          ctx.commit("setMutation", {
            especiesByID: _.keyBy(especies, "id")
          });
        });

        // _.getJSON(urls.apiurl + "especie/tipoespecie/", {}, data => {
        //   ctx.commit("setMutation", { especies: data.results });
        //   ctx.commit("setMutation", {
        //     especiesByID: _.keyBy(data.results, "id")
        //   });
        // });

        graphQL(QUERYES["especies_ocorrencia"], {}).then(data => {
          // const benfeitorias = parques.map(parque => parque.parque_benfeitoria);
          ctx.commit("setMutation", { avistamentos: data.especie_ocorrencia });
        });

        // _.getJSON(urls.apiurl + "especie/ocorrencia/", {}, data => {
        //   ctx.commit("setMutation", { avistamentos: data.results });
        // });

        var featuresPolygon = [];
        var featuresCenter = [];

        _.each(parques, parque => {
          parque.color = "hsl(" + _.random(0, 255, false) + ", 40%, 50%)";
          parque.status = {}; //status[parque.id];
          parque.visitado = false; //garonto que vai ser reativo
          parque.visitadoObj = false;
          var parqueProperties = { ...parque };
          delete parqueProperties.geom;
          delete parqueProperties.center;

          featuresPolygon.push({
            properties: parqueProperties,
            geometry: parque.geom,
            type: "Feature"
          });
          featuresCenter.push({
            properties: parqueProperties,
            geometry: parque.center,
            type: "Feature"
          });
        });

        ctx.commit("geoJSON", {
          type: "FeatureCollection",
          features: featuresPolygon
        });
        ctx.commit("parquesCentroidesGeoJSON", {
          type: "FeatureCollection",
          features: featuresCenter
        });
        ctx.commit("parques", parques);

        ctx.dispatch("loadStats");
      },

      addAvistamento: async function(ctx, { point, id }) {
        let template = {
          oficial: false,
          publico: true,
          user: null,
          especie: id,
          parque: null,
          trilha: null,
          foto: null,
          geom: `Point(${point.lng} ${point.lat})`
        };

        _.postJSON(urls.apiurl + "especie/ocorrencia/", template, data => {
          setTimeout(() => {
            _.getJSON(urls.apiurl + "especie/ocorrencia/", {}, data => {
              ctx.commit("setMutation", { avistamentos: data.results });
            });
          }, 400);
          //LETODO - so pq precisa de um tempo maior?
          setTimeout(() => {
            _.getJSON(urls.apiurl + "especie/ocorrencia/", {}, data => {
              ctx.commit("setMutation", { avistamentos: data.results });
            });

            ctx.dispatch("loadParques");
          }, 700);
        });
      },

      enviarTrilha: async function(ctx, trilha) {
        try {
          //send trilha
          let res = await _.postJSON(urls.apiurl + "trilha/trilha/", trilha);

          //load this trilha with all its stats
          let data = await _.getJSON(urls.apiurl + "trilha/trilha/" + res.id, {
            includes: "parques,atividades"
          });

          var trilhas = _.map([data], trilha => {
            trilha.color = "hsl(" + _.random(0, 255, false) + ", 100%, 90%)";
            trilha.visitado = false;
            trilha.visitadoObj = false;
            return trilha;
          });

          ctx.dispatch("loadStats");

          ctx.commit("setMutationAdd", { trilhas: trilhas });

          return res;
        } catch (e) {
          console.error(e);
          return { error: true, msg: e.responseJSON };
        }
      },

      enviarEspecie: async function(ctx, especie) {
        try {
          let especieFinal = { ...especie };

          delete especieFinal.autor;
          delete especieFinal.imagens;

          //send especie
          let res = await _.postJSON(
            urls.apiurl + "especie/tipoespecie/",
            especieFinal
          );

          //send imagens set
          for (let i = 0; i < especie.imagens.length; i++) {
            const imagem = especie.imagens[i];

            let form_data = new FormData();
            form_data.append("imagem", imagem);
            form_data.append("especie", res.id);
            form_data.append("autor", especie.autor);

            try {
              let imagenRes = await _.postJSON(
                urls.apiurl + "especie/imagemespecie/",
                form_data
              );
            } catch (e) {
              console.warn(e);
            }
          }

          //load this trilha with all its stats
          let data = await _.getJSON(
            urls.apiurl + "especie/tipoespecie/" + res.id
          );

          ctx.commit("setMutationAdd", { especies: [data] });
          // ctx.commit('setMutationAdd', {especiesByID:_.keyBy([data],'id')});

          // ctx.dispatch('loadStats')

          return res;
        } catch (e) {
          console.error(e);
          return { error: true, msg: e.responseJSON };
        }
      },

      addAtrativo: async function(ctx, { point, id }) {
        let template = {
          tipo_atrativo: id,
          descricao: "teste",
          limitacao: "teste",
          geom: `Point(${point.lng} ${point.lat})`
        };

        _.postJSON(urls.apiurl + "parque/atrativo/", template, data => {
          setTimeout(() => ctx.dispatch("loadParques"), 400);
          // alert(adicionado)
        });
      },
      addBenfeitoria: async function(ctx, { point, id }) {
        let template = {
          tipo_benfeitoria: id,
          descricao: "teste",
          limitacao: "teste",
          geom: `Point(${point.lng} ${point.lat})`
        };

        _.postJSON(urls.apiurl + "parque/benfeitoria/", template, data => {
          setTimeout(() => ctx.dispatch("loadParques"), 400);
          // alert(adicionado)
        });
      },


      loadStats: async function(ctx) {
          console.log('loadStats')
          console.log('ctx: ', ctx)
          graphQL(QUERYES["stats"], {}).then(data => {

          console.log('data:', data)


          var parquesStats = _.keyBy(data.parques?.[0]?.data, "parque_id");
          var trilhasStats = _.keyBy(data.trilhas?.[0]?.data, "trilha_id");
          var especiesStats = _.keyBy(data.especies?.[0]?.data, "especie_id");
          ctx.commit("setMutation", { parquesStats });
          ctx.commit("setMutation", { trilhasStats });
          ctx.commit("setMutation", { especiesStats });

          console.log(parquesStats)
          console.log(trilhasStats)
          console.log(especiesStats)
        });

        // _.getJSON(urls.apibase + "obterstatsparque/", {}, data => {
        //   var status = _.keyBy(data, "parque_id");
        //   ctx.commit("setMutation", { parquesStats: status });
        // });

        // _.getJSON(urls.apibase + "obterstatstrilha/", {}, data => {
        //   ctx.commit("setMutation", {
        //     trilhasStats: _.keyBy(data, "trilha_id")
        //   });
        // });

        // _.getJSON(urls.apibase + "obterstatsespecie/", {}, data => {
        //   ctx.commit("setMutation", {
        //     especiesStats: _.keyBy(data, "especie_id")
        //   });
        // });
      },

    loadUserInfo: async function(ctx) {
      var user = ctx.rootGetters.user;
      if (!user?.pk) {
        ctx.commit("setMutation", {
          parquesvisitados: [],
          trilhasvisitados: []
        });
        return;
      }

      graphQL(QUERYES["visitanteparque"], { visitanteid: user.pk }).then(
        data => {
          var parquesvisitados = _.keyBy(data?.visitantesparque, "parque");
          var trilhasvisitados = _.keyBy(data?.trilhas, "trilha");
          ctx.commit("setMutation", { parquesvisitados });
          ctx.commit("setMutation", { trilhasvisitados });
        }
      );

      // await _.getJSON(
      //   urls.apiurl + "parque/visitanteparque/",
      //   { visitante: user.pk },
      //   data => {
      //     ctx.commit("setMutation", {
      //       parquesvisitados: _.keyBy(data.results, "parque")
      //     });
      //   }
      // );
     // await _.getJSON(
      //   urls.apiurl + "trilha/visitantetrilha/",
      //   { visitante: user.pk },
      //   data => {
      //     ctx.commit("setMutation", {
      //       trilhasvisitados: _.keyBy(data.results, "trilha")
      //     });
      //   }
      // );
      },

      currentParque: function(ctx, parqueID) {
        ctx.commit("setCurrentParque", parqueID);
      },

      trilhaSelectedID: function(ctx, parqueID) {
        ctx.commit("setMutation", { trilhaSelectedID: parqueID });
      },

      especieSelectedID: function(ctx, parqueID) {
        ctx.commit("setMutation", { especieSelectedID: parqueID });
      },

      setParqueVisitado: function(ctx, parque) {
        var visitado = _.get(parque, "visitadoObj.id", false);
        if (!visitado) {
          _.postJSON(
            urls.apiurl + "parque/visitanteparque/",
            { parque: parque.id },
            data => {
              setTimeout(() => ctx.dispatch("loadUserInfo"), 0);
            }
          );
        } else {
          _.postJSON(
            urls.apiurl + "parque/visitanteparque/" + visitado,
            {},
            data => {
              setTimeout(ctx.dispatch("loadUserInfo"), 0);
            },
            { type: "DELETE" }
          );
          // setTimeout( ctx.dispatch('loadUserInfo'),400)
        }
      },

      setAvistamento: function(ctx, { especie, point }) {
        especie = _.get(especie, "id", false);

        var geom = {
          type: "Point",
          coordinates: point
        };

        _.postJSON(
          urls.apiurl + "especie/ocorrencia/",
          { especie: especie, geom: geom },
          data => {
            setTimeout(() => {
              _.getJSON(urls.apiurl + "especie/ocorrencia/", {}, data => {
                ctx.commit("setMutation", { avistamentos: data.results });
              });
            }, 200);
          }
        );
      },

      setTrilhaVisitado: function(ctx, parque) {
        var visitado = _.get(parque, "visitadoObj.id", false);
        if (!visitado) {
          _.postJSON(
            urls.apiurl + "trilha/visitantetrilha/",
            { trilha: parque.id },
            data => {
              ctx.dispatch("loadUserInfo");
            }
          );
        } else {
          _.postJSON(
            urls.apiurl + "trilha/visitantetrilha/" + visitado,
            {},
            data => {
              ctx.dispatch("loadUserInfo");
            },
            { type: "DELETE" }
          );
        }
      }
    },

    //--GETTERS
    getters: {
      parques: (state, getters) => {
        console.count("PARQUES");
        var visitados = state.parquesvisitados;
        var stats = state.parquesStats;
        let avistamentos = state.avistamentos;
        if (!_.isArray(state.parques)) return false;

        return _.map([...state.parques], parque => {
          parque.visitado = _.has(visitados, parque.id) ? true : false;
          parque.visitadoObj = _.get(visitados, parque.id);
          parque.status = stats[parque.id];
          parque.avistamentos = [];
          _.each(avistamentos, avistamento => {
            if (avistamento.parque == parque.id) {
              parque.avistamentos.push(avistamento.especie);
            }
          });

          parque.trilha_set = _.map(parque.trilha_set, trilhaInfo => {
            let id = _.get(trilhaInfo, "id", trilhaInfo);
            let trilhaObjCompleto = getters.trilhaByID(id);
            return trilhaObjCompleto;
          });

          return parque;
        });
      },

      parqueByID: (state, getters) => id =>
        _.find(getters.parques, { id: parseInt(id, 10) }),

      parquesSelectedGeoJSON: (state, getters) => {
        var id = state.currentParqueID;
        if (id === false) return false;
        var geojson = { ...getters.parquesGeoJSON };
        geojson.features = _.filter(
          geojson.features,
          feature => feature.properties.id == id
        );
        return geojson;
      },
      currentParqueID: (state, getters) => {
        return state.currentParqueID;
      },

      parquesGeoJSON: state => {
        return state.geoJSON;
        // if(_.isEmpty(state.parques)) return false;
        // var parques = state.parques
        // var featuresPolygon = []
        // _.each(parques, parque=>{
        //     var parqueProperties = {...parque}
        //     parqueProperties.selected = (state.currentParqueID == parque.id) ? true : false;
        //     delete parqueProperties.geom
        //     delete parqueProperties.center
        //     featuresPolygon.push( { properties:parqueProperties, geometry:parque.geom , type:"Feature" })
        // })
        // return  {type:"FeatureCollection", features:featuresPolygon}
      },

      parquesCentroidesGeoJSON: state => {
        return state.parquesCentroidesGeoJSON;
        // if(_.isEmpty(state.parques)) return false;
        // var parques = state.parques
        // var featuresCenter = []
        // _.each(parques, parque=>{
        //     var parqueProperties = {...parque}
        //     parqueProperties.selected = (state.currentParqueID == parque.id) ? true : false;
        //     delete parqueProperties.geom
        //     delete parqueProperties.center
        //     featuresCenter.push( { properties:parqueProperties, geometry:parque.center , type:"Feature" })
        // })
        // return  {type:"FeatureCollection", features:featuresCenter}
      },

      benfeitoriasGeoJSON: state => {
        var features = [];
        // if not all objects loaded, return empty
        if (
          state.atrativos === null ||
          state.tipo_atrativo === null ||
          state.atrativosTrilhas === null
        ) {
          return { type: "FeatureCollection", features: features };
        }

        // features = _.map(state.benfeitorias, benfeitoria => {
        //   return {
        //     properties: state.tipo_benfeitoria[benfeitoria.tipo_benfeitoria],
        //     geometry: benfeitoria.geom,
        //     type: "Feature"
        //   };
        // });

        _.each(state.atrativos, atrativo => {
          if (!state?.tipo_atrativo?.[atrativo.tipo_atrativo_id]) return;
          let feature = {
            properties: {
              ...atrativo, //vem primeiro pq atrativo tem nome tb. retirar no backend
              ...state.tipo_atrativo[atrativo.tipo_atrativo_id],
              imagens: atrativo.imagematrativoparque_set,
              videos: atrativo.videoatrativoparque_set,
              hasmedia:
                atrativo.videoatrativoparque_set.length > 0 ||
                atrativo.imagematrativoparque_set > 0,
              icontype: "parque"
            },
            geometry: atrativo.geom,
            type: "Feature"
          };

          let { nome, icone, icontype, cor, hasmedia } = feature.properties;
         
          feature.properties.imagemnome = `${nome}${icone}${icontype}${cor}${hasmedia}`;
          feature.properties.imagemurl = `${window.____BACKEND_URL}obtericone/?url=${icone}&icontype=${icontype}&hasmedia=${hasmedia}`;
          if (cor)
            feature.properties.imagemurl += "&color=" + cor.replace(/^#/, "");

          features.push(feature);
        });

        _.each(state.atrativosTrilhas, atrativo => {
 
          if (!state?.tipo_atrativo?.[atrativo.tipo_atrativo_id]) return;
          let feature = {
            properties: {
              ...atrativo, //pq atrativo tem nome tb. retirar no backend
              ...state.tipo_atrativo[atrativo.tipo_atrativo_id],
              imagens: atrativo.imagematrativotrilha_set,
              videos: atrativo.videoatrativotrilha_set,
              hasmedia:
                atrativo.videoatrativotrilha_set.length > 0 ||
                atrativo.imagematrativotrilha_set > 0,
              icontype: "trilha"
            },
            geometry: atrativo.geom,
            type: "Feature"
          };
          
          let { nome, icone, icontype, cor, hasmedia } = feature.properties;
          feature.properties.imagemnome = `${nome}${icone}${icontype}${cor}${hasmedia}`;
          feature.properties.imagemurl = `${window.____BACKEND_URL}obtericone/?url=${icone}&icontype=${icontype}&hasmedia=${hasmedia}`;
          if (cor)
            feature.properties.imagemurl += "&color=" + cor.replace(/^#/, "");

          features.push(feature);
        });

        return { type: "FeatureCollection", features: features };
      },

      atrativoOptionsFilter: state => {
        let options = [{ value: "", label: "Todos Atrativos" }];

        _.each(state.tipo_atrativo, atrativo => {
          options.push({ value: atrativo.id, label: atrativo.nome });
        });

        return options;
      },
      bemfeitoriaOptionsFilter: state => {
        let options = [{ value: "", label: "Todos Benfeitorias" }];

        _.each(state.tipo_benfeitoria, benfeitoria => {
          options.push({ value: benfeitoria.id, label: benfeitoria.nome });
        });

        return options;
      },

      avistamentosGeoJSON: state => {
        let avistamento = state.avistamentos;
        var features = [];

        features = _.map(avistamento, avistamento => {
          return {
            properties: state.especiesByID[avistamento.especie],
            geometry: avistamento.geom,
            type: "Feature"
          };
        });

        return { type: "FeatureCollection", features: features };
      },

      // avistamentosSelectedGeoJSON: (state, getters) => {
      //   var id = state.avistamentoSelectedID;
      //   if (id === false) return false;
      //   var geojson = { ...getters.avistamentosGeoJSON };
      //   geojson.features = _.filter(
      //     geojson.features,
      //     feature => feature.properties.id == id
      //   );
      //   return geojson;
      // },

      trilhasGeoJSON: (state, getters) => {
        var features = [];
        features = _.map(getters.trilhas, trilha => {
          var properties = { ...trilha };
          delete properties.geom;

          let status = properties?.status;
          if (status?.constructor?.name === "String") {
            try {
              status = JSON.parse(status);
            } catch (e) {
              status = {};
            }
          }
          return {
            properties: {
              ...properties,
              status
            },
            geometry: trilha.geom,
            type: "Feature"
          };
        });
        return { type: "FeatureCollection", features: features };
      },

      trilhas: (state, getters) => {
        var stats = state.trilhasStats;
        var visitados = state.trilhasvisitados;
        return _.map(state.trilhas, trilha => {
          Vue.set(trilha, "status", stats[trilha.id]);

          trilha.visitado = _.has(visitados, trilha.id) ? true : false;
          trilha.visitadoObj = _.get(visitados, trilha.id);
          trilha = { ...trilha, ...stats[trilha.id] };
          return trilha;
        });
      },

      trilhasAtividades: state => state.trilhasAtividades,

      trilhaByID: (state, getters) => id =>
        _.find(getters.trilhas, { id: parseInt(id, 10) }),

      especies: state => {
        let especies = state.especies;
        let avistamentos = state.avistamentos;
        // return especies

        return _.map([...state.especies], especie => {
          especie.parques = [];
          _.each(avistamentos, avistamento => {
            if (avistamento.especie == especie.id) {
              especie.parques.push(avistamento.parque);
            }
          });
          return especie;
        });
      },

      especieByID: (state, getters) => id =>
        _.find(getters.especies, { id: parseInt(id, 10) }),

      especiesByCategoria: (state, getters) => type => {
        return _.filter(getters.especies, { categoria: type });
      }
    }
  };
}

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