// // import StringFormatValidation from 'string-format-validation'
import StringFormatValidation from './stringFormatValidation.js';

// // import wkx from 'wkx';
import wellknown from 'wellknown';

// // import { Utm, Dms} from 'geodesy'
import Utm from 'geodesy/utm.js';
import Dms from 'geodesy/dms.js';

// // import { LatLonEllipsoidal as LatLon } from 'geodesy'
// // import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js';

// // import * as model from 'models/models'
// // import * as model from '../models/models.js'
import * as model from '../models/models.js'

// // export { getIDKey, getIDValue, t, d } from '../models/models.js'
export { getIDKey, getIDValue, t, d } from '../models/models.js'

// // import prws from './processaResourcesWithState.js'
// import prws from './processaResourcesWithState'
// import { features } from 'process';

// Utilitarios/ Helpers
// 

export {model as model}

export const getModelNome = (modelo="")=>{
    var res = prws({nome:'$api.modelOptions.'+modelo+'.name'})
    return res.nome;
}

export const getModeloNome = (modelo="")=>{
    return this.getModelNome(modelo)
}


export const formatCPF = (cpf) => {
    return  StringFormatValidation.format('000.000.000-00', cpf)
}


export { formatCPF as formataCPF };


const formatString = (f="",s)=>{
    if( _.isString(f) ){
      return  StringFormatValidation.format(f, s)
    }else{
      return s
    }
}

export { formatString as formatString };

//======================================================
//     Images/FILES UTIL
//======================================================

export const thumb = (file,size) =>{
  return `${window.SI3CONFIG.thumbAPI}?url=${file}&w=${size}&h=${size}`;
}


//get File Type
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

//======================================================
//     GEOS UTILS
//======================================================

