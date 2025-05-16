

var objetosAnimados = [];
/////////////////////////////////////////////////
//   LAGO Layer
/////////////////////////////////////////////////

vtl.LagoLayer = vtl.dom.extend({

        mapa:{},
        grupoSetLago:[],
        percursoM:{},
        $camera:{},
        paper: undefined,
        classid:"Lago Layer",
        gmaps:false,


      //setup inicial
      init: function(){

          // funcao do underscore que faz com que todo a
          // funcao chamada desse objeto o this se refere a ele mesmo
          _.bindAll(this);

          this._el = "#cr-stage";
          this.$el = $(this._el);

          //crio o elemento que só controla a rotação para facilitar a vida
          this.rotationCam = new vtl.dom(0,0,'100%','100%','rotation-cam',"#cr-stage");

          //crio o lago layer
          this._super(0,0,vtl_W,vtl_H,"lago-layer",this.rotationCam.el)
          this.attr({"oriX":"0%","oriY":"0%"});

         //carrego os Objetos basicos
          this.loadLago();
          this.bindAll();



      },


      loadLago: function(){
          var _that = this;
          this.paperLayer = new vtl.Raphael(null,0,0,'100%','100%',"lago-layer-raphael","#lago-layer").callback(_that.lagoLoaded,_that).attr({url:VTL_MODELS+"mapa_final.svg"});

       //   this.mapa = Crafty.e("2D, DOM, Raphael").attr({oriW: 2057, oriH: 1865,w: 2057, h: 1865}).importSVG(VTL_MODELS+"mapa_final.svg").callback(_that.lagoLoaded,_that);

         // this.grupoSetLago =  this.mapa.getSets();
         // this.grupoSetLago["lago"].mouseover(alert("lago"));
       //   this.catedral = Crafty.e("2D, DOM, Raphael").attr({x: 780, y: 1027,w:50,h:50}).importSVG(VTL_MODELS+"catedral.svg");
       //
                 //aplico mais uma camada para controlar o rotation

      },


      getPaper : function(){ // retorno o paper do raphael
            return this.paper;
      },





      vEV_GOOGLE_MAPS:function(){

          this.gmaps = (this.gmaps == true ) ? false : true;

          if(this.gmaps){
            this.grupoSetLago["rua"].hide();
          }else{
            this.grupoSetLago["rua"].show();
          }

       },


      vEV_MOUSE_DRAG: function(data){
   //     this.attr(data); // sempre que atribuo um attr, ele chama o updateInterno Automaticamente
       // this.updateInterno(data);
      },


      vEV_MOVE_STEP: function(data){
        this.attr(data);
        //this.updateInterno(data); // sempre que atribuo um attr, ele chama o updateInterno Automaticamente
      },


      vEV_MOVE_START: function(data){
        this.attr(data);
        //this.updateInterno(data); // sempre que atribuo um attr, ele chama o updateInterno Automaticamente
      },

      vEV_MOVE_END: function(data){
        this.attr(data);
        //this.updateInterno(data); // sempre que atribuo um attr, ele chama o updateInterno Automaticamente
      },


      updateInterno:function(){

        this._super();

        vtlTrigger("vEV_LAGO_LAYER_UPDATE","");

          TweenMax.set(this.rotationCam.el,{css:{rotation:(this._rotation+"deg")}});
        try{
       //   TweenMax.set(this.el,{css:{left:this._x,top:this._y,width:this._w,height:this._h,scale:this._z, transformOrigin:"0 0"}});


        }catch(e){
          //console.log(e);
        }
      },



      update:function(pt){

        // console.log(pt);
          //this.camerael.attr("style",("-webkit-transform: translate3d("+pt.x+"px, "+pt.y+"px, 0px)"));

         // this.camerael.attr("style",("-webkit-transform: translate("+pt.x+"px, "+pt.y+"px)"));

          TweenMax.to(this.el,0,{css:{x:pt.x,y:pt.y,scale:pt.z, transformOrigin:"0 0"},ease:Sine.easeOut});

      },




      lagoLoaded:function(objeto){

           this.grupoSetLago =  objeto.getSets().groups;
           this.paper = objeto.getPaper();

          //crio um atributo com os grupos importados
           this.paper.groups =  this.grupoSetLago;

           //crio os objetos animados depois de 1 segundo
           setTimeout(this.createAnimationObjects,10);

           this.grupoSetLago["lagomouseevent"][0].attr({fill:"white",opacity:"0"}).mouseover(function(){console.log("entrou lago");});
           this.grupoSetLago["lagomouseevent"][0].mouseout(function(){console.log("saiu lago");});

           this.grupoSetLago["rua"].attr({fill:"#969796",opacity:"1.0"}).toBack();
            var rua = this.grupoSetLago["rua"];
            rua.opacidade = 0.06;

            vtlBind("vEV_ZOOM",function(data){
                var zf = vtlu.math.fromToInterpolation(0.36,1.2,0.02,0.06,data.z,true);//   amountOf(zoom, 0.36, 0.7);
                //var c = Color("#969796").darkenByRatio(zf).toCSS();
                if(zf != rua.opacidade){
                    rua.attr({opacity:zf,'fill':'white'});
                    rua.opacidade = zf;
                  }
            });

           vtlTrigger("vEV_APP_START",'');
           vtlTrigger("vEV_LAGO_LOADED",{paper:this.paper}); // Aviso que o lago foi carregado, ai outros podem usar o raphael paper dele etc
      },




      //anima objetos
      createAnimationObjects: function(){
           //faço um loop e vejo onde tem caminhos animados
           for (var grp in this.paper.groups) {
              if(/^animpath/.test(grp)){
                var a = grp.split("_"); // 0 - animapath  1- nome  2 - quantidade 3 -km/h
                var el = this.paper.groups[grp][0];


                  var pointsPath = el.getPoints();
                  for (var i = a[2]; i >= 0; i--) {
                        var obj = new vtlObjeto(a[1]);
                        window.objetosAnimados.push(obj);
                        obj.anima();
                        var kmh = parseInt(a[3],10);
                        obj.follow_path(pointsPath,kmh,0);
                  }
             }
            };
      },









      moveCameraTo: function(x,y,z,angle,vel,tox,toy){
          var that = this;
          if(this.camerael === undefined) this.camerael = $("#cr-stage>div");


          if(!z){
            z= 1;
          }
          var tostr = tox+"px "+toy+"px";

           //   TweenMax.killTweensOf($("#cr-stage>div"));

         // if(_.isElement($("#cr-stage>div")[0]))
           if (vel===0){
                setTimeout(function(){
                TweenMax.set(that.camerael,{css:{x:x,y:y,z:0,scale:z,rotation:angle}});
               },0);
            }else{
              setTimeout(function(){
                    TweenMax.to(that.camerael,vel,{css:{x:x,y:y,z:0,scale:z,rotation:angle},ease:Sine.easeOut,overwrite:"all"});
             },0);
          }
      },



      addPercurso: function(url){
         this.percursoM = new vtl.Percurso({url:url,callback:this.showPercurso,context:this}); //
         this.percursoM.setPaper(this.mapa.getPaper());
         return this.percursoM;

      },

       showPercurso: function(percurso){
      //   var strPercurso = "M";
      //   for (var i = 0; i < percurso._pointsCartesian.length; i++) {
      //     var p = percurso._pointsCartesian[i];
      //     strPercurso += p[0] + "," + p[1] + "L";
      //   }

      //   this.mapa.getPaper().path(strPercurso).attr({ stroke: "#D88518", 'stroke-dasharray': '- ','stroke-width': 1.0});
       }


});
//****************************
























































