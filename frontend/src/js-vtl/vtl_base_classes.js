

vtl = (window.vtl === undefined) ? {} : window.vtl;

vtl.vtlLoadedModels = {};
vtl.ControllersObjects = {};



//aqui salvo as configuracoes dos objetos que vou carregar
vtl.ObjetosResources = {
             barco:{fps:6,x:0,y:0,w:18,h:28,oxiX:"50%",oriY:"50%",url:"barco_simples_animado_sombra.svg"},
         //     sup:{x:0,y:0,w:40,h:28,url:"/themes/voltaaolago_theme/models/barco_simples_animado_sombra.svg"},
}



//var navigation = responsiveNav("#menu");

/////////////////////////////////////////////////
//  EVENTOS
/////////////////////////////////////////////////


//para facilitar dar os binds com um nome mais mio default bom
var vtlBind = PubSub.subscribe;
var vtlTrigger = PubSub.publish;
var vtlbindAll = PubSub.subscribeAnObject;
var Color = net.brehaut.Color;

function vtlBindScope(eveName,callback,scope){
  scope = scope || window;
  PubSub.subscribe(eveName,function(msg,data){
        callback.call(scope,data);
  });
}




var vEV_MOUSE_DOWN = "vEV_MOUSE_DOWN";
var vEV_MOUSE_DRAG = "vEV_MOUSE_DRAG";
var vEV_MOUSE_UP = "vEV_MOUSE_UP";
var vEV_MOUSE_OVER = "vEV_MOUSE_OVER";
var vEV_MOUSE_OUT = "vEV_MOUSE_OUT";
var vEV_MOUSE_WHELL = "vEV_MOUSEWHELL";

// ocorre sempre que muda x, y, z alpha, rotation
var vEV_MOVE_START = "vEV_MOVE_START";
var vEV_MOVE_STEP = "vEV_MOVE_STEP";
var vEV_MOVE_END = "vEV_MOVE_END";

// ocorre sempre que muda x, y, z alpha, rotation
var vEV_ANIMATION_START = "vEV_MOVE_START";
var vEV_ANIMATION_STEP = "vEV_MOVE_STEP";
var vEV_ANIMATION_END = "vEV_MOVE_END";


// ocorre quando altera o z
var vEV_ZOOM_START = "vEV_ZOOM_START";
var vEV_ZOOM_STEP = "vEV_ZOOM_STEP";
var vEV_ZOOM_END = "vEV_ZOOM_END";


// eventos de CONTEUDO
var vEV_PAGE_LOAD;
var vEV_PAGE_LOAD_START;
var vEV_PAGE_LOAD_END;
var vEV_PAGE_LOAD_SHOW;
var vEV_PAGE_LOAD_HIDE;




var vEV_RESIZE = "vEV_RESIZE";
var vEV_CARREGOU = "carregou";
var vEV_APP_START = "vEV_APP_START";
var vEV_CONTEUDO_LOAD = "vEV_CONTEUDO_LOAD";
var vEV_CONTEUDO_READY = "vEV_CONTEUDO_READY";
var vEV_CONTEUDO_MOSTRA = "vEV_CONTEUDO_MOSTRA";
var vEV_MENU_CLICKOU = "vEV_MENU_CLICKOU";
var vEV_MENU_CHEGOU = "vEV_MENU_CHEGOU";
var vEV_FERRAMENTA_SELECIONADA = "ferramenta selecionada";
var vEV_MODO_MENU = "vEV_MODO_MENU";
var vEV_MODO_NAVEGACAO = "vEV_MODO_NAVEGACAO";

var vEV_CENTER_VIEW_IN_POINT = "vEV_CENTER_VIEW_IN_POINT";
var vEV_ZOOMOUT_ACTION = "vEV_ZOOMOUT_ACTION";
var vEV_ZOOMIN_ACTION = "vEV_ZOOMIN_ACTION";
var vEV_ZOOM_BOUNDS = "vEV_ZOOM_BOUNDS";
var vEV_PERCURSO_LOADED = "vEV_PERCURSO_LOADED";




//click MouseEvent  Fired when the user clicks (or taps) the map.
//dblclick    MouseEvent  Fired when the user double-clicks (or double-taps) the map.
//mousedown   MouseEvent  Fired when the user pushes the mouse button on the map.
//mouseup     MouseEvent  Fired when the user pushes the mouse button on the map.
//mouseover   MouseEvent  Fired when the mouse enters the map.
//mouseout    MouseEvent  Fired when the mouse leaves the map.
//mousemove   MouseEvent  Fired while the mouse moves over the map.
//contextmenu MouseEvent  Fired when the user pushes the right mouse button on the map, prevents default browser context menu from showing if there are listeners on this event.
//focus Event Fired when the user focuses the map either by tabbing to it or clicking/panning.
//blur  Event Fired when the map looses focus.
//preclick    MouseEvent  Fired before mouse click on the map (sometimes useful when you want something to happen on click before any existing click handlers start running).
//load  Event Fired when the map is initialized (when its center and zoom are set for the first time).
//viewreset   Event Fired when the map needs to redraw its content (this usually happens on map zoom or load). Very useful for creating custom overlays.
//movestart   Event Fired when the view of the map starts changing (e.g. user starts dragging the map).
//move  Event Fired on any movement of the map view.
//moveend     Event Fired when the view of the map ends changed (e.g. user stopped dragging the map).
//dragstart   Event Fired when the user starts dragging the map.
//drag  Event Fired repeatedly while the user drags the map.
//dragend     Event Fired when the user stops dragging the map.
//zoomstart   Event Fired when the map zoom is about to change (e.g. before zoom animation).
//zoomend     Event Fired when the map zoom changes.
//autopanstart      Event Fired when the map starts autopanning when opening a popup.
//layeradd    LayerEvent  Fired when a new layer is added to the map.
//layerremove LayerEvent  Fired when some layer is removed from the map.
//baselayerchange   LayerEvent  Fired when the base layer is changed through the layer control.
//locationfound     LocationEvent     Fired when geolocation (using locate method) went successfully.
//locationerror     ErrorEvent  Fired when geolocation (using locate method) failed.
//popupopen   PopupEvent  Fired when a popup is opened (using openPopup method).
//popupclose  PopupEvent  Fired when a popup is closed (using closePopup method).






