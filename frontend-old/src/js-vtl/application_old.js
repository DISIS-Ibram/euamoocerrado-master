
/**@
* #Image
* @category Graphics
* Draw an image with or without repeating (tiling).
*/
Crafty.c("Image2", {
  ready: false,

  init: function () {
    var draw = function (e) {
      if (e.type === "canvas") {
        //skip if no image
        if (!this.ready || !this._pattern) return;

        var context = e.ctx;

        context.fillStyle = this._pattern;

        context.save();
        context.translate(e.pos._x, e.pos._y);
        context.fillRect(0, 0, this._w, this._h);
        context.restore();
      } else if (e.type === "DOM") {
        if (this.__image)
          el = this._element;
          el.innerHTML = "<img src='"+this.__image +"' style='"+this._w+"px;height:"+this._h+"px'>";
          //e.style.background = "url(" + this.__image + ") " + this._repeat;


      }
    };

    this.bind("Draw", draw).bind("RemoveComponent", function (id) {
      if (id === "Image2") this.unbind("Draw", draw);
    });
  },

  /**@
  * #.image
  * @comp Image
  * @trigger Change - when the image is loaded
  * @sign public this .image(String url[, String repeat])
  * @param url - URL of the image
  * @param repeat - If the image should be repeated to fill the entity.
  *
  * Draw specified image. Repeat follows CSS syntax (`"no-repeat", "repeat", "repeat-x", "repeat-y"`);
  *
  * *Note: Default repeat is `no-repeat` which is different to standard DOM (which is `repeat`)*
  *
  * If the width and height are `0` and repeat is set to `no-repeat` the width and
  * height will automatically assume that of the image. This is an
  * easy way to create an image without needing sprites.
  *
  * @example
  * Will default to no-repeat. Entity width and height will be set to the images width and height
  * ~~~
  * var ent = Crafty.e("2D, DOM, Image").image("myimage.png");
  * ~~~
  * Create a repeating background.
  * ~~~
  * var bg = Crafty.e("2D, DOM, Image")
  *              .attr({w: Crafty.viewport.width, h: Crafty.viewport.height})
  *              .image("bg.png", "repeat");
  * ~~~
  *
  * @see Crafty.sprite
  */
  image2: function (url, repeat) {
    this.__image = url;
    this._repeat = repeat || "no-repeat";

    this.img = Crafty.asset(url);
    if (!this.img) {
      this.img = new Image();
      Crafty.asset(url, this.img);
      this.img.src = url;
      var self = this;

      this.img.onload = function () {
        if (self.has("Canvas")) self._pattern = Crafty.canvas.context.createPattern(self.img, self._repeat);
        self.ready = true;

        if (self._repeat === "no-repeat") {
          self.w = self.w || self.img.width;
          self.h = self.h || self.img.height;
        }

        self.trigger("Change");
      };

      return this;
    } else {
      this.ready = true;
      if (this.has("Canvas")) this._pattern = Crafty.canvas.context.createPattern(this.img, this._repeat);
      if (this._repeat === "no-repeat") {
        this.w = this.img.width;
        this.h = this.img.height;
      }
    }


    this.trigger("Change");

    return this;
  }



});
















//Create or return raphael Paper

Crafty.c("Paper", {
  _paper: {},
  ready: true,
  init: function(){
     this.requires("2D, DOM");
     this._paper = Raphael(this._element.id,this._w,this._h);

  }
});












//Create or return raphael Paper

Crafty.c("Raphael", {
  _paper: {},
  ready: true,
  group:{},
  oriW:0,
  oriH:0,

  init: function(){
     this.requires("2D, DOM");
     this._paper = Raphael(this._element.id,'100%','100%');
    // this._paper.setViewBox(0, 0, this._w, this._h, false);
     //this._paper.setViewBox(0, 0, this._w, this._h, false);
     draw = function(){

      
          //   
     // this._paper.circle(this._w/2,this._w/2,this._w/2).attr({'fill':'red'});
      if(this.oriW > 0){

           this._paper.setViewBox(0, 0,this.oriW,this.oriH);
           //this.group.anima();
            return this;
          }
     };

     this.bind("Draw", draw);
     this.trigger("Change");
  },

  importSVG: function(url){
          that=this;



           $.ajax({
              type: "GET",
              url: url,
              context:this,
              dataType: "xml",
              success: function(svgXML) {
                    // var paper = Raphael(10, 10, 800, 600);
                    //  paper.setSize('100%', '100%');
                //    that._paper.setViewBox(0, 0, that._w, that._h, false);
                   this.group = this._paper.importSVG(svgXML);
                  this.trigger("Change");

              }
        });



    return this;


  },


  anima : function(){

    this.group.anima();

  },


  getPaper: function(func){
    return this._paper;
  },

  getSet: function(func){
    return this.group;
  }



});
























var pontosDeTroca = [13.64,15,26.4,50,65,73,80];  //ponstos de troca em Klometros



L.Class.extend({

  _resetView: function (center, zoom, preserveMapOffset, afterZoomAnim) {

    var zoomChanged = (this._zoom !== zoom);

    if (!afterZoomAnim) {
      this.fire('movestart');

      if (zoomChanged) {
        this.fire('zoomstart');
      }
    }

    this._zoom = zoom;
    this._initialCenter = center;

    this._initialTopLeftPoint = this._getNewTopLeftPoint(center);

    if (!preserveMapOffset) {
      L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
    } else {
      this._initialTopLeftPoint._add(this._getMapPanePos());
    }

    this._tileLayersToLoad = this._tileLayersNum;

    var loading = !this._loaded;
    this._loaded = true;

    //this.fire('viewreset', {hard: !preserveMapOffset});

    this.fire('move');

    if (zoomChanged || afterZoomAnim) {
      this.fire('zoomend');
    }

    this.fire('moveend', {hard: !preserveMapOffset});

    if (loading) {
      this.fire('load');
    }
  }

});



