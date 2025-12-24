

var VERSAO_VTL = "0.0.56";

// yepnope.addPrefix( 'preload', function ( resource ) {
//   resource.noexec = true;
//   return resource;
// });
// ( function ( yepnope ) {
//   // add each prefix
//   yepnope.addPrefix( 'css', function ( resource ) {
//     // Set the force flag
//     resource.forceCSS = true;
//     //carry on
//     return resource;
//   } );
// } )( this.yepnope );




vtl = (window.vtl === undefined) ? {} : window.vtl;

vtl.vtlLoadedModels = {};
vtl.ControllersObjects = {};

CCM_THEME_PATH = "./src"

var Resources = [
          // "preload!"+CCM_THEME_PATH+"/models/mapa_final.svg",
          // "preload!"+CCM_THEME_PATH+"/models/barco_simples_animado_sombra.svg",
          // "preload!"+CCM_THEME_PATH+"/models/marker_pi.svg",
          // "preload!"+CCM_THEME_PATH+"/models/marker_start_finish.svg",
          CCM_THEME_PATH+"/js-vtl/lib/sammy.js",
          //"http://code.jquery.com/ui/1.10.2/jquery-ui.js",
          //"http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css",
           "css!http://fonts.googleapis.com/css?family=Signika+Negative:300,400,600,700&subset=latin,latin-ext",
           "css!http://fonts.googleapis.com/css?family=Lato:300,400,700,900,300italic,400italic,700italic",

           CCM_THEME_PATH+"/js-vtl/psub.js",
           CCM_THEME_PATH+"/js-vtl/lib/TweenMax.new.js",
           CCM_THEME_PATH+"/js-vtl/lib/raphael.js",
           CCM_THEME_PATH+"/js-vtl/lib/raphael-svg-import.js",
           CCM_THEME_PATH+"/js-vtl/raphael-extensions.js",
           CCM_THEME_PATH+"/js-vtl/lib/underscore-min.js",
           CCM_THEME_PATH+"/js-vtl/lib/crafty.js",
           CCM_THEME_PATH+"/js-vtl/CraftyComponents.js",
           CCM_THEME_PATH+"/js-vtl/varios.js",
           CCM_THEME_PATH+"/js-vtl/vtl_base_classes.js",
           CCM_THEME_PATH+"/js-vtl/vtl_util.js",
           CCM_THEME_PATH+"/js-vtl/vtl_lago_layer.js",
           CCM_THEME_PATH+"/js-vtl/vtl_html_layer.js",
           CCM_THEME_PATH+"/js-vtl/vtl_widgets.js",
           CCM_THEME_PATH+"/js-vtl/vtl_percurso.js",
           CCM_THEME_PATH+"/js-vtl/vtl_gpx_reader.js",

           CCM_THEME_PATH+"/js-vtl/lib/leaflet-custom.js",
           CCM_THEME_PATH+"/js-vtl/vtl_mapa_google.js",

           CCM_THEME_PATH+"/js-vtl/vtl_director.js",
           "http://jscrollpane.kelvinluck.com/script/jquery.jscrollpane.min.js",

           CCM_THEME_PATH+"/js-vtl/jquery.mousewhell.js",
           "http://gregfranko.com/jquery.selectBoxIt.js/js/jquery.selectBoxIt.min.js",
];


// var Resources = [
//           "preload!"+CCM_THEME_PATH+"/models/mapa_final.svg",
//           //"preload!"+CCM_THEME_PATH+"/models/barco_simples_animado_sombra.svg",
//           "preload!"+CCM_THEME_PATH+"/models/marker_pi.svg",
//           "preload!"+CCM_THEME_PATH+"/models/marker_start_finish.svg",
//           "preload!"+CCM_THEME_PATH+"/models/percurso.gpx",
//            "css!http://fonts.googleapis.com/css?family=Signika+Negative:300,400,600,700&subset=latin,latin-ext",
//            "css!http://fonts.googleapis.com/css?family=Lato:300,400,700,900,300italic,400italic,700italic",
//            "http://jscrollpane.kelvinluck.com/script/jquery.jscrollpane.min.js",
//            CCM_THEME_PATH+"/js/min-ck.js?v=2",
// ];





