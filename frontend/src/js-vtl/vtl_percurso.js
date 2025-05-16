














/////////////////////////////////////////////////
//  PERCURSO
/////////////////////////////////////////////////
//
//
//
vtl.Percurso = vtl.EventClass.extend({
    name:"Percurso",
    _points:[],
    _pointsCartesian:[],
    _pointsKmCartesian:[],
    _elevation:[],
    paper:{},
    _groups:[],
    _set:undefined,
    _kmsets:{},
    _distTotalKm:0,
    _distTotalCart:0,
    _trechos:undefined,

    kmPoints:[],
    _kmsMarkers:null,
    _pisMarkers:null,
    _percursoMarkers:[],
    _popupInfo:null,


    defaults:{
        line:{
          stroke:"#333",//"#f5b60c",
          "stroke-width":1.5,
          'stroke-dasharray': '- '
        },
        kms:{
          stroke:"#F9662B",
          "stroke-width":1.0,
           fill: "#D88518",
          size:2
        },
        paper:{},
        url:'',
        showKms:true,
        showStartEnd:true,
        callback:undefined,
        context:{}
    },



    init: function(options){

        vtl.ControllersObjects[this.name] = this;

        this.bindAll();
        _.bindAll(this);

        this.defaults = $.extend(this.defaults,options);
        this.paper = this.defaults.paper;
        var that = this;




          //carergo o ponto dos percursos
       // this.gpx = new vtl.GPX((VTL_MODELS+"percurso.gpx"),{async: true,func:"vEV_GPX_LOADED",scope:this});


        //carergo o ponto dos percursos
        var _this = this;
        this.gpx = new vtl.GPXFROMGEOGJON(this.defaults.url,{async: true,func:"vEV_GPX_LOADED",scope:this});




      



        //crio o popupInfo que vai ser usado no mapa
        this._popupInfo = new vtl.infoWindow();
        window.vtlPopupInfo = window.vtlInfoWindow = this._popupInfo;

        return this;
    },



    loadGEOJSON:function(url){

      //apago o percurso
      this._percurso.remove();

      //apago os layers pis
      this._destroyPis();

      //apagou os kms
      this._destroyKms();

      this._removeTrechoTrack();

      this.gpx = new vtl.GPXFROMGEOGJON(url,{async: true,func:"vEV_GPX_LOADED",scope:this});




    },









    carregaNovoTrecho:function(){


    },




    escondeTudo: function(){
        this._hideKms();
        this._hidePis();
        this._percurso.hide();
    },


    showTudo: function(){
        this._showKms();
        this._showPis();
        this._percurso.show();
    },


    destroy: function(){

      //apago o percurso
      this._percurso.remove();

      //apago os layers pis
      this._destroyPis();

      //apagou os kms
      this._destroyKms();


    },





//****************************  EVENTS/PUBLIC FUNC

    //rodo quando carrego o arquivo gpx do percurso
    vEV_GPX_LOADED: function(gpx){ //GPX é um objeto vtl.GPX

      this.gpx = gpx;
     //this.points = this.gpx._get_points_avarege_dist(60); //pego optimizados, para não ter muito
      this.points = this.gpx.get_points();
      this.showPercurso();
      var _that = this;

     // this._trechos = [];

      this._percursoETrechos = this.gpx._percursos.concat(this.gpx._trechos);



     //vtlTrigger("vEV_TRECHOS_INFO_LOADED");



     this._showPis();
     this._showKms();


        vtlTrigger("vEV_PERCURSO_LOADED");

        //carrego infos dos Trechos
        // $.ajax({
        //   type: "GET",
        //   url: this.defaults.url,
        //   context:_that,
        //   dataType: "json",
        //   success: function(pointsGPS) {
        //       this._trechos = pointsGPS.trechos;
        //       vtlTrigger("vEV_TRECHOS_INFO_LOADED");
        //   }
        // });



    },


    // vEV_TRECHOS_INFO_LOADED:function(){
    //       this._showPis();
    //       vtlTrigger("vEV_PERCURSO_LOADED");

    // },

    vEV_TASK_SHOWKMS:function(){
        this._toogleKms();
    },

   vEV_SHOW_KMS:function(){
        this._showKms();
    },

    vEV_SHOW_KMS_IF_HIDDEN:function(){
        if(this._kmsMarkers == null){
                  this._showKms();
        }
    },

    vEV_HIDE_KMS:function(){
        this._hideKms();
    },

    vEV_SHOW_PIS:function(){
        this._showPis();
    },

    vEV_HIDE_PIS:function(){
        this._hidePis();
    },

    vEV_ZOOM_END: function(data){
        if(this._percurso){
          var esp = vtl.Util.math.fromToInterpolation(0.35,2.2,3,0.6,data.z,true);
          this._percurso.attr({"stroke-width":esp});
        }
    },

    vEV_TASK_RITMO: function(){
     //   this._toggleRitmo();
    },

    vEV_TASK_RITMOTOGGLE: function(){
      // this._toggleRitmo();
    
    },

    vEV_TASK_ALTIMETRIA:function(){
      this._toggleAltimetria();
    },

   vEV_TASK_ALTIMETRIATOOGLE:function(){
      this._toggleAltimetria();
    },


    vEV_TASK_TRECHOS: function(){
        // this._toggleTrechos();
    },

    vEV_TASK_TRECHOSTOGGLE: function(){
     //   this._toggleTrechos();
    },


    
    vEV_TASK_MARCATRECHOCORREDORTRACK:function(obj){
        this._marcaTrechoCorredorTrack(obj.trecho,obj.cor); //numero do trecho e a cor
    },

    vEV_TASK_REMOVETRECHOCORREDORTRACK:function(obj){
        this._removeTrechoCorredorTrack(obj); //numero do trecho e a cor
    },
    


     vEV_MODO_NAVEGACAO: function(){
        $(".ritmo .altimetria .trechos").removeClass("active");
        this._hideAltimetria();
    },







//****************************  TRACK

    showPercurso: function(){
      var strPercurso = "M";

      for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        strPercurso += p._x + "," + p._y + "L";
      }

      var attr = this.defaults.line;
      this._percurso = this.paper.path(strPercurso).attr(attr);
      this.paper.setStart();
      //isso porque criei um atributo groups com os grupos importados no lago layer
      var lago = this.paper.groups["barcos"][0];
      this._percurso.insertBefore(lago);
    },



//****************************  KMS MARKERS

    createKms: function(){
      this.kmPoints = this.gpx._get_km_points();
      this._kmsMarkers  = [];
      for (i = 1; i < this.kmPoints.length; i=i+1) {
        var pt = this.kmPoints[i];
        var opt = {text:i,zoomOffset:0,zoomVisibleMin:0.5,zoomMax:1.2,imagesss:VTL_MODELS+"blank.png"};

        if(i%5 == 0){
             opt = {css:{paddingTop:'5px'},image:VTL_MODELS+"marker_km_cinza.svg",text:i,zoomMax:1.5,zoomOffset:0.1,zoomVisibleMin:0};
        }

        var mk = new vtl.Marker(pt,opt).attr({visible:0});
        this._kmsMarkers.push(mk);

        // mk.click(function(){
        //   vtlPopupInfo.open(this).html("<h2>"+this.opt.text+" km</h2>");
        // });
      }
    },


    _showKms: function(){
        if(this._kmsMarkers == null){
            this.createKms();
        }

       if( $(".showkms").hasClass("active")) return false;

        $(".showkms").addClass("active");

       //vejo quantos markes estao na area da janela
        var inViewPort = 0
        _.each(this._kmsMarkers,function(el,i){
            if(el.inViewPort()) inViewPort++;
        });

        var count = 0;
        var delayOf = 2/inViewPort;
        delayOf = vtl.Util.math.clamp(delayOf,0.01,0.2);
        //ai os que forem visiveis, animo, os outros so mostro
        _.each(this._kmsMarkers,function(el,i){
            if(el.inViewPort()){
              el.drop(count*delayOf);
              count++;
            }else{
               el.show();
            }
        });
    },


    _hideKms: function(){
        if(this._kmsMarkers !== null){
            _.each(this._kmsMarkers,function(el){ el.hide();});
        }
        $(".showkms").removeClass("active");

    },


    _destroyKms:function(){
        _.each(this._kmsMarkers,function(el,i){
               el.remove();
        });

        this._kmsMarkers = null;
    },


    _toogleKms: function(){
        if( $(".showkms").hasClass("active")){
           this._hideKms();
        }else{
            this._showKms();
        }
    },



//****************************  PIs /ponto de trocas MARKERS

    _createPis: function(){
        
        this._pisMarkers = [];
        var piCount = 0;

        for (var i = 0; i < this.gpx._pis.length; i++) {

                var pi = this.gpx._pis[i];
                var trechopi = this.gpx._trechos[i];
                var pp = pi.LatLng;


                      if(piCount==0){ // o primeiro PI é o PI de Largada
                            var pim =  new vtl.MarkerPI(pp,{text:"",image:VTL_MODELS+"marker_start_finish.svg",h:75,oy:73}).anima(2);


                      }else if(piCount==this.gpx._pis.length-1){ // o ultimo PI é o PI de chegada
                            var pim =  new vtl.MarkerPI(pp,{text:"",image:VTL_MODELS+"marker_finish.svg",h:75,oy:68,ox:25}).anima(2);

                      }else{ //senão é pi intermediarios
                           var pim =  new vtl.MarkerPI(pp,{text:piCount}).attr({visible:0});
                      }

                


                     if(piCount<this.gpx._pis.length-1){

                         pim.info = pi.info;
                         pim.trecho = trechopi;

                         pim.infoStr = "<div class='trecho-"+i+"' data-trecho="+i+">\
                          <h2 style='font-size:16px;font-family:Arial' class='titulo'>"+pi.nome+"/"+trechopi.nome+"</h2>\
                          <div>Distancia: <b>"+trechopi.distInfo+"km</b></div>\
                          <div>Abertura: <b>"+pi.abertura+"</b></div>\
                          <div>Fechamento: <b>"+pi.fechamento+"</b></div>\
                          <div><a onclick=\"vtlTrigger('vEV_MODO_NAVEGACAO','');vtlTrigger('_showAltimetria',"+piCount+");\"><b><i class=\"icon-signal\"></i></b> altimetria</a>&emsp;\
                               <a onclick=\"vtlTrigger('vEV_MODO_NAVEGACAO','');vtlTrigger('_showTrechos');\"><b>+</b> info</a></div>";


                         pim.click(function(){
                              // new vtl.infoWindow(this._latlng).html("<h2>"+this.opt.text+" km</h2>").show();
                              vtlPopupInfo.open(this).html(this.infoStr).onClose(function(){vtlTrigger("_fechaTrechoPopup")});
                              vtlTrigger("vEV_SHOW_TRACADO_TRECHO",this.trecho);

                          });

                      }else{

                          pim.info = pi.info;

                           pim.infoStr = "<div class='trecho-"+i+"' data-trecho="+i+">\
                            <h2 style='font-size:16px;font-family:Arial' class='titulo'>"+pi.nome+"</h2>\
                            <div>Abertura: <b>"+pi.abertura+"</b></div>\
                            <div>Fechamento: <b>"+pi.fechamento+"</b></div>\
                            <div><a onclick=\"vtlTrigger('vEV_MODO_NAVEGACAO','');vtlTrigger('_showAltimetria',"+piCount+");\"><b><i class=\"icon-signal\"></i></b> altimetria</a>&emsp;\
                                 <a onclick=\"vtlTrigger('vEV_MODO_NAVEGACAO','');vtlTrigger('_showTrechos');\"><b>+</b> info</a></div>";


                         pim.click(function(){
                              // new vtl.infoWindow(this._latlng).html("<h2>"+this.opt.text+" km</h2>").show();
                              vtlPopupInfo.open(this).html(this.infoStr).onClose(function(){vtlTrigger("_fechaTrechoPopup")});
                              vtlTrigger("vEV_SHOW_TRACADO_TRECHO",i-1);
                          });



                      }


                           piCount++;

                      this._pisMarkers.push(pim);
                      _pisMarkers = this._pisMarkers
              
        }





         // //crio a marca da maratona de 60 km
         var pp = this.gpx._getPointInKm(40);
         var pim =  new vtl.MarkerPI(pp,{text:"",image:VTL_MODELS+"marker_60km.svg",h:75,oy:73}).anima(2);

         pim.info = this.gpx._trechosPercursos[1];
         pim.infoStr = "<div class='trecho-"+i+"' data-trecho="+i+">\
                  <h2 style='font-size:16px;font-family:Arial' class='titulo'>Largada 60km</h2>\
                  <div>Abertura: <b>9h</b>";

          pim.click(function(){
              // new vtl.infoWindow(this._latlng).html("<h2>"+this.opt.text+" km</h2>").show();
              vtlPopupInfo.open(this).html(this.infoStr).onClose(function(){vtlTrigger("_fechaTrechoPopup")});
              vtlTrigger("vEV_SHOW_TRACADO_TRECHO",this.info);
          });



        this._pisMarkers.push(pim);





        // for (var i = 0; i < this._gpx._trechos.length; i++) {

        //         //se for percurso, ignoro ele, quero trabalhar só os trechos agora

        //         var trecho = this._percursoETrechos[i];

        //         if(trecho.kmInicio !== undefined){
        //           kmanterior = trecho.kmInicio;
        //              kmatual = trecho.kmInicio;
        //         }

        //         if(trecho.kmInicio === undefined) trecho.kmInicio = kmatual;

        //         var pp = this.gpx._getPointInKm(kmatual);
        //         kmatual += trecho.distancia;


        //         if(trecho.tipo=="trecho"){

        //               if(piCount==0){ // crio o marca da largada/CHEGADA
        //                     var pim =  new vtl.MarkerPI(pp,{text:"",image:VTL_MODELS+"marker_start_finish.svg",h:75,oy:73}).anima(2);
        //               }else{
        //                    var pim =  new vtl.MarkerPI(pp,{text:piCount}).attr({visible:0});
        //               }

        //              piCount++;

        //              pim.info = trecho;

        //              pim.infoStr = "<div class='trecho-"+i+"' data-trecho="+i+">\
        //               <h2 style='font-size:1.2em' class='titulo'>"+trecho.nome+"</h2>\
        //               <div>Distancia: <b>"+trecho.distancia+"km</b></div>\
        //               <div>Abertura: <b>"+trecho.abertura+"</b></div>\
        //               <div>Fechamento: <b>"+trecho.fechamento+"</b></div>\
        //               <div><a onclick=\"vtlTrigger('vEV_MODO_NAVEGACAO','');vtlTrigger('_showAltimetria',"+piCount+");\"><b><i class=\"icon-signal\"></i></b> altimetria</a>&emsp;\
        //                    <a onclick=\"vtlTrigger('vEV_MODO_NAVEGACAO','');vtlTrigger('_showTrechos');\"><b>+</b> info</a></div>";


        //              pim.click(function(){
        //                   // new vtl.infoWindow(this._latlng).html("<h2>"+this.opt.text+" km</h2>").show();
        //                   vtlPopupInfo.open(this).html(this.infoStr).onClose(function(){vtlTrigger("_fechaTrechoPopup")});
        //                   vtlTrigger("vEV_SHOW_TRACADO_TRECHO",this.info);
        //               });

        //               this._pisMarkers.push(pim);
        //               _pisMarkers = this._pisMarkers
        //       }
        // }










        // //crio a marca da maratona de 60 km
        //  var pp = this.gpx._getPointInKm(40);
        //  var pim =  new vtl.MarkerPI(pp,{text:"",image:VTL_MODELS+"marker_60km.svg",h:75,oy:73}).anima(2);

        //  pim.info = this.gpx._trechosPercursos[1];
        //  
        //  pim.infoStr = "<div class='trecho-"+i+"' data-trecho="+i+">\
        //           <h2 style='font-size:0.8em' class='titulo'>Largada 60km</h2>\
        //           <div>Abertura: <b>9h</b>";

        //   pim.click(function(){
        //       // new vtl.infoWindow(this._latlng).html("<h2>"+this.opt.text+" km</h2>").show();
        //       vtlPopupInfo.open(this).html(this.infoStr).onClose(function(){vtlTrigger("_fechaTrechoPopup")});
        //       vtlTrigger("vEV_SHOW_TRACADO_TRECHO",this.info);
        //   });



    },






    _showPis: function(){
      if(this._pisMarkers == null){
            this._createPis();
        }

       var count = 0;
       var delayOf = 0.18;
       _.each(this._pisMarkers,function(el,i){
           if(el.inViewPort()){
             el.drop(count*delayOf);
             count++;
           }else{
              el.show();
           }
       });
    },

    _hidePis:function(){
         if(this._pisMarkers !== null){
            _.each(this._pisMarkers,function(el){ el.hide();});
        }

    },


    _destroyPis:function(){
        _.each(this._pisMarkers,function(el,i){
               el.remove();
        });

             this._pisMarkers = null;
    },








//****************************  TRECHOS MARKER

    vEV_SHOW_TRACADO_TRECHO: function(trechoobj){
      //  var obj = this.gpx._trechos[ind];
       this._showTrechoTrack(trechoobj)
   },

    _showTrechoTrack:function(trecho){
        this._removeTrechoTrack();
        var pointsTrecho = this._getTrechoPoints(trecho);

        trecho.points = pointsTrecho;

        this._trechoAtivo = trecho;
        this._altimetriaTrecho(trecho);

        var strPercurso = "M";

        for (var i = 0; i < pointsTrecho.length; i++) {
          var p = pointsTrecho[i];
          strPercurso += p._x + "," + p._y + "L";
        }

        var attr = this.defaults.line;
        this._trechoPath = this.paper.path(strPercurso).attr(attr).attr({'stroke-dasharray':'','stroke-width':2,'stroke':'#d32b21'}).showProgressive(2000);

       var bb = this.paper.path(strPercurso).attr({'stroke-width':0,'stroke':'transparent'}).getBBox();

       bb.x +=00;
       bb.y -=00;
       bb.height +=0;
       bb.width +=0;

       // vtlTrigger('vEV_TASK_ZOOMBOUNDBOX',bb)


    },

    _fechaTrechoPopup:function(){
      this._removeTrechoTrack();
      //se a altimetria ta ativa, mostro ele para o percurso inteiro
      if($(".altimetria").hasClass('active'))
            this._showAltimetria();
    },

    _removeTrechoTrack:function(){
      if(this._trechoPath !== undefined){
          try{
          this._trechoPath.stoptween().remove();
          this._trechoPath === undefined;
              delete this._trechoAtivo;
          }catch(e){}
        }

    },


    _getTrechoPoints:function(trecho){
      if(!_.isObject(trecho) ){
        trecho = this.gpx._trechos[trecho];
      }

        return this.gpx._getPointsInTrecho(trecho.pi0.km/1000,trecho.pi1.km/1000);
    },






      _marcaTrechoCorredorTrack:function(trecho,cor){ //trecho como numero do trecho
       // this._removeTrechoTrack();
        this._trechosCorredor = (this._trechosCorredor || {});
        

        if(trecho in this._trechosCorredor){
            this._removeTrechoCorredorTrack(trecho);
        }

        var pointsTrecho = this._getTrechoPoints(trecho);
       

        this._trechosCorredor[trecho] = {};


        var strPercurso = "M";

        for (var i = 0; i < pointsTrecho.length; i++) {
          var p = pointsTrecho[i];
          strPercurso += p._x + "," + p._y + "L";
        }

        var attr = this.defaults.line;
        this._trechosCorredor[trecho].path = this.paper.path(strPercurso).attr(attr).attr({'stroke-dasharray':'','stroke-width':10,'stroke':cor}).showProgressive(2000);

       // var bb = this.paper.path(strPercurso).attr({'stroke-width':0,'stroke':'transparent'}).getBBox();

       // bb.x -=150;
       // bb.y -=150;
       // bb.height +=250;
       // bb.width +=250;

        //vtlTrigger('vEV_TASK_ZOOMBOUNDBOX',bb)


    },

     _removeTrechoCorredorTrack:function(trecho){

         try{
          this._trechosCorredor[trecho].path.stoptween().remove();
          delete  this._trechosCorredor[trecho];
          }catch(e){}

     },






//****************************  RESULTADO INTERATIVO

    // vEV_SHOW_RESULTADO_INTERATIVO: function(obj){ this._showResultadoInterativo(obj) },

    // vEV_LOAD_EQUIPE_RUNNER:function(quem){



    //   if(this.runners == undefined) this.runners = []; 


    //    var eq = {file:$(quem).data("file"),
    //                     nome:$(quem).data("nome"),
    //                     largada:$(quem).data("largada"),
    //                     chegada:$(quem).data("chegada"),
    //                     gpx:null,
    //                     cor:vtl.Util.random_color()
    //                    }

       
    //    if(quem.checked){
    //       $(quem).parent().css('color',eq.cor)
    //       var ppt =  this.gpx._getPointInKm(1);
    //       var qt = this.runners.length;
    //       var dir = (qt % 2) ? -1 : 1;
    //       var runner = new vtl.Runners(ppt,{text: "",
    //                                           ox:(60+(qt*dir*20)),
    //                                           gpxfile: eq.file,
    //                                           nome:eq.nome,
    //                                           largada:eq.largada,
    //                                           chegada:eq.chegada,
    //                                           cor:eq.cor
    //                                           });
    //       runner.name = eq.nome
    //       this.runners.push(runner);
    //       runner.drop(0.5);
        

    //     }else{
    //       $(quem).parent().css('color','white')
    //       for (var i = 0; i < this.runners.length; i++) {
    //         var runner = this.runners[i];
    //         if (runner.name == eq.nome){
    //            runner.remove();
    //            this.runners.remove(i);
    //         }
    //       }

    //     }


      


    // },



    // _showResultadoInterativo:function(trecho){
    //     //get list of runners
    //   var totaltime = 0
    //    for (var i = 0; i < this.runners.length; i++) {
    //       var runner = this.runners[i];
    //       if (runner.getTotalTime() > totaltime){
    //           totaltime = runner.getTotalTime()
    //       }
    //     }
    //   //pego o tempo mais demorado desses

    //   window.t = 0
    //   console.log(totaltime/1000)
    //   TweenMax.fromTo(window,180,{t:0},{t:totaltime/1000,ease:Linear.easeInOut,
    //     onUpdate:function(){vtlTrigger("vEV_RUNNINGTIME_CHANGE",window.t)}})


    //     //e animo eles


    // },






    _aafechaTrechoPopup:function(){
      this._removeTrechoTrack();
      //se a altimetria ta ativa, mostro ele para o percurso inteiro
      if($(".altimetria").hasClass('active'))
            this._showAltimetria();
    },

    _aaremoveTrechoTrack:function(){
      if(this._trechoPath !== undefined){
          try{
          this._trechoPath.stoptween().remove();
          this._trechoPath === undefined;
              delete this._trechoAtivo;
          }catch(e){}
        }

    },


    _aagetTrechoPoints:function(trecho){
        return this.gpx._getPointsInTrecho(trecho.kmInicio,(trecho.kmInicio+trecho.distancia));
    },

















//****************************  ALTIMETRIA

  //chamada toda vez que clico em um trecho, entao so mostro se tiver aberto
  _altimetriaTrecho:function(trecho){
      if( $(".altimetria").hasClass('active')){
          this._showAltimetria(trecho);
      }
  },



  _toggleAltimetria: function(){
      if(! $(".altimetria").hasClass('active')){
          if(this._trechoAtivo){
            this._showAltimetria(this._trechoAtivo);
          }else{
             this._showAltimetria();
          }

      }else{
        this._hideAltimetria();
      }


  },

  _hideAltimetria: function(){


         if(this._paperChart !== undefined ){
     var that = this;
                  var ww = $("#chart").width();
        var hh = $("#chart").height();

         TweenMax.to($("#chart"),0.6,{bottom:(-hh),ease:Back.easeIn,onComplete:function(){
                 that._paperChart.remove();
                 delete that._paperChart;
                $(".altimetria").removeClass('active');
           }});
         return;
        }


  },


  _showAltimetria: function(trechoIndex){


        if(typeof trechoIndex == "number"){
           trechoIndex = this.gpx._trechos[trechoIndex];
           trechoIndex.points =  this._getTrechoPoints(trechoIndex);
         }

        var that = this;

        var ww = $("#chart").width();
        var hh = $("#chart").height();


       $(".altimetria").addClass('active');

       this._paperChart = Raphael($("#chart")[0],'100%','100%');

        _paperChart =  this._paperChart;
        //this._paperChart.setViewBox(0, 0,w,h,true);

        var valuesX = [];
        var valuesY = [];


        var elevation = trechoIndex ? trechoIndex.points :  this.points;

        //reduso para 255 ponstos só
        var elevationT = [];

          if(elevation.length>600){

            for (var i = 0,j = elevation.length, c = parseInt(j / 600,10); i < elevation.length; i +=c) {
              elevationT.push(elevation[i]);
            };
            elevation = elevationT;
        }

        var tam = elevation.length;


        for ( i = 0; i < tam; i++) {
          if(elevation[i].meta){ //so quero que
            valuesX.push(elevation[i]._dist/1000);
            valuesY.push(elevation[i].meta.ele);
          }
        }


        this._grafico = this._paperChart.linechart(30,10,ww-30,hh-20, valuesX, valuesY, {shade:true,smooth: true, colors: ['#f5b60c'], symbol: 'circle', axis: "0 0 1 1", axisxstep:30,axisystep:10});


        this._paperChart.drawGrid(0,0,ww,hh,ww/30,hh/10,"#999").toBack();

        this._grafico.hoverColumn(function(ev){

            this.tags = _paperChart.set();
              r = _paperChart;

              for (var i = 0, ii = this.y.length; i < ii; i++) {
                // console.log(this.axis);
                this.tags.push(r.tag(this.x, this.y[i], parseInt(this.values[i],10), 160, 10).insertBefore(this).attr([{ fill: "#000" }, { fill: this.symbols[i].attr("fill") }]).toFront());
              }

                //a distancia
                var dist = this.axis;
             //   this.tags = that._grafico.set();
                //pego a cordenada a essa distancia
                var point = that.gpx._getPointInKm(dist);
                //mostro um circulo onde é o ponto
               // that.pointtemp && that.pointtemp.remove();
                  that.pointtemp = that.paper.circle(point._x,point._y,5).attr({fill:"red"});

                  vtlTrigger(vEV_CENTER_VIEW_IN_POINT,point);

          },function () {
             that.pointtemp && that.pointtemp.remove();
              this.tags && this.tags.remove();
          }

        );


        //faco umas animações pego a linha
         var linha = this._grafico.lines[0];
         //var pathstr = linha[0].attr('path').toString();
        // var linhaInicial1 = Raphael.transformPath(pathstr,transform);
      //   this._grafico.lines[0].attr({'path':linhaInicial1}).animate({path:pathstr2},1000,"<>");



        var linha2 = this._grafico.shades[0];
        var linhaFinal = linha2.attr('path').toString();

        var bb = linha2.getBBox();

        var transform =  "s 1 0.1 0 "+bb.y2;
        var linhaInicial = Raphael.transformPath(linhaFinal,transform);



        //a array dos pontos finais
         var pontosFinails = Raphael.parsePathString(linhaFinal.toString());

        //a array dos pontos iniciais
         var pontosIniciais = Raphael.parsePathString(linhaInicial.toString());

         var animalinha = new TimelineMax().pause();

         var arrayDest = pontosIniciais;


           TweenMax.to($("#chart"),1,{bottom:'0',ease:Back.easeOut,onComplete:function(){
           }});


          linha2.attr({'path':linhaInicial}).animate({path:pontosFinails},1000,"<>");
          linha.attr({'path':linhaInicial}).animate({path:pontosFinails},2000,"bounce").remove();


         window.linha = linha2;

         window.grafico = this._grafico;

        this._grafico.symbols.attr({ r: 2 });

        this._grafico.axis[0].text.attr({fill:'white','font-color':'white'}).transform("t0 0").toFront();
        this._grafico.axis[1].text.attr({fill:'white','font-color':'white'}).transform("t0 0").toFront();

    },













//****************************  CRIA INFOS TRECHOS
//
//


    _showTrechos:function(){
          var obj = {};
          obj.html = this._criaTrechosInfo();
          obj.callback = this._trechosInfoJS;
          vtlTrigger("vEV_MOSTRA_CONTEUDO_LATERAL",obj);
          _.delay(function(){$(".trechos").addClass("active")},1000);
          $(".ritmo").removeClass("active");
    },

    _hideTrechos:function(){
         vtlTrigger("_hideLateral");
        $(".trechos").removeClass("active");
    },


    _toggleTrechos:function(){

        if($(".trechos").hasClass("active")){
            this._hideTrechos();
        }else{
            this._showTrechos();
        }

    },


   _criaTrechosInfo: function(){

      var trechosStr = "<ul id='trecho-infos' class='unstyled'>";
       for (var i = 0; i < this._trechos.length; i++) {
            var pi = {info:this._trechos[i]};
            trechosStr += "<li class='trecho-"+i+"' data-trecho="+i+"><h3 style='margin:5px'><a class='trechoinfo trecho-"+i+"' href='#'>"+pi.info.nome+" <small><i> - "+pi.info.distancia+"</i> km </small></a></h3><div class='info-trecho'>"+pi.info.info+"</li>";
        }
        trechosStr+="</ul>";
        return trechosStr;
   },

   _trechosInfoJS: function(){


      $("#trecho-infos h3").click(function(event) {
         $('.info-trecho').slideUp();
          $(this).parent().find('.info-trecho').slideToggle();
          var tt = $(this).parent().data('trecho');
          vtlTrigger("vEV_TRECHO_CLICADO_MENU",tt);
      });

   },




   vEV_TRECHO_CLICADO_MENU:function(index){
      var trechoobj = this.gpx._trechos[index];
      vtlTrigger("vEV_SHOW_TRACADO_TRECHO",trechoobj);

   },



    pegaPontosOptimizados:function(){

      //this._set.getTotalLength();
       var points = [];
       for(var i = 0; i<this._distTotalCart; i=(i+this._distTotalCart/100)){
          points.push(this._set.getPointAtLength(i));
       }
       return points;
    },



    setPaper: function(paper){
        this.paper = paper;
    },


    updateInfos: function(){
       this._distTotalCart =  this._set.getTotalLength();
       this._distTotalKm = this.getTotalDistance();

       this._pointsKmCartesian = [];
       for (i = 0; i < this._distTotalKm; i++) {
          var porc = i * this._distTotalCart / this._distTotalKm;
          var pt = this._set.getPointAtLength(porc);
          this._pointsKmCartesian.push([pt.x,pt.y]);
        }


       //this.showKms();
      //pego a elevação
       this.getElevation();
    },




    showKmsAntigo: function(){

        var attr = this.defaults.kms;
         this.paper.setStart();

            this._pointsKmCartesian = [];
        for (i = 0; i < this._distTotalKm; i++) {
          var porc = i * this._distTotalCart / this._distTotalKm;


          var pt = this._set.getPointAtLength(porc);

          this._pointsKmCartesian.push([pt.x,pt.y]);

          var kmMarker = this.paper.circle(pt.x, pt.y, this.defaults.kms['size']).attr(attr);

          var kmHover = this.paper.circle(pt.x, pt.y, (this.defaults.kms['size']*3)).attr({opacity:0,fill:"black"});

          kmHover.text = (i+" km");
          kmHover.sizeo = this.defaults.kms['size'];
          kmHover.marker = kmMarker;

          kmHover.mouseover(function(){
                TweenMax.to(this.marker,0.3,{raphael:{"stroke-width":(this.sizeo+8)}});
                this.flag = this.paper.flag((this.getBBox().x+10), (this.getBBox().y+this.sizeo/2),this.text,45).attr({opacity:0.1}).animate({opacity:1},1000,">");
          });
          kmHover.mouseout(function(){
                TweenMax.to(this.marker,0.5,{raphael:{"stroke-width":"-=8"},delay:0.2});
                if(this.flag) this.flag.remove();
          });
        }

        this._kmsets = this.paper.setFinish();
    },






    showKmsLabels: function(msg){

     var that = this;

        if(that._kmsmarkes) {
            that._kmsmarkes.remove();
            delete that._kmsmarkes;
            $(".kmmarks").removeClass('active');

          }else{
         that.paper.setStart();

          $(".kmmarks").addClass('active');

         var attr = this.defaults.kms;

        for (i = 1; i < that._pointsKmCartesian.length-1; i++) {

          var pt = that._pointsKmCartesian[i];
          var text = i;
          if(i==99) text = 100;
          var kmMarker = that.paper.circle(pt[0], pt[1], that.defaults.kms['size']).attr(attr);
          var mk = that.paper.flag(pt[0],(pt[1]-3),(text),90).attr({ font: '9px Arial, sans-serif, bolder' });
          mk[1].attr({fill:'white'}).transform("...r90");
          mk[0].attr({fill:vtl_cor_azul,'stroke-width':0});

        }

           that._kmsmarkes = that.paper.setFinish();
         }
    },



    getElevation : function(){

          var path = [];
          for (var i = 0, tam = this._points.length; i < tam; i++) {
                pp = this._points[i];
                path.push(new google.maps.LatLng(pp[0], pp[1]));
          }
          var caminho = new google.maps.Polyline({path:path});
          var pathRequest = {
                'path': path,
                'samples': 256
          };
          var elevator = new google.maps.ElevationService();
          var that = this;
          elevator.getElevationAlongPath(pathRequest,function(results,status){return that.elevationCallback.call(that,results,status);});
    },


    getElevationTrecho : function(trechoIndex){

          var trecho = this._trechos[trechoIndex];
          var trechoPath = trecho.obj;
          var path = [];

          for (var i = 0, tam = trechoPath.getTotalLength(); i < tam; i += (tam/255)) {
                pp = trechoPath.getPointAtLength(i);
                ppMap = vtl.Util.inverseMercator(pp.x,pp.y);
                path.push(new google.maps.LatLng(ppMap[0], ppMap[1]));
          }

          var caminho = new google.maps.Polyline({path:path});

          this.trechoAtual.distancia = caminho.inKm();

          var pathRequest = {
                'path': path,
                'samples': 256
          };
          var elevator = new google.maps.ElevationService();
          var that = this;
          elevator.getElevationAlongPath(pathRequest,function(results,status){return that.elevationTrechoCallback.call(that,results,status);});

    },



    elevationCallback: function(results, status){
          if (status == google.maps.ElevationStatus.OK) {
               this._elevationResultArray = results;
              // this.showElevation();
          }else{
              console.log("ocorreu um erro ao pegar as alturas");
          }
    },


    elevationTrechoCallback: function(results, status){
          if (status == google.maps.ElevationStatus.OK) {
               this._trechoElevationResultArray = results;
                this.showElevation(1);
              // this.showElevation();
          }else{
              console.log("ocorreu um erro ao pegar as alturas");
          }
    },


    showElevation: function(trechoIndex){

        var that = this;

        var ww = $("#chart").width();
        var hh = $("#chart").height();

        if(this._paperChart !== undefined ){


         TweenMax.to($("#chart"),0.6,{bottom:(-hh),ease:Back.easeIn,onComplete:function(){
                 that._paperChart.remove();
                 delete that._paperChart;
                $(".altimetria").removeClass('active');


           }});

         return;

        }


       $(".altimetria").addClass('active');

       this._paperChart = Raphael($("#chart")[0],'100%','100%');

        _paperChart =  this._paperChart;
        //this._paperChart.setViewBox(0, 0,w,h,true);

        var valuesX = [];
        var valuesY = [];


        var elevation = trechoIndex ? this._trechoElevationResultArray :  this._elevationResultArray;

        var tam = elevation.length;




        if(trechoIndex){
            //pego a kilometragem inicial
            var inicio = this.trechoAtual.kmInicio;
            for ( i = 0; i < tam; i++) {
              valuesX.push(i*(this.trechoAtual.distancia/tam)+(inicio));
              valuesY.push(elevation[i].elevation);
            }


        }else{

            for ( i = 0; i < tam; i++) {
              valuesX.push(i*(this._distTotalKm/tam));
              valuesY.push(elevation[i].elevation);
            }

        }



        this._grafico = this._paperChart.linechart(30,10,ww-30,hh-20, valuesX, valuesY, {shade:true,smooth: true, colors: ['#f5b60c'], symbol: 'circle', axis: "0 0 1 1", axisxstep:30,axisystep:10});


        this._paperChart.drawGrid(0,0,ww,hh,ww/30,hh/10,"#999").toBack();

        this._grafico.hoverColumn(function(ev){

            this.tags = _paperChart.set();
              r = _paperChart;

              for (var i = 0, ii = this.y.length; i < ii; i++) {
                // console.log(this.axis);
                this.tags.push(r.tag(this.x, this.y[i], parseInt(this.values[i],10), 160, 10).insertBefore(this).attr([{ fill: "#000" }, { fill: this.symbols[i].attr("fill") }]).toFront());
              }

                //a distancia
                var dist = this.axis;
             //   this.tags = that._grafico.set();
                //pego a cordenada a essa distancia
                var point = that.getPointFromKm(dist);
                //mostro um circulo onde é o ponto
               // that.pointtemp && that.pointtemp.remove();
                  that.pointtemp = that.paper.circle(point.x,point.y,5).attr({fill:"red"});

                  vtlTrigger(vEV_CENTER_VIEW_IN_POINT,point);




        },function () {
             that.pointtemp && that.pointtemp.remove();
              this.tags && this.tags.remove();
          }

        );


        //faco umas animações pego a linha
         var linha = this._grafico.lines[0];
         //var pathstr = linha[0].attr('path').toString();
        // var linhaInicial1 = Raphael.transformPath(pathstr,transform);
      //   this._grafico.lines[0].attr({'path':linhaInicial1}).animate({path:pathstr2},1000,"<>");



        var linha2 = this._grafico.shades[0];
        var linhaFinal = linha2.attr('path').toString();

        var bb = linha2.getBBox();

        var transform =  "s 1 0.1 0 "+bb.y2;
        var linhaInicial = Raphael.transformPath(linhaFinal,transform);



        //a array dos pontos finais
         var pontosFinails = Raphael.parsePathString(linhaFinal.toString());

        //a array dos pontos iniciais
         var pontosIniciais = Raphael.parsePathString(linhaInicial.toString());

         var animalinha = new TimelineMax().pause();

         var arrayDest = pontosIniciais;


           TweenMax.to($("#chart"),1,{bottom:'0',ease:Back.easeOut,onComplete:function(){
           }});


          linha2.attr({'path':linhaInicial}).animate({path:pontosFinails},1000,"<>");
          linha.attr({'path':linhaInicial}).animate({path:pontosFinails},2000,"bounce").remove();


         window.linha = linha2;

         window.grafico = this._grafico;

        this._grafico.symbols.attr({ r: 2 });

        this._grafico.axis[0].text.attr({fill:'white','font-color':'white'}).transform("t0 0").toFront();
        this._grafico.axis[1].text.attr({fill:'white','font-color':'white'}).transform("t0 0").toFront();

    },








    getPointFromKm: function(km){
          var p = this._set.getPointAtLength(km/this._distTotalKm*this._distTotalCart);
          return p;

    },

    getCartFromKm: function(km){
          return km/this._distTotalKm*this._distTotalCart;
    },


    getTotalDistance: function() {
            var path = [];
            for (var i = 0, tam = this._points.length; i < tam; i++) {
                  pp = this._points[i];
                  path.push(new google.maps.LatLng(pp[0], pp[1]));
            }
            var caminho = new google.maps.Polyline({path:path});
            return (caminho.inKm());
      },


      show:function(){
        this._set.show();
      },


      hide:function(){
        this._set.hide();
      },


      //Trechos
      showTrechos:function(){

        if(! this._trechos) return;

        if(this.trechosSet){
          this.trechosSet.remove();
          this.pontosDeTrocaSet.remove();
          delete this.trechoAtual;
          $("#trechoLayer").remove();
          $("#trecho").remove();
          $(".trechos").removeClass('active');
          delete this.pontosDeTrocaSet;
          delete this.trechosSet;
          return;

        }


        $(".trechos").addClass('active');

        var kmatual = 0;
        var kmanterior = 0;
        var pontoTrocasCount = 0;

        this.pontosDeTrocaSet = this.paper.set();

        this.trechosSet = this.paper.set();

         $("<div id='trechoLayer' style='font-size:10px'></div>").appendTo('#trechos-tab');


          var trechosStr = "<ul class='unstyled'>";

          for (var i = 0; i < this._trechos.length; i++) {

                var trecho = this._trechos[i];
                if(trecho.kmInicio !== undefined){
                  kmanterior = trecho.kmInicio;
                     kmatual = trecho.kmInicio;

                }

                if(trecho.kmInicio === undefined) trecho.kmInicio = kmatual;

                kmatual += trecho.distancia;
                var pp = this.getPointFromKm(kmatual);

                if(trecho.tipo=="trecho"){

                      pontoTrocasCount++;
                        //crio os pontos de trocas
                    //this.paper.flag(pp.x,pp.y,("PI "+(pontoTrocasCount)),90).toFront();

                        var pontotroca = this.paper.drop(pp.x,pp.y,("PI "+(pontoTrocasCount+1)),90).attr({ font: '9px Arial, sans-serif, bolder' });
                        pontotroca[1].attr({fill:'white'});
                        pontotroca[0].attr({fill:"#d43c1f",'stroke-width':0});


                        pontotroca[0].node.className.baseVal = 'cursor-pointer';
                        pontotroca[0].hover(function() {
                              vtlTrigger("trechoInfoHover",this.i+1);
                        }, function() {
                          // Stuff to do when the mouse leaves the element;
                             vtlTrigger("trechoInfoOut",this.i+1);
                        });
                        pontotroca[0].i = i;
                        this.pontosDeTrocaSet.push(pontotroca);

              }



                //crio os trechos com mouse over emcima dos safados
                var pthstr = this._set.getSubpath(this.getCartFromKm(kmanterior),this.getCartFromKm(kmatual));
                kmanterior = kmatual;
                var trechoP = this.paper.path(pthstr).attr({'stroke':'red','stroke-width':8,'opacity':0.0}).hover(function(i){
                      vtlTrigger("trechoInfoHover",this.index);
                },function(i){
                       vtlTrigger("trechoInfoOut",this.index);
                });
                trechoP.click(function(event) {
                      vtlTrigger("trechoInfoClique",this.index);
                });

                trechoP.node.className.baseVal = 'cursor-pointer';

                var info = trecho.info;

                trechosStr += "<li class='trecho-"+i+"' data-trecho="+i+"><a class='trecho-"+i+"' href='#'>"+trecho.nome+"<i> - "+trecho.distancia+"</i> km <div class='info-trecho'>"+info+"</li>";

                trechoP.index = i;
                this._trechos[i].obj = trechoP;
                this.trechosSet.push(trechoP);
        }


        this.pontosDeTrocaSet.toFront();


        trechosStr +="</ul>";

        $("#trechoLayer").html(trechosStr);

        $("#trechoLayer li").click(function(e) {
             e.preventDefault();
             vtlTrigger("trechoInfoClique",$(this).data('trecho'));
             return false;
        });



      },



     trechoInfoHover : function(trechoIndex){
             var trecho = this._trechos[trechoIndex];
             $("#trecho").remove();
             trecho.obj.attr({"opacity":1});

               $(".info-trecho").hide();

            this.trechoAtual = this._trechos[trechoIndex];

            $(("li.trecho-"+trechoIndex+" .info-trecho")).show();


     },

    trechoInfoOut : function(trechoIndex){
                var trecho = this._trechos[trechoIndex];
                this.trechosSet.attr({"opacity":0.0});
                $("#trecho").remove();
                delete this.trechoAtual;
     },


    trechoInfoClique : function(trechoIndex){
            //mostro as infos
            this.trechoInfoOut(trechoIndex);
            this.trechoInfoHover(trechoIndex);


            this.trechoAtual = this._trechos[trechoIndex];

            var bbox =  this.trechoAtual.obj.getBBox();
            //dou um zoom nele
            vtlTrigger("vEV_ZOOM_BOUNDS",bbox);

            //e mostro a altimetria, mas depois da animacao de movimento terminada
           if( this._paperChart !== undefined ){
               this.showElevation(); //sumo com ele;

                  var that = this;
                  setTimeout(function(){
                    that.getElevationTrecho(trechoIndex);
                  },1650);
            }
     },



      hideAllMarkes: function(){
        if(this.trechosSet){
           this.showTrechos();
        }

         if(this._kmsmarkes) {
             this.showKmsLabels();
          }

      if(this._paperChart !== undefined ){
          this.showElevation();
          }

      },



      mostraTrecho:function(){



      }






});
//****************************