/////////////////////////////////////////////////
//  O CONTROLE GERAL DE TODOS
/////////////////////////////////////////////////
Controlador = (function() {

    //defino as variaveis privadas
    var _that = this;
    var _adp; // qual engni vou estar usando
    var paper, _w, _h, _div, htmlLayer, cena, animados = [],
        _zoomp = 100,
        _x = 0,
        _y = 0,
        _lat,
        _long,
        camera,
        percursoAtual=[];

    var mapaL;

    //constantes para conversão para o nosso mapa
    var _SCALEMAP = 1686 / 16113;
    var _XMOVEMAPA = +558075 + 186 + 186;
    var _YMOVEMAPA = 185356 - 39;

    //controle do pan
    var mousedown = false,
        startX, startY, dX, dY;





      /////////////////////////////////////////////////
      //  EVENTOS DE MOUSE NO MAPA
      /////////////////////////////////////////////////
      //
      setupMouseEvents = function() {
        htmlLayer = document.getElementById("htmlLayer");
        if (window.addEventListener) /** DOMMouseScroll is for mozilla. */
        htmlLayer.addEventListener('DOMMouseScroll', onMouseWheel, false); /** IE/Opera. */
        htmlLayer.onmousewheel = htmlLayer.onmousewheel = onMouseWheel;
        $(htmlLayer).mousedown(onMouseDown);
        $(htmlLayer).mousemove(onMouseMove);
        $(htmlLayer).mouseup(onMouseUp);
      };
      onMouseWheel = function (event) {
        var delta = 0;
        if (!event) /* For IE. */
        event = window.event;
        if (event.wheelDelta) { /* IE/Opera. */
            delta = event.wheelDelta / 120;
        } else if (event.detail) { /** Mozilla case. */  /** In Mozilla, sign of delta is different than in I * Also, delta is multiple of 3. */
            delta = -event.detail / 3;
        }
        if (delta) handleMouseWheel(delta);
        //LETODO - verificar mesmo se queremos  impedir que o evendo de scrool seje passado aos outros
        if (event.preventDefault) event.preventDefault();
        event.returnValue = false;
      };
      handleMouseWheel = function(delta) {
        if (delta < 0) {
            _zoomp *= 0.95;
            _zoomp *= 0.95;
        } else {
            _zoomp *= 1.05;
            _zoomp *= 1.05;
        }
        _that._adp.zoomCamera(_zoomp);
      };
      onMouseDown = function(e) {
        mousedown = true;
        startX = e.pageX;
        startY = e.pageY;
      };
      onMouseMove = function(e) {
        if (mousedown === false) {
            return;
        }
        var dX = startX - e.pageX;
        var dY = startY - e.pageY;
        //move relativamentes ao nivel de zoom que estamos,
     // dX *= (_zoomp/100);
      //dY *= (_zoomp/100);
      _x += dX;
      _y += dY;
        _that._adp.moveCamera(_x, _y);
        startX = e.pageX;
        startY = e.pageY;
      };
      onMouseUp = function(e) {
        if (mousedown === false) return;
        mousedown = false;
        _x = paper._viewBox[0];
        _y = paper._viewBox[1];
      };






      /////////////////////////////////////////////////
      //  SETUP MAPA
      /////////////////////////////////////////////////
      setupMapa = function(){

        return;

          //pego o valores do x e y do meu mapa
          //
        wW = $(window).width();
        wH = $(window).height();

        ltlong = inverseMercator(+wW/2,+wH/2);

        _lat = ltlong[1];
        _long = ltlong[0];
        mapaL = L.map('map',{'trackResize':false,'inertia':false,'zoomControl':true,'attributionControl':true,worldCopyJump:true}).setView([ltlong[1], ltlong[0]], 14);


          L.tileLayer('http://{s}.tile.cloudmade.com/c1eb4df270b845118e5bd262f8ea0826/997/256/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
          maxZoom: 18
        }).addTo(mapaL);





      };


      updateMapaLayer = function(){

          if(mapaL){
               var xx = _x + ($(window).width()/2);
               var yy = _y + ($(window).height()/2);
               var ltlong = inverseMercator(xx,yy);
               x = parseInt(14*100/_zoomp,10);
               //
             // var  _latDelta = ltlong[1];
             // _long - ltlong[0];

               mapaL.setView([ltlong[1], ltlong[0]],14,false);



          }
      }







      /////////////////////////////////////////////////
      // SINCRONIZACAO LAYER HTML COM O SVG/CANVAS
      /////////////////////////////////////////////////

      //LETODO - salvar os divs numa array, para ficar mais rapido os loops
      updateHtmlLayer = function() {


         updateMapaLayer();

            var porc = 100 / _zoomp;
            $("#htmlLayer > div").each(function(event) {
                  _$this = $(this);
                  var posicaoTemp = _$this.position();
                  //pego a posicao original deles
                  if (_$this.data("xori") === undefined) {
                        _$this.data("xori", posicaoTemp.left);
                        _$this.data("yori", posicaoTemp.top);
                  }
                  var x = _$this.data("xori");
                  var y = _$this.data("yori");
                  //agora pego a diferenca da origem do lago para a posicao atual. 0 pois é a origem do plano que usamos
                  var difX = 0 - _x;
                  var difY = 0 - _y;
                  //aplico essa diferenca as posicoes originais do div
                  x += difX;
                  y += difY;
                  //converto a posicao para adequar o nivel de zoom
                  x *= porc;
                  y *= porc;
                  //e aplico para o centro ser no center bottom do objeto
                  x -= _$this.width() / 2;
                  y -= _$this.height();
                  scale = porc;
                  if (_$this.data("zoom") === false) {
                        scale = 1;
                  }
                  // scale = 1;
                  // _$this.position({top:x,left:y});
                  TweenMax.to(_$this, 0, {
                        css: {
                              top: y,
                              left: x,
                              scale: scale,
                              transformOrigin: "center bottom"
                        }
                  });
            });




      };



      /////////////////////////////////////////////////
      //  CONVERSAO DE PONTOS DE MAPAS
      /////////////////////////////////////////////////

      function toMercator(lon, lat) {
            var x = lon * 20037508.34 / 180;
            var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
            y = -y * 20037508.34 / 180;
            //converto para o tamanho do meu mapa
            x = x * _SCALEMAP + _XMOVEMAPA;
            y = y * _SCALEMAP - _YMOVEMAPA;
            return [x, y];
      }

      function inverseMercator(x, y) {
            //converto do tamanho do meu mapa
            x = (x - _XMOVEMAPA) / _SCALEMAP;
            y = -(y + _YMOVEMAPA) / _SCALEMAP;
            var lon = (x / 20037508.34) * 180;
            var lat = (y / 20037508.34) * 180;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
            return [lon, lat];
      }





      /////////////////////////////////////////////////
      //  ANIMACOES
      /////////////////////////////////////////////////


      animateCameraTo = function(x,y,zoom){


                      TweenMax.to(_that,1, {
                        _zoomp: zoom,
                        onUpdateScope: _that,

                        onUpdate: function() {

                          this._adp.zoomCamera(_zoomp);
                        }
                      });

      };


    // anima = function(set) {
    //     var nframes = 11;
    //     var current_frame = -1;
    //     var direction = 1;
    //     var frames = set.groups;
    //     function safecall(stmt) {
    //         var old_error = window.onerror;
    //         window.onerror = safecall_suppress_errors;
    //         eval(stmt);
    //         window.onerror = old_error;
    //     }
    //     function safecall_suppress_errors() {
    //         return true;
    //     }
    //     next_frame = function() {
    //         var svgobj;
    //         var svgstyle;
    //         var previous_frame = current_frame;
    //         current_frame += direction;
    //         if ((current_frame >= nframes) || (current_frame < 0)) {
    //             current_frame = 1;
    //             direction = 1;
    //         }
    //         svgobj = frames['FRAME_' + current_frame];
    //         svgobj.show();
    //         if (previous_frame >= 0) {
    //             svgobj = frames['FRAME_' + previous_frame];
    //             svgobj.hide();
    //         }
    //     }
    //     setInterval(next_frame, 90);
    // }
    anima = function(set) {
        var nframes = 11;
        var current_frame = -1;
        var direction = 1;
        set.frames = set.groups;
        set.totalframes = Object.keys(set.frames).length - 1;
        totalframes = set.totalframes;
        set.frame = 0;
        set.prev_frame = 0;
        set.tween = new TimelineMax({
            delay: 0,
            repeat: -1,
            repeatDelay: 0,
            useFrames: false,
            yoyo: true
        });
        set.tween.to(set, 1.5, {
            frame: totalframes,
            onUpdateScope: set,
            onUpdate: function() {
                //console.log(this.frame);
                this.frame = parseInt(this.frame, 10);
                try {
                    if (this.frame != this.prev_frame) {
                        svgobj = this.frames['FRAME_' + this.prev_frame];
                        svgobj.hide();
                    }
                    svgobj = this.frames['FRAME_' + this.frame];
                    svgobj.show();
                } catch (e) {
                }
                this.prev_frame = this.frame;
                //  },ease:SteppedEase.config(totalframes)});
            },
            ease: SteppedEase.config(totalframes)
        });
    };


    animaOsBarcos = function () {
        return;
        var ref = animados[0];
        var po = ref.position();
        var pfx = (po.x + (Math.random() * 500) - 250);
        var pfy = (po.y + (Math.random() * 500) - 250);
        lago = cena.groups.lago[0];
        while (!lago.isPointInside(pfx, pfy)) {
            console.log("fora");
            pfx = (po.x + (Math.random() * 500) - 250);
            pfy = (po.y + (Math.random() * 500) - 250);
        }
        //lago.isPointInside();
        //pego o angulo entre os pontos
        var angulo = Raphael.angle(po.x, po.y, pfx, pfy);
        //var timeline = new TimelineMax({delay:0, repeat:-1, repeatDelay:0,useFrames:false,yoyo:true});
        for (var i = 0; i < animados.length; i++) {
            var ofX = Math.random() * 100;
            var ofY = Math.random() * 100;
            //  animados[i].inicio
            //animados[i].selfRotate(angulo+45);
            animados[i].animate({
                transform: ("T" + (pfx + ofX) + "," + (pfy + ofY))
            }, 90000, "<>", function() {
                animaOsBarcos();
            });
            // var el = animados[i];
            // el.x = posicaoInicial.x;
            // el.y = posicaoInicial.y;
            // TweenMax.to(el,20,{x:posFinalX,y:posFinalY, onUpdateScope:el,onUpdate:function(){
            //         this.transform(("T"+el.x+","+el.y));
            // } })
        }
    };




      /////////////////////////////////////////////////
      //  ADAPTADORES - fuoncoes que vão lidar com a framework escolhida
      //  ex: raphael.js, three.js, canvas.js
      /////////////////////////////////////////////////
      //
      var adapter = {

            RAPHAEL: {
                  marca:undefined,

                  //carrega o cenario
                  carregaCenario: function() {
                        paper = new Raphael(_div, _w, _h);
                        paper.setViewBox(0, 0, _w, _h, false);
                        // $(_div).height(_h).width(_w); //garanto que o div tem o tamanho do paper
                        //crio os grids
                        // var at = {"stroke":'#908F96','stroke-width':0.2}
                        // for( i=0,step = _w/100; i<(_w/2); i=i+step ){
                        //     paper.rect((i*2)+10,0,step,_h).attr(at);
                        // }
                        //  for( i=0,step = _h/100; i<(_h/2); i=i+step ){
                        //     paper.rect(0,(i*2)+10,_w,step).attr(at);
                        // }
                        $.ajax({
                              type: "GET",
                              url: "themes/voltaaolago_theme/models/mapa_final.svg",
                              dataType: "xml",
                              success: function(svgXML) {
                                    // var paper = Raphael(10, 10, 800, 600);
                                    //  paper.setSize('100%', '100%');
                                    cena = paper.importSVG(svgXML);
                                //    _that._adp.carregaPercurso();
                                 //   _that._adp.carregaBarcos();
                              }
                        });
                        //carrego os outros objetos agora
                        //
                        //carrego os barcos
                        //
                        //duplico eles
                        //
                        //e animo eles
                  },
                  carregaBarcos: function() {
                        $.ajax({
                              type: "GET",
                              url: "themes/voltaaolago_theme/js/barco_simples_animado.svg",
                              dataType: "xml",
                              success: function(svgXML) {
                                    // var paper = Raphael(10, 10, 800, 600);
                                    //  paper.setSize('100%', '100%');
                                    barco = paper.importSVG(svgXML);
                                    barco.toFront();
                                    //posiciono onde quero
                                    barco.transform("S0.05,0.05,0,0");
                                    barco.applyTransform();
                                    barco.transform("T1450,887");
                                    anima(barco);
                                    animados.push(barco);
                                    for (var i = 0; i < 13; i++) {
                                          barcoNew = barco.cloneSet();
                                          barcoNew.transform(("T" + ((Math.random() * 100) + 1450) + "," + ((Math.random() * 100) + 887)));
                                          //  barcoNew.selfRotate(Math.random()*4);
                                          // barcoNew.transform(("...r"+(Math.random()*180)+" 0 0"));
                                          animados.push(barcoNew);
                                          anima(barcoNew);
                                    }
                                    animaOsBarcos();
                              }
                        });
                  },



                  carregaPercurso: function(arquivo) {
                        arquivo = "themes/voltaaolago_theme/js/percurso_gps.js";
                        $.ajax({
                              type: "GET",
                              url: arquivo,
                              dataType: "json",
                              success: function(pointsGPS) {
                                    //   alert(pointsGPS);
                                    //  console.log($.parseJSON(pointsGPS));
                                    mapa = "M";
                                    for (var i = 0; i < pointsGPS.trackPoints.length; i++) {
                                          point = pointsGPS.trackPoints[i];
                                          pointCartesian = toMercator(point.longitude, point.latitude);
                                          mapa += pointCartesian[0] + "," + pointCartesian[1];

                                          percursoAtual.push([point.longitude,point.latitude]);

                                          mapa += "L";
                                    }
                                    cena.groups.traco_x5F_percurso.hide();
                                    st = paper.path(mapa).attr({
                                          stroke: "#D88518",
                                          'stroke-dasharray': '- ',
                                          'stroke-width': 1.0
                                    });//.showProgressive(10000);


                                    //crio um elevation CHART usando servisos do google maps
                                    mapaServ = new mapasServeces();

                                    //retorna a distancia do caminho
                                    distanciaTotal = mapaServ.getTotalDistance(percursoAtual);

                                    //crio um marquer em cada 5 kilometros
                                    distanciaPath = st.getTotalLength();

                                    for(i=0;i<distanciaTotal;i++){

                                          porcentagemNoPath = i*distanciaPath/distanciaTotal;
                                          var pt = st.getPointAtLength(porcentagemNoPath);
                                          paper.circle(pt.x,pt.y,2).attr({
                                          fill: "#D88518",
                                          stroke:"#F9662B",
                                          'stroke-width': 0.0
                                    });
                                    }

                                    //crio os pontos de trocas
                                    for ( i = 0; i < pontosDeTroca.length; i++) {
                                         porcentagemNoPath = pontosDeTroca[i]*distanciaPath/distanciaTotal;
                                         var pt = st.getPointAtLength(porcentagemNoPath);
                                         //ai coloco um htmlLayer de ponto de troca no lugar
                                          $("#htmlLayer").append('<div id="ins" class="pontotroca" data-zoom="true" style="position:absolute;left:'+pt.x+'px;top:'+pt.y+'px"> <h5>Ponto de Troca '+ (i+1) +'</h5></div>');
                                        paper.circle(pt.x,pt.y,4).attr({
                                          fill: "#F9662B",
                                          stroke:"#F9662B",
                                          'stroke-width': 0.0
                                    });

                                    };


                                    elevations = mapaServ.getElevationFromPath(percursoAtual);

                                    //  st.showProgressive(5000);
                                    // comprimento = st.getTotalLength();
                                    // $(st.node).attr({'stroke-dasharray':(comprimento+","+comprimento)});
                                    // $(st.node).attr({'stroke-dashoffset':comprimento});
                                    // $(st.node).animate({'stroke-dashoffset':0},13000);
                                    // var paper = Raphael(10, 10, 800, 600);
                                    //  paper.setSize('100%', '100%');
                              }
                        });
                  },





                  showElevationPointInPercurso: function(x,y,elevation){

                            //converto de lat e long para meu mapa
                            var pConv = toMercator(x,y);
                            x = pConv[0];
                            y = pConv[1];

                            var slop = (25-5)/(1100-1000);
                            var b = 5-1000*slop;
                            size =slop*elevation + b ;

                            if(_that._adp.marca != undefined) _that._adp.marca.remove();

                            _that._adp.marca = paper.circle(x,y,size).attr({
                                      fill: "#D88518",
                                      stroke:"#F9662B",
                                      'stroke-width': 0.0
                                });

                            _that._adp.moveCameraCenter(x,y);

                  },





                             //funcoes de cameras
                  moveCameraCenter: function(x, y) {
                        //x e y vem das posicoes reais, considerando que estamos 100% do mapa, quer dizer, usando as cordenadas do svg
                        var w = paper._viewBox ? paper._viewBox[2] : paper.width;
                        var h = paper._viewBox ? paper._viewBox[3] : paper.height;
                        w = (w == "100%") ? w = _w : w;
                        h = (h == "100%") ? h = _h : h;

                        winH = $(window).height();
                        winW = $(window).width();


                        porc = _zoomp/100;


                        x -= winW*porc/2;
                        y -= winH*porc/2;


                        paper.setViewBox(x, y, w, h, false);
                        //salvo a posicao que estamos;
                        _x = x;
                        _y = y;
                        updateHtmlLayer();
                  },



                  //funcoes de cameras
                  moveCamera: function(x, y) {

                    $(_div).css({
                      left: -x+"px",
                      top: -y+"px"
                    });
                       //TweenMax.to(_div,0,{left:-x,top:-y,overwrite:"all"});
                       return;


                        //x e y vem das posicoes reais, considerando que estamos 100% do mapa, quer dizer, usando as cordenadas do svg
                        var w = paper._viewBox ? paper._viewBox[2] : paper.width;
                        var h = paper._viewBox ? paper._viewBox[3] : paper.height;
                        w = (w == "100%") ? w = _w : w;
                        h = (h == "100%") ? h = _h : h;

                        //   xrel = w / _w;
                        //  yrel = h / _h;
                        //   x *= xrel;
                        //  y *= yrel;
                        //converto o x e o y para o nivel de zoom que estamos
                        //  porc = _zoomp/100;
                        // x *= porc;
                        // y *= porc;
                        paper.setViewBox(x, y, w, h, false);
                        //salvo a posicao que estamos;
                        _x = x;
                        _y = y;
                        updateHtmlLayer();
                  },
                  rotateCamera: function(deg) {
                        _that.cena.animate({
                              transform: "R90 500 500"
                        }, 200);
                  },


                  zoomCamera: function(perc) {
                        //100% é o tamanho original, ou é o tamanho da tela? heinn, heinnnn
                        var wTotal = _w * (perc / 100);
                        var hTotal = _h * (perc / 100);
                        var x = paper._viewBox ? paper._viewBox[0] : 0;
                        var y = paper._viewBox ? paper._viewBox[1] : 0;
                        var w = wTotal; //(wTotal - x) / 2;
                        var h = hTotal; //(hTotal - y) / 2;


                        winH = $(window).height();
                        winW = $(window).width();
                        porc = perc/100;

                       // x += w/2;
                        //y += h/2;
                     //   x +=((w/2)*porc)/2;
                      //  y += ((h/2)*porc)/2
                        _x = x;
                        _y = y;

                        paper.setViewBox(x, y, w, h, false);
                        //salvo no glogal a porcentagem que estamos
                        _zoomp = perc;



                        updateHtmlLayer();
                  },

                   animateCameraTo: function(x,y,zoom,time){

                                    var objtemp = {};
                                    objtemp.zz = _zoomp;
                                    objtemp.xx = _x;
                                    objtemp.yy = _y;
                                    objtemp.adp = _that._adp;

                                    timeFinal = time || 1;

                                    TweenMax.to(objtemp,timeFinal, {
                                      zz: zoom, xx:x, yy:y,
                                      onUpdateScope: objtemp,

                                      onUpdate: function() {

                                        objtemp.adp.zoomCamera(objtemp.zz);
                                        objtemp.adp.moveCamera(objtemp.xx,objtemp.yy);
                                      }
                                    });

                    },



                  //
                  goTo: function(x, y, zoom, deg) {}
                  //funcoes de animações
            },



            processingjs: {
                  carregaCenario: function() {
                        paper = new Raphael(document.getElementById('lago'), 1798, 1933);
                        $.ajax({
                              type: "GET",
                              url: "themes/voltaaolago_theme/js/mapa_final.svg",
                              dataType: "xml",
                              success: function(svgXML) {
                                    // var paper = Raphael(10, 10, 800, 600);
                                    _that.cena = paper.importSVG(svgXML);
                              }
                        });
                  }
            }
      };

    //defino os metodos privados
    return {
        setup: function(adpname, div, width, height) {
            _that._adp = adapter[adpname];
            _div = document.getElementById(div);
            _w = width;
            _h = height;
            //agora que tenho o div, inicio o events observes para ele
            setupMouseEvents();

            setupMapa();

        },
        getPaper: function() {
            return paper;
        },
        getCena: function() {
            return cena;
        },


        /////////////////////////////////////////////////
        // CENARIO
        /////////////////////////////////////////////////
        cenario: {
            setup: function() {
                _that._adp.carregaCenario();
                return _that.paper;
            },
            carregaPercurso: function(arquivo) {
                _that._adp.carregaPercurso(arquivo);
            },
            getAnimados: function() {
                return animados;
            }

        },


        percurso:{

          showElevationPoint: function(x,y,elevation){

            _that._adp.showElevationPointInPercurso(x,y,elevation);

          }

        },


        // fim so cenario
        /////////////////////////////////////////////////
        //  CAMERA
        /////////////////////////////////////////////////
        camera: {
            posicao: {
                x: 0,
                y: 0
            },
            rotacao: 0,
            zoomPerc: 0,
            setup: function() {
                this.posicao.x = 50;
            },
            move: function(x, y) {
                _that._adp.moveCamera(x, y);
                return posicao;
            },
            zoom: function(perc) {
                _that._adp.zoomCamera(perc);
            },
            animateCameraTo: function(x,y,zoom,time){
                _that._adp.animateCameraTo(x,y,zoom,time);
            }
        }
    }; //fim do objeto(ou do return) CONTROLADOR
})(this);







