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






// retorna todos os estados
// http://127.0.0.1:8000/localizacao/?dado=estado

// Retorna os estados consultados, pode misturar geocodigo, siga e nome
// http://127.0.0.1:8000/localizacao/?dado=estado&estado=RJ,13,São Paulo&

// Retorna os municipios dos estados 
// 127.0.0.1:8000/localizacao/?dado=municipio&estado=RJ,13&

// Retorna as localidades dos Estados
// 127.0.0.1:8000/localizacao/?dado=localidade&estado=RJ,SP

// Retorna as localidades de um Municipio
// 127.0.0.1:8000/localizacao/?dado=localidade&estado=RJ,SP&municipio=Araruama

// Retorna uma localidade especifica
// http://127.0.0.1:8000/localizacao/?dado=localidade&estado=RJ,SP&municipio=Araruama&localidade=Morro%20Grande

window.SI3CONFIG = config;