/////////////////////////////////////////////////
//  variavel
/////////////////////////////////////////////////

var VTL_DEBUG_MODE = true;
var VTL_TIMELINE = new TimelineMax();

var VTL_MODELS = CCM_REL+"/themes/voltaaolago_theme/models/";

var _SCALEMAP = 1686 / 16113;
var _XMOVEMAPA = +558075 + 186 + 186;
var _YMOVEMAPA = 185356 - 39;

//salvo alguns valores do director globalmente, para facilitar acessos
var _VTLZOOM = 1;
var _VTLX = 0;
var _VTLZ = 0;

vtl = vtl || {};

var vtl_cor_azul = '#22718f';
var vtl_cor_laranja = '#22718f';
var vtlAppCrt;
var vtlMapaCrt;



vtl_W = 2057;
vtl_H = 1865;


var _VTL_MARKERS;






vtl.EventClass = Class.extend({

      _lastUpdate:0,
      _timeoutTemp:undefined,
      init:function(){
      //registro para chamadas automaticas de funcoes relacionadas aos eventos

        _that = this;
        this.updateth = _that.updateInterno;
      },

      // msg ou é vazio, ou o nome de uma ou mais funcoes, separados por espaco, (com o nome dos eventos) para subscrever
      bindAll: function(msg){
          msg = msg || "";
          PubSub.subscribeAnObject(this,msg);
      },

      unbindAll: function(){
            PubSub.unsubscribeAnObject(this);
      },


      attr: function(obj,update){
        update = update || true;
        for(at in obj){
          try{
              this[("_"+at)] = obj[at];
          }catch(e){};
        }
        if(update) this.markForUpdate();

        return this;
      },


      markForUpdate: function(){
      //  this.updateInterno();
       //// window.clearTimeout(this._timeoutTemp);
        //this._timeoutTemp = setTimeout(this.updateInterno,31);

        var atual = new Date().getTime();
        if((this._lastUpdate + 40) < atual ){
          this._lastUpdate = atual;
          this.updateInterno();
         // window.clearTimeout(this._timeoutTemp);
        }
      },


      //funcao chamada quando qualquer atributo é modificado
      updateInterno: function(){
        return true;
      },


      defineGetSetter: function(name,intVal,func){
        //crio um com o nome do attributo mesmo
        this[name] = function(val){
              if (arguments.length === 0) {
                  return this[intVal];
               } else {
                  this[intVal] = val;
                  if(typeof func === "function"){
                    func.call(this);
                  }
                  return this[intVal];
               }
         };
         //crio outro com o set, para evaluacoes mais rapidas, para usar com o tween
         this[("set"+name)] = function(val){
              if (arguments.length === 0) {
                  return this[intVal];
               } else {
                  this[intVal] = val;
                  this.updateInterno();
                  return this[intVal];
               }
         };


      },

    throttle:function(func,delay){
        var that = this;
        return _.throttle(function(){func.call(that)},delay);
    }

});







//so temporario para nao da erro nos ooutros, apagar
 vtl.Layers =  vtl.EventClass.extend({


});






//************ Classe Basicas de elementos em 2D
//****************************

vtl.e2D =  vtl.EventClass.extend({
    _x: 0,
    _y: 0,
    _z: 1,
    _ox:0,
    _oy:0,
    _oriX:"50%",
    _oriY:"50%",
    _w: 0,
    _h: 0,
    _zIndex:1, // null = automatic calculate
    _zIndexOffset:1,
    _opacity:1,
    _rotation:0,
    _visible:1,
    _dirty:0,   //dirty é quando o objeto não esta visivel

    init: function(){
      this.defineGetSetter("x","_x",this.markForUpdate);
      this.defineGetSetter("y","_y",this.markForUpdate);
      this.defineGetSetter("z","_z",this.markForUpdate);
      this.defineGetSetter("w","_w",this.markForUpdate);
      this.defineGetSetter("h","_h",this.markForUpdate);
      this.defineGetSetter("opacity","_opacity",this.markForUpdate);
      this.defineGetSetter("rotation","_rotation",this.markForUpdate);
      this.defineGetSetter("zIndex","_zIndex",this.markForUpdate);
  },

  updateInterno:function(){

          if(this._dirty == 1 || this._visible == 0){

            return false;
         }

        return true;
  },

  getMapaCrt:function(){
      return vtl.ControllersObjects["MapaController"] || false;

  },


});

//****************************







