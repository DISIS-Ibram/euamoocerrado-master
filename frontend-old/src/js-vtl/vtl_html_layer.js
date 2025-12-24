





/////////////////////////////////////////////////
//   HTML Layer
/////////////////////////////////////////////////

vtl.HtmlLayer = vtl.Layers.extend({

    divs:[],
    _that:this,

    init: function(){
            this._div = "#htmlLayer";
            this.$div = $(this._div);
            var divs = this.divs = [];
            var defaults = {
                      x:0,
                      y:0,
                      rotX:0,
                      rotY:0,
                      rotZ:0,
                      rotation:"0 0 0",
                      oriX:50,
                      oriY:50,
                      origem:"0% 0%",
                      perspective:"0",
                      zoom:false,
                      scale:1,
                      scalerate:1,
                      showin:false, //controlo se sempre visivel ou não
                      showinzoom:1,
                      showinraio:500,
                      showinzoomdelta:0.5,
                      mostrando: true,
                      pin: false // controlo se move com o mapa ou não
                     };


                      //        $("#htmlLayer > div, .layer").remove();


                //loop para todos os divs animados
               $("#htmlLayer > div, .layer").each(function(event) {
                  var div = $(this);
                  var posicaoTemp = div.offset();
                  if (div.data("x") === undefined) {
                        div.data("x", posicaoTemp.left);
                        div.data("y", posicaoTemp.top);
                  }
                  //mergo as infos do defaults com as do div
                  objetoData = div.data();
                  divInfo = $.extend({}, defaults, objetoData);

                  var ori = divInfo.origem.split(" ");
                  divInfo.oriX = parseInt(ori[0],10)/100;
                  divInfo.oriY = parseInt(ori[1],10)/100;

                  var rot = divInfo.rotation.split(" ");
                  divInfo.rotX = parseInt(rot[0],10);
                  divInfo.rotY = parseInt(rot[1],10);
                  divInfo.rotZ = parseInt(rot[2],10);

                  divInfo.width = div.width();
                  divInfo.height = div.height();

                  divInfo.jdiv = div; //e coloco o objeto jquery do elemento no array tb

                  if (divInfo.showin){
                 //     divInfo.html = jdiv.html();
                  }
                  //para cada div, crio uma entidade no mapa de verdade
                 divInfo.elWatcherID = Crafty.e("2D, DOM").attr({x:divInfo.x,y:divInfo.y,w:1, h:1}).getDomId();
                 divInfo.elWatcher  = document.getElementById(divInfo.elWatcherID);
                //  TweenLite.to(divInfo.jdiv, 0, {
                //     css: {
                //         top: divInfo.x,
                //         left: divInfo.y,
                //         scale: divInfo.scale,
                //         transformOrigin: divInfo.origem,
                //         rotationX: divInfo.rotX,
                //         rotationY: divInfo.rotY,
                //         rotationZ: divInfo.rotZ,
                //         transformPerspective: divInfo.perspective,
                //         overwrite:'all'
                //     }
                // });
                  div.data("infos",divInfo);
                  divs.push(divInfo);
            });

            //loop para todos os estaticos



               this.moveCameraTo(0,0,1,0,0,0,0);
    },


    moveCameraTo: function(x, y, z, angle, vel, tox, toy) {


      //return;

        for (i = 0, f = this.divs.length; i < f; i++) {

            var porc = z;
            var div = this.divs[i];
            var jdiv = div.jdiv;
            var atualiza = true;


            // se é para processar os divs que eu so mostra quando tiver no local deves, analizo
            if (div.showin) {

                atualiza = false;
                var d = div.showinzoomdelta;
                //verifico se o zoom esta no range informado
                if (div.showinzoom < z + d && div.showinzoom > z - d) {
                    //verifico se a diferenca da posicao TL do div com a localizacao atual esta no range
                    var left = x+((div.x*z)-(div.width * div.oriX));
                    var top =  y+((div.y*z)-(div.height * div.oriY));

                    if( left<div.showinraio && left > - div.showinraio && top<div.showinraio && top > -div.showinraio){
                        atualiza = true;
                        if(div.mostrando === false){
                            div.mostrando = true;

                            //jdiv.show();
                      //    TweenMax.to(jdiv, 0.3, {css:{autoAlpha: 1}, onCompleteScope:div, onComplete:function(){ this.mostrando = true;}});
                          }
                    }
                }

                if(atualiza === false &&  div.mostrando === true){
                     div.mostrando = false;
                      //jdiv.hide();
                  //  TweenMax.to(jdiv, 0.3, {css: {autoAlpha: 0}});
                      TweenMax.to(jdiv, 0.3, {css:{autoAlpha: 0}, onCompleteScope:div, onComplete:function(){ this.mostrando = false;}});
                   // _.delay(function(){jdiv.html('')})
               }

            }



            // atualizo o div, caso seje nescessario
            if (atualiza) {


                var xdiv = div.x;
                var ydiv = div.y;
                //multiplico por z para colocar na mesma proporcao
                xdiv *= z;
                ydiv *= z;
                //e aplico o tanto que ja movemos o mapa
                xdiv += x;
                ydiv += y;

                if (div.pin) {
                    xdiv = 0;
                    ydiv = 0;
                }
                //e aplico para o centro ser no center bottom do objeto
                xdiv -= (div.width * div.oriX);
                ydiv -= (div.height * div.oriY);


               //   var posInfo = div.elWatcher.getBoundingClientRect();

               // // // console.log(posInfo);
               //  xdiv = posInfo.left;
               //  ydiv = posInfo.top;

               //  xdiv -= (div.width * div.oriX);
               // ydiv -= (div.height * div.oriY);

                scala = div.zoom ? z * div.scale : 1;



                TweenMax.killTweensOf(jdiv);

                TweenLite.to(jdiv, vel, {
                    css: {
                        top: ydiv,
                        left: xdiv,
                        scale: scala,
                        autoAlpha: 1,
                        transformOrigin: div.origem,
                     //   rotation:div.rotX,
                     //  rotationX: div.rotX,
                     //  rotationY: div.rotY,
                     //  rotationZ: div.rotZ,
                     //  transformPerspective: div.perspective,
                        overwrite:'auto',
                        roundProps:"top,left"
                    }
                });
            }
        }
    }








});
// ********** fim htmlLayer





