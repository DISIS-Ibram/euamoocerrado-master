// FLOW DO APLICATIVO


  // Loader.js
  //  ------------ApplicationController
  //   -----------------Mapa controller
  //   --------------------------Percurso Loaded
  //   -------------------------------setup application controller
  //





//Controller de Aplicativos
vtlLinks = (window.vtlLinks === undefined) ? {} : vtlLinks;
vtlLinkAtual = {};


var vtlPERCURSO;

// controlo o status e o bind de todo o aplicativo
vtl.ApplicationController = vtl.EventClass.extend({
  urls:{},
  _pageLoadStatus:null,
  _contentHtml:"",
  _uiGoogle:0,
  _uiTrechos:0,
  _uiRitmo:0,
  _ui_modo:0,


  //quando inicio
  init:function(){
        //so coloco uma referencia global para facilitar minha vida
        vtlAppCrt = this;
        //assisto a todos os eventos/ logo as funcoes e nome dos eventos precisam coincedir
        this.bindAll();
        // inicio o Controlador do mapa
        this.vtlMapaCrt = new vtl.MapaController(vtl_W,vtl_H);
        //quando o percurso tiver carregado, continuo o setup
        this.vEV_PERCURSO_LOADED = this.setup;
   },


  //vai ser chamado quando o percurso tiver carregado
   setup:function(){
        // configuro os links para funcionarem como ajax
        this.linksConfig();
        // setup os routes
        this.routesSetup();
        this.vEV_TRECHOS_INFO_LOADED = null;
        this.setupUIS();

        $("#loader").fadeOut('slow', function() {
            $(this).remove();
        });

  },

  setupUIS:function(){
        //agora configuro os tooltips
        $('#barra-lateral').tooltip({
          selector: "a[data-toggle=tooltip]"
        });
        //configuro onde vai entrar os conteudos
        $("#conteudo-wrap").jScrollPane({autoReinitialise:true});
        //configuro onde vai entrar os conteudos
        $("#lado-page").jScrollPane({autoReinitialise:true});

        $("#loader").fadeOut('slow', function() {
            $(this).remove();
        });
  },





//****************************  SETUPS DOS LINKS/ROUTES

  //setups que cuido dos clicks/uis
  linksConfig: function(){

          //se tem nome de pagina duplicado, faco elas unicas
          var i = 1;
          _.each(navegacao,function(e){
              var name = vtlu.slug(e['name']);
              if( name in vtlLinks){
                  name = name+i;
                  i++;
              }
              e.name = name;
              e['url'] = (CCM_DISPATCHER_FILENAME+e.url);
              vtlLinks[name] = e;
          });




          //para o link de bandeirinhas funcionar sem ajax
          $('#lang a').addClass('ignore');


          //observo todos os clicks em links na página
          $('#page').on('click', "a[target!='_blank'][href]:not('.ignore')", function(event) {

            // if($(this).attr('href').match(/switch_language/)){

            //     window.location = $(this).attr('href');
            // }


            //pego a url
            var url = $(this).attr("href");

            //se o link ja usa hashtag
            if(/^\/?#/.test(url)){
                    //se é hashtag pura, eu ignoro ela completamento
                    if(/^#$/.test(url)){
                        event.preventDefault();
                        return false;
                    }
                   //limpo o location atual se for um hashtag,
                   //pois assim se a url for igual a que estou clicando, rodo ela novamente
                    // window.location = "#";
                    // Sammy('#page').redirect(url);
                 
                    //se é um navegar, e a url é igual a que ja estamos, volto somente para o navegar
                    currurl = Sammy('#page').getLocation().replace(/.*#/,'#');
                    
                    if(url == currurl){
                        Sammy('#page').setLocation("#/navegar");
                         return false;

                    }


                    return true;
            }
            url = url.replace(/.*index.php/,"").replace(/\/$/,"");
            var itemLink = {};
            //procuro se tenho armazenado a url no meu sistema
            var exist = _.find(vtlLinks, function(e){
               var eUrl = e['url'].replace(/.*index.php/,"").replace(/\/$/,"");
               if( eUrl == url){
                  itemLink = e;
                  return true;
                }
            });
            //se não tenho, crio um linkItem para ela
            if(!exist){
              var name = vtlu.slug(url);
              vtlLinks[name] = {name:name,url:url};
              itemLink = vtlLinks[name];
            }
            window.location = "#/"+itemLink.name;
            event.preventDefault();
            return false;
          });

         var that = this;
        //configuro os formulario para funcionarem com ajax
         $('#page').on('submit','form',function(event){
              event.preventDefault();
              var type = $(this).attr('method');
              var url = $(this).attr('action');
              var param = $(this).serialize();
              $(this).html("Processando");
                $.ajax({
                     type: type,
                     url: url,
                     data: param, // serializes the form's elements.
                     success: function(data)
                     {
                          vtlTrigger("_showConteudo",data);
                     }
                   });
              return false;
        });
  },



   _findLinkFromName: function(name){
      var linkItem = null;
      _.find(vtlLinks, function(e){
          if(e['name']==name){
            linkItem = e;
            return true
          }
      });
      return linkItem;
  },






  routesSetup: function(){
        var _that = this;

    //inicio o sammy para controlar o flow do applicativo conforme o menu
        Sammy('#page', function() {
        //    this.use('GoogleAnalytics');


                 // Para o controle da navegacao
          this.get('#/navegar', function() {
                  vtlTrigger('vEV_MODO_NAVEGACAO_SOLO','');

          });


          // Para o controle da navegacao
          this.get('#/navegar/:task', function() {
                  var task = this.params['task'];
                  vtlTrigger('vEV_MODO_NAVEGACAO','');
                  var tarefa = "vEV_TASK_"+task.toUpperCase();
                  vtlTrigger(tarefa,'');
          });



          // define a 'get' route that will be triggered at '#/path'
          this.get(/#\/(.*)/, function() {
                  var context = this;
                  var quem = this.params['splat'][0];
                  // console.log(quem);

                  if(quem === null || quem === undefined) return false;
                  //se for navegar, ignoro pois trato dele acima;
                  if(/navegar/.test(quem)){ vtlTrigger('vEV_MODO_NAVEGACAO',''); return false;}

                  var itemLink = _that._findLinkFromName(quem);
                  vtlTrigger('vEV_MODO_MENU','');
                  vtlTrigger("vEV_PAGE_LOAD",{item:itemLink,url:itemLink.url});

              });
        }).run("#/inicio");
  },







   //****************************  EVENTOS DE CONTEUDO
   //
   vEV_PAGE_LOAD:function(obj){
        //faco o ajax da pagina
        var _that = this;
        vtlTrigger("vEV_PAGE_LOAD_START", obj.item);

        $.ajax({
          url: obj.url,
          type: 'GET',
          data: {isAjax: 1},
          success: function(data, textStatus, xhr) {
            vtlTrigger("vEV_PAGE_LOAD_END",{data:data,itemLink:obj.item});
          },
          error: function(xhr, textStatus, errorThrown) {
             vtlTrigger("vEV_PAGE_LOAD_FAIL",{data:textStatus});
          }
        });

   },

   vEV_PAGE_LOAD_START: function(obj){
      this._pageLoadStatus="start";

      var pos = {x:obj.x, y:obj.y, z:obj.z};
      vtlTrigger("vEV_ANIMA_MAPA_BEZIER",{data:pos,time:2});

       $("#conteudo-wrap").stop().fadeOut('fast', function() {
           $("#conteudo-wrap #conteudo-conteudo").html("Carregando....");
       });
   },

   vEV_PAGE_LOAD_END: function(obj){

      var texto = vtl.Util.parseC5page(obj.data);
      this._contentHtml = texto; //so salvo, não coloco ainda, pois se tiver na animacao, trava um pouco

      //se a animacao ja acabou, applico e mostro
      if(this._pageLoadStatus == "animend"){
          this._showConteudo(texto);
      }
      //se nao acabou ainda, salvo o resultado

      this._pageLoadStatus="end";



      // $("#conteudo-wrap #conteudo-conteudo").html(texto);
      // var _that = this;
      // setTimeout(function(){_that.vEV_MOVE_END()},10000); //se em 1 segundo nao terminou a animação, mostro o conteudo
   },

   vEV_ANIMATION_END:function(){
      if(this._pageLoadStatus=="start"){
        this._pageLoadStatus="animend";

         //mostro que to carregando
         $("#conteudo-wrap").stop().fadeIn('fast');

      }else if(this._pageLoadStatus=="end"){
        this._showConteudo(this._contentHtml);
        this._pageLoadStatus="animend";
      }


   },


    vEV_MOVE_STEP:function(obj){
      if(CCM_EDIT_MODE == true){
        $("#info").text("x:"+obj.x.toFixed(2)+"    y: "+obj.y.toFixed(2)+"   z: "+obj.z.toFixed(2));
      }
    },






   //****************************  FUNCOES DE CONTEUDO

    _showConteudo:function(html){

      $("#conteudo-wrap #conteudo-conteudo").html(html);

      //inclui no div
      $(".menumode #conteudo-wrap").show(0);

      $("#conteudo-wrap").stop().fadeIn('fast');

       TweenMax.from($("#conteudo-conteudo h1.titulo"),0.5,{scale:0,rotation:0,delay:0.1,imediateRender:true});

       $(document).ready();
    },



    _hideConteudo:function(html){
          $("#conteudo-wrap").stop().fadeOut('fast');
     },


    vEV_PAGE_LOAD_SHOW: function(obj){},

    vEV_PAGE_LOAD_HIDE: function(obj){},


    vEV_MOSTRA_CONTEUDO_LATERAL: function(obj){
        obj.callback = obj.callback || function(){};
        this._conteudoLateral(obj.html,obj.callback);
    },

    vEV_MODO_MENU: function(){
        this._hideLateral();
        this._showConteudo();
    },

    vEV_MODO_NAVEGACAO: function(){
      //show os kms
        vtlTrigger("vEV_SHOW_KMS_IF_HIDDEN",'');
        this._hideConteudo();
    },

    vEV_TASK_NAVEGAR: function(){
        vtlTrigger("vEV_ANIMA_MAPA",{data:{x:-245,y:-363,z:0.74},time:2});
    },



    //setup de eventos
    setupEvents:function(){


    },



    //parte que controla os conteudos
    carregaPagina:function(){

    },







   _conteudoLateral:function(html,callback){
      $("#trechoLayer").remove();
      $("<div id='trechoLayer' style='font-size:10px;color:white'></div>").appendTo('#trechos-tab');
      $("#trechoLayer").html(html).show();
      TweenMax.to($("#page"),0.6,{left:240,right:0, delay:0.4, onComplete:function(){vtlTrigger(vEV_RESIZE,"");}});
      callback.call();
  },


  _hideLateral:function(){
     TweenMax.to($("#page"),0.6,{left:0,right:0, delay:0.2, onComplete:function(){vtlTrigger(vEV_RESIZE,"");}});
  },








  //****************************   UI LISTNERS/FUNCTIONS

    VEV_TASK_GMAPSTOOGLE: function(data){
        // console.log('aaa')
        vtlTrigger('vEV_GOOGLE_MAPS');
    },

    vEV_TASK_RITMOTOGGLE: function(data){
        if(!this.ritmowidget){
              var perc = this.getPercurso()
              this.ritmowidget = new vtl.RitmoWidget(perc);
        }

        this.ritmowidget._toogle();
    },


    vEV_TASK_PLANILHATOGGLE: function(data){
        if(!this.planilhawidget){
              var perc = this.getPercurso()
              this.planilhawidget = new vtl.PlanilhaWidget(perc);
        }

        this.planilhawidget._toogle();
    },


    vEV_TASK_TRECHOSTOGGLE: function(data){
        if(!this.trechowidget){
              var perc = this.getPercurso()
              this.trechowidget = new vtl.TrechoWidget(perc);
        }
        this.trechowidget._toogle();
    },


    vEV_TASK_RESULTADOTOOGLE: function(data){
        if(!this.resultadowidget){
              var perc = this.getPercurso()
              this.resultadowidget = new vtl.ResultadoWidget(perc);
        }else{
          this.resultadowidget._toogle();
        }
    },





    vEV_TASK_ALTIMETRIATOOGLE: function(data){

    },

    vEV_TASK_KMSTOOGLE: function(data){

    },





    getPercurso:function(){
      return vtlAppCrt.vtlMapaCrt.percurso
    }

});


