//usar minify meu mesmo em
//http://localhost/voltaaolago.com/min/?f=/themes/voltaaolago_theme/js/vtl_director.js

for (var i = 0; i < Resources.length; i++) {
//  Resources[i] = Resources[i].replace(/^((?!http).*)\.js$/,'$1-ck.js');

Resources[i] = Resources[i].replace(/^((?!http).*)\.js$/,'$1.js?v='+VERSAO_VTL);
};




var VTL_RESOURCES_COUNT = 0;
var VTL_RESOURCES_TOTAL = Resources.length;
//uso yepnope para carregar os motores principais






// var isIE8 = $.browser.msie && +$.browser.version <= 8;

if ( false ) {
    // do stuff
     $("#loader-text").parents("td").html("O site é incompativél com essa versão do Internet Explorer. <br>Utilize um navegador mais moderno como o <b><a style='color:yellow' href='http://www.google.com/intl/pt-BR/chrome/browser/'>Google Chrome</a></b> para visualizar o site.<br> ou <br><div><a class='btn btn-primary' href='../index.php/inscricoes'> Clique aqui para fazer as inscrições</a><a class='btn' href='../index.php/login'> Acesso de equipe</a></div>");


}else{




$.holdReady(true);


$('#linha-load').animate({
  'background-position-x': '-100%',
}, 30000, 'linear');

yepnope({
  load: Resources,
  callback: function (url, result, key) {
    if(!result){
         VTL_RESOURCES_COUNT++;
         $("#loader-text").text(parseInt((VTL_RESOURCES_COUNT/VTL_RESOURCES_TOTAL)*100,0)+"");

         if(/svg$/i.test(url)){
              var uurl = url;
             $.ajax({
                  type: "GET",
                  url: url,
                  dataType: "xml",
                  success: function(data, textStatus, xhr) {
                      vtl.vtlLoadedModels[uurl] = data;
                  }
           });
         }

     }else{
         $("#loader-text").text("ERRO CARREGANDO"+key);
     }

  },


  complete: function(){


    //  inicio angularjs application
  //  new vtl.ApplicationController();


    setTimeout(

       function(){

     //   try{
            //LETODO - verificar pq as vezes aqui é chamado 2 vezes, principalmente quando selecionavamos percurso
         window.vtlControl = (window.vtlControl === undefined) ? (new vtl.ApplicationController()) : window.vtlControl;




            //angular.element(document).ready(function() {
            //     angular.bootstrap(document);

             //});

              loadGoogleMaps(); //carrego o google mats


     //   }catch(e){
        //    window.location.reload();
            //se deu algum erro, eu tento comecar tudo denovo
            //no chrome notei que o yepnope as vezes, apesar de carregar os scripts, as vezes da problema inicializando eles
     //      $("#loader-text").text("erro:"+e.toString());
           //setTimeout(function(){window.location = window.location;},500);
     //   }

      },500);


    $.holdReady(false);
  }

});







}


//pois o google maps não funciona com o yep nopo, pois usa document.write
function loadGoogleMaps() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?sensor=false&callback=googleMapsLoaded";
  document.body.appendChild(script);
}



//ai quando o google maps é arregado, carrego as dependencias deles
function googleMapsLoaded(){
      var Resources2 = [
                  // CCM_THEME_PATH+"/js/lib/gmaps-v3-extend-poly.js",
                   CCM_THEME_PATH+"/js/vtl_mapa_google.js",
                   "css!"+"http://cdn.leafletjs.com/leaflet-0.5/leaflet.css"

      ];
       yepnope({
               load: Resources2,
               complete: function(){
                new vtl.GoogleMapaLayer();
           }
        });


}


