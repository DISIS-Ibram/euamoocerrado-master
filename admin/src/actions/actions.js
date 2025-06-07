
import React from 'react';
import * as _  from 'lodash';
import humps from 'humps';
import { apiActions, serialize, deserialize } from '../bibliotecas/si3rc-api';
import { normalize, Schema, arrayOf, valuesOf } from 'normalizr';

// import Fuse from 'fuse.js';
import Fuse from 'fuse.js';

import fuzzysearch from 'fuzzysearch';


// import { SI3RC_MODELS, getIDKey, getIDValue, t, d } from 'models/models'
import { SI3RC_MODELS, getIDKey, getIDValue, t, d } from '../models/models'
import { denormalize } from 'denormalizr';

// import * as util from 'util/s3util'
import * as util from '../util/s3util'

import {Header, Modal, Label, List, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';

// import { store } from 'configStore.js'
import { store } from '../configStore.js'

//import { ModalForm, ModalYesNo } from 'components/Modals'
// import criaconsole from 'util/myconsole'
import criaconsole from '../util/myconsole'

const _debug = false;
const myconsole = criaconsole(_debug,' *** Actions.js | ', 'color:orange;font-weight:bold')


//======================================================
//     FUNCOES DE RESGATE DE OBJETOS
//======================================================





util.getIDKey = getIDKey;
util.getIDValue = getIDValue;
util.t = t;;
util.d = d;
export { util as util}


//pega os items como objeto
export const filterItens2 = (items, filter={}, sort=[]) => {
    let itensFinal;
    itensFinal=  _.map(_.omitBy(items, _.isNil) , (item) => {
                       return (item)
                })

    if(filter){

        itensFinal = _.filter(itensFinal,(i)=>{

            let match = true;

            _.forIn(filter,(v,k)=>{

                if(_.isString(v) && _.isString(i[k]) ){
                    if(! fuzzysearch(v.toUpperCase(),i[k].toUpperCase())){
                      match = false;
                    }
                }else if(_.isNumber(i[k])){
                   if(i[k] != v){
                      match = false
                   }
                }
            })

            if(match) return i;
        })

    }

    let sortFuncArray = [];

    (sort || []).forEach((k)=>{
        //vejo se é string o key, se for usolowercase para nao ter problema

    })

    const itensFinal2 = _.sortBy(itensFinal);

    return itensFinal2;

}







//a new search items
export const filterItens = async (items, keyword="", propriedadesAProcurar = [], idKey = false,optionsExtend = {})=>{


        if(_.isEmpty(keyword)){ 
            return items;
        }

        //pego os keys que vou usar na procura
        let keys = [];

        if(propriedadesAProcurar == "all" || propriedadesAProcurar[0] == "all"){
            keys = geraArrayDeKeys(items)
        }
        else if( _.isArray(propriedadesAProcurar) ){
            keys = propriedadesAProcurar;
        }
        else if( _.isString(propriedadesAProcurar) ){
            keys = [propriedadesAProcurar]
        }


        // keys: [{
        //     name: 'title',
        //     weight: 0.3
        //   }, {
        //     name: 'author',
        //     weight: 0.7
        // }]



        var options = {
            caseSensitive: false,
            shouldSort: true,
            threshold: 0.2,
            tokenize: true,
            matchAllTokens: false,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 0,
            keys: keys,
            getFn: function (obj, path) {
                            var valor = _.get(obj,path)
                            if(_.isNumber(valor)){
                                valor = valor.toString()
                            }
                            return valor;
                            }
        }



        if(keyword.length <= 4){
            options.threshold = keyword.length/20;
        }

        //se só é numero, é uma busca exata 
        if(/^\d+$/.test(keyword)){
             options.threshold = 0;
        }



        // if(idKey)
        //     options.id = idKey;
        myconsole.log("FUSE SEARCH pavara:%s itens: %o, OPTIONS %o, keys: %o ", keyword, items, options, keys)
        var fuse = new Fuse(items, options); // "list" is the item array
        
       
       try{
          var result = fuse.search(keyword); 
          return result;
       }catch(e){
          console.warn(e);
          return items
       }

        // var options2 = options
        // options2.include = ["score"];

        // var fuse2 = new Fuse(items, options2); // "list" is the item array
        // var result2 =  fuse2.search(keyword); 

        // myconsole.log("resultado sem score:", result)
        // myconsole.log("resultado com score:", result2)

        

}




export function geraArrayDeKeys(obj, condition=(i)=>_.isString(i) ){

    let objFinal = {};
    let keysBag = [];
    let path = "";

    if(_.isArray(obj)){
        objFinal = (_.isObject(obj[0])) ? obj[0] : {}
    }else if(_.isObject(obj)){
        objFinal = obj
    }else{
        return "";
    }


    const getKeys= (o,path,keysBag)=>{

         _.each(o, (v,k)=>{
             if(_.isObject(v)){
                    getKeys(v,path+k+".",keysBag)
             }else{
                  keysBag.push(path+k);
             }

            //  if(condition(v) === true || k === "_id"){
            //          keysBag.push(path+k);
            //  }
        })     

    }


    getKeys(objFinal,path,keysBag)

    //REMOVO QUALQUER KEY QUE SEJE INTERNO
    keysBag = _.filter(keysBag,v=>v.indexOf("_") !== 0)

    myconsole.log("Keys Achado no Objeto: %o",keysBag)

    return keysBag
}














//
export const getById = (items) => {
    return   _.map(_.filter(items) , (item) => {
           return deserialize(item)
      })
}


//pega o type do modelo
export const getTipo = (type) => {

    
    let tipo =  SI3RC_MODELS[type].type || type;
    tipo = humps.camelize(tipo);
    return tipo;
}












// 

export const serializeByModeloID = (modeloNome,id) => {

    //se não tenho um id, entao serializo o modelo inteiro
    if(id === undefined || id == 0 || id=='all' ){
      return serializeAllByModelo(modeloNome);
    }

    let obj,tipo,entities;
    const state = store.getState();
    let modelo =  getModel(modeloNome) || false;

    //ja tenho o objeto id carregado
    if( _.has(state.api.entities[modeloNome],id) ){
      obj = state.api.entities[modeloNome][id]
      tipo = modeloNome
      entities = state.api.entities;

      let objF = {}
    //  objF[id] = obj

      //serialize trablha com um objeto que tem o id omo key,
      //entao passo ele assim, e depois retorno o objeto solo 
      //pegando so o que estai abaixo de key
    //   return serializeModel(objF,tipo,entities)[id]


    //Aqui com o novo serializador
      return serializeModel(obj,tipo,entities)
      
    //   return objF;

    }else{
      return false;
    }
}





export const serializeAllByModelo = (modeloNome,id=0) => {

    //se tenho um ID,ai so serializo esse modelo
    if(id !== 0 && id != ''  && id != undefined && id !='all'){
        return serializeByModeloID(modeloNome,id)
    }

    let obj,tipo,entities;
    const state = store.getState();
    let modelo =  getModel(modeloNome) || false;

    const entitiesModelo = state.api.entities[modeloNome]
    let objNormalizados = entitiesModelo
    tipo = modeloNome
    entities = state.api.entities;

    let arrayObj = [];

    _.forEach(entitiesModelo,(v,k)=>{
        obj = v
        arrayObj.push( serializeModel(v,tipo,entities) )
    })
   
    return arrayObj;
}










//OBJ - recebo o objeto ou array de objetos
//TIPO - o tipo relacionado ao modelhttp://162.243.186.165/coplii/relato/8/
//entities - todos os objetos da api

// LETODO - quando não tiver mapeamento retornar o id. Exemplo - testar pessoas tirando o include do gerente
export const serializeModel = (obj,tipo,entities) => {

    const _serializo = (valor = null, modeloTipoDoValor, entidies, parentObjectBag,caminho="") => {
            

             parentObjectBag.push(modeloTipoDoValor)

             myconsole.log("SERIALIZER | Serializando %o Iniciando valor:%o, modelo:%o",caminho, valor,modeloTipoDoValor);

        
            if(valor === null) return null;

            let modeloDoValor =  SI3RC_MODELS[modeloTipoDoValor] || false;
            
            if(!modeloDoValor) return valor;

            var valorRetorno = _.cloneDeep(valor);

           

            // ** PEGO O OBJETO CORREPODENNTE AO VALOR NO MODELO ESPECIFICADO
            //****************************************** */

            //se o valor nao é array, volto o valor
            if(! _.isArray(valor) ){
                    //pego o objeto no modelo pertecente
                    //se ele existir, retorno ele
                    if( _.has(entidies,modeloTipoDoValor+'.'+valor) ){
                        valorRetorno = {..._.get(entidies,modeloTipoDoValor+'.'+valor)}
                    }
                    
            //se o valor é uma array, preciso rodar em cada elemento
            }else if( _.isArray(valor) ){

                    valorRetorno = _.map(valor,val=>{
                        if( _.has(entidies,modeloTipoDoValor+'.'+val) ){
                            return {..._.get(entidies,modeloTipoDoValor+'.'+val)}
                        }else{
                            return val;
                        }
                    })
            }


              myconsole.log("SERIALIZER | Serializando %o... valorRetornoIntermediario:%o",caminho,valorRetorno) 


            // ** PROCESSO OS MAPEAMENTO DOS OBJETOS QUE PEGUEI
            //****************************************** */
            //agora que ja tenho o valor gerado, vejo se ele tem mapa também, e rodo em cima dele
            //se tenho mapeamento no objeto definido, faço um loop nas propriedade que tem mapeamento
            if(modeloDoValor.map){

                _.forIn(modeloDoValor.map, (modeloTipo,keyNome)=>{ 

                    //Se ainda nao foi serializado esse tipo de modelo
                    //isso apra evitar loops infinito de modelo que tem ref ao modelo pai
                    if( _.indexOf(parentObjectBag, modeloTipo) == -1 ){
                        if(_.isArray(valorRetorno)){
                            
                           valorRetorno = _.map(valorRetorno,valorElemento=>{
                               
                               if( _.has(valorElemento,keyNome) ){
                                    var valor = valorElemento[keyNome];
                                    valorElemento[keyNome] = _serializo(valor,modeloTipo,entities, parentObjectBag, caminho+"."+modeloTipo )
                               }
                              return valorElemento;
                               
                         })

                        }else if(_.isObject(valorRetorno)){
                            if( _.has(valorRetorno,keyNome) ){
                                    var valor = valorRetorno[keyNome];
                                    var valorConvertido = _serializo(valor, modeloTipo,entities, parentObjectBag, caminho+"."+modeloTipo )
                                    valorRetorno[keyNome] = valorConvertido;
                            }
                        } 
                    }
                    }
                )              
            }


             myconsole.log("SERIALIZER | Serializando %o... valorRetorno Final , valor:%o",caminho,valorRetorno) 
           
            return valorRetorno;
    }



    let modelo =  SI3RC_MODELS[tipo] || false

    if(!modelo) return obj;

    let objSerial = _.cloneDeep(obj);

    myconsole.log("SERIALIZER | VAI SERIALIZAR ===== %o",objSerial)

    //se tenho mapeamento no objeto definido, faço um loop nas propriedade que tem mapeamento
    if(modelo.map){
         _.forIn(modelo.map, (modeloTipo,keyNome)=>{ 
                if(_.has(objSerial,keyNome)){
                    var valor = objSerial[keyNome];
                    objSerial[keyNome] = _serializo(valor,modeloTipo,entities, [],">"+modeloTipo)
                }
        })  
    }


    myconsole.log("SERIALIZER | OBJ SERIALIZADO  ===== %o",objSerial)
    //Aqui crio os atributosVirtuais ao modelo
    objSerial = adicionaPropriedadesVirtuais(objSerial);
    myconsole.log("SERIALIZER | Com Propriedades Virtuais ===== %o",objSerial)

    return objSerial;

}















//OBJ - recebo o objeto ou array de objetos
//TIPO - o tipo relacionado ao modelhttp://162.243.186.165/coplii/relato/8/
//entities - todos os objetos da api

// LETODO - quando não tiver mapeamento retornar o id. Exemplo - testar pessoas tirando o include do gerente
export const serializeModelBak = (obj,tipo,entities) => {

    let modelo =  SI3RC_MODELS[tipo] || false
    
    if(!modelo) return obj;



    //defino uma funcao interna que serializa
    //é chamada recorrente
    //parentObjectTipo - é usado para previnir loops infinitos, onde objeto tem objeto que tem referencia ao pai
    const serialize = (objToSerialize = null,modelo,entidies,key,parentObjectTipo) => {
        
        if(objToSerialize === null) return null;
        
      
        //se nao tenho mapa no modelo retorno o objeto
        if(! _.has(modelo,'map')){
            return objToSerialize
        }

        let newobj = new Object();

        let map = modelo.map;
        
        //vejo se e um objeto que recebi
        if(_.isObject(objToSerialize) && _.isArray(objToSerialize) === false ){

                //se for um objeto loop por todas as keys deles
                _.forIn(objToSerialize, (v,k) => {
                            // let modeloRef = map[k];
                            // let modeloNew = SI3RC_MODELS[modeloRef] || false 
                            // if(v === null || v === undefined){
                            //       newobj[k] = null
                            // }else{
                            //       newobj[k] = serialize(v,modeloNew,entities,k)
                            // }
                           // //ja defino como padrao o valor atual, mudo se achar em entro modelo 
                           newobj[k] = v

                           // 
                            //verifico se a key existe no map
                            if(_.has(map,k)){

                                let modeloRef = map[k];   

                                //vejo se tenho o modelo que quero na entidades
                                if(_.has(entidies,modeloRef)){
                                    
                                    let modeloNew = SI3RC_MODELS[modeloRef] || false

                                    //se o tipo que estou me referindo é o meu pai, so volta o id dele
                                    //isso apra evitar loop infinito
                                    if( _.indexOf(parentObjectTipo, k) >-1 ){

                                        newobj[k] = v

                                    }else  if(_.isArray(v)){
                                        //LETODO - ver se o modelo de entidies[modeloRef][id] ja foi carregado ou se volto um id
                                  
                                        parentObjectTipo.push(modelo.type)
                                        newobj[k] = _.map(v, id => serialize(entidies[modeloRef][id],modeloNew,entidies,k, parentObjectTipo ) )

                                    }else{
                                        let objetoNew = entidies[modeloRef][v]

                                        //se o objeto é vazio(nao carregou ainda), eu volto o id
                                        if(! _.isObject(objetoNew) ){
                                             newobj[k] = v
                                        }else{
                                           //AI SERIALIZO O NOVO OBJETO TB
                                            parentObjectTipo.push(modelo.type)
                                            newobj[k] = serialize(objetoNew,modeloNew,entidies,k, parentObjectTipo )
                                        }
                                    }
                                }
                            }
                })  

                return newobj;

          }else{



                if(! _.has(map,key)){
                    
                    return objToSerialize;
                
                }else{
                    
                    let modeloRefTipo = map[key];
                    let modeloRef = SI3RC_MODELS[modeloRefTipo] || false

                    //se tenho so uma id
                     if(_.isString(objToSerialize) || _.isNumber(objToSerialize)){
                        
                        //vejo se tem ela no modelo referencia
                        
                        if( _.has(entidies[modeloRefTipo],objToSerialize) ){
                                let objReferencia = entidies[modeloRefTipo][objToSerialize]
                                // retorno ele serializado
                               
                                if( _.indexOf(parentObjectTipo, key) >-1 ){
                                    return objToSerialize
                                }
                               
                                parentObjectTipo.push(modelo.type)
                                

                                return  serialize(objReferencia,modeloRef,entidies,key,parentObjectTipo)
                        }else{
                                return objToSerialize; //LETODO - verificar
                        }


                   
                    //vejo se é uma array
                 }else if(_.isArray(objToSerialize)){
                        
                         if( _.indexOf(parentObjectTipo, key) >-1 ){
                                return objToSerialize
                         }

                        parentObjectTipo.push(modelo.type)
                        return  _.map(objToSerialize, id => serialize(entidies[modeloRefTipo][id],modeloRef,entidies,key,parentObjectTipo) )
                    } 


                    // vejo se é um objeto
                                    
                    
                    
                    // vejo se é so um id
                    
                   
                }
        }




           
      //se nnao tenho mapa no modelo, so retorno o objeto como é   
      // }else{
           
      //       newobj = objToSerialize
      // }

      // return newobj

    }  //final serialize




    let objSerial = new Object();

    myconsole.log("SERIALIZADO ANTES===== %o, tipo:%s",obj,tipo)


    //LETODO - verifico se obj é uma array ou um Map ou um objeto solo
     _.forIn(obj, (v,k)=>{ 
            if(v === null || v === undefined){
                  objSerial[k] = null
            }else{
                  objSerial[k] = serialize(v,modelo,entities,k, [])} 
            }          
    )
    

    myconsole.log("SERIALIZADO===== %o",objSerial)

    //Aqui crio os atributosVirtuais ao modelo
    objSerial = adicionaPropriedadesVirtuais(objSerial);


    myconsole.log("Com Propriedades Virtuais ===== %o",objSerial)


    return objSerial;

}




















export function adicionaPropriedadesVirtuais(obj){

    
    const addVirtual = (objToSerialize) => {
            let obj = {...objToSerialize}

            //pego o modelo do objeto
            var model = getModel(obj._type);

            //vejo se tem key virtual    
            if (_.has(model,"propriedadeVirtual")){

                    _.forIn(model.propriedadeVirtual, (v,keyVirtual)=>{ 
                    //para cada propriedade virtual
                            let escolhido = v.default || null;
                           
                            if( _.has(v,'choice')){
                                //pego crio o value correto baseado nas configuracoes
                                _.each(v.choices,(choice)=>{
                                        let keysToCompare = _.keys(choice.value);
                                        let objetoKeysToCompare = _.pick(obj,keysToCompare)
                                        let isEqual = _.isEqual(objetoKeysToCompare,choice.value)
                                        if(isEqual){
                                            escolhido = choice.display_name
                                        }
                                })

                            }else if( _.has(v,'valueFn') ){
                                escolhido = v.valueFn(obj)
                            }
                            //crio o key
                            obj[keyVirtual] = escolhido
                            
                    })
            }


            // vou um loop nos outors keys para ver se tenho objetos internos
            // LETODO - testar se loop em objetos internos esta realmente funcionando
            _.forIn(obj, (v,k)=>{ 
                if( _.isObject(v) && _.has(v,"_type") ){
                    obj[k] = addVirtual(v)
                }
            })
             
            return obj;
            
    }


    let objSerial = addVirtual({...obj});

  


    return objSerial;

}














export const excluirDeModel = (id,tipo) => {


     let modelo = getModel(tipo);

     let state = store.getState().api;

     //pego o id do objto;
     

     //apago o proprio objeto
     

     //procuro para ver se tem algum modelo que tem esse objeto
     //se tiver voulto esse modelo sem o id tambem

    //defino uma funcao interna que normaliza
    //é chamada recorrente
    const deletiza = (obj,modelo,bag={}) => {

        //no bag sempre mantenho o que tenho anteriormente
        let newobj = {}

        //tipo atual
        let tipo = modelo.type

        //crio o tipo no bag se não existir
        if(! _.has(bag,tipo) )
            bag[tipo] = {}

        //pego qual o id utilizado como key no modelo
        let idkey = (modelo.idkey || 'id');
        let idObj = obj[idkey];



        //e adiciono o Objeto no bag 
        if(! _.has(bag[tipo],idObj) ){
            bag[tipo][idObj] = {}
        }

        bag[tipo][idObj] = _.merge(bag[tipo][idObj],obj)


        //verifico se tem um mapeamento no modelo
        if( _.has(modelo,'map') ){
            
            const map = modelo.map
            // se tem pecorro tudo que é mapeado
            _.forIn(map, (v,k) => {

                var objAtualNaBag = bag[tipo][idObj];

                //pego o modelo referente a esse objeto
                let modeloNew = SI3RC_MODELS[v] || false 
                //pego o id que pertence a esse objRefer 
                let idkey = (modeloNew.idkey || 'id');


                //vejo se no meu objeto existe essa key e se é um objeto ou array
                if( _.has(objAtualNaBag,k) && _.isObjectLike(objAtualNaBag[k]) ){
                    
                    // pego o objeto
                    let objRefer = objAtualNaBag[k]

                    if( _.isArray(objRefer) ){

                        let refs = []
                        objRefer.map( (objRefAtual)=>{
                                //pego o id do objeto referencia
                                let ref = objRefAtual[idkey];
                                // e normalizo o valor do objRefer atual tb
                                refs.push(deletiza(objRefAtual, modeloNew, bag))
                        })

                        objAtualNaBag[k] = refs;

                    }else{
                        //pego o id do objeto referencia
                        let ref = objRefer[idkey];
                        // e normalizo o valor do objRefer atual tb
                        objAtualNaBag[k] = deletiza(objRefer, modeloNew, bag)

                    }
                }
            
            })
        
        }


        //normalize pode retornar a nova referencia dos objetos, né?
        return idObj;
    
    }





    let objSerial = {}
    
    let bag = {}

    bag = state[modelo.type][id];


    _.forIn(obj, 
        (v,k)=>{ 
           
            objSerial[tipo] = deletiza(v,modelo,bag)
        } 
    )
    
    // console.log('====  NORMALIZADO '+tipo.toUpperCase()+'===========')
    // console.log(bag)

    //dou um merge 
    
    return {entities:bag};

}





















//OBJ - recebo o objeto ou array de objetos
//TIPO - o tipo relacionado ao model
//entities - todos os objetos da api

export const normalizerModel = (obj,tipo) => {

    let modelo =  getModel(tipo) //SI3RC_MODELS[tipo] || false
    

    //LENOTA - essa parte não deve executar mais, ja que o get tipo retorna um novo 
    // schema de modelo virtual mesmo que baseado em url fornecida como o tipo
    // verificar se isso nao vai afetar o resto do sistema
    // if(!modelo){ 
    //     let res = {}
    //     res.entities = {}
    //     res.entities[tipo] = obj;
    //     return res
    // }


    //defino uma funcao interna que normaliza
    //é chamada recorrente
    const normaliza = (obj,modelo,bag={}) => {

        //no bag sempre mantenho o que tenho anteriormente
        let newobj = {}


        //tipo atual
        let tipo = modelo.type

        //crio o tipo no bag se não existir
        if(! _.has(bag,tipo) )
            bag[tipo] = {}

        //pego qual o id utilizado como key no modelo
        let idkey = (modelo.idkey || 'id');
       

       let idObj;
       //se o objeto em si é uma string, ele deve pode ser o objeto que é a sua propria key, tipo tag
       if( _.isString(obj) ){
             idObj = obj
             var valor = obj
             obj = {}
             obj[idkey] = valor
       }else{
             idObj = obj[idkey];
       }
        
        //se nao tenho id provavelmente estou retornando alguma coisa que nao seja um modelos em si
         if(idObj === undefined){
                idObj = 0
         }
        //CRIO ATRIBUTOS INTERNOS
        //usando set para nao da problema quando
        //normalizo um objeto ja normalizado
        _.set(obj,"_idkey",idkey)
        _.set(obj,"_id",idObj)
        _.set(obj,"_type",tipo)


        //e adiciono o Objeto no bag 
        if(! _.has(bag[tipo],idObj) ){
            bag[tipo][idObj] = {}
        }


      if( _.isString(obj) ){
              bag[tipo][idObj] = obj
      }else{
               bag[tipo][idObj] = _.merge(bag[tipo][idObj],obj)
      }

     

        //verifico se tem um mapeamento no modelo
        if( _.has(modelo,'map') ){
            
            const map = modelo.map
            // se tem pecorro tudo que é mapeado
            _.forIn(map, (v,k) => {
                var objAtualNaBag = bag[tipo][idObj];
                
                //pego o modelo referente a esse objeto
                let modeloNew = SI3RC_MODELS[v] || false 

                //pego o id que pertence a esse objRefer 
                let idkey = (modeloNew.idkey || 'id');


                //vejo se no meu objeto existe essa key e se é um objeto ou array
                if( _.has(objAtualNaBag,k) && _.isObjectLike(objAtualNaBag[k]) ){
                    
                    // pego o objeto
                    let objRefer = objAtualNaBag[k]

                    if( _.isArray(objRefer) ){

                        let refs = []

                        objRefer.map( (objRefAtual)=>{
                                //se for um objeto que teho normalizo ele
                                if(_.isObject(objRefAtual)){
                                    //pego o id do objeto referencia
                                    let ref = objRefAtual[idkey];
                                    // e normalizo o valor do objRefer atual tb
                                    refs.push(normaliza(objRefAtual, modeloNew, bag))
                                }else{
                                  //senao so coloco ele de volta.
                                  
                                  refs.push(objRefAtual)
                                   //antes para a tag estaca colocando de volta
                                   //refs.push(normaliza(objRefAtual, modeloNew, bag))
                                   //e salvo na bag, claro
                                   // bag[tipo][idObj] = _.merge(bag[tipo][idObj],obj)
                                }
                        })


                        objAtualNaBag[k] = refs;

                    }else{
                        //pego o id do objeto referencia
                       if(_.isObject(objRefer)){
                          // e normalizo o valor do objRefer atual tb
                          objAtualNaBag[k] = normaliza(objRefer, modeloNew, bag)
                      }else{
                          objAtualNaBag[k] = objRefer;
                      }
                    }

                }
            
            })
        
        }


        //normalize pode retornar a nova referencia dos objetos, né?
        return idObj;
    
    }





    let objSerial = {}
    
    let bag = {}

    myconsole.log('====  NORMALIZER | VAI NORMALIZAR ===========',obj)


    _.forIn(obj, 
        (v,k)=>{ 
            objSerial[tipo] = normaliza(v,modelo,bag)
        } 
    )
    
    myconsole.log('====   NORMALIZER | NORMALIZADO '+tipo.toUpperCase()+'===========%o',bag)

    //dou um merge 
    
    return {entities:bag};

}


















//======================================================
//     FUNCOES INICIAS DE REQUISICOES DA API
//     -implementação completa utiliznado o middleware e o api.
//     uma adaptação do json-api
//======================================================



export const getModel = (type)=>{

        if( _.has(SI3RC_MODELS,type) ){
            return SI3RC_MODELS[type]
        }else{
           // throw new Error(`Tipo ${type} não existe no modelo`);
           // return type;
           //se não existe o medelo, eu crio ele utilizando a url como o path
           let modeloObj={}

           modeloObj.type = type; //_.kebabCase(type); // pq kebaba quera a referencia aos modelos nos connects,que uso a outra versao
           modeloObj.url = type+"/";

           return modeloObj;
           // vacina:{type:'situacao', url:'adm/Vacina/'}
        }


}








// Load a Model
//---------------------------
//type - nome do modelo
//obj - contem o id a ser carregado
//opt.include = 'all' - carrega todas as dependencias mapeadas no model
//opt.include = ['key','key'] - carrega so as dependencias especificadas
export const load = (type, obj = {}, opt = {}) => {
    const modelo = getModel(type);
    

    modelo.options = opt;

    //marco se é para incluir alguns objetos ou nnao na requisicao
    if(opt['include']){
        modelo.includeOnLoad = opt['include']
    }
    


    // else{
    //      //modelo.includeOnLoad = _.uniq( _.concat( (modelo.includeOnLoad || []), opt.include ) )
    // }
    
    // TIREI O ALL pq agora a api aceita
    //   if(opt.include == 'all'){
    //      const keysToInclude = _.map( (modelo.map || []), (v,k) => k )
    //       modelo.includeOnLoad = keysToInclude;
    //   }else{
    //      modelo.includeOnLoad = _.uniq( _.concat( (modelo.includeOnLoad || []), opt.include ) )
    //   }
    // }

    return async (dispatch) => {
         let data = await dispatch( apiActions.read( obj , modelo ) );            
         return data;
    }
}



export const loadOptions = (type) => {
     
      const modelo = getModel(type);

      //so disparo o action se não tiver carregado ainda
    
      const state = store.getState();

      if( _.isEmpty(state.api.modelOptions[type]) === false ){
            return async (dispatch) => {} 
      }
           
      return async (dispatch) => {
          
            const data = await dispatch(apiActions.options( modelo ));
            
            localStorage.setItem( (type+"_options"),JSON.stringify(data[0]) ); //salvo no localStorage
            return data;          
      }

}




export const save = (type, obj = {}) => {
     
      const modelo = getModel(type);
      
      const param = modelo.param || type;
      
      const objF = {...obj};

      //verifico se alguns do modelos tem imagem, se tiver mudo o tipo de envio
      return async (dispatch) => {
            const data = await dispatch(apiActions.write( objF , modelo ));
            return data;          
      }
}







export const remove = (type, obj = {}) => {

      const modelo = getModel(type);
     
      const param = modelo.param || type;

      const objF = {...obj};

      return async (dispatch) => {
            const data = await dispatch(apiActions.remove(objF , modelo ));
            return data;          
      }
}









//======================================================
//     MODALS
//======================================================

export const removeItem = ( modeloNome, id ) => {

      
        return (dispatch) => {

             var props = {
                     modelo:modeloNome,
                     id:id,
                     icon:"trash",
                     titulo:"Deseja remover?",
                     texto:modeloNome+' '+id,
                     nome:'deleta'+modeloNome+'_'+id,
                     tipo:'confirm',
                     onYes:()=>{
                             const modelo = getModel(modeloNome);
                             var objFinal= {id:id, _id:id};
                             dispatch(apiActions.remove(objFinal , modelo ));
                    }
                }
      
                dispatch({type:'MODAL_CREATE',payload:props} )
      
          }

}


//   this.props.openModal( {nome:"modal"+this.props.modelo,
//                               tipo:'form',
//                               modelo:this.props.modelo,
//                               onSave:this.addFromform,
//                               value:value} 
//                             )

export const openModal = ( props = {nome,tipo} ) => {
    //props.nome
    //props.tipo

    return (dispatch) => {
      dispatch({type:'MODAL_CREATE',payload:props} )
    }

}



// export const openModalForm = ( nome='modalForm', props = {} ) => {

//     let nomeFinal = props.modelo ? props.modelo : nome;

//     // let conteudo = <ModalForm {...props} />
//     let conteudo = "lalala"

//     return (dispatch) => {
//       dispatch({type:'MODAL_CREATE',payload:{nome:nomeFinal,conteudo:conteudo}})
//     }
// }



// export const openDeleteModal = ( nome='modal', conteudo = "lalala" ) => {

//     return (dispatch) => {
//       dispatch({type:'MODAL_CREATE',payload:{nome:nome,conteudo:conteudo}})
//     }
// }




export const closeModal = ( nome='modal') => {
    return (dispatch) => {
      dispatch({type:'MODAL_REMOVE',payload:{nome:nome}})
    }
}






// Set Preferences
//---------------------------
export const preference = (obj={}) => {
        return (dispatch) => {
          dispatch({type:'PREFERENCE_SET',obj})
        }
    
}

export const setPref = (obj={}) => {
        return (dispatch) => {
          dispatch({type:'PREFERENCE_SET',payload:obj})
        }
    
}










export const getMidiaTipo = (file) => {

      //pego o mini type
      const minitype = file.type;

      if( minitype.match(/image/) ){
          return 0
      }
      if( minitype.match(/video/) ){
          return 1
      }
      if( minitype.match(/audio/) ){
          return 2
      }

      //LETODO #diego - verificar se quaquerl outro documento 
      //entra como documento_digitalizado,
      //ou se SO vamos aceitar algums minityper espeficicos
      //como PDF, WORD etc
      return 3

}






// funcoes de geopoints
//---------------------------




export const sendGeoFiles = (formdata) => {

                //LETODO - colocar em config
                const convergeourl = window.SI3CONFIG.convertGeoFileToGeoJson;

                return $.ajax(
                    convergeourl,
                    { 
                        method:'POST',
                        data:formdata,
                        cache: false,
                        processData: false, // Don't process the files
                        contentType: false
                    }
                )
}




export const getGeoJson = (modelo="terraindigena", options = {}) => {

                //LETODO - colocar em config
                const convergeourl =  window.SI3CONFIG.obterGeoJson;

                return $.getJSON(
                    convergeourl,
                    {modelo:modelo,
                      ...options}
                )
}




export const docSearch = (palavra='') => {

        //LETODO - colocar em config
        const docsearch =  window.SI3CONFIG.docSearch+palavra;

        return $.getJSON(
            docsearch
        )

}


export const getDepedenciaMidia = (id='') => {

        //LETODO - colocar em config
        const depmidia =  window.SI3CONFIG.dependeciaMidia+id;

        return $.getJSON(
            depmidia
        )

}








// TABELAS

export const tabelaAdd = (nome) => {
    //props.nome
    //props.tipo

    return (dispatch) => {
      dispatch({type:'TABELA_ADD',payload:{nome:nome}} )
    }

}


export const tabelaAddFilter = (nome,filter) => {
    //props.nome
    //props.tipo
    return (dispatch) => {
      dispatch({type:'TABELA_ADD_FILTER',payload:{nome:nome}} )
    }

}