/////////////////////////////////////////////////
//  MAPA CONTROLLER
/////////////////////////////////////////////////


vtl.MapaController =  vtl.e2D.extend({
      name:"MapaController",
      _that:this,
      _moveStatus:"STILL",  // MOVING, STILL
      _zoomStatus:"STILL",  // ZOOIMG, STILL
      _winH:0,
      _winW:0,
      _xOld:0,
      _yOld:0,
      _zOld:1,
      drag:{
        elem: null,
        x: 0,
        y: 0,
        state: false
      },
      delta:{
          x: 0,
          y: 0
      },
      percurso:null,
      classid:"MapaController",

      checkMoveEndTh:function(){},
      checkZoomEndTh:function(){},



//****************************  SETUP DE LOADS DE OBJETOS

      init:function(w,h){
            //so salvo uma referencia para acesso globaix mais faceis
            vtl.ControllersObjects[this.name] = this;

            this._super();
            this.w(w);
            this.h(h);

            this.bindAll();

            _.bindAll(this);

            this.setupEvents();

            this.onWindowRezise(); //rodo a primeira vez apra pegar ele

            //crio funcoes que vao auxiliar na verificação de quando o mapa esta movendo ou esta parado
            this.checkMoveEndTh = _.debounce(this.checkMoveEnd,700,false);
            this.checkZoomEndTh = _.debounce(this.checkZoomEnd,500,false); //false so para ocorrer depois




            //agora crio o lago
            this.lagoLayer = new vtl.LagoLayer();


      },

      setupEvents:function(){
              var _that = this;
              $("#cr-stage").mousedown( _that.mousedown);
              $("#cr-stage").mousemove(_that.mousemove);
              $("#cr-stage").mouseup(_that.mouseup);
              this.mouseWhellTh = _.throttle(_that.mousewhellFunc,40);
              $("#cr-stage").mousewheel(_that.mouseWhellTh);
              $("#cr-stage").dblclick(_that.zoomIn);

              $(window).bind("resize",_that.onWindowRezise);
      },


    vEV_LAGO_LOADED: function(data){  //quando o lago é todo carregado e configurado
            this.percurso = new vtl.Percurso({paper:data.paper,url:(CCM_TOOLS_PATH+"/percurso.php"),callback:this.showPercurso,context:this}); //

            //um globallll
            window.vtlPERCURSO = this.percurso;
    },




//****************************  SETUP DE EVENTOS DE MOUSE

    mousedown : function(e) {
        if (!this.drag.state) {
             this.notificaEvento("vEV_MOUSE_DOWN");
            this.drag.x = e.pageX;
            this.drag.y = e.pageY;
            this.drag.state = true;
             $('body,#cr-stage').addClass('grabbing');
        }
        return false;
    },

    mousemove : function(e) {
      if (this.drag.state) {
          this.delta.x = e.pageX - this.drag.x;
          this.delta.y = e.pageY - this.drag.y;
          this._x += this.delta.x;
          this._y += this.delta.y;
       //   this.boundaries();

          //trigo o evento que o mouse foi drag
          this.notificaEvento("vEV_MOUSE_DRAG");
          this.drag.x = e.pageX;
          this.drag.y = e.pageY;

          this.updateInterno();
      }
    },


     mouseup: function(){
        if (this.drag.state) {
           // this.drag.elem.style.backgroundColor = '#808';
            this.drag.state = false;
            $('body,#cr-stage').removeClass('grabbing');
            this.notificaEvento("vEV_MOUSE_UP");
        }
     },


    mousewhellFunc: function(event, delta,dx,dy) {

        if(delta === undefined) return;

      //  var deltaFactor = vtlu.math.fromToInterpolation(2.4,0.36,1,0.04,this._z,true);


       // var deltaFactor = 1;

       // val = (delta/100*deltaFactor); //Math.clamp(delta, -0.56, 0.56);

        var val = (delta>0) ? 0.10 : -0.10;


        //a porcentagem de onde ocorrey na cordenada do mapa o evento
        prcX = ((-this._x + event.pageX) / this._w) / this._z;
        prcY = ((-this._y + event.pageY) / this._h) / this._z;

        //e a porcentagem onde ocorreu na janela
        pwX = event.pageX / this._winW;
        pwY = event.pageY / this._winH;

        //largura antiga
        var old = {
          width: this._w * this._z,
          height: this._h * this._z
        };
        this._z += val;
        this._z = Math.clamp(this._z, 0.35, 6);

        //largura nova
        var new_s = {
          width: this._w * this._z,
          height: this._h * this._z
        };

        //a diferenca da largura antiga para a nova
        var diff = {
          width: new_s.width - old.width,
          height: new_s.height - old.height
        };

        //ai mexo essa diferenca proporcional ao ponto no mapa
         this._x -= diff.width * prcX;
         this._y -= diff.height * prcY;

         this.updateInterno();

         this.notificaEvento("vEV_MOUSE_WHELL");

         return false;
    },


    onWindowRezise : function(){
          vtlTrigger(vEV_RESIZE,"");
          this._winW = $("#mapa-wrap").width();//win.width();
          this._winH = $("#mapa-wrap").height();//win.height();
    },


//****************************  ATRIBUTOS INTERNOS


    updateInterno: function(){
          //verifico se ta movendo
          if(this._moveStatus == "STILL"){
              this.notificaEvento("vEV_MOVE_START");
              this._moveStatus = "MOVING";
          }else{
              this.notificaEvento("vEV_MOVE_STEP");
          }

          //para zoom separado
          //se mudou o zoom
          if(this._zOld !== this._z){
                if(this._zoomStatus == "STILL"){
                    vtlTrigger("vEV_ZOOM_START",{z:this._z});
                    this._zoomStatus = "ZOOIMG";
                }else{
                    vtlTrigger("vEV_ZOOM_STEP",{z:this._z});
                }
            //se nao é zoom que mudou, verifico em xxseg se continua o mesmo, se continuar,
            //falo que parou o zoom
            this.checkZoomEndTh();
          }

          this._zOld = this._z;

          //chamo uma funcao throutad(chamada so de 0.7 a 0.7 segundos) para verificar se paramos de mover o mapa
          this.checkMoveEndTh();

          return this;
    },

    //para notificar sempre com os x,y,etc
    notificaEvento:function(nome){
          var obj = {x:this._x,y:this._y,z:this._z,rotation:this._rotation};
          vtlTrigger(nome,obj);
    },


    //funcao suporte para verificar se o movimento terminou
    checkMoveEnd: function(){
        //se a posicao é diferente
        if(this._xOld !== this._x || this._yOld !== this._y  || this._zOld !== this._z){
           //se a posicao NAO é a mesma, continuo verificando
           this.checkMoveEndTh();
        //se é igual
        }else{
            this._moveStatus = "STILL";
            this.notificaEvento("vEV_MOVE_END");
        }

        this._xOld = this._x;
        this._yOld = this._y;
        this._zOld = this._z;
    },


    //funcao suporte para verificar se o zoom
    checkZoomEnd: function(){
        //se a posicao é diferente
        if(this._zOld !== this._z){
           //se a posicao NAO é a mesma, continuo verificando
           this.checkZoomEnd();
        //se é igual
        }else{
            this._zoomStatus = "STILL";
             vtlTrigger("vEV_ZOOM_END",{z:this._z});
        }
        this._zOld = this._z;
    },


     vEV_MOUSE_DRAG: function(){
      // Stop a animação do assets
      VTL_TIMELINE.pause();
    },

    vEV_MOVE_START: function(){
      // Stop a animação do assets
      VTL_TIMELINE.pause();
    },
    vEV_MOVE_END: function(){
      // Stop a animação do assets
      VTL_TIMELINE.play();
    },
    vEV_MOUSE_UP : function(){
      // Stop a animação do assets
      VTL_TIMELINE.play();
    },










//****************************  Funcoes Publicas
//


      vEV_TASK_ZOOMOUT:function(){
        this.zoomOut();
      },


      vEV_TASK_ZOOMIN:function(){
        this.zoomIn();
      },

      vEV_TASK_ZOOMBOUNDBOX:function(bbx){
        this.cameraZoomBound(bbx,0.5);
      },

     vEV_TASK_ZOOMBOUNDBOX_FAST:function(bbx){
        this.cameraZoomBound(bbx,0.3);
      },






//****************************  ANIMACOES
//
      vEV_ANIMA_MAPA:function(obj){
          this._animate(obj.data,obj.time);
      },

      vEV_ANIMA_MAPA_BEZIER:function(obj){
          this._animateBezier(obj.data,obj.time);
      },

      _animate: function(obj,time,evfalse){
          evfalse = evfalse || true
          this.xx = this._x;
          this.zz = this._z;
          this.yy = this._y;
          this.ev = evfalse;

          // console.log("animate");

          TweenMax.killTweensOf(this);

          TweenMax.to(this,time,{xx:obj.x,yy:obj.y,zz:obj.z,onUpdateScope:this,onStartScope:this,onCompleteScope:this,

                      onStart:function(){
                       if(this.evfalse) vtlTrigger("vEV_ANIMATION_START",{x:this._x,y:this._y,z:this._z});
                      },

                      onUpdate: function(){
                          this._x = this.xx;
                          this._y = this.yy;
                          this._z = this.zz;
                          vtlTrigger("vEV_ANIMATION_STEP",{x:this._x,y:this._y,z:this._z});
                      },

                      onComplete:function(){
                        if(this.evfalse) vtlTrigger("vEV_ANIMATION_END",{x:this._x,y:this._y,z:this._z});
                      },
          });
      },


      _animateBezier: function(obj,time){
          var x = this.xx = this._x;
          var y = this.yy = this._y;
          var z = this.zz = this._z;
          var xx =parseFloat(obj.x);
          var yy =parseFloat(obj.y);
          var zz =parseFloat(obj.z);

          xx = xx ? xx : x;
          yy = yy ? yy : y;
          zz = zz ? zz : z+0.5;

          var winW = $(window).width();
          var winH = $(window).height();

          //ponto no inicio
          var px = Math.abs((x-winW/2)/z);
          var py = Math.abs((y-winH/2)/z);

          //ponto no FIM do mapa
          var pxf = Math.abs((xx-winW/2)/zz);
          var pyf = Math.abs((yy-winH/2)/zz);

          //ponto no MEIO do mapa
          var pxm = Math.abs((Math.max(px,pxf)+Math.min(px,pxf))/2);
          var pym = Math.abs((Math.max(py,pyf)+Math.min(py,pyf))/2);

          //pego a distancia entre os pontos
          var dist3d = vtl.Util.math.distance3d(px,py,z,pxf,pyf,zz); //quanto maios a dif
          var angleInDegrees = Math.atan2((zz-z), (pxf - px)) * 180 / Math.PI;

          var distanciaXY = vtlu.math.distance(x,y,xx,yy);
          var diztanciaZ = (z-zz);
          var distancia = vtlu.math.distance3d(x,y,z,xx,yy,zz);
          var distanciaRel = vtlu.math.distance(px*z,py*z,pxf*z,pyf*zz)*z;


          var difAltura = Math.abs(zz-z); //quanto menor a diferenca, maior o z

          //crio no meio da linha entre um ponto e outro, um ponto mais acima no Z

          // var zpeladistancia =  vtlu.math.fromToInterpolation(300,2000,0,1.5,dist3d,true);
          // var zpertoTopo = vtlu.math.fromToInterpolation(3.5,0.36,0,1.5,z,true);
          // var zmid = (Math.min(z,zz)-(zpeladistancia-zpertoTopo));
          // zmid = Math.clamp(zmid,1,5);



          time = vtlu.math.fromToInterpolation(0,3000,1,6,dist3d,true);
          var curveness = vtlu.math.fromToInterpolation(800,1500,1,2,dist3d,true);


          //o zoom que dou para cima
          var zpeladistancia = vtlu.math.fromToInterpolation(300,2000,0,1.5,distanciaRel,true);
          var zpertoTopo = vtlu.math.fromToInterpolation(3.5,0.36,0,1.5,z,true);

          zmid = (Math.min(z,zz)-(zpeladistancia-zpertoTopo));
          zmid = Math.clamp(zmid,1,5);


          xmid = -pxm*zmid;
          ymid = -pym*zmid;

          xmid+=(winW/2);
          ymid+=(winH/2);

         var pontospath = [{xx:xmid,yy:ymid,zz:zmid},{xx:xx,yy:yy,zz:zz}];

         if((distanciaRel < winW) || z<0.4 || Math.abs(z-zz)>4) {
           // console.log("é menor");
            pontospath = [{xx:x,yy:y,zz:z},{xx:xx,yy:yy,zz:zz}];
        }


          TweenMax.to(this,time,{bezier:{values:pontospath,type:"thru",curviness:curveness,timeResolution:0 },onUpdateScope:this,onStartScope:this,onCompleteScope:this,

                      onStart:function(){
                        vtlTrigger("vEV_ANIMATION_START",{x:this._x,y:this._y,z:this._z});
                      },

                      onUpdate: function(){
                          this._x = this.xx;
                          this._y = this.yy;
                          this._z = this.zz;
                          vtlTrigger("vEV_ANIMATION_STEP",{x:this._x,y:this._y,z:this._z});
                      },

                      onComplete:function(){
                          vtlTrigger("vEV_ANIMATION_END",{x:this._x,y:this._y,z:this._z});
                      },

                      ease:Sine.esaseInOut
          });
      },




//****************************  UTILITARIOS

      //bbox é bbox do raphael.js
      //{
      // x:numbertop left corner x
      // y:numbertop left corner y
      // x2:numberbottom right corner x
      // y2:numberbottom right corner y
      // width:numberwidth
      // height:numberheight

      cameraZoomBound : function(bbox,time){

               bbox.x = -bbox.x - $("#page").position().left;
               bbox.y = -bbox.y;



              var winW = $("#page").width();
              var winH = $("#page").height();

              //pego o zoom que precisa estar para caber na tela
              var widthObj = bbox.width;
              var heightObj = bbox.height;

              var zdest = widthObj > heightObj ? winW/widthObj : winH/heightObj;
               // zdest *= 0.5; //quero 70% do view
              //pego a posicao que precisa estar para caber na tela

              var ref = widthObj > heightObj ? widthObj : heightObj;


              var xmid = bbox.x+(widthObj/2);
              var ymid = bbox.y+(heightObj/2);

              var point = this.xyFromCenterPoint(xmid,ymid,(zdest));
              this._animate({x:-point.x,y:-point.y,z:zdest},time);
            //
            //z = zdest;
            //this.cameraCenterInPoint({x:xmid,y:ymid});
      },


      xyFromCenterPoint : function(centerX,centerY,zoom){
              zoom = zoom || this._z;
              //o x que preciso estar é?
              //o y que preciso estar é?
              var xdest = -centerX*zoom;
              var ydest = -centerY*zoom;
              var winW = $("#page").width();
              var winH = $("#page").height();

              xdest+=winW/2;
              ydest+=winH/2;

              return {x:xdest,y:ydest};

      },

      vEV_CENTER_VIEW_IN_POINT: function(point){
          this.cameraCenterInPoint(point);
      },
      cameraCenterInPoint : function(point){

            //o x que preciso estar é?
            //o y que preciso estar é?
            var winW = $("#page").width();
            var winH = $("#page").height();

            var x = -point._x*this._z;
            var y = -point._y*this._z;
            x+=winW/2;
            y+=winH/2;

            this._animate({x:x,y:y,z:this._z},0.4,false);
      },




  vEV_ZOOMOUT_ACTION:function(){
      this.zoomOut();
    },
   vEV_ZOOMIN_ACTION:function(){
      this.zoomIn();
    },

    zoomIn:function(){

        //pego o centro
        val = 0.4;

        var winW = $("#page").width();
        var winH = $("#page").height();
        var w = this._w;
        var h = this._h;
        var x = this._x;
        var z = this._z;
        var y = this._y;

        //a porcentagem de onde ocorrey na cordenada do mapa o evento
        var prcX = ((-x + winW/2) / w) / z;
        var prcY = ((-y + winH/2) / h) / z;

        //e a porcentagem onde ocorreu na janela
        pwX = 0.5;
        pwY = 0.5;

        //largura antiga
        var old = {
          width: w * z,
          height: h * z
        };
        z += val;
        z = Math.clamp(z, 0.35, 6);

        //largura nova
        var new_s = {
          width: w * z,
          height: h * z
        };

        //a diferenca da largura antiga para a nova
        var diff = {
          width: new_s.width - old.width,
          height: new_s.height - old.height
        };

        //ai mexo essa diferenca proporcional ao ponto no mapa
         x -= diff.width * prcX;
         y -= diff.height * prcY;

        this._animate({x:x,y:y,z:z},0.8);
        return false;
    },


     zoomOut:function(){

        //pego o centro
        val = -0.4;

        var winW = $("#page").width();
        var winH = $("#page").height();
        var w = this._w;
        var h = this._h;
        var x = this._x;
        var z = this._z;
        var y = this._y;
        //a porcentagem de onde ocorrey na cordenada do mapa o evento
        prcX = ((-x + winW/2) / w) / z;
        prcY = ((-y + winH/2) / h) / z;

        //e a porcentagem onde ocorreu na janela
        pwX = 0.5;
        pwY = 0.5;

        //largura antiga
        var old = {
          width: w * z,
          height: h * z
        };
        z += val;
        z = Math.clamp(z, 0.35, 6);

        //largura nova
        var new_s = {
          width: w * z,
          height: h * z
        };

        //a diferenca da largura antiga para a nova
        var diff = {
          width: new_s.width - old.width,
          height: new_s.height - old.height
        };

        //ai mexo essa diferenca proporcional ao ponto no mapa
         x -= diff.width * prcX;
         y -= diff.height * prcY;

        this._animate({x:x,y:y,z:z},0.8);
        return false;
    },



});