//************ CRIA DIV/DOM
//****************************
vtl.dom = vtl.e2D.extend({
     name:"dom",
    _pai:null,
    _flipY:1,
    _useXY:false,
    _id:null,
    el:null,
    _el:null,


    init: function(x,y,w,h,id,pai){
      this._super();
      this.x(x);
      this.y(y);
      this.w(w);
      this.h(h);
      this._id = id;
      this.el = $('<div></div>').attr({'id':id,class:'e2d'}).css({position:'absolute'});
      this._el = this.el[0];

      if(pai === undefined){
        pai = 'body';
      }

      this.append(pai);
      this.updateOrigemPos();
      this.updateDom();

    },


    attr:function(obj){
      if("oriX" in obj || "oriY" in obj){
          this._oriX = ("oriX" in obj) ? obj.oriX : this._oriX;
          this._oriY = ("oriY" in obj) ? obj.oriY : this._oriY;
          this.updateOrigemPos();
      }
      if("visible" in obj){
        if(obj.visible===0) this.hide(); else this.show();
      }

      this._super(obj);

      return this;
    },

    updateOrigemPos: function(){

        if(! /%/.test(this._w)){
                    this._ox = /%/.test(this._oriX) ? this._w*parseInt(this._oriX,10)/100 : parseInt(this._oriX,10);
        }

        if(! /%/.test(this._h)){
              this._oy = /%/.test(this._oriY) ? this._h*parseInt(this._oriY,10)/100 : parseInt(this._oriY,10);
        }
    },


    updateInterno:function(){

        if(this._dirty == 1 || this._visible == 0){

            return false;
        }

         if(this.el == null) return false;

         if(this._zIndex == null){
           var zIndex = (this._zIndexOffset+this._y);
         }else{
            var zIndex = this._zIndex;
         }

         this._el.style.zIndex = parseInt(zIndex);
         this.el.transform({translate:[(this._x-this._ox)+"px",(this._y-this._oy)+"px"],rotate:this._rotation+"deg",scaleY:this._flipY*this._z,scaleX:this._z, origin:[this._oriX,this._oriY]});

         return true;
       //   try{
         //   TweenMax.set(this.el,{css:{x:(this._x-this._ox),y:(this._y-this._oy),width:this._w,height:this._h,rotation:this._rotation,scaleX:this._z,scaleY:(this._flipY*this._z),zIndex:this._zIndex,transformOrigin:(this._oriX+" "+this._oriY)}});
         //   this.el.css({"zIndex":parseInt(this._zIndex,10)});
        //  }catch(e){
            //console.log(e);
         // }
    },


    vEV_ANIMATION_STEP:function(obj){
      this._x = obj.x;
      this._y = obj.y;
      this._z = obj.z;
      this.updateInterno();
     // this.el.transform({translate:[(this._x-this._ox)+"px",(this._y-this._oy)+"px"],rotate:this._rotation+"deg",scaleY:this._flipY*this._z,scaleX:this._z, origin:[this._oriX,this._oriY]});
  },

    inViewPort:function(){
       ww = $(window).width();
       wh = $(window).height();
       var hidden = false;
       var rr = true;

       if(this.el.css('display')=='none'){
          hidden = 1;
          this.el.css({'display':'block',opacity:0});
       }

       var bb = this._el.getBoundingClientRect();
       if((bb.left+bb.width)>0 && (bb.right)<ww && (bb.top+bb.height)>0 && bb.bottom<wh){
          rr = true;
       }else{
          rr = false;
       }

       if(hidden) this.el.css({'display':'none',opacity:1});
       return rr;
      //this._markerL.attr({x:pos.left-this.opt.ox,y:pos.top-this.opt.oy});
  },



    updateDom:function(){
         TweenMax.set(this.el,{css:{x:this._x,y:this._y,width:this._w,height:this._h}});
    },


    dirty:function(){
      this._dirty = 1;
      this.el.css('display', 'none');
  },

   undirty:function(){
      this._dirty = 0;
      this.el.css('display', 'block');
   },



    html:function(html){
      this.el.html(html);
      return this;
    },

    text:function(html){
      this.el.text(html);
      return this;
    },


    css:function(obj){
      this.el.css(obj);
      return this;
    },

    class:function(obj){
      this.el.addClass(obj);
      return this;
    },

    append:function(selector){
      this.el = this.el.appendTo(selector);
      return this;
    },

    div:function(){
      return this.el;
    },

      show:function(){
      this._visible = 1;
      this.el.css('display', 'block');
      return this;
   },

   hide:function(){
      this._visible = 0;
      this.el.css('display', 'none');
      return this;
  },


    vEV_ENABLE_GPU: function(){
        this.el.addClass("gpu");

    },

    mouseover:function(func){
      this.el.mouseover(function(e){func.call(_this,e)});
      return this;
    },
    mouseout:function(func){
       this.el.mouseout(function(e){func.call(_this,e)});
       return this;
    },
    mousemove:function(func){
      this.el.mousemove(function(e){func.call(_this,e)});
       return this;
    },
    click:function(func){
        this.el.click(function(e){func.call(_this,e)});
       return this;
    },
    bind:function(ev,func){
        this.el.bind(ev,function(e){func.call(_this,e)});
       return this;
    },



    remove:function(){
      this.el.remove();
    },



    //animações
    follow_path:function(pointsObj,kmHora,offsetObj){

       //offsetPoints
       var offpoints = offsetObj || 1.5;
       var offsetDist = offpoints*this._h;

       //offsetDist = 15;
       var randPoints = [];
       for (var i = 0; i < pointsObj.length; i++) {
            var p = pointsObj[i];
             var xx = p.x + vtl.Util.math.randomNumber(-offsetDist,offsetDist);
             var yy = p.y + vtl.Util.math.randomNumber(-offsetDist,offsetDist);
            randPoints.push({xx:parseInt(xx),yy:parseInt(yy)});
       }

      // pointsObj = randPoints;
       var dist = 0;
       for (var i = 1; i < pointsObj.length; i+=2) {
         var p1 = pointsObj[i-1];
         var p2 = pointsObj[i];
         dist += vtl.Util.math.distance(p1.x,p1.y,p2.x,p2.y);
       };

       //100pixel vale 1km no zoom 14;
       var distInKm = dist/110;
       var horaTotal = distInKm/25;
       var tempo = horaTotal*60*60;


         var _that = this;
        // var lp = randPoints[randPoints.length-1];
        // this.xx = this._x,
        // this.yy = this._y;
        // VTL_TIMELINE.add(
        //   TweenMax.fromTo(_that, tempo, {xx:randPoints[0].x,yy:randPoints[0].y},{xx:lp.x,yy:lp.y,
        //   onUpdateScope:_that,
        //   onUpdate:function(){
        //       this._flipY = this._rotation<-90 || this._rotation > 90 ? -1 : 1;
        //       this._x = this.xx;
        //       this._y = this.yy;
        //       this.updateInterno();
        //       //TweenMax.set(this._el,{x:this.xx,y:this.yy});
        //   },
        //   ease:"Linear.easeNone",
        //   yoyo:true,
        //   immediateRender:true,
        //   repeat: -1 }),
        // 0);



        //****************************  Utilizo o elemento direto, pois aumenta muito a performance, ao inves de usar o objeto
        this.xx = this._x,
        this.yy = this._y;
        this.rr = this._rotation;
        VTL_TIMELINE.add(
          TweenMax.fromTo(_that, tempo, {xx:randPoints[0].xx,yy:randPoints[0].yy},{bezier:{type:"thru",timeResolution:0,curviness:0, values:randPoints,autoRotate:["xx","yy","rr",0,false]},
          onUpdateScope:_that,
          onUpdate:function(){
              //this._flipY = this._rotation<-90 || this._rotation > 90 ? -1 : 1;
              this._flipY = this.rr<-90 || this.rr > 90 ? -1 : 1;
            //  console.log(this._rotation);
              this._x = this.xx;
              this._y = this.yy;
              this._rotation = this.rr;

               this.markForUpdate();

              //TweenMax.set(this.el,{rotation:this.el.rotatioon,scaleY:(this._flipY*this._z),zIndex:this._zIndex,transformOrigin:(this._oriX+" "+this._oriY)});
             // this._zIndex = parseInt(this._y+5000);
              //this.updateInterno();
             // this._el.transform= ""

           //  this.el.transform({translate:[this._x+"px",this._y+"px"],rotate:this.rotationn+"deg",scaleY:this._flipY});

             //this.el.css('transform', ('translate('+this._x+'px, '+this._y+'px) rotate('+this.rotationn+'deg) scale('+this._z+','+(this._z*this._flipY)+') '));

            //   TweenMax.set(this._el,{top:0,left:0,y:(this.yy),x:(this.xx),zIndex:this._zIndex,transformOrigin:(this._oriX+" "+this._oriY),rotation:this.rotationn+"deg",scaleY:this._flipY*this._z});
          },
          ease:"Linear.easeNone",
          yoyo:true,
          immediateRender:true,
          repeat: -1 }),
        0);


        return this;


      //em que lugar eu addo, zero pois roda tudo paralelo
      //  VTL_TIMELINE.add(TweenMax.fromTo(_that.barcos[i].pos, 200, {css:{x:xx,y:yy}},{bezier:{type:"soft", values:[{x:(xx+400+(Math.random() * 10)), y:yy+20+(Math.random() * 30)}, {x:(xx+110+(Math.random() * 10)), y:(yy+40+(Math.random() * 40))}, {x:(xx), y:(yy+80+(Math.random() * 10))}, {x:xx, y:yy}],autoRotate:["x","y","rotation",0,false]},
      //     onUpdateScope:_that.barcos[i],
      //     onUpdate:function(){
      //           scaleY = this.pos.rotation<-90 || this.pos.rotation > 90 ? -1 : 1;
      //           TweenMax.set(this._element,{css:{x:this.pos.x,y:this.pos.y,rotation:(this.pos.rotation),scaleY:scaleY,transformOrigin:"50% 50%"}});
      //     },
      //     ease:"Linear.easeNone",
      //     yoyo:true,
      //     immediateRender:true,
      //     repeat: -1 }), 0);
      // }
    },

});





