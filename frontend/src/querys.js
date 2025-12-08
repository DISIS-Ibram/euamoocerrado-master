/**
 * @typedef {Object} Querytype
 * @property {string} name - the name of query, used in all code
 * @property {{}} variables - variables to use in substitution to query
 * @property {{}} order - Object with key and ordering desc
 */

export const QUERYES = {
  parques: {
    query: `
    query getParques {
      parques: parque_parque(where: {deleted_at: {_is_null: true}}) {
        id
        categoria
        custo_entrada
        descricao
        nome
        nome_decreto
        periodo_abertura
        regiao_administrativa
        tipo
        center
        videoyoutubeparque_set:parque_videoyoutubeparques(where: {deleted_at: {_is_null: true}}) {
          url
          nome
        }
        imagemparque_set: parque_imagemparques(where: {deleted_at: {_is_null: true}}) {
          imagem
          autor
        }
        atrativo_set: parque_atrativos(where: {deleted_at: {_is_null: true}}) {
          id
          cor
          tipo_atrativo: parque_tipoatrativo {
            icone
            id
            nome
          }
        }
        benfeitoria_set: parque_benfeitoria(where: {deleted_at: {_is_null: true}}) {
          descricao
          geom
          id
          tipo_benfeitoria_id
        }
        parque_contatoparque {
          email
          endereco
          responsavel
          telefone
        }
        trilha_set {
          id
          nome
          deleted_at
        }

      #  trilha_set(where: {}) {
      #    trilha_trilha {
      #      id
      #      nome
      #      deleted_at
      #    }
      #  }
      #  trilha_trilha {
      #    id
      #    nome
      #    deleted_at
      #  }
      #  trilha_set: trilha_trilha(where: {deleted_at: {_is_null: true}}) {
      #    id
      #    nome
      #    deleted_at
      #  }
        geom
      }
    }
        `
  },

  trilhas: {
    query: `
    query getTrilhas {
      trilhas: trilha_trilha(where: {deleted_at: {_is_null: true}, publico: {_eq: true}}) {
        geom
        id
        nome
        oficial
        categoria
        descricao
        regiao_administrativa
        sinalizada
        imagemtrilha_set: trilha_imagemtrilhas(where: {deleted_at: {_is_null: true}}) {
          id
          autor
          imagem
        }
        videoyoutubetrilha_set: trilha_videoyoutubetrilhas(where: {deleted_at: {_is_null: true}}) {
          id
          autor
          nome
          url
        }
       #atrativotrilha_set: trilha_atrativotrilhas(where: {deleted_at: {_is_null: true}}) {
       #  id
       #  cor
       #  geom
       #  descricao
       #  tipo_atrativo:parque_tipoatrativo {
       #    icone
       #    id
       #    nome
       #    tipo_geom
       #  }
       #}
        atividades: trilha_trilha_atividades {
          id
        }
        parques:trilha_trilha_parques {
          id:parque_id
        }
      }
    }
    `
  },
  tipo_atrativos_benfeitorias: {
    query: `
    query tipoAtrativo {
      tipo_atrativo:parque_tipoatrativo(where: {deleted_at: {_is_null: true}}) {
        id
        icone
        nome
        tipo_geom
      }
      tipo_benfeitoria:parque_tipobenfeitoria(where: {deleted_at: {_is_null: true}}) {
        id
        icone
        nome
        tipo_geom
      }
    }
        `
  },
  atrativos_benfeitorias_parques: {
    query: `
    query MyQuery {
      parque_benfeitoria(where: {deleted_at: {_is_null: true}}) {
        id
        parque_id
        tipo_benfeitoria_id
        geom
      }
      parque_atrativo(where: {deleted_at: {_is_null: true}}) {
        id
        parque_id
        tipo_atrativo_id
        geom
        cor
        descricao
        nome
        imagematrativoparque_set: parque_imagematrativoparques(where: {deleted_at: {_is_null: true}}) {
          autor
          id
          imagem
        }
        videoatrativoparque_set:parque_videoatrativoparques(where: {deleted_at: {_is_null: true}}) {
          nome
          url
          id
        }
      }
    }
        `
  },
  atrativos_trilhas: {
    query: `
    query MyQuery {
      trilha_atrativotrilha(where: {deleted_at: {_is_null: true}}) {
        cor
        descricao
        geom
        id
        tipo_atrativo_id
        imagematrativotrilha_set: trilha_imagematrativotrilhas(where: {deleted_at: {_is_null: true}}) {
          imagem
          id
          autor
        }
        videoatrativotrilha_set: trilha_videoatrativotrilhas(where: {deleted_at: {_is_null: true}}) {
          autor
          id
          nome
          url
        }
      }
    }
    
        `
  },
  tipo_benfeitoria: {
    query: `
    query tipoBenfeitorias {
      tipo_benfeitoria:parque_tipobenfeitoria(where: {deleted_at: {_is_null: true}}) {
        icone
        id
        nome
        tipo_geom
      }
    }
   `
  },
  especies_tipo: {
    query: `
    query getEspecies {
      especies: especie_tipoespecie(where: {deleted_at: {_is_null: true}, publico: {_eq: true}}) {
        categoria
        cor
        descricao
        id
        link
        nome
        nome_cientifico
        oficial
        imagemespecie_set:especie_imagemespecies(where: {deleted_at: {_is_null: true}, publico: {_eq: true}}) {
          imagem
          id
          especie_id
        }
        ocorrencia_set:especie_ocorrencia(where: {deleted_at: {_is_null: true}, publico: {_eq: true}}) {
          id
        }
      }
    }
   `
  },
  especies_ocorrencia: {
    query: `
    query getEspeciesOcorrencia {
      especie_ocorrencia(where: {deleted_at: {_is_null: true}, publico: {_eq: true}}) {
        especie:especie_id
        foto
        geom
        id
        oficial
        parque:parque_id
        trilha:trilha_id
      }
    }
   `
  },
  stats: {
    query: `
    query getStats {
      especies: sumario_especie {
        data:json_agg
      }
      parques:sumario_parque {
        data:json_agg
      }
      trilhas:sumario_trilha {
        data:json_agg
      }
    }
    
   `
  },
  visitanteparque: {
    query: `
    query getVisitantes($visitanteid: Int=0) {
      visitantesparque: parque_visitanteparque(where: {publico: {_eq: true}, visitante_id: {_eq: $visitanteid}}) {
        id
        oficial
        parque: parque_id
        visitante: visitante_id
      }
      visitantestrilha: trilha_visitantetrilha(where: {publico: {_eq: true}, visitante_id: {_eq: $visitanteid}}) {
        id
        oficial
        trilha: trilha_id
        visitante: visitante_id
      }
    }
   `,
    variables: {
      visitanteid: -1
    }
  },

  solucoesIds: {
    query: `
            query MyQuery($filter: json = {}) {
            solucoes: fc_solucao_filtro(args: {query:  $filter  }) {
                solucao_id: cod_solucao
                estudodecaso_id: cod_estudo_de_caso
            }
          }
        `
  },

  solucoesFilters: {
    query: `
        query MyQuery($filter: json={}) {
            tema: fc_solucao_filtro_agregacao(args: {
                                          cod_tipo: "cod_tema", 
                                          tipo: "tema", 
                                        query: $filter
                }) {
              cod
              quantidade
              valor
            }
             desafio:fc_solucao_filtro_agregacao(args: {
                                          cod_tipo: "cod_desafio", 
                                          tipo: "desafio", 
                                        query: $filter
                }) {
              cod
              quantidade
              valor
            }
               categoria:fc_solucao_filtro_agregacao(args: {
                                          cod_tipo: "cod_categoria", 
                                          tipo: "categoria", 
                                        query: $filter
                }) {
              cod
              quantidade
              valor
            },
            maturidade:fc_solucao_filtro_agregacao(args: {
                                          cod_tipo: "cod_maturidade", 
                                          tipo: "maturidade", 
                                        query: $filter
                }) {
              cod
              quantidade
              valor
            }
            ods:fc_solucao_filtro_agregacao(args: {
                                          cod_tipo: "cod_ods", 
                                          tipo: "ods", 
                                        query: $filter
                }) {
              cod
              quantidade
              valor
            }
              meta:fc_solucao_filtro_agregacao(args: {
                                          cod_tipo: "cod_meta", 
                                          tipo: "meta", 
                                        query: $filter
                }) {
              cod
              quantidade
              valor
            }
            
                agrupamento:fc_solucao_filtro_agregacao(args: {
                                          cod_tipo: "cod_agrupamento", 
                                          tipo: "agrupamento", 
                                        query: $filter
                }) {
              cod
              quantidade
              valor
            }
            
           }
        `,
    variables: {
      //   "filter": {"desafio": {"_in": ["5b8e90aba0b1fa5390a37c4e343434"] }}
    }
  },

  tema: {
    query: `{
            en_tema: en_tipologia(order_by: {nome: asc}) {
              descricao
              nome
              cod_tema: en_tema_cod_tema
              svg
              cor
            }
          }`,
    variables: {},
    order: null
  },
  estudosDeCasoLista: {
    query: `{
            estudosDeCasoLista: en_estudo_de_caso(where: {}) {
              id
              nome
              geom
              contexto
              many_en_solucao_has_many_en_estudo_de_casos {
                en_solucao {
                  en_tema {
                    cod_tema
                  }
                  en_desafio {
                    nome
                  }
                  nome
                  cod_solucao
                }
              }
            }
          }          
          `,
    variables: {},
    order: null
  },
  estudosDeCasoGeom: {
    query: `{
            estudosDeCasoGeom: en_estudo_de_caso(where: {estado: {}}) {
              geom
              id
              exterior
              municipio
              estado
              many_en_solucao_has_many_en_estudo_de_casos {
                en_solucao {
                  en_tema {
                    cod_tema
                  }
                  en_desafio {
                    nome
                  }
                  nome
                }
              }
              tb_municipio {
                center
                nome
                geocodigo
              }
              tb_estado {
                center
                nome
                geocodigo
              }
              tb_cidade_regiao {
                center
                nome
                geocodigo
              }
            }
          }                  
          `,
    variables: {},
    order: null
  },
  tipologia: {
    query: `  {
            tipologia: en_tipologia {
              camada
              id: cod_tipologia
              cor
              descricao
              nome
              variavel_cluster
              variavel_indice
              clusters: en_clusters {
                id: cod_cluster
                descricao
              }
              indicadores: en_indicadors {
                camada
                id: cod_indicador
                nome
                variavel
              }
            }
          }
                                               
          `,
    variables: {},
    order: null
  }
};
