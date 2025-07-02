import { camelize } from 'humps';
// // import { serialize, deserialize } from '../serializers';
// // import { si3, si3Actions }  from 'actions/index';
import { si3, si3Actions }  from '../../../actions/index.js';
// // import { SI3RC_MODELS, getIDValue, getIDKey } from 'models/models'
import { SI3RC_MODELS, getIDValue, getIDKey } from '../../../models/models.js'
import * as _  from 'lodash';
// // import {normalizerModel} from 'actions/actions';
import { normalizerModel } from '../../../actions/actions.js';
import u from 'updeep';

// // import Notifications from 'react-notification-system-redux';

// // import criaconsole from 'util/myconsole';
import criaconsole from '../../../util/myconsole.js';
const _debug = false;
const myconsole = criaconsole(_debug, ' *** Api.js | ', 'color:green;font-weight:bold');




//======================================================
//     ACTIONS FUNCS
//======================================================

// ACTION CONSTANTS
//---------------------------
export const RECEIVE = '@@redux-si3rc/RECEIVE';
export const GET = '@@redux-si3rc/GET';
export const POST = '@@redux-si3rc/POST';
export const PATCH = '@@redux-si3rc/PATCH';
export const DELETE = '@@redux-si3rc/DELETE';
export const OPTIONS = '@@redux-si3rc/OPTIONS';


// ACTION CREATOR - retorna um objeto acao
// ----------------------------

const requestCreator = (method, resources, modeloSchema, meta={}) => {
  return {
    type: method,
    payload: {
      modeloSchema,
      resources,
    },
    meta,
  };
};


export const receive = (resources, method, schema,resourceOriginal) => {
  return {
    type: RECEIVE,
    payload: {
      method,
      resources,
      schema,
      resourceOriginal
    },
  };

};



// ACTIONS
//---------------------------

//resources = o Objeto
//modeloSchema = schema
//
export const read = (resources, modeloSchema = {}) => {
  return requestCreator(GET, prepareResources(resources), modeloSchema);

};



export const options = ( modeloSchema = {}) => {

  return requestCreator(OPTIONS, {}, modeloSchema);

};




//payload tem o modelo
export const write = (resources, modeloSchema = {}) => {


  let method = POST;

  let id = getIDValue(resources,modeloSchema)

  //quer dizer que estamos alterando, entao vamos remover tudo que esta igual
  if( id != 0 && id != "new"){
      method = PATCH
  }

  if(resources._new){
      method = POST;
  }
  
  return requestCreator(method, prepareResources(resources), modeloSchema);

};



export const remove = (resources, modeloSchema = {}) => {
  return requestCreator(DELETE, prepareResources(resources), modeloSchema);
};






//LETODO - colocar aqui a verificacao se tem envio de arquivo ou não?
const prepareResources = (resources) => {
  //removo todas as propriedade internas (ex:"_id,_idkey,_type,_modelo")
  var resourcesNew = _.pickBy(resources,(v,k)=> k.indexOf("_") !== 0)

  //mas mantenho falando se o resource é new ou não
  if( _.has(resources,'_new') ){
    resourcesNew._new = resources._new;
  }

  return resourcesNew;
  // if (Array.isArray(resources)) return resources.map((resource) => serialize(resource));
  // return [serialize(resources)];
};

const dataResource = (resources) => {
  resources = prepareResources(resources);
  return resources[resources.length - 1];
};




//======================================================
//     REDUCER PARTE
//======================================================


// O REDUCER DA API
//---------------------------

function reducer(state = getInitialState(), { type, payload }) {
  switch(type) {
    case RECEIVE:
      return receiveReducer(state, payload);
    default:
      return state;
  }
}



// STATE INICIAL DO REDUCER
//---------------------------

function getInitialState() {
  //o estado inicial ja quero popular com os tipos de items da applicacao,
  //para facilitar a hora de connectar com um componente
  var obj = {}
  var formOptions = {}
  var modelOptions = {};
  
  _.forEach(SI3RC_MODELS, (v,k) =>
  {
      obj[k] = {}
      var item = localStorage.getItem(k+"_options");
      if(item === undefined){
        item = {}
      }else{
        item = JSON.parse(item)
      }
      modelOptions[k] =  item; 
  })
  
  return {entities:obj,formOptions:obj,modelOptions:{...modelOptions}};
}


// O RECEIVE REDUCER - RODA NO REDUCER PARA GERAR O NOVO STATE
//---------------------------
//state - é o tree api atual
//method - GET, POST, ETC
//resources - é o objeto recebido
//schema - é o esquema do modelo
function receiveReducer(state, { method, resources, schema, resourceOriginal }) {

  myconsole.log("%c====receiveReducer======",'color:red;font-size:24px')
  let res;
  res = resources;
  res = (_.isArray(res))? res : [res];

  let datanormalizado = {};
// myconsole.log("%c====data normalizado ANTES ======,%o",'color:red;font-size:24px', res)

  if(method != OPTIONS){

         //LETODO - quando removo um modelo que é child de alguem, preciso
         //ver como atualizar esses modelos pais. acho que preciso correr
         //
          // if(_.has(res,'[0].idkey'))
            datanormalizado = normalizerModel(res,schema.type);

  }else{

        let formOptions = {};
        let  modelOptions = {}

       if(_.has(res[0],'actions.POST')){
          formOptions[schema.type] = res[0].actions.POST;  //res vem como array pq sempre faco isso com os meus resources
          modelOptions[schema.type] = res[0];  //res vem como array pq sempre faco isso com os meus resources
       }
      
      datanormalizado = { formOptions, modelOptions }
  }

  let dataFinal;

  if(method === DELETE ){
    //LETODO - fazer remover de result também, e de todos os nested objects também
    var pathToRemove = ('entities.'+schema.type+'.'+resourceOriginal._id);
    dataFinal = u.omit(pathToRemove,state);
    }else{
       dataFinal =  u(datanormalizado, state);      
  }
  myconsole.log("%c====receiveReducer Final ======",'color:red;font-size:24px')
  return dataFinal;
}

export default reducer;