//************ CRIA LatLng
//****************************
LatLng = Class.extend({
  name:"LatLng",
  _lat:0,
  lat:0,
  lng:0,
  _lgt:0,
  _x:0,
  _y:0,
  _dist:0,
  _ele:0,

  init:function(a,b){
    this._lat = parseFloat(a);
    this._lgt = parseFloat(b);
    this.lat = this._lat;
    this.lng = this._lgt;
    var pxy = vtl.Util.toMercator(this._lat,this._lgt);
    this._x = pxy[0];
    this._y = pxy[1];
    return this;
  },
  xy:function(a,b){
    this._x = parseFloat(a,10);
    this._y = parseFloat(b,10);
    var pxy = vtl.Util.inverseMercator(a,b);
    this._lat = parseFloat(pxy[0]);
    this._lgt = parseFloat(pxy[1]);
    this.lat = this._lat;
    this.lng = this._lgt;
    return this;
  },

  latlon:function(a,b){
    this.init(a,b);
  }
});










//************ CRIA Marker
//****************************
vtl.Marker = vtl.e2D.extend({
  //é criado um div no lago layer que vamos usar como referencia para capturar a posicao
  // assim podemos aplicar rotacoes, 3d etc e pegamos o xy de maneira facil. :)
   name:"Marker",
  _this:this,
  _layerPaiId : "#lago-layer",
  _refLayer : null,
  _options : {  canScale:0,
                text:"1",
                css:{paddingTop:'15px'},
                cssInterno:{'color':'white',paddingTop:'15px','textAlign':'center'},
                zoomMax:1.8, //o maximo que 0o marker pode aumentar,
                             //lembrando que se o canScale for 0, o marker precisa aumentar/diminuir para visualmente ficar do mesmo tamanho
                zoomOffset:0.0, //quanto a mais ou a meno diminuo a scala normal
                zoomMin:0, // o minimo que posso diminuir
                zoomVisibleMin:0,
                zoomVisibleMax:10,
                w:26,h:47,sw:42,sh:33,ox:13,oy:47,sox:42,soy:10,image:VTL_MODELS+"marker_km.svg",shadow:VTL_MODELS+"marker_km_shadow.png"},

  _markerL: null,
  _shadowL: null,
  _refL:null,  //layer no lago que capturo a posicao
  _latlng:null,

  zoomStepTh: function(){},

  init:function(latlng, options){

    var _this = this;
    this._super();

    this.bindAll();
    this._latlng = latlng;
    this.pp = this._latlng;

    this.opt = $.extend({},this._options,options);
    this._options = this.opt;

    this._x=this.pp._x;
    this._y=this.pp._y;
    this._w=this.opt.w;
    this._h=this.opt.h;



    if(/\.(png||jpg)$/i.test(this.opt.image)){
       this._markerL = new vtl.dom(0,0,this.opt.w,this.opt.h,"",this._layerPaiId).css({'textAlign':'center','background':'url("'+this.opt.image+'") no-repeat'}).css(this.opt.cssInterno).css(this.opt.css).text(this.opt.text);
    } else  if(/\.svg$/i.test(this.opt.image)){
       this._markerL = new vtl.Raphael(null,0,0,this.opt.w,this.opt.h,"",this._layerPaiId).attr({fill:0,url:this.opt.image}).css(this.opt.cssInterno).css(this.opt.css).text(this.opt.text).callback(this.loaded,this);
    }

    this._shadowL = new vtl.dom(this._x,this._y,this.opt.sw,this.opt.sh,"",this._layerPaiId).html("<img src='"+this.opt.shadow+"' />");


    this._markerL.attr({x:this._x,y:this._y,oriX:this.opt.ox+"px",oriY:this.opt.oy+"px",zIndex:null,zIndexOffset:300}).updateInterno();
    this._shadowL.attr({x:this._x,y:this._y,oriX:this.opt.sox+"px",oriY:this.opt.soy+"px",zIndex:null,zIndexOffset:100}).class('shadow').updateInterno();

   // this._refL = new vtl.dom(this.pp._x,this.pp._y,1,1,"","#lago-layer").html("");
    //_VTL_MARKERS.push(this);
    this.el = [this._markerL._el,this._shadowL._el];
    this.el  = $(this.el);


    this.zoomStepTh = _.throttle(_this._zoomStep,500);


   _this._zoomStep({z:this._z});
   this.updateInterno();
   return this;

  },


  attr:function(obj){
     if("visible" in obj){
      if(obj.visible===0) this.hide(); else this.show();
    }
    this._super(obj);
    return this;
  },


  updateInterno:function(){
      if(this._visible == 0 || this._dirty == 1 ){
        return false;
      }
      this._markerL.attr({x:this._x,y:this._y,z:this._z});
      this._shadowL.attr({x:this._x,y:this._y,z:this._z});
      return true;
  },

   updateInternoFast:function(){
     if(this._dirty == 1 || this._visible == 0){
            return false;
      }
      this._markerL.attr({x:this._x,y:this._y,z:this._z},false).updateInterno();
      this._shadowL.attr({x:this._x,y:this._y,z:this._z},false).updateInterno();
   },

   immediateUpdate:function(){
    this.updateInterno();
    this._markerL.updateInterno();
    this._shadowL.updateInterno();
   },


  inViewPort:function(){
    return this._markerL.inViewPort();
  },

  anima:function(fps){
    this._markerL.anima(fps);
    return this;

  },

  show:function(){
      this._visible = 1;
      this.el.css('display', 'block');
      this.updateInterno();

      return this;
  },

  hide:function(){
      this._visible = 0;
      this.el.css('display', 'none');
      this.updateInterno();

      return this;
  },


  //call when sgv is loaded
  loaded:function(){


  },



  drop:function(delay){
    var d = delay || 0;
    this.show();
    // TweenMax.fromTo(this,1,{x:(this._x-200)},{x:this._x,delay:d,ease:Back.easeOut});
    TweenMax.fromTo([this._markerL,this._shadowL],0.1,{sety:this._y-100,setz:0},{sety:this._y,setz:this._z,delay:d,immediateRender:true,ease:Bounce.easeOut});
  },


    mouseover:function(func){
      var _this = this;
      this._markerL.el.mouseover(function(e){func.call(_this,e)});
      return this;
   },
    mouseout:function(func){
         var _this = this;
       this._markerL.el.mouseout(function(e){func.call(_this,e)});
       return this;
    },
    mousemove:function(func){
       var _this = this;
      this._markerL.el.mousemove(function(e){func.call(_this,e)});
      return this;
    },
    click:function(func){
         var _this = this;
        this._markerL.el.css({"cursor":"pointer"});
        this._markerL.el.click(function(e){func.call(_this,e)});
        return this;
    },

    bind:function(ev,func){
         var _this = this;
        this.el.bind(ev,function(e){func.call(_this,e)});
       return this;
    },


    dirty:function(){
        this._dirty = 1;
        this.el.css('display', 'none');
    },
    undirty:function(){
        this._dirty = 0;
        this.el.css('display', 'block');
    },


    remove:function(){
      this._markerL.remove();
      this._shadowL.remove();
    },


    vEV_ZOOM_START: function(data){
      //  this.hide();
      //  this._shadowL.hide();
    },



  // vEV_ANIMATION_STEP:function(obj){
//this._zoomStep(obj)
      // this.el.transform({translate:[(this._x-this._ox)+"px",(this._y-this._oy)+"px"],rotate:this._rotation+"deg",scaleY:this._flipY*this._z,scaleX:this._z, origin:[this._oriX,this._oriY]});
  // },


     vEV_ZOOM_STEP: function(data){
          this._ztemp = data.z;
          if(this.opt.zoomVisibleMin > data.z || this.opt.zoomVisibleMax < data.z){
            if(this._dirty == 0 && this._visible == 1){
              this.dirty();
              this.updateInternoFast();
            }
          }else{
             if(this._dirty == 1 && this._visible == 1){
               this.undirty();
               this._zoomStep(data);
               this._dirty = 0;
               this.updateInternoFast();
            }
          }
          //this.zoomStepTh();
       // this.show();
    },



    _zoomStep: function(data){
        var zz = this.opt.canScale ? 1 : 1/data.z;
        zz += (this.opt.zoomOffset/data.z);
        zz = vtl.Util.math.clamp(zz,this.opt.zoomMin,this.opt.zoomMax);
        this._z = zz;
        this.updateInternoFast();
    },

    vEV_ZOOM_END: function(data){
        this._zoomStep(data);
    },



    vEV_ANIMATION_START :function(data){
        this.dirty();
    },

    vEV_ANIMATION_END: function(data){
    //  console.log(data);
        this.undirty();
        this._zoomStep(data);
    },

    vEV_ANIMATION_STEP: function(data){
      //  this.vEV_ZOOM_STEP(data);
    },


});