/////////////////////////////////////////////////
//  MAPA
/////////////////////////////////////////////////


mapasServeces = function() {

     var  _that = this;
      var _distTotal;
      var _pointsCartesian;

      this.criaGooglePoint = function(lat, lgt) {
            return new google.maps.LatLng(lat, lgt);
      };


       this.getTotalDistance = function(latlongArray) {
            var path = [];
            for (var i = 0, tam = latlongArray.length; i < tam; i++) {
                  pp = latlongArray[i];
                  path.push(_that.criaGooglePoint(pp[1], pp[0]));
            }
            caminho = new google.maps.Polyline({path:path});
            return (caminho.inKm());
      };






      this.getElevationFromPath = function(latlongArray) {
            var path = [];

            for (var i = 0, tam = latlongArray.length; i < tam; i++) {
                  pp = latlongArray[i];
                  path.push(_that.criaGooglePoint(pp[1], pp[0]));

            }

            caminho = new google.maps.Polyline({path:path});
            _distTotal = (caminho.inKm());

            var pathRequest = {
                  'path': path,
                  'samples': 256
            };

            elevator = new google.maps.ElevationService();
            elevator.getElevationAlongPath(pathRequest,_that.resultadoElevatorServece);

      };



      this.resultadoElevatorServece = function(results, status) {

            if (status == google.maps.ElevationStatus.OK) {
                  elevations = results;
                  _pointsCarrtesian = [];
                 //  var chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));

                  // Extract the elevation samples from the returned results
                  // and store them in an array of LatLngs.
                  console.log(results);
                  var elevationPath = [];
                  for (var i = 0; i < results.length; i++) {
                        elevationPath.push(elevations[i].location);
                         _pointsCarrtesian.push(elevations[i].location);
                  }

                  // Extract the data from which to populate the chart.
                  // Because the samples are equidistant, the 'Sample'
                  // column here does double duty as distance along the
                  // X axis.
                  //var data = new google.visualization.DataTable();
                  //data.addColumn('string', 'Sample');
                  //data.addColumn('number', 'Elevation');
                  numeros = [];
                  for (i = 0; i < results.length; i++) {
                      //  data.addRow(['', elevations[i].elevation]);
                        numeros.push(elevations[i].elevation);
                  }



      var chart;
        chart = new Highcharts.Chart({
          chart: {
            renderTo: 'chart',
            type: 'area',
            animation:true,
            backgroundColor: 'transparent',

          },
          title: {
            text: ''
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            color: 'white',
            lineColor: 'white',
             startOnTick:false,
             showLastLabel: true,
            labels: {
              formatter:function() {
                 return (this.value*(_distTotal/250)).toFixed(1) + " km";
              },

              style: {
                color: 'white',
                fontWeight: 100
              }
            }
          },
          yAxis: {
            title: {
              text: ' '
            },

            labels: {

              align:'left',
              formatter:function() {
                 return parseInt(this.value,10) + "";
              },

              style: {
                color: 'white',
                fontWeight: 100
              }
            },

            min: 900,
            maxPadding:0.1,

            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
            color: 'white',
            lineColor: 'white',
            startOnTick:false,
            showLastLabel: true,
            endOnTick: true

          },
          tooltip: {
            formatter: function() {

              pp = _pointsCarrtesian[this.x];



              Controlador.percurso.showElevationPoint(pp.lb,pp.kb,this.y);

              return ''+ (this.x*(_distTotal/250)).toFixed(2) + 'km -> ' + (this.y).toFixed(2)+"m altura";
            }
          },

          plotOptions: {
            area: {
              lineWidth: 1,
              color: "#49A5CB",
              fillOpacity:0.4,
              states: {
                hover: {
                  lineWidth: 2
                }
              },
              marker: {
                enabled: false,
                states: {
                  hover: {
                    enabled: true,
                    symbol: 'none',
                    radius: 5,
                    lineWidth: 1
                  }
                }
              },
              pointInterval: 1,
              pointStart: 0
            }
          },
          series: [{
            name: ' ',
            data: numeros,
              animation: true,
                   duration: 9000
          }],
          navigation: {
            menuItemStyle: {
              fontSize: '5px'
            }
          }
        });










                  // Draw the chart using the data within its DIV.
             //     document.getElementById('elevation_chart').style.display = 'block';
                  // chart.draw(data, {
                  //       width: 640,
                  //       height: 200,
                  //       legend: 'none',
                  //       titleY: 'Elevation (m)'
                  // });
            }

      };

      return this;
};






