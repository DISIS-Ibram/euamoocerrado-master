// Regiao de Estudo


import Fuse from 'fuse.js'

import theapi from '~/api.js'


var mapas = function(data) {

    var API_listamapas = theapi.listamapas;


    var state = {


        mapas: [],

    }

    return {

        state: state,

        mutations: {
            mapas: function(state, lista) {
                state.mapas = lista;
            },
        },


        actions: {

            carregaListaMapas: function(ctx, filtro = {}) {

                $.getJSON(API_listamapas, filtro, data => {
                    ctx.commit('mapas', data);
                })

            }

        },


        getters: {



            montaMenuMapas(state, getters, rootState) {

                var itens = [];

                _.each( _.filter(state.mapas,{externo:true}), mapa => {
                    var item = {...mapa };
                    item._nome = mapa.titulo;
                    item.tipo = "mapa";
                    item.codigo = mapa.id;
                    item._categoria = _.get(mapa, 'categoria', '');
                    itens.push(item)
                })





                return itens;

            },


            buscaMenuMapas: (state, getters, rootState) => (filtro) => {

                var regioes = getters.montaMenuIndicadores;

                //pego so os itens
                var soitens = [];

                //so retornos os que não sao do tipo grupo
                var buscaItens = function(itens) {
                    _.each(itens, item => {
                        if (item.tipo == "grupo") {
                            buscaItens(item.itens)
                        } else {
                            soitens.push(item)
                        }
                    })
                }
                buscaItens(regioes);

                var options = {
                    minMatchCharLength: 2,
                    threshold: 0.2,
                    location: 0,
                    distance: 50,
                    shouldSort: true,
                    keys: [{
                        name: '_nome',
                        weight: 1
                    }]
                };


                var fuse = new Fuse(soitens, options)
                var resultado = fuse.search(filtro);
                return _.slice(resultado, 0, 50)

            },

        },

    }
}


export default mapas;