//************ CRIA POPUPINFO
//****************************


vtl.infoWindow = vtl.Marker.extend({
  name:"infoWindow",
  _layerPaiId : "#htmlLayer",
  _elPai:null,
  _callBackfuncs:[],
  _options : {  canScale:0,
                text:"1",
                css:{paddingTop:'5px'},
                cssInterno:{'color':'white',paddingTop:'15px','textAlign':'center'},
                zoomMax:12.0, //o maximo que 0o marker pode aumentar,
                             //lembrando que se o canScale for 0, o marker precisa aumentar/diminuir para visualmente ficar do mesmo tamanho
                zoomOffset:1, //quanto a mais ou a meno diminuo a scala normal
                zoomMin:0, // o minimo que posso diminuir
                zoomVisibleMin:0,
                zoomVisibleMax:10,
                w:230,h:232,sw:343,sh:130,ox:115,oy:240,sox:260,soy:-10,image:VTL_MODELS+"blank.png",shadow:VTL_MODELS+"popupinfo-shadow.png"},


  init:function(latlng, options){

      this._elPai = $((""+this._layerPaiId));

      latlng = latlng || new LatLng(0,0);
      latlg = this.getLatLgFromObject(latlng); //pego a latitude caso seje de um objeto

      //crio qual vai ser minha referencia de posicao no mapa
      this._refL = new vtl.dom(latlng._x,latlng._y,1,1,"","#lago-layer").html("");
      this._super(latlng, options);
      //crio a estrutura do popup que contem o html
      this._markerL.attr({zIndex:null,zIndexOffset:500}).html("<div id='popupinfo'><div id='popupinfo-content'></div></div><div id='popinfo-arrow'></div><div id='popinfo-close'><i class='icon-close icon'></i>x</div>");
      this._shadowL.attr({zIndex:null,zIndexOffset:100}).css({'pointerEvents':'none'});

      this._conteudoL = this._markerL.el.find("#popupinfo-content");


      var _that = this;
      this._markerL.el.find("#popinfo-close").click(function(){
          _that.close();
      });

      //this.hide();
      this.updateInterno();
      return this;
  },

  html:function(code){
      this._conteudoL.html(code);
      return this;
  },

  updateInterno:function(){
     if(this._visible == 0 || this._dirty == 1 ){
        return false;
      }
      //pego a posicao do referencia
      var pos = this._refL.el[0].getBoundingClientRect();
      var ppai = this._elPai.offset();
      var xx = pos.left - ppai.left;
      var yy = pos.top - ppai.top;

      this._markerL.attr({x:xx,y:yy});
      this._shadowL.attr({x:xx,y:yy});
      return true;
  },

  immediateUpdate:function(){
    this.updateInterno();
    this._markerL.updateInterno();
    this._shadowL.updateInterno();
  },



  //uso a observacao do lago layer, ao inves do vEV_MOVE_STEP, pois preciso que o lago primeiro se atualize,
  // para a posicao do layer que deixei la
   vEV_LAGO_LAYER_UPDATE:function(){
    this.updateInterno();
   },


  show:function(){
      this._visible = 1;
      this.el.css('display', 'block');
      this.immediateUpdate();
      TweenMax.fromTo([this._markerL,this._shadowL],0.4,{setz:0.1},{setz:1,immediateRender:true,ease:Back.easeOut});
      return this;
  },

  getLatLgFromObject:function(latlg){

       if(latlg !== undefined){
        //se for um marker
        if(latlg.name == "Marker"){

            var zz = latlg._z;

            latlg = new LatLng(0,0).xy(latlg._x-latlg._ox+((latlg._w/2)*zz),latlg._y-latlg._oy-((latlg._h/2)*zz));
        };

      }
      return latlg;
  },

  setLatlg:function(latlg){

    this._latlng = latlg;
    this._refL.attr({x:this._latlng._x,y:this._latlng._y}).updateInterno();
  },

  open:function(latlg){
      latlg = this.getLatLgFromObject(latlg);
      this.setLatlg(latlg);
      this.show();
      return this;
  },

  onClose:function(func){
        this._callBackfuncs = func;
        return this;
  },


  runCallbacks: function(obj){
      this._callBackfuncs.call();
   },


  close:function(){
      TweenMax.to([this._markerL,this._shadowL],0.4,{setz:0,immediateRender:true,ease:Back.easeIn,onCompleteScope:this,onComplete:function(){
        this.hide();
        this.runCallbacks();
      }});
      return this;
  },


  hide:function(){
      this._visible = 0;
      this.el.css('display', 'none');
      this.updateInterno();
  },

  //so sobescrevo com uma funcao vazia para ignorar o padrao do marker class
  vEV_ZOOM_END:function(){

  },

   vEV_ANIMATION_STEP:function(obj){
    this.updateInterno();
    //   this._zoomStep(obj)
      // this.el.transform({translate:[(this._x-this._ox)+"px",(this._y-this._oy)+"px"],rotate:this._rotation+"deg",scaleY:this._flipY*this._z,scaleX:this._z, origin:[this._oriX,this._oriY]});
   },


    vEV_ANIMATION_START :function(data){

    },

    vEV_ANIMATION_END: function(data){

    },



});