let geo = {

  convertPointFromWKT: (p) =>{
        var convertido;
        try{
          convertido = wkx.Geometry.parse(p);
        }catch(e){
          convertido = {x:0,y:0}
        }
       
        var point = {x:convertido.y,y:convertido.x};
        return point;
  },
  

  convertPointToWKT: (objOrLng, lat='') => {
      let lng;
      if( _.isObject(objOrLng) ){
        if(objOrLng.lat){
          lat = objOrLng.lat
          lng = objOrLng.lng
        }
      
      }else if( lat !='' ){
          lat = lat
          lng = objOrLng
      }

      const wktString = new wkx.Point(lng,lat).toWkt();
      return wktString;
  
  },


  convertGeomToWKT: (geo) => {
      let a = wkx.Geometry.parseGeoJSON(geo).toWkt();
    
      return a;
  },


  convertGeomFromWKT: (geo) => {
      // console.log("******* GEOOOO *******")
      // console.log(geo)
    
      let a;
      try{
        a = wkx.Geometry.parse(geo)
        geo = a.toGeoJSON();
    
    
      }catch(e){

      
      }
      
      let feature =  [{
          type:"Feature",
          "properties": {},
          geometry:geo
        }]

        a = {"type":"FeatureCollection","features":feature}
   
      let newFeatures = [];

      if(a.features){
      a.features.forEach( feature=>{
      
            if( geo.type=="MultiPolygon"){
                //convert muiltpolygon to to polygon features 
                feature = [];
                geo.coordinates.forEach(function(coords){
                  var polygeo={'type':'Polygon','coordinates':coords};
                  newFeatures.push( {
                    type:"Feature",
                    "properties": {},
                    geometry:polygeo
                  } )
                }
              );

            }else{
              newFeatures.push(feature)
            }

        })
        a.features = newFeatures
      
      }
  
      return a;
  
  
  },



  getPointinXY: (point) => {

          if(point.x){
            return {x:point.x,y:point.y}
          }
          if(point.lng){
            return {x:point.lng,y:point.lat}
          }
  },


  //POINT CONVERSION
  //*************
  toUTM: (x,y)=>{
    
      let point = new LatLon(x,y);
      // point.toUtm().toString(2);
      
      let utmstr 
      try{ 
          utmstr = point.toUtm().toString(2)
      }catch(e){
          utmstr = e.toString();
      }

      return utmstr
  },

  toGD: (x,y)=>{
    let point = new LatLon(x,y);
      //return point.toString('deg')
    return x.toFixed(6)+"º, "+y.toFixed(6)+"º"

  },

  toGMS: (x,y)=>{
      let point = new LatLon(x,y);
      return point.toString('deg-min-sec')
  },



  //GET LOCATION
  //*************
  //
  getLocationName: (point,cb,_t) => {
        if(point){
            let p = geo.getPointinXY(point)
            if(p)
                geo._getLocationNameFromSI3( p.x, p.y, cb, _t)
        }
},


  getAreasName: (geom,cb,_t) => {
    
    const url = `${window.SI3CONFIG.getLocation}`;

    return( 
        $.post(url,{geom_wkt:geom}, (data) =>{
                  let local = ""                  
                //   if(data.Estado) local += data.Estado.Sigla + " | ";
                //   if(data.Município) local += data.Município.Nome ;
                  if(data.TerraIndigena){
                    local += " TI. "
                    _.each(data.TerraIndigena, ti=>{
                     local += ti.Nome+ ",";
                    })
                  } 
                  cb.call(_t,local)

        })
    )      

  },


 _getLocationNameFromGoogle: (lat,lng, cb,_t) => {

    const url = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=pt_BR`;

    return (
        $.getJSON(url, (data) =>{
            if(data.status == 'OK'){
              if(data.results[0].formatted_address){
                cb.call(_t,data.results[0].formatted_address)
              }
            }else{ //pq nao achei endereco nem no nosso sistema nem no google, entao retorno endereco vazilo
                 cb.call(_t,false)
            }
        })
    )

  },




  _getLocationNameFromSI3: (lat,lng, cb,_t) => {

    const url = `${window.SI3CONFIG.getLocation}`;

    var pointWKT= "POINT("+lng+" "+lat+")";

    return( 
        $.post(url,{geom_wkt:pointWKT}, (data) =>{
                if(_.isEmpty(data)){
                    geo._getLocationNameFromGoogle(lat,lng, cb,_t)                    
                }else{

                  let local = ""                  
                //   if(data.Estado) local += data.Estado[0].Sigla + " | ";
                  if(data.Município) local += data.Município[0].Nome ;
                  if(data.TerraIndigena) local += " | TI. " + data.TerraIndigena[0].Nome;
                  cb.call(_t,local)
          }
        })
    )      
},




  _getLocationNameFromSI3BAK: (lat,lng, cb,_t) => {

    const url = `${window.SI3CONFIG.getLocation}?y=${lat}&x=${lng}`;


    return( 
        $.getJSON(url, (data) =>{
                if(_.isEmpty(data)){
                    geo._getLocationNameFromGoogle(lat,lng, cb,_t)                    
                }else{

                  let local = ""                  
                //   if(data.Estado) local += data.Estado.Sigla + " | ";
                  if(data.Município) local += data.Município.Nome ;
                  if(data.TerraIndigena) local += " | TI. " + data.TerraIndigena.Nome;
                  cb.call(_t,local)
          }
        })
    )      
},



}

export { geo as geo }



//======================================================
//     OUTOR UTIL
//======================================================

// largura em semantic
//---------------------------



const larguraInSemantic={
1:"one",
2:"two",
3:"three",
4:"four",
5:"five",
6:"six",
7:"seven",
8:"eight",
9:"nine",
10:"ten",
11:"eleven",
12:"twelve",
13:"thirteen",
14:"fourteen",
15:"fifteen",
16:"sixteen",
}

const widthToSemantic = (v)=>{
  if( v.indexOf("%") > -1 ){
      let perc = v.replace('%','');
      let num = Math.round(16*perc/100);
      return larguraInSemantic[num]
  }
  return v
}

export {widthToSemantic as widthToSemantic}




//ve ser é rea
////----------------------------

const isRealEmpty = (v,includeZero=false)=>{
    
    let  returnValue = false;

    if( _.isObjectLike(v) ){
        returnValue = _.isEmpty(v)
    }
    
    if( v === null || v === undefined || v === "" || v === NaN ){
        returnValue = true
    }

    if( v === true ){
        return false
    }

    if( v === false ){
        return true
    }

    if(includeZero && v == 0) returnValue = true
    
    return returnValue;
} 

export {isRealEmpty as isRealEmpty}
