var url = window.____BACKEND_URL

if(window.____BACKEND_URL==""){
    url = 'http://euamocerrado.com.br:8585/';
}


var urlApi = `${url}rest_api/`;
const config = {
    url:url,
    urlAPI:urlApi,
    thumbAPI:url+'thumb/',
    getLocation:url+'nomelocal/',
    modelsByID:url+'obteritens/', //?modelo=midia&id=169,170
    downloadMidia:url+'obter_midia/',  //{midia_id}
    localizacao:url+'localizacao/?dado=',  //?dado=estado&estado=RJ,13,São Paulo&
    login:url+'login/',
    logout:url+'logout/',
    meUser:url+"user/",
    convertGeoFileToGeoJson:url+"conversaogeo/",
    obterGeoJson:url+"obtergeojson/",
    docSearch:url+"doc_search/?q=",
    dependeciaMidia:url+'/dependencia_midia/'  // /dependencia_midia/id
}



window.SI3CONFIG = config;