//************ CRIA Marker
//****************************
vtl.MarkerPI = vtl.Marker.extend({

      _options : {  canScale:0,
                    text:"1",
                    css:{paddingTop:'5px'},
                    cssInterno:{'color':'white',paddingTop:'15px','textAlign':'center'},
                    zoomMax:2.0, //o maximo que 0o marker pode aumentar,
                                 //lembrando que se o canScale for 0, o marker precisa aumentar/diminuir para visualmente ficar do mesmo tamanho
                    zoomOffset:0.6, //quanto a mais ou a meno diminuo a scala normal
                    zoomMin:0, // o minimo que posso diminuir
                    zoomVisibleMin:0,
                    zoomVisibleMax:10,
                    w:30,h:51,sw:60,sh:18,ox:4,oy:48,sox:31,soy:6,image:VTL_MODELS+"marker_pi.svg",shadow:VTL_MODELS+"marker_pi_shadow.png"},





       vEV_ZOOM_STEP: function(data){
           this._super(data);
          //this._zoomStep(data);
    },

    vEV_ANIMATION_START :function(data){
    },

    vEV_ANIMATION_STEP: function(data){
        this._zoomStep(data);
    },

    vEV_ANIMATION_END: function(data){
        this._zoomStep(data);
    },


});










//************ CRIA RUNNER
//****************************
vtl.Runners = vtl.Marker.extend({
      gpx: undefined,
      _kmstart:0,
      _distAnt:0,
      _tempoAnt:0,
      _distPercorrida:0,
      _oxOri:25,
      _soxOri:32,
      _options : {  canScale:0,
                    gpxfile:null,
                    cor:"#ffffff",
                    nome:null,
                    largada:0,
                    chegada:0,
                    text:"1",
                    css:{paddingTop:'5px'},
                    cssInterno:{'color':'white',fontSize:'9px',lineHeight:'0.9',marginTop:'-25px','textAlign':'center'},
                    zoomMax:2.0, //o maximo que 0o marker pode aumentar,
                                 //lembrando que se o canScale for 0, o marker precisa aumentar/diminuir para visualmente ficar do mesmo tamanho
                    zoomOffset:1.5, //quanto a mais ou a meno diminuo a scala normal
                    zoomMin:0, // o minimo que posso diminuir
                    zoomVisibleMin:0,
                    zoomVisibleMax:10,
                    w:35,h:40,sw:35,sh:15,ox:25,oy:36,sox:32,soy:2,image:VTL_MODELS+"marker_runner.svg",shadow:VTL_MODELS+"marker_runner_shadow.svg"},

      // _options : {  canScale:0,
      //               text:"1",
      //               css:{paddingTop:'5px'},
      //               cssInterno:{'color':'white',paddingTop:'15px','textAlign':'center'},
      //               zoomMax:2.0, //o maximo que 0o marker pode aumentar,
      //                            //lembrando que se o canScale for 0, o marker precisa aumentar/diminuir para visualmente ficar do mesmo tamanho
      //               zoomOffset:0.6, //quanto a mais ou a meno diminuo a scala normal
      //               zoomMin:0, // o minimo que posso diminuir
      //               zoomVisibleMin:0,
      //               zoomVisibleMax:10,
      //               w:30,h:51,sw:60,sh:18,ox:4,oy:48,sox:31,soy:6,image:VTL_MODELS+"marker_runner.svg",shadow:VTL_MODELS+"marker_pi_shadow.png"},



    init: function(pp,options){
  
      
      if(options.offsetX > 0){
        
        this._options.ox = this._options.ox+options.offsetX;
        this._options.sox = this._options.ox+options.offsetX;
      }




      if(options.categoria.match(/60/g)){
          this._kmstart = 40;

      }

      // console.log(options)
      
      this._super(pp,options);


      // this._ref = new vtl.dom(this._x,this._y,this.opt.sw,this.opt.sh,"",this._layerPaiId).html("<img src='"+this.opt.shadow+"' />");


      //  this._ref.attr({x:this._x,y:this._y,oriX:this.opt.sox+"px",oriY:this.opt.soy+"px",zIndex:null,zIndexOffset:100}).class('shadow').updateInterno();


      var _this = this

      optsgpx = {async: true, func:"_carregouGPX",scope:_this}

      if (this.opt.largada != 0 ) optsgpx.clampByTimeStart = this.opt.largada
      if (this.opt.chegada != 0 ) optsgpx.clampByTimeEnd = this.opt.chegada


      //carrego gdb como gpx fo normato gdb/larrgada/chegada
    
      this.gpx = new vtl.GPX( this.opt.gpxfile ,optsgpx)


    },


    getTotalTime:function(){
        return this.gpx.get_total_time();
    },

    loaded:function(){
        var cor = this.opt.cor
        this._markerL._paper.importGroups.groups.preenchimento.attr({fill:cor,"stroke-width":"1","stroke-color":"black"});

        this.vEV_RUNNINGTIME_END(0);
    },

    _carregouGPX: function(gpx){
      this.gpx = gpx;


    },

    vEV_ZOOM_STEP: function(data){
           this._super(data);
          //this._zoomStep(data);
    },

    vEV_ANIMATION_START :function(data){
    },


    vEV_ANIMATION_STEP: function(data){
        this._zoomStep(data);
    },


    vEV_ANIMATION_END: function(data){
        this._zoomStep(data);
    },


    vEV_RUNNINGTIME_START: function(tempo){
        // this._markerL.attr({oriX:this._oxOri+"px"});
        // this._shadowL.attr({oriX:this._oxOri+"px"});
        this._distPercorrida = 0;
        this._distAnt=0
        this._tempoAnt=0
        this._distPercorrida=0
        this.tempoAntes = 0 
    },



    vEV_RUNNINGTIME_END: function(tempo){
       this._markerL.attr({oriX:this._options.ox+"px"});
       this._shadowL.attr({oriX:this._options.sox+"px"});


      var pttrecho = this._options.percursoAtual.gpx._getPointInKm(this._kmstart);


      this.setx(pttrecho._x)
      this.sety(pttrecho._y)
      this._markerL.text("");


      this.immediateUpdate();

    },



    vEV_RUNNINGTIME_CHANGE: function(tempo){


     // if(this._options.sox != this._soxOri)this._options.sox = this._soxOri;

      //acho a minha posicao no tempo que estou

      //pego o ponto do meu pgx baseado no tempo da corrida que estyamos
      var pt = this.gpx._getPointInTime(tempo);

    // console.log(pt);
      //pego o kmatual que devo estar
      var kmatual = (pt._dist+(this._kmstart*1000))

      
      // se o km é maior que o percurso, cheguei ao final
      // 

      // console.log(kmatual);
      // console.log(this._options.percursoAtual.gpx.get_distance());


      if(kmatual > this._options.percursoAtual.gpx.get_distance()){

        this._markerL.text("chegou");
        return false;

      }

        var pttrecho = this._options.percursoAtual.gpx._getPointInKm((pt._dist+(this._kmstart*1000))/1000);

       



      if(!this._distPercorrida)this._distPercorrida = pt._dist;
           if(!this.tempoAntes)this.tempoAntes = tempo;

      //ignoro os erros de gps, ignorando voltas
      if(this._distPercorrida <= pt._dist || tempo < this.tempoAntes){
        

        if(this._x > pttrecho._x ){

                this._markerL.attr({w:-this._w});
                this._shadowL.attr({w:-this._w});


        }

        this.setx(pttrecho._x)
        this.sety(pttrecho._y)


        
        var deltaMin = ((pt._runtime-this._tempoAnt)/1000)/60
        var deltaDist = (pt._dist-this._distAnt)/1000
        var pace = deltaMin/deltaDist;

        this._distPercorrida = pt._dist;
        this.tempoAntes = tempo;

        this.atualizaProximoPonto(tempo)
      }


      //quer dizer que voltei no percurso
      if(this._distAnt > pt._dist){
        this._distAnt = 0;
      } 



      if(deltaDist>0.3){
          this._distAnt=pt._dist
          this._tempoAnt=pt._runtime
          var paceMin = pace.toFixed(0)
          var paceSeg = ((-paceMin+pace.toFixed(2))*60).toFixed(0)
          var pacefinal = paceMin+":"+paceSeg+" min/km"
          this._markerL.text(pace.toFixed(2)+" m/km")
      }

      this.updateInterno();


      //atualizo a camera para me ter
    },





  atualizaProximoPonto:function(tempo){

      //acho a minha posicao no tempo que estou
      // var pt = this.gpx._getPointInTime(tempo+200);

      // //ai pego do percurso o ponto que estou baseqado na kilometragem que já corri
      // var pttrecho = vtlPERCURSO.gpx._getPointInKm(pt._dist/1000);


      //   this._px = pttrecho._x
      //   this._py = pttrecho._y

        // this._ref.attr({x:this._px,y:this._py,z:this._z});
     
      


  },






  updateInterno:function(){
      if(this._visible == 0 || this._dirty == 1 ){
        return false;
      }
      this._markerL.attr({x:this._x,y:this._y,z:this._z});
      this._shadowL.attr({x:this._x,y:this._y,z:this._z});
      return true;
  },

   updateInternoFast:function(){
     if(this._dirty == 1 || this._visible == 0){
            return false;
      }
      this._markerL.attr({x:this._x,y:this._y,z:this._z},false).updateInterno();
      this._shadowL.attr({x:this._x,y:this._y,z:this._z},false).updateInterno();
   },

   immediateUpdate:function(){
    this.updateInterno();
    this._markerL.updateInterno();
    this._shadowL.updateInterno();
   },

});





























