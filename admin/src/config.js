
//LETODO - verificar o tamnnho do leaflet aqui
import L from 'leaflet';

// const config = {
//     url:'http://http://162.243.187.7/',
//     urlAPI:'http://http://162.243.187.7/',
//     thumbAPI:'http://http://162.243.187.7/thumb/',
//     getLocation:'http://http://162.243.187.7/nomelocal/',
//     modelsByID:'http://http://162.243.187.7/obteritens/', //?modelo=midia&id=169,170
//     downloadMidia:'http://http://162.243.187.7/obter_midia/',  //{midia_id}
//     localizacao:'http://http://162.243.187.7/localizacao/?dado='  //?dado=estado&estado=RJ,13,São Paulo&
// }


// var url = 'http://162.243.187.7/';

// if( window.location.host.indexOf("10.0.4.42") > -1 ){
//     url = 'http://10.0.4.42:666/';
// }


// var urlApi = `${url}/rest_api/`;
// const config = {
//     url:url,
//     urlAPI:urlApi,
//     thumbAPI:url+'thumb/',
//     getLocation:url+'nomelocal/',
//     modelsByID:url+'obteritens/', //?modelo=midia&id=169,170
//     downloadMidia:url+'obter_midia/',  //{midia_id}
//     localizacao:url+'localizacao/?dado=',  //?dado=estado&estado=RJ,13,São Paulo&
//     login:url+'login/',
//     logout:url+'logout/',
//     meUser:url+"user/",
//     convertGeoFileToGeoJson:url+"conversaogeo/",
//     obterGeoJson:url+"obtergeojson/",
//     docSearch:url+"doc_search/?q=",
//     dependeciaMidia:url+'/dependencia_midia/'  // /dependencia_midia/id
// }






// // retorna todos os estados
// // http://127.0.0.1:8000/localizacao/?dado=estado

// // Retorna os estados consultados, pode misturar geocodigo, siga e nome
// // http://127.0.0.1:8000/localizacao/?dado=estado&estado=RJ,13,São Paulo&

// // Retorna os municipios dos estados 
// // 127.0.0.1:8000/localizacao/?dado=municipio&estado=RJ,13&

// // Retorna as localidades dos Estados
// // 127.0.0.1:8000/localizacao/?dado=localidade&estado=RJ,SP

// // Retorna as localidades de um Municipio
// // 127.0.0.1:8000/localizacao/?dado=localidade&estado=RJ,SP&municipio=Araruama

// // Retorna uma localidade especifica
// // http://127.0.0.1:8000/localizacao/?dado=localidade&estado=RJ,SP&municipio=Araruama&localidade=Morro%20Grande

// window.SI3CONFIG = config;

// export default config;



var iconbase =  { shadowUrl: '/images/mark-relatos-shadow.svg',
                          
                  iconSize: [45, 56],
                  iconAnchor: [22, 56],

                  shadowSize:   [51, 32],
                  shadowAnchor: [7, 28],

                  popupAnchor: [22, -60],
                }



export const markersMap = function(name = "generico",properties){
            if(name=="registro"){ 
        
                return L.icon({
                        iconUrl: `${window.SI3CONFIG.url}obtericone/?cor=${properties.cor.replace(/#/,'%23')}`,
                          ...iconbase
                })

            }else{
                return L.icon({
                        iconUrl: `/images/mark-${name}.svg`,
                          ...iconbase
                })
            
            }
}

export const markers = {

        relato:L.icon({
                iconUrl: '/images/mark-relatos.svg',
                    ...iconbase
            }),

        registro: L.icon({
                iconUrl: '/images/mark-registros.svg',
                ...iconbase
            }),

        fpe: L.icon({
                iconUrl: '/images/mark-fpe.svg',
            ...iconbase
            }),
            avistamento : L.icon({
                iconUrl: '/images/mark-avistamento.svg',
            ...iconbase
            }),
            sitio : L.icon({
                iconUrl: '/images/mark-sitio.svg',
            ...iconbase
            }),
        vestigio : L.icon({
                iconUrl: '/images/mark-vestigio.svg',
            ...iconbase
            }),
            
        aldeia : L.icon({
                iconUrl: '/images/mark-vestigio.svg',
            ...iconbase
            }),
            

        generico : L.icon({
                iconUrl: '/images/mark-generico.svg',
                ...iconbase
            }),
}






// { relato:function(){ L.icon({
//                             iconUrl: '/images/mark-relatos.svg',
//                              ...iconbase
//                         })
// },
                    
//                     registro : L.icon({
//                           iconUrl: '/images/mark-registros.svg',
//                           ...iconbase
//                         }),

//                     fpe : L.icon({
//                           iconUrl: '/images/mark-fpe.svg',
//                         ...iconbase
//                       }),
//                       avistamento : L.icon({
//                           iconUrl: '/images/mark-avistamento.svg',
//                         ...iconbase
//                       }),
//                      sitio : L.icon({
//                           iconUrl: '/images/mark-sitio.svg',
//                         ...iconbase
//                       }),
//                     vestigio : L.icon({
//                           iconUrl: '/images/mark-vestigio.svg',
//                         ...iconbase
//                       }),
                      

//                     generico : L.icon({
//                           iconUrl: '/images/mark-generico.svg',
//                          ...iconbase
//                         }),
//                   }











// const icons = {

//   relatos: L.icon({
//               iconUrl: 'images/mark-relatos.svg',
//               iconSize: [24, 24],
//               iconAnchor: [12, 24],
//               popupAnchor: [12, -24],
//   });

// }