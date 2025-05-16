






vtl.GoogleMapaLayer = vtl.e2D.extend({

    map:null,

    init: function(){
            this.bindAll();

            // $('head').append('<style> * {\
            //                   -webkit-transition-property: none!important;\
            //                   transition-property: none!important;\
            //                   -webkit-animation: none!important;\
            //                   animation: none!important;\
            //                 }</style>');

    },



    setupGoogleMaps:function(){



    },


    vEV_GOOGLE_MAPS:function(){

      if(this.map === null ){

         //a primeira vez preciso deixar o mapa com o zoom 1


          var that = this;
          var winW = $(window).width();
          var winH = $(window).height();

          var ltlong = vtlu.inverseMercatorGoogleInit(+winW/2,+winH/2);  //considero o zoom 1

          //inicio o google maps
          var mapOptions = {
                  center: new google.maps.LatLng(ltlong[0], ltlong[1]),
                  zoom: 14,
                  animatedZoom: false,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          this.map = new google.maps.Map(document.getElementById("gmap-layer"), mapOptions);

          this.updateInterno();

          $('#googleicon').addClass('active');
          $('#barra-lateral').css({'background':'gray'})

     }else{
        //scondo o mapa

        $("#gmap-layer").hide(0);
        $("#gmap-layer").html('');
         $("#gmap-layer").attr('style','');
        this.map = null
         $('#googleicon').removeClass('active');
        $('#barra-lateral').css({'background':'transparent'})


     }


    },



    updateInterno:function(){

        if(this.map === null || this._visible == 0){
            return false;
        }

        var winW = $(window).width();
        var winH = $(window).height();

        var centerX = (-this._x+($(window).width()/2))/this._z;
        var centerY = (-this._y+($(window).height()/2))/this._z;
        var center = vtlu.inverseMercator(centerX,centerY);

        //agora o zoom que dou no mapa
        var zoommapa = (parseInt((this._z*14),10));

        //var zoom =  crs.scale(toZoom) / crs.scale(this._zoom);
        var zscalezoom = 14 + (Math.log(this._z) / Math.LN2);
        var zscalezoomInt = parseInt(zscalezoom,10);

         //e pego a diferenca e dou scale

        var scaleSobra =  this.scale(zscalezoom) / this.scale(zscalezoomInt);
        var ctr = new google.maps.LatLng(center[0], center[1]);

        //this.map.setZoom(zscalezoomInt);
        //this.map.setCenter(ctr);

        this.map.setOptions({
              center: ctr,
              zoom: zscalezoomInt,
             animatedZoom: false
        });


        TweenMax.to($("#gmap-layer"),0,{css:{scale:scaleSobra}});


    },

    vEV_ZOOM_START:function(){

        $("#gmap-layer").hide(0);
        this._visible = 0;
    },

    vEV_ANIMATION_START:function(){
        this.vEV_ZOOM_START();
    },

    vEV_ANIMATION_END:function(data){
        this.vEV_ZOOM_END(data);
    },

    vEV_ANIMATION_STEP:function(data){
      this.attr(data,false);
      this.updateInterno();

    },

    vEV_ZOOM_END:function(){

        $("#gmap-layer").show(0);
         this._visible = 1;
        this.updateInterno();
    },

    vEV_MOVE_STEP:function(data){
      this.attr(data,false);
      this.updateInterno();
    },

    //util import from leaflet
    getZoomScale: function (toZoom) {
      var crs = this.options.crs;
      return crs.scale(toZoom) / crs.scale(this._zoom);
    },

    getScaleZoom: function (scale) {
      return this._zoom + (Math.log(scale) / Math.LN2);
    },

    scale: function (zoom) {
      return 256 * Math.pow(2, zoom);
    }




    // update: function(pt){

    //         console.log(pt);
    //         //pego o ponto no centro do mapa
    //         var centerX = -pt.x+($(window).width()/2);
    //         var centerY = -pt.y+($(window).height()/2);
    //         var latlong = vtlu.inverseMercator(centerX,centerY);
    //         var latlg = new google.maps.LatLng(latlong[0],latlong[1]);
    //         console.log(latlg);
    //         this.map.setCenter(latlg);


    // }



});












// vtl.GMapaLayer = vtl.Layers.extend({
//     init: function(){

//             var that = this;

//                  wW = $(window).width();
//         wH = $(window).height();

//         ltlong = vtlu.inverseMercator(+wW/2,+wH/2);

//           //inicio o google maps
//           var mapOptions = {
//               center: new google.maps.LatLng(ltlong[0], ltlong[1]),
//               zoom: 14,
//               mapTypeId: google.maps.MapTypeId.ROADMAP
//             };
//            this.map = new google.maps.Map(document.getElementById("map"), mapOptions);


//            //evento para observar quando o mapa move
//            //quando o mouse é arrastado, atualiza a posicao dos mapas
//             vtlBind(vEV_MOUSE_DRAG, function(msg,parm){ that.update.call(that,parm);});

//     },



//     update: function(pt){

//             console.log(pt);
//             //pego o ponto no centro do mapa
//             var centerX = -pt.x+($(window).width()/2);
//             var centerY = -pt.y+($(window).height()/2);
//             var latlong = vtlu.inverseMercator(centerX,centerY);
//             var latlg = new google.maps.LatLng(latlong[0],latlong[1]);
//             console.log(latlg);
//             this.map.setCenter(latlg);


//     }



// });




// vtl.LMapaLayer = vtl.Layers.extend({
//     init: function(){

//              var that = this;
//           //pego o valores do x e y do meu mapa
//           //
//         wW = $(window).width();
//         wH = $(window).height();


//              //paro eventos
//         vtl.Director.stopEvents();
//         ltlong = vtlu.inverseMercator(+wW/2,+wH/2);

//         _lat = ltlong[0];
//         _long = ltlong[1];
//         this.map = L.map('map',{'trackResize':false,'inertia':true,'zoomControl':true,'attributionControl':true,worldCopyJump:true}).setView([ltlong[0], ltlong[1]], 14);

//        //   this.map.scrollWheelZoom=false;




//         //   L.tileLayer('http://{s}.tile.cloudmade.com/c1eb4df270b845118e5bd262f8ea0826/997/256/{z}/{x}/{y}.png', {
//         //   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
//         //   maxZoom: 18
//         // }).addTo(this.map);

//         L.tileLayer('https://mts0.googleapis.com/vt?lyrs=m@212000000&src=apiv3&hl=en-US&x={x}&y={y}&z={z}&s=Galile&apistyle=p.h%3A%2300ffe6%7Cp.s%3A-20%2Cs.t%3A3%7Cs.e%3Ag%7Cp.l%3A100%7Cp.v%3Asimplified%2Cs.t%3A3%7Cs.e%3Al%7Cp.v%3Aoff&style=api%7Csmartmaps', {
//           attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
//           maxZoom: 18
//         }).addTo(this.map);


//         ltlong = vtlu.inverseMercator(0,0);

//         var latlng = new L.LatLng(ltlong[0], ltlong[1]);
//       //  this.map.addLayer(new this.MyCustomLayer(latlng));

//         //return this;

//             this.update({x:vtl.Director.getx(),
//                             y:vtl.Director.gety(),
//                         z:vtl.Director.getz()
//                         })


//            //evento para observar quando o mapa move
//            //quando o mouse é arrastado, atualiza a posicao dos mapas
//            vtlBind(vEV_MOUSE_DRAG, function(msg,parm){ that.update.call(that,parm);});
//            vtlBind(vEV_EM_MOVIMENTO, function(msg,parm){ that.update.call(that,parm);});
//            vtlBind(vEV_ZOOM, function(msg,parm){ that.update.call(that,parm);});

//     },



//     update: function(pt){

//             console.log(pt);
//             //pego o ponto no centro do mapa
//             var centerX = (-pt.x+($(window).width()/2))/pt.z;
//             var centerY = (-pt.y+($(window).height()/2))/pt.z;
//             var center = vtlu.inverseMercator(centerX,centerY);


//                   //agora o zoom que dou no mapa
//               zoommapa = (parseInt((pt.z*14),10));

//               var crs = this.map.options.crs;

//               //var zoom =  crs.scale(toZoom) / crs.scale(this._zoom);
//               var zscalezoom = 14 + (Math.log(pt.z) / Math.LN2);
//               var zscalezoomInt = parseInt(zscalezoom,10);


//             // var latlg = new google.maps.LatLng(latlong[0],latlong[1]);
//              //  console.log(latlong);
//              // this.map.setView([latlong[0], latlong[1]],14,false);
//               L.Transition = null;

//                var map = this.map;
//                var offset = map._getNewTopLeftPoint(center).subtract(map._getTopLeftPoint());
//                map.fire('movestart');
//                map.fire('zoomstart');
//                map._rawPanBy(offset);
//               // L.DomUtil.setPosition(map._mapPane,new L.Point(centerX, centerY))
//                map._zoom = zscalezoomInt;
//                map.fire('zoomend');
//                map.fire('move');
//                map.fire('moveend');





//              // this.map.setView([latlong[0], latlong[1]],zscalezoomInt,false);

//               //e pego a diferenca e dou scale

//              var scaleSobra =  crs.scale(zscalezoom) / crs.scale(zscalezoomInt);

//                 console.log("scale to zoom"+zscalezoom);
//                   console.log("scale sobra "+scaleSobra);

//              TweenMax.to($("#map"),0,{css:{scale:scaleSobra}});

//     },





//     getMap: function(){

//             return this.map;

//     },


//     MyCustomLayer: L.Class.extend({

//         initialize: function (latlng) {
//             // save position of the layer or any options from the constructor
//             this._latlng = latlng;
//         },

//         onAdd: function (map) {
//             this._map = map;

//             // create a DOM element and put it into one of the map panes
//             this._el = L.DomUtil.create('div', 'my-custom-layer leaflet-zoom-animated');
//             map.getPanes().overlayPane.appendChild(this._el);
//             $(this._el).html($("#cr-stage>div").html());


//             // add a viewreset event listener for updating layer's position, do the latter
//             map.on('viewreset', this._reset, this);
//             this._reset();
//         },

//         onRemove: function (map) {
//             // remove layer's DOM elements and listeners
//             map.getPanes().overlayPane.removeChild(this._el);
//             map.off('viewreset', this._reset, this);
//         },

//         _reset: function () {

//             var image   = this._image,
//             topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
//             size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

//             L.DomUtil.setPosition(image, topLeft);

//             image.style.width  = size.x + 'px';
//             image.style.height = size.y + 'px';

//             // update layer's position
//           //  var pos = this._map.latLngToLayerPoint(this._latlng);
//            // L.DomUtil.setPosition(this._el, pos);
//         }
//     }),






// });