//************ CRIA Raphael Extension
//****************************
vtl.Raphael = vtl.dom.extend({

    _paper:null,
    _viewbox:null,
    _oriW:0,
    _oriH:0,
    el:null,
    _url:"",
    _urlLoaded:"",
    _needRedraw: 0,
    _play : 0,
    _fit : 0,
    _callBackfuncs:[],
    _fps:7,

    init: function(paper,x,y,w,h,id,pai){
      delete this._callBackfuncs;
      this._callBackfuncs = [];

      if(paper == null){ // se nao passo um paper, crio um novo
        this._super(x,y,w,h,id,pai);
       // this._paper = Raphael(this._el.id,'100%','10270%');
      }else{
        this._paper = paper;
      }
      this.raphaContainer = this.el;

     return this;
    },


    importSVG: function(url){
      if(this.paper == null){
            this._paper = Raphael(this.raphaContainer[0],'100%','100%');
      }
      that=this;
      this._url = url;
      that.groups = {};
      this._paper.importFileSVG(url,that.runCallbacks,this);
      return this;
    },


    text:function(txt){
      this.divDump().text(txt);
      return this;
    },

    click:function(func){
        this._paper.click(function(e){func.call(_this,e)});
       return this;
    },


    html:function(txt){
      this.divDump().html(txt);
      return this;
    },


    css:function(css){
      this.divDump().css(css);
      return this;
    },


    divDump:function(){
      if(!this._divDump){
          this._divDump = $("<div class='htmlel' style='position:absolute;top:0;left:0;right:0;bottom:0;'></div>");
          this.el.append(this._divDump);
      }
      return this._divDump;
    },


    runCallbacks: function(obj){

       this.group = obj;
       this._needRedraw = 1;
       //this._paper.fitContent();
       var that = this;
        for (var i = 0; i < that._callBackfuncs.length; i++) {
            var func = that._callBackfuncs[i];
            func[0].call(func[1],that);
        };

       delete this._callBackfuncs;

        this.updateInterno();
    },


    callback : function(func,quem){
        this._callBackfuncs.push([func,quem]);
        return this;
   },



   attr: function(obj){
        //verifico se tem uma url
       if(("url" in obj) && obj["url"] !== this._urlLoaded){
          this.importSVG(obj["url"]);
          this._urlLoaded = obj["url"];
       }

       this._super(obj);

       return this;
   },

    updateInterno: function(){
       this._super();
       //needRedraw é alterado para 1 assim que um arquivo acaba de ser carregado
       if(this._needRedraw == 1){
          this._needRedraw = 0;
          if(this._play == 1){
           this._anima();
          }
          if(this._fit == 1){
           this._paper.fitContent();
          }
       }
    },


    anima: function(fps){
      this._play = 1;
      this._fps = fps || this._fps;
      return this;
    },


    _anima:function(){
        this._paper.importGroups.anima(this._fps);
    },


    getPaper: function(func){
      return this._paper;
    },


    getSets: function(func){
      return this.group;
    },

});




//(paper,x,y,w,h,id,pai){
vtlObjeto = vtl.Raphael.extend({

  init:function(nome){
      if(vtl.ObjetosResources[nome]){
        var c = vtl.ObjetosResources[nome];
        this._super(null,c.x,c.y,c.w,c.h,nome,"#lago-layer");
        this.attr({zIndexOffset:500});
        this.attr(c);
        this.attr({zIndex:null,fit:1,url:VTL_MODELS+c.url});
        return this;
      }else{
        return false;
      }
  }

});