var box = $('#htmlLayer');

box.offset({
    left: 0,
    top: 0
});

var drag = {
    elem: null,
    x: 0,
    y: 0,
    state: false
};
var delta = {
    x: 0,
    y: 0
};

box.mousedown(function(e) {
    if (!drag.state) {
        drag.elem = this;
      //  this.style.backgroundColor = '#f00';
        drag.x = e.pageX;
        drag.y = e.pageY;
        drag.state = true;
    }
    return false;
});


$(document).mousemove(function(e) {
    if (drag.state) {
        //drag.elem.style.backgroundColor = '#f0f';
        drag.elem = "#cr-stage>div";
        delta.x = e.pageX - drag.x;
        delta.y = e.pageY - drag.y;

       // $('#log').text(e.pageX + ' ' + e.pageY + ' ' + delta.x + ' ' + delta.y);

        var cur_offset = $(drag.elem).offset();

        $(drag.elem).offset({
            left: (cur_offset.left + delta.x),
            top: (cur_offset.top + delta.y)
        });

        drag.x = e.pageX;
        drag.y = e.pageY;
    }
});


$(document).mouseup(function() {
    if (drag.state) {
       // drag.elem.style.backgroundColor = '#808';
        drag.state = false;
    }




 var ent,barcos;



$(function() {


 // ct = Controlador;
 // ct.setup("RAPHAEL", "lago", 2057, 1865);

 // ct.cenario.setup();
 // ct.cenario.carregaPercurso("themes/voltaaolago_theme/js/percurso_gps.js");
 // ct.camera.setup();




   Crafty.init();
     Crafty.viewport.clampToEntities = false;
 //  Crafty.viewport.mouselook(true);
  //  // ent = Crafty.e("2D, DOM, Image2").attr({w: 2057, h: 1865}).image2("themes/voltaaolago_theme/images/mapa_final.png");


  mapa = Crafty.e("2D, DOM, Raphael").attr({oriW: 2057, oriH: 1865,w: 2057, h: 1865}).importSVG("themes/voltaaolago_theme/models/mapa_final.svg");

  // // catedral = Crafty.e("2D, DOM, Raphael").attr({w: 100, h: 100, x:0,y:100}).importSVG("themes/voltaaolago_theme/models/catedral.svg");



barcos = [];
for(i=0;i<29;i++){
    x = Math.random()*20;
     y = Math.random()*20;
    barco = Crafty.e("2D, DOM, Raphael").attr({oriW:1024,oriH:1024,x:x, y:y, w: 50, h: 50}).importSVG("themes/voltaaolago_theme/models/barco_simples_animado.svg");
    barcos.push(barco);
}


   // barcos.anima();

  //Crafty.viewport.follow(catedral, 0, 0);

//  TweenMax.to(catedral,3,{left:2000,yoyo:true,repeat:-1});


//    barco = Crafty.e("Raphael").

//    percurso = Crafty.e("Raphael").




     Crafty.sprite(126, "themes/voltaaolago_theme/models/barco.png", {
         PlayerSprite: [0,0,0,0]
     })


// for(i=0;i<5;i++){

//    barcoimg =   Crafty.e("2D, DOM, SpriteAnimation, PlayerSprite").attr({scale:0.1})
//          .animate('PlayerRunning', 0,0,19)
//          .animate('PlayerRunning', 80, -1) // start animation
//         barcos.push(barcoimg);

// }

// Load our sprite map image
 // Crafty.load(['themes/voltaaolago_theme/models/barco.png'], function(){
    // Once the image is loaded...

    // Define the individual sprites in the image
    // Each one (spr_tree, etc.) becomes a component
    // These components' names are prefixed with "spr_"
    //  to remind us that they simply cause the entity


 // });









// //ent = Crafty.e("2D, DOM, Raphael").attr({w: 20, h: 20}).importSVG("themes/voltaaolago_theme/js/mapa_final.svg");
      $('#page').bind('mousewheel', function(event, delta) {
            //var dir = delta > 0 ? 'Up' : 'Down',
             //   vel = Math.abs(delta);
            //$(this).text(dir + ' at a velocity of ' + vel);
        var ev = window.event;
        if(ev){
        if (ev.wheelDelta) { /* IE/Opera. */
            delta = delta / 120;
        } else if (ev.detail) { /** Mozilla case. */  /** In Mozilla, sign of delta is different than in I * Also, delta is multiple of 3. */
            delta = -delta / 3;
        }
      }
           console.log(delta);
           val = 1+delta;
            Crafty.viewport.zoom(val,0,0,0);
            return false;
        });


});





function animaBarcos(){



  for (i = 0; i < barcos.length; i++) {
    barcos[i].anima();



  //TweenMax.to(document.getElementById("myDiv"), 5, {css:{bezier:{type:"cubic", values:[{x:100, y:250}, {x:150, y:100}, {x:300, y:500}, {x:500, y:400}], autoRotate:["x","y","rotation",45,false]}}, ease:Power1.easeInOut});



    TweenMax.fromTo(barcos[i]._element, 155, {css:{
      x: (Math.random() * 80 + 1100),
      y: (Math.random() * 80 + 700)
    }}, {css:{
      x: (Math.random() * 100 + 1500),
      y: (Math.random() * 100 + 900)},
      yoyo: true,
      ease:"Linear.easeNone",
      repeat: -1
    })
  }
// for(i=0;i<barcos.length;i++){
//   barcos[i].anima();

//    barcos[i].attr({x:(Math.random()*30+1100),y:(Math.random()*30+700)}).tween({x:(Math.random()*100+1200),y:(Math.random()*100+800)}, 400);
//  }


}



//   var newPath;
//   var paper, caminho, percurso, lago;
//   var viewBoxWidth;
//   var viewBoxHeight;
//   var canvasID = "#lago";
//   var startX, startY;
//   var mousedown = false;
//   var dX, dY;
//   var oX = 0,
//       oY = 0,
//       oWidth = viewBoxWidth,
//       oHeight = viewBoxHeight;
//   var viewBox;
//   var vB;
//   anima = function(set) {
//       var nframes = 11;
//       var current_frame = -1;
//       var direction = 1;
//       var frames = set.groups;
//       function safecall(stmt) {
//           var old_error = window.onerror;
//           window.onerror = safecall_suppress_errors;
//           eval(stmt);
//           window.onerror = old_error;
//       }
//       function safecall_suppress_errors() {
//           return true;
//       }
//       next_frame = function() {
//           var svgobj;
//           var svgstyle;
//           var previous_frame = current_frame;
//           current_frame += direction;
//           if ((current_frame >= nframes) || (current_frame < 0)) {
//               current_frame = 1;
//               direction = 1;
//           }
//           svgobj = frames['FRAME_' + current_frame];
//           svgobj.show();
//           if (previous_frame >= 0) {
//               svgobj = frames['FRAME_' + previous_frame];
//               svgobj.hide();
//           }
//       }
//       setInterval(next_frame, 220);
//   }
//   var barco;
//   function getCircletoPath(x, y, r) // x and y are center and r is the radius
//   {
//       var s = "M";
//       s = s + "" + (x) + "," + (y - r) + "A" + r + "," + r + ",0,1,1," + (x - 0.1) + "," + (y - r) + "z";
//       //alert(s);
//       return s;
//   }
//   window.load = function() {
//       //canvg(document.getElementById('canvas'), "themes/voltaaolago_theme/js/barco.svg");
//   }
//   $(function() {
//       //a funcao que desenha o lago
//       //
//       //  desenhaLago();
//       paper = new Raphael(document.getElementById('lago'), 1798, 1933);
//       //paper.addGuides();
//       $.ajax({
//           type: "GET",
//           url: "themes/voltaaolago_theme/js/mapa_final.svg",
//           dataType: "xml",
//           success: function(svgXML) {
//               // var paper = Raphael(10, 10, 800, 600);
//               barco = paper.importSVG(svgXML);
//               //
//               //  var grupos = barco.groups;
//               // b = grupos[0];
//               //  anima();
//               init();
//               animate();
//           }
//       });
//       //load '../path/to/your.svg' in the canvas with id = 'canvas'
//       //
//       //
//       // $.ajax({
//       //     type: "GET",
//       //     url: "themes/voltaaolago_theme/js/mapa_final.svg",
//       //     dataType: "xml",
//       //     success: function(svgXML) {
//       //      // var paper = Raphael(10, 10, 800, 600);
//       //       barco = paper.importSVG(svgXML);
//       //       //
//       //       var grupos = barco.groups;
//       //       b = grupos[0];
//       //     //  anima();
//       //     }
//       //   });
//       //         mapa = "M";
//       //         for (var i = 0; i < pointsGPS.trackPoints.length; i++) {
//       //            point = pointsGPS.trackPoints[i];
//       //            pointCartesian = toMercator(point.longitude,point.latitude);
//       //            mapa += pointCartesian[0]+","+pointCartesian[1];
//       //            mapa += "L";
//       //         };
//       //         console.log(mapa);
//       //         st =   paper.path(mapa).attr({stroke : "red",fill:'none'})//.transform("t5330859,1782107");
//       //         var t = (1686.465/st.getBBox().width);
//       //         var translate='t'+(-1*st.getBBox().x+330)+','+(-1*st.getBBox().y-60)+'s'+t+','+t+st.getBBox().x+','+st.getBBox().y;
//       //         console.log(translate);
//       //       //  st.transform('s0.1,0.1,0,0');
//       //         st.transform(translate);
//       //          //   st.transform("T0,0");
//       //         var white = {stroke : "white",fill:'white','x':'20','y':'-40'};
//       //         var pp = caminho.getPointAtLength(0);
//       //         var points = new Array();
//       //         newPath = "M"+pp.x+","+pp.y;
//       //         points.push({x:pp.x,y:pp.y});
//       //         var circ1 = paper.circle(0, 0, 10).attr(white);
//       //               var len = caminho.getTotalLength();
//       //         for (var i = 0; i < 100; i=i+50) {
//       //                     var point = caminho.getPointAtLength(i/100 * len);
//       //                       //point.x += Math.cos(point.alpha)*30;
//       //                       //point.y += Math.sin(point.alpha)*30;
//       //                       speed_length = 10;
//       //                       point.alpha += 90;
//       //                       // while(point.alpha > 180){
//       //                       //   point.alpha -=90;
//       //                       // }
//       //                    // if ( point.alpha > 360 )  point.alpha -= 360;
//       //                      // if ( point.alpha > 180 )  point.alpha -= 360;
//       //                       //point.alpha = 360 + Math.abs(point.alpha);
//       //                       speed_angle =  (((i/100)*(360*100))); //* (Math.PI / 180);
//       //                       speed_x = point.x//+(speed_length * Math.cos(speed_angle));
//       //                       speed_y = point.y//+(speed_length * Math.sin(speed_angle));
//       //                        points.push({x:speed_x,y:speed_y});
//       //                       newPath += "L"+speed_x+","+speed_y
//       //         }
//       //         newPath += "z"
//       //     // })
//       //                 anim =  Raphael.animation({path : "M1754.83,1023.17c0.67-6-3.83-5-3.17-11c-3.67-4-2.17-15-5.83-19 c-3.32-7.68-6.09-14.12-8.33-20.48c-4.96-3.49-10.27-2.64-15.95-4.2c-4.01-2.41-4.2-4.46-3.86-11.05 c-1.99-1.03-0.86-7.27-2.86-8.27c-3.97,2.28-8.49,8.4-10.2,13.1c-1.33-0.02-2.67-0.03-4-0.05c-1.62-3.69-0.13-12.38-1.8-16.05 c-1.33,0-2.67,0-4,0c-25.01,23.44-17.09,19.08-40.17,23c-5-6.67-10.83-20.33-15.83-27c-2.61-1.29-3.49-1.79-8-2 c-6.02,9.29-18.64,1.33-27.17,8c-21.77-3.32-93.5-10.51-102.83-26c-5.43-7.91-4.84-14.75-10.17-23 c-9.98-15.51-19.91-30.62-30.83-46c-6.04-8.49-5.46-28.29-11.17-38c-13.25-22.53-77.52-27.06-89-50c-5.72-11.42,2.04-28.7,0-42 c-3.2-20.83,5.34-47.29-1.83-65c0.33-7.43,2.21-10.04,8-12c4.27-0.87,6.91,2.1,11,3c10.1,2.22,25.2-3.5,32-7c1-0.67,2-1.33,3-2 c0-1.67,0-3.33,0-5c-9.05-5.37-61.15-43.71-64-50c-11.38-32.51,51.27-86.72,32-97c-19.29-6.62-31.76,26.2-51,11 c-17.42-13.76,4.82-26.87-1-42c-0.42-1.1-36.75-43.22-38-44c-9.67-3-19.33-6-29-9c-9.77-5.99-10.71-18.12-24-21c-3,2-6,4-9,6 c-22.9-3.77-20.55-21.39-34-27c-9.5-2.33-18.51,7.5-27,10c-1-0.33-2-0.67-3-1c-4.43-8.76-16.53-26.75-13-40 c1.3-4.86,4.88-6.09,6-13c-6.43-6.28-21.12-9.64-26-17c-3.49-5.25,1.08-28.8-2.81-32.75c-14.64,5.35-25.55,23.25-51.57,21.14 c-5.92-3.43-11.84-6.84-17.76-10.27c-28.79-11.06-19.86-18.85-39.58-38.07c-14.24-13.87-32.36-26.9-48.28-32.04 c-3.61-2.44-2.99-6.38-6-9c-3.95-3.45-10.97-1.26-16-4c-17.76-9.68-25.09-31.23-49-36c-5.66,5.36-14.8,17.12-16,26 c4.25,5.58,11.26,17.01,17,21c6.47,4.5,16.36,4.88,20,12c4.11,8.04,0.81,15.4,8,20c7.33,1.67,14.67,3.33,22,5 c6.73,4.17,6.31,14.9,11,21c8.39,10.92,21.62,18.85,33,27c9.33,9.67,18.67,19.33,28,29c13.65,9.9,33.86,8.74,44,22 c16.48,21.55,26.3,48.62,50,63c12.87,7.81,29.7,7.8,45,14c17.67,7.16,88.93,49.14,96,62c0.33,0.33,0.67,0.67,1,1 c-4.16,20.97-33.49,32.04-29,59c4.24,25.45,30.71,29.31,33,53c1.16,11.96-10.39,20.8-13,30c-0.67,11.33-1.33,22.67-2,34 c-6.88,37.81-13.6,96.84-58,97c-6.67-6.26-17.71-15.02-20-25c-1.78-7.74,2.94-13.13,4-18c2.42-11.08-8.74-43.43-13-50 c-10.28-15.86-33.06-15.51-49-26c-12.57-8.27-17.2-27.55-31-36c-8.71-5.33-22.33-4.75-28-13c-4.27-6.21-0.14-17.96-2-27 c-2.27-11.05-10.17-27.82-18-34c-11.74-9.26-25.52-13.06-39-21c-8-7.67-16-15.33-24-23c-11.33-5.67-22.67-11.33-34-17 c-7.67-1.67-15.33-3.33-23-5c-9.33-5-18.67-10-28-15c-14.05-3.45-24.01,0.47-34-5c-9.43-5.17-6.63-15.77-12-25 c-5.23-8.99-15.35-18.43-24-24c-23.23-14.96-60.99-14.26-82-31c-56.92-45.34-50.68-125.34-138-144c-9.14-1.95-17.07,3.52-24,5 c-18.37,3.93-49.92,7.81-71,4c-6.55-1.19-18.61,0.25-26-2c-9.53-2.91-16.9-20.21-29-18c-1.33,1.33-2.67,2.67-4,4 c5.26,10.07,13.83,25.03,24,30c14.23,5.39,34.52-1.79,50,2c31.29,7.66,122.1,46.42,130,73c6.6,22.22-7.27,34.84-13,48c1,2,2,4,3,6 c10.71,3.92,20.44,3.38,32,1c14.95,9.15,14.59,33.76,29,43c6.67,0.67,13.33,1.33,20,2c6.67,9,13.33,18,20,27 c21.33,27.28,51.73,48.25,73,76c14.88,19.41,19.7,55.44,44,65c28.52,11.22,47.26-3.78,77-4c5.95,5.6,15.42,12.48,18,21 c2.72,9-0.06,15.48,4,22c19.72,31.67,55.97,50.76,62,96c-7.98,13.49-18.52,11.77-32,20c-7.57,4.62-8.22,16.42-15,21 c-5.92,3.99-15.09-1.09-23,2c-10.84,4.23-49.76,41.18-54,51c-4.94,11.43-3.86,23.24-2,33c1.96,10.31-1.85,29.19,3,36 c4.16,6.96,20.7,13.32,29,16c7.01-5.53,8.62-17.47,17-21c36.25-15.27,88.08,41.61,114,43c29.3,1.57,54.69-10.56,76-15 c22.37-4.66,109.77,1.28,128,9c15,12,30,24,45,36c3.37,4.78,3.96,10.02,9,13c17.31,10.23,41.6,3.78,55,17c-0.33,2.67-0.67,5.33-1,8 c-17.84,14.79-39.41,17.69-63,28c-19.61,8.57-30.75,22.9-46,35c-8.82,7-21.79,14.75-27,25c-5.45,7.99,2.98,72.56,5,85 c2.65,16.38-2.11,31.54-4,44c-1.99,13.14,5.7,27.5,1,41c-3.48,9.99-12.61,23.94-17,36c-4,10.99-6.41,32.43-15,39 c-7.22,5.52-39.01,0.53-53,3c-14.62,2.58-26.5,11.23-39,14c-16.67-4-33.33-8-50-12c-11.33,1-22.67,2-34,3 c-16.98-4.17-33.34-21.84-53-26c-39,6.67-78,13.33-117,20c-19.66,0.67-39.34,1.33-59,2c-21.03-4.54-44.05-16.52-74-10 c-77.91,16.97-133.78,58.71-170,119c-7.62,12.69-7.97,24.17-15,39c-5.33,11.24-44.45,22.08-58,28c-9.07,3.97-22.32,10.34-28,18 c-4,6.33-8,12.67-12,19c-14.91,10.34-27.3,0.2-48,5c-20.94,4.86-37.46,27.92-53,31c-6.37,1.26-9.58-2.46-15-2 c-0.67,0.67-1.33,1.33-2,2c2.47,11.16,3.26,18.57-2,36c-7.23,23.96-34.85,21.48-60,29c-15.94,4.77-27.48,15.98-48,20 c-8.23,14.07-15.08,28-23,40c-10.74,1.58-24.15-0.96-27,11c4.33,4.67,8.67,9.33,13,14c20.57-2.42,50.16-29.55,67-40 c9.33-4,18.67-8,28-12c4.67-5.33,9.33-10.67,14-16c13.74-9.24,45.71-5.79,61-15c22.92-13.81,50.86-27.42,73-43c13-10,26-20,39-30 c19.96-7.81,34.92,11.72,56,7c11.58-2.59,13.88-15,22-21c19.29-14.25,39.8-20.02,54-39c19.51-26.07,15.29-75.13,33-102 c1.67-0.33,3.33-0.67,5-1c2.86,2.85,7.81,10.13,14,9c6.05-1.11,38.27-40.1,44-47c21.11-0.84,60.15-2.73,68,16 c8.37,20-14.97,42.48,10,56c19.07-1.28,17.28-18.2,31-24c19.87-8.4,38.86,3.3,59,0c24.55-4.02,54.02-22.02,80-15 c8.39,3.3,13.75,12.79,14,24c-8.34,8.53-18.43,13.55-28,21c-5.67,7.67-11.33,15.33-17,23c-9,7.33-18,14.67-27,22 c-9,13.33-18,26.67-27,40c-18.12,23.6-35.69,39.95-49,70c-6.08,13.73-26.35,44.41-27,61c9.98,9.79-17.98,19.4-18,39 c-17.13,19.52-10.98,54.33-38,62c-0.67,1.67-1.33,3.33-2,5c5.33,6.53,16.14,13.37,27,14c20.58-8.74,24.85-27.77,30-50 c7.2-4.63,17.09-13.96,24-17c5,0.33,10,0.67,15,1c17.04-2.48,33.55-16.18,56-10c9.04,2.49,13.19,10.2,20,15 c8.15-0.26,17.31-2.87,22-7c31.18-18.75-53.74-31.49-62-35c-0.67-1.33-1.33-2.67-2-4c5.14-33.98,37.97-46.75,61-64 c25.18-18.87,36.18-48.2,69-61c19.39-7.56,28.93,12.89,48,9c28.15-5.74,51.09-11.08,82-9c3.54-1.67,25.54-59.46,33-69 c9.73-12.43,55.55-39.81,80-33c19.59,5.46,36.39,17.39,62,20c1.67-1.67,3.33-3.33,5-5c-7.56-14.18-21.18-22.45-24-41 c4.01-7.06,30.11-33.89,37-38c5-1.33,10-2.67,15-4c5.16-3.47,4.53-16.89,8-22c12.06-17.74,37.97-33.02,68-26 c1.67-1.67,3.33-3.33,5-5c-7.91-15.93-29.35-23.26-34-39c-4.12-13.94,3.02-29.29,5-39c4.72-23.16-0.24-46.46-4.17-67 c4.4-8.24,22.6-1.53,27-9c2.33-3.96-9.52-21.46-7-25c1.83-3.1,10.41-10.63,14-12c9.33,1.67,19.67,20.33,29,22 c1.67-2.33-1.67-21.67,0-24c-6.48-9.12-0.67-8.01-7-18c3.12-24.12,4.18-60.77,18-77c6.85-8.04,33.07,0.05,38-10 c3.17-8.31-14.94-29.78-9-38c11.66-16.12,60.1-14.31,80-13c1.33,1.67,11.67,9.33,13,11c-2.76,4.54-23.19,10.2-24,17 c21.71,8.36,57.19,4.86,62,38c0.67,0.33,11.33-2.33,12-2c6.94-1.43,0.05-19.1,5-22c8.61-3.41,21.18,19.02,26,24 c16.84-4.29,57.95-36.17,73-16c1.55,9.64-18.58,27.44-18,36c1.14,16.69,30.8,21.72,44,27c14.45-1.66,26.08-29.5,29.17-42 C1758.17,1043.83,1756.5,1033.5,1754.83,1023.17z"},
//       //                  3000, "=");
//       //             //    caminho.animate(anim.repeat(5000))
//       //             //anim =  Raphael.animation({along : 1}, 300000, "=");
//       //                  //   circ1.animate(anim.repeat(500))
//       //       //   })
//       // //var translate='t'+(-1*lago.getBBox().x)+','+(-1*lago.getBBox().y);
//       // //lago.transform(translate);
//       // //lago.transform('s0.27,0.27,0,0');
//       viewBoxWidth = paper.width;
//       viewBoxHeight = paper.height;
//       canvasID = "#lago";
//       mousedown = false;
//       viewBox = paper.setViewBox(oX, oY, viewBoxWidth, viewBoxHeight);
//       viewBox.X = oX;
//       viewBox.Y = oY;
//       //vB = paper.rect(viewBox.X,viewBox.Y,viewBoxWidth,viewBoxHeight).attr({stroke: "#009", "stroke-width": 3});;
//       /** This is high-level function.
//        * It must react to delta being more/less than zero.
//        */
//       function handle(delta) {
//           vBHo = viewBoxHeight;
//           vBWo = viewBoxWidth;
//           if (delta < 0) {
//               viewBoxWidth *= 0.95;
//               viewBoxHeight *= 0.95;
//           } else {
//               viewBoxWidth *= 1.05;
//               viewBoxHeight *= 1.05;
//           }
//*
//B.attr({
//: viewBox.X,
//: viewBox.Y,
//idth: viewBoxWidth,
//eight: viewBoxHeight
//);
///
//           viewBox.X -= (viewBoxWidth - vBWo) / 2;
//           viewBox.Y -= (viewBoxHeight - vBHo) / 2;
//           paper.setViewBox(viewBox.X, viewBox.Y, viewBoxWidth, viewBoxHeight);
//       }
//       /** Event handler for mouse wheel event.
//        */
//       function wheel(event) {
//           var delta = 0;
//           if (!event) /* For IE. */
//           event = window.event;
//           if (event.wheelDelta) { /* IE/Opera. */
//               delta = event.wheelDelta / 120;
//           } else if (event.detail) { /** Mozilla case. */
//               /** In Mozilla, sign of delta is different than in IE.
//                * Also, delta is multiple of 3.
//                */
//               delta = -event.detail / 3;
//           }
//           /** If delta is nonzero, handle it.
//            * Basically, delta is now positive if wheel was scrolled up,
//            * and negative, if wheel was scrolled down.
//            */
//           if (delta) handle(delta);
//           /** Prevent default actions caused by mouse wheel.
//            * That might be ugly, but we handle scrolls somehow
//            * anyway, so don't bother here..
//            */
//           if (event.preventDefault) event.preventDefault();
//           event.returnValue = false;
//       }
//     /** Initialization code.
//      * If you use your own event management code, change it as required.
//      */
//     if (window.addEventListener) /** DOMMouseScroll is for mozilla. */
//     window.addEventListener('DOMMouseScroll', wheel, false); /** IE/Opera. */
//     window.onmousewheel = document.onmousewheel = wheel;
//     //Pane
//     $(canvasID).mousedown(function(e) {
//         if (paper.getElementByPoint(e.pageX, e.pageY) != null) {
//             return;
//         }
//         mousedown = true;
//         startX = e.pageX;
//         startY = e.pageY;
//     });
//     $(canvasID).mousemove(function(e) {
//         if (mousedown == false) {
//             return;
//         }
//         dX = startX - e.pageX;
//         dY = startY - e.pageY;
//         x = viewBoxWidth / paper.width;
//         y = viewBoxHeight / paper.height;
//         dX *= x;
//         dY *= y;
//         //alert(viewBoxWidth +" "+ paper.width );
//         paper.setViewBox(viewBox.X + dX, viewBox.Y + dY, viewBoxWidth, viewBoxHeight);
//     })
//     $(canvasID).mouseup(function(e) {
//         if (mousedown == false) return;
//         viewBox.X += dX;
//         viewBox.Y += dY;
//         mousedown = false;
//     });
//   })
//   // converts polygons to SVG path string
//   function polys2path(poly, scale) {
//       var path = "",
//           i, j;
//       if (!scale) scale = 1;
//       for (i = 0; i < poly.length; i++) {
//           for (j = 0; j < poly[i].length; j++) {
//               if (!j) {
//                   path += "M";
//                   path += (poly[i][j].X / scale) + ", " + (poly[i][j].Y / scale);
//                   path += "R";
//               } else {
//                   path += "";
//                   path += (poly[i][j].X / scale) + "," + (poly[i][j].Y / scale) + ",";
//               }
//           }
//           path += "Z";
//       }
//       return path;
//   }
//   Array.prototype.flatten || (Array.prototype.flatten = function() {
//       return this.reduce(function(a, b) {
//           return a.concat('function' === typeof b.flatten ? b.flatten() : b);
//       }, []);
//   });
//   function svgpath_to_clipper_polygons(d) {
//       var arr;
//       d = d.trim();
//       arr = Raphael.parsePathString(d); // str to array
//       arr = Raphael._pathToAbsolute(arr); // mahvstcsqz -> uppercase
//       var str = arr.flatten().join(" ");
//       var paths = str.replace(/M/g, '|M').split("|");
//       var k, polygons_arr = [],
//           polygon_arr = [];
//       for (k = 0; k < paths.length; k++) {
//           if (paths[k].trim() === "") continue;
//           arr = Raphael.parsePathString(paths[k].trim());
//           polygon_arr = [];
//           var i = 0,
//               j, m = arr.length,
//               letter = "",
//               x = 0,
//               y = 0,
//               pt = {},
//               subpath_start = {};
//           subpath_start.x = "";
//           subpath_start.y = "";
//           for (; i < m; i++) {
//               letter = arr[i][0].toUpperCase();
//               if (letter != "M" && letter != "L" && letter != "Z") continue;
//               if (letter != "Z") {
//                   for (j = 1; j < arr[i].length; j = j + 2) {
//                       if (letter == "V") y = arr[i][j];
//                       else if (letter == "H") x = arr[i][j];
//                       else {
//                           x = arr[i][j];
//                           y = arr[i][j + 1];
//                       }
//                       pt = {};
//                       pt.X = null;
//                       pt.Y = null;
//                       if (typeof(x) != "undefined" && !isNaN(Number(x))) pt.X = Number(x);
//                       if (typeof(y) != "undefined" && !isNaN(Number(y))) pt.Y = Number(y);
//                       if (pt.X !== null && pt.Y !== null) {
//                           polygon_arr.push(pt);
//                       } else {
//                           return false;
//                       }
//                   }
//               }
//               if ((letter != "Z" && subpath_start.x === "") || letter == "M") {
//                   subpath_start.x = x;
//                   subpath_start.y = y;
//               }
//               if (letter == "Z") {
//                   x = subpath_start.x;
//                   y = subpath_start.y;
//               }
//           }
//           polygons_arr.push(polygon_arr);
//       }
//       return polygons_arr;
//   }
//   function toMercator(lon, lat) {
//       var x = lon * 20037508.34 / 180;
//       var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
//       y = -y * 20037508.34 / 180;
//       return [x, y];
//   }
//   function inverseMercator(x, y) {
//       var lon = (x / 20037508.34) * 180;
//       var lat = (y / 20037508.34) * 180;
//       lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
//       return [lon, lat];
//   }