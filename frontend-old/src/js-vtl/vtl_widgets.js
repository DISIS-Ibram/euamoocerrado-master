

vtl.WidgetBase = vtl.EventClass.extend({



})


/////////////////////////////////////////////////
//  WIDGETS - Laterais
/////////////////////////////////////////////////

vtl.WidgetBase = vtl.EventClass.extend({
    _nome:'basewidget',
    _start:false,
    _width:240,
    _data:{},
    _json:undefined,
    _open:false,
    _urlGet:'',
    _pos:'left',
    _icon:'#ritmoicon',
    _wrapID:'',
    _wrapClass:'',
    _wrapClass:'',
    _html:'',
    _target:'body',
    _insermode:'prepend',
    _js:function(){},
    _css:'',

    init:function(data){
        this._data = data;
        this.bindAll();
         _.bindAll(this);

        if(this._urlGet != ''){


            var _this = this;

            this.ajax =  $.ajax({
              url: _this._urlGet,
              dataType: 'json',
            })


            this.ajax.then(function(dataobj) {
                    _this._createHtml(dataobj);  
                    _this._createJs();
                    _this._show();
            });

   


        }else{
        
         this._createHtml();  
         this._createJs();

       }




        return this;
    },

    vEV_WIDGET_CLOSEIFOPEN: function(nome){
        if(nome!=this._nome && this._open){
          this._hide();
        }
        return this;
    
    },

    _toogle:function(){
        //mando todos os outros que tiverem aberto fechar
        vtlTrigger('vEV_WIDGET_CLOSEIFOPEN',this._nome);
        
        if(this._open){
          this._hide();
        }else{
          this._show();        
        }
    },


    _show:function(){
      $(this._icon).addClass('active');

      TweenMax.to($("#page"),0.6,{left:300,right:0, delay:0.6, 
        onStartScope:this,
        onStart:function(){
              $("<div id='trechoLayer' style='font-size:10px;color:white'></div>").appendTo('#trechos-tab');
              $("#trechoLayer").html(this._html).show();
              this._createJs();

      }, onComplete:function(){vtlTrigger(vEV_RESIZE,"");}});
              this._open = true;
    },



    _hide:function(){
        $(this._icon).removeClass('active');
        TweenMax.to($("#page"),0.4,{left:0,right:0, delay:0, onComplete:function(){vtlTrigger(vEV_RESIZE,"");}});
        this._open = false;
    },


    _createHtml:function(){

    },


    _createJs:function(){

    },



    _load:function(){


    },

    //se entro no modo de nmavegacao somente, escondo qualquer widget
    vEV_MODO_NAVEGACAO_SOLO: function(){
      
          this._hide();
     
    },


})






//  Ritmo widget
//-----------------------

vtl.RitmoWidget = vtl.WidgetBase.extend({
    _nome:'ritmo',
    _icon:'#ritmoicon',

    init:function(data){
       this._super(data);
       this.data = data
    },

    _createHtml: function(){

      // var str = "<div class='row-fluid'><div class='span12' id='trechosRitmo'>";
      //  str+='<div class="row-fluid ">\
      //       <div class="span6"><h3>Horário Largada </h3> </div>\
      //       <select  class="span5" id="hor-largada" name="psclID"><option value="06h15m">06:15</option><option value="07h30m">07:30</option></select>\
      //       <div class="info" style="margin-top:-10px;line-height:10px"></div></div>';


 var str = "<div class='row-fluid'><div class='span12' id='planilhaRitmo'>";


      str+='<div class="panel panel-default">\
        <div class="panel-heading"><i>1</i>Horario de largada<small>Escolha o horario de largada que deseja</small></div>\
        <div class="panel-body">\
          <select  class="span12" id="hor-largada" name="psclID"><option value="06h15m">06:15</option><option value="07h30m">07:30</option></select>\
        </div>\
      </div>';




   str+='<div class="panel panel-default">\
    <div class="panel-heading"><i>2</i>Trechos<small>Defina o tempo estimado em cada trecho</small></div>\
        <div class="panel-body">';

      for (var i = 0; i < this._data.gpx._trechos.length; i++) {
        var pi =  this._data.gpx._trechos[i];




        str+='<div class="trecho-linha row-fluid ritmo">\
            <div class="span7"><h3>&emsp;' +pi.nome+' - <small> &emsp;'+pi.distInfo+' km</small> </h3> </div>\
            <input  class="span5 input-mini trecho-ritmo" data-abertura="'+pi.pi1.abertura+'" data-fechamento="'+pi.pi1.fechamento+'" data-dist="'+pi.distInfo+'" id="prependedInput" type="text" placeholder="0h00m">\
            <div class="info"></div></div>';

      };

   str+='</div></div>';



   str+='<div class="panel panel-default">\
    <div class="panel-heading"><i>3</i>Resultado<small></small></div>\
        <div class="panel-body">';

      str+="<div class='row-fluid'>\
                <div class='span6'> \
                  <h3  style='font-size:14px;text-align:left'>Tempo total:<div style='font-size:18px;' id='tempototal'> 0h</div></h3>\
                </div> \
                <div class='span6'>\
                   <h3  style='font-size:12px;text-align:left'>Média do Ritmo:<div style='font-size:18px;' id='pacemedio'> 0 min/h</div></h3>\
                 </div>\
                </div>\
                </div></div>";

            str+='</div></div>';
        
        this._html = str;

        return this;
    },

    _createJs: function(){

      window.convInMinutos = function(val){
           var arrm = val.match(/(\d+)h(\d+)m/);
            if(arrm != null){
              return parseInt(arrm[1]*60,10) + parseInt(arrm[2],10);
            }else{
              return 0;
            }
      };

       $('.trecho-ritmo:eq(0)').focus();
       $('.trecho-ritmo').mask("9h99m");
       $('.trecho-ritmo, #hor-largada').change(function(){
          var total = 0;
          var distTotal = 0;
          var minLargada = convInMinutos($('#hor-largada').val());
          
          $('.trecho-ritmo').each(function(event) {
              //converto o valores para o tempo real
              var val = $(this).val();
              var arrm = val.match(/(\d+)h(\d+)m/);
              if(arrm != null){
                  var minutosTotal = parseInt(arrm[1]*60,10) + parseInt(arrm[2],10);


                 var dist = $(this).data("dist");
                 distTotal += dist;
                 //vejo se esse ta no limite
                 var pacePista = minutosTotal/dist;

                 // if(pacePista > 6.3){
                 //   $(this).parents(".ritmo").find(".info").text("Ritmo de "+pacePista.toFixed(2)+" min/km muito lento.").css("color","red");
                 // }else{
                 //    $(this).parents(".ritmo").find(".info").text("Ritmo de "+pacePista.toFixed(2)+" min/km").css("color","yellow");
                 // }

                 // var minAbertura = convInMinutos( $(this).data("abertura"));
                 var minFechamento = convInMinutos( $(this).data("fechamento"));

                 if((total+minLargada)<minLargada){
                     $(this).parents(".ritmo").find(".info").text("Ritmo de "+pacePista.toFixed(2)+" fica fora do Horário de Abertura").css("color","red");
                 }else
                 if((total+minLargada+minutosTotal)>minFechamento){
                       $(this).parents(".ritmo").find(".info").text("Ritmo de "+pacePista.toFixed(2)+" fica fora do Horário de Fechamento").css("color","red");
                 }else{
                       $(this).parents(".ritmo").find(".info").text("Ritmo de "+pacePista.toFixed(2)+" min/km").css("color","yellow");
                 }

                  total += minutosTotal;


              }else{
                     $(this).parents(".ritmo").find(".info").text("");
              }
          });

          $("#tempototal").text( Math.floor(total/60)+"h "+(total % 60)+"m");
          $("#pacemedio").text( (total/distTotal).toFixed(1)+" min/h");
       })
    }



})


















//  Planilha widget
//-----------------------

vtl.PlanilhaWidget = vtl.WidgetBase.extend({
    _nome:'planilha',
    _icon:'#planilhaicon',

    init:function(data){
       this._super(data);
       this.data = data
    },

    _createHtml: function(){

      var str = "<div class='row-fluid'><div class='span12' id='planilhaRitmo'>";


      str+='<div class="panel panel-default">\
        <div class="panel-heading"><i>1</i>Atletas <small>Inclua um ou mais atletas</small></div>\
        <div class="panel-body">\
          <div id="atleta-input"><input class="atleta" placeholder="Digite o nome" />  <a class="btn-add" href="javascript:void(0)"><i class="icon-plus-sign"></i></a></div>\
          <div id="atletas">\
          </div>\
        </div>\
      </div>';






      str+='<div id="trecho-lista" class="panel panel-default">\
        <div class="panel-heading"><i>2</i>Trechos <small>Selecione o atleta de cada trecho</small></div>\
        <div class="panel-body">';



      for (var i = 0; i < this._data.gpx._trechos.length; i++) {
        var pi =  this._data.gpx._trechos[i];
        str+='<div class="trecho-linha">\
            <h3>&emsp;' +pi.nome+' - <small> '+pi.distInfo+' km</small> </h3>\
            <select disabled data-nome="' +pi.nome+'" data-infotrecho="'+pi.pi0.info+'" data-trecho='+i+' class="trecho-ritmo corredor js-example-responsive" data-dist="'+pi.distInfo+'">\
            <option>**Inclua um atleta **</option> \
            </select>\
            </div>';

      };

      str+="</div></div>"



       str+='<div id="salva-planilha" class="panel panel-default">\
        <div class="panel-heading"><i>3</i>Salvar Planilha <small> Por Email ou Imprima</small></div>\
        <div class="panel-body">\
          <div id="email-save"><input class="" id="planilhaEmail" placeholder="Digite o email" /><a id="btn-email-planilha" class=" btn-add" href="javascript:void(0)"><i class="icon-envelope"></i></a>      <a id="print-planilha" class=" btn-add" href="javascript:void(0)"><i class="icon-print"></i></a></div>\
          <form id="from-print" action="'+CCM_TOOLS_PATH+'/planilha.php" method="post" target="_blank">\
            <input type="hidden" name="data" id="data-print"> <input type="hidden" name="task" value="task">\
          </form>\
          <div id="alert-save">\
          </div>\
        </div>\
      </div><br><br><br>';

        
        this._html = str;

        return this;
    },

    _createJs: function(){

            window.planilhaNomes= (window.planilhaNomes || {});
            window.planilhaTrechos = (window.planilhaTrechos || {})

            window.planilhaCores = ['#229331','#F96C0C','#179CF9','#EB00F9','#FFAD00','#5389AB','#ACD72D','#B00047','#A200A9'];
            window.planilhaCoresDisponiveis = (window.planilhaCoresDisponiveis || planilhaCores);

            if(window.populateSelectPlanilha) window.populateSelectPlanilha();
            if(window.atualizaResumoPlanilha) window.atualizaResumoPlanilha();





            $('#planilhaEmail').change(function(){

                 var email = $('#planilhaEmail').val();
                 var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

                 if(re.test(email)){
                          //encodo os atletas

                           window.enviaEmailPlanilha('email',email)
                 }

            });


            $('#print-planilha').click(function(event) {

                 window.enviaEmailPlanilha('print');
            });







            window.enviaEmailPlanilha = function(task,email){


                   //encodo os trechos
                    var trechosjson = {};

                    $('select.corredor').each(function(event) {
           
                        var atleta = $(this).val();
                        var trecho =  $(this).data('trecho');
                        var info =  $(this).data('infotrecho');
                        var nome =  $(this).data('nome');
                        var dist =  $(this).data('dist');
                        trechosjson[nome] = {atleta:atleta, nome:nome, info:info, dist:dist};
                    });

                     var data = JSON.stringify({email:email,
                                              atletas: window.planilhaNomes,
                                              trechos: trechosjson});


                     if( task == 'print'){
                        $('#data-print').val(data);
                       $('#from-print').submit();

                     }else{





                      $.ajax({
                         url: CCM_TOOLS_PATH+"/planilha.php",
                         data: {data:data,task:task},
                         type:'POST',
                         success: function(data){
                            data = jQuery.parseJSON(data);
                             if(data.task == 'email'){

                                $('#alert-save').html('Email enviado com sucesso!!');
                             }
                         },
                        });


                     }


                 
            }
       




          $('#atleta-input input').val('').focus();

          $('#atleta-input input').change(function(event) {
          
                 var val = $(this).val()
                 window.changeAtletaPlanilha(val);
                  $(this).val('').focus();
               
          });


          window.changeAtletaPlanilha = function(val){
                
                

                if(val in window.planilhaNomes){
                  alert('Nome já incluso');
                  return;
                }
          


                 //pego uma das cores disponivel
                 var corres = window.planilhaCoresDisponiveis.splice(0,1)

                
                 window.planilhaNomes[val] = {"nome":val,dist:0,descanso:0,cor:corres[0]}

                
                 window.populateSelectPlanilha();
                 window.atualizaResumoPlanilha();
          }




          window.populateSelectPlanilha = function(){

                  var str="<option value=''>**Selecione**</option>";
                  $.each(window.planilhaNomes, function(index, val) {
                    if(index != ""){
                      str+="<option value='"+index+"'>"+index+"</option>";
                    }
                  });

                  $('select.corredor').each(function(index, el) {

                      var vv = $(this).val();
                    
                      $(this).html(str);
                    

                      if(vv in window.planilhaNomes){
                        $(this).val(vv);
                      }else{
                         $(this).val(''); 
                         $(this).change();
                      }

                      

                      $(this).removeAttr('disabled');
                  });


          }


          window.removeAtletaPlanilha = function(val){

                  //pego a cor do elemento
                  var cor = window.planilhaNomes[val].cor;
                  //coloco na lista de disponivel denovo
                  window.planilhaCoresDisponiveis.push(cor);


                  // remove ele
                  delete window.planilhaNomes[val];

                  //vejo select que tem ele e mudo para o normal
                  window.populateSelectPlanilha();
                  window.atualizaResumoPlanilha();
             


                  // var planilhatemp = window.planilhaNomes;

                  // window.planilhaNomes = {};



                  // $.each(planilhatemp, function(index, val) {
                  // //    window.changeAtletaPlanilha(index);
                  // });

          }




            window.convInMinutos = function(val){
                 var arrm = val.match(/(\d+)h(\d+)m/);
                  if(arrm != null){
                    return parseInt(arrm[1]*60,10) + parseInt(arrm[2],10);
                  }else{
                    return 0;
                  }
            };


            window.atualizaResumoPlanilha = function(){


                  //atualizaResumoPlanilha
                  var size = _.size(window.planilhaNomes);



                    //zero a distancia total de cada um
                    $.each( window.planilhaNomes, function(index, val) {
                       window.planilhaNomes[index].dist = 0;
                       window.planilhaNomes[index].descanso = 0;
                    });

                    
                    //crio objeto com informacao de cada trecho/corredor
                    window.trechosCorredor = {};
                     //calculo tudo denovo agora
                    $('select.corredor').each(function(index, el){
                        var vv = $(this).val();
                        var dist = $(this).data("dist");
                        window.trechosCorredor[index] = {nome:vv,dist:dist}

                    })



                    //calculo infos de cada corredor
                    $.each( window.planilhaNomes, function(index, val) {

                          var corredor = window.planilhaNomes[index];

                          $.each(window.trechosCorredor, function(i2, val2) {
                              
                              if(corredor.nome == val2.nome){
                                corredor.dist +=val2.dist;
                              //  corredor.dist +=val2.dist;
                              }else{
                                corredor.disttemporario +=val2.dist; 
                              }

                          });

                    });


                    //mostro o resumo de cada corredor
                     var str = "";
                     $.each( window.planilhaNomes, function(index, val) {

                          var corredor = window.planilhaNomes[index];
                          str += "<h3 class='corredor' style='color:"+corredor.cor+"'>\
                                   <a class='remove-atleta' href='javascript:window.removeAtletaPlanilha(\""+corredor.nome+"\");'><i class='icon-trash'></i></a> <span class='nome'>"+corredor.nome+" </span><span class='tempo'>"+corredor.dist.toFixed(2)+" km</span></h3>"
                      })

                     $("#atletas").html(str);


                     //dou o zoom nos pedacoes
                     // vtlTrigger('vEV_TASK_ZOOMBOUNDBOX',{x:-100,y:-200,width:2000,height:2000});
                   
            
            };

     
          



            $('select.corredor').change(function(event) {
               
                var vv = $(this).val();
                var trecho =  $(this).data('trecho');

                window.planilhaTrechos[trecho] = vv;

                $(this).addClass('ativo');

                window.atualizaResumoPlanilha();
                
                var cor = "transparent"
                if(! _.isEmpty(vv)){
                      cor = window.planilhaNomes[vv].cor;
                      vtlTrigger('vEV_TASK_MARCATRECHOCORREDORTRACK',{trecho:trecho,cor:cor});
                }else{
                    vtlTrigger('vEV_TASK_REMOVETRECHOCORREDORTRACK',trecho);
                    cor='transparent'
                }
                 $(this).parent('.trecho-linha').css('background', cor);
            });



            vtlTrigger('vEV_ANIMA_MAPA',{data:{x:50,y:100,z:0.35},time:3});




            $.each(window.planilhaTrechos, function(index, val) {

                $(('select.corredor[data-trecho="'+index+'"]')).val(val)
                $(('select.corredor[data-trecho="'+index+'"]')).change();

            })


    },



  
      _hide:function(){
        this._super();

        $('select.corredor').each(function(index, el) {
             var trecho =  $(this).data('trecho');
            vtlTrigger('vEV_TASK_REMOVETRECHOCORREDORTRACK',trecho);          
        });


      }







})
















//  Trecho widget
//-----------------------

vtl.TrechoWidget = vtl.WidgetBase.extend({
    _nome:'trecho',
    _icon:'#trechoicon',

    init:function(data){
      this.perc = data;
       this._super(data);
    },

    _createHtml: function(){



      //var trechosStr = "<ul id='trecho-infos' class='unstyled'>";

        // for (var i = 0; i < this._data.trechospercurso.length; i++) {
        //     var pi = {info:this._data.trechospercurso[i]};
        //     trechosStr += "<li class='trecho-"+i+"' data-trecho="+i+"><h3 style='margin:5px'><a class='trechoinfo trecho-"+i+"' href='#'>"+pi.info.nome+" <small><i> - "+pi.info.distancia+"</i> km </small></a></h3><div class='info-trecho'>"+pi.info.info+"</li>";
        // }

       var trechosStr = "<div class='row-fluid'><div class='span12' id='trecho-infos'>";

       for (var i = 0; i <  this.perc.gpx._trechos.length; i++) {
            var pi = {info:this.perc.gpx._trechos[i]};

            trechosStr += "<div  class='panel panel-default trecho-"+i+"' data-trecho="+i+" style='margin-bottom:0'>\
                   <div class='panel-heading'><i>"+(i+1)+"</i><a class='trechoinfo trecho-"+i+"' href='#'>"+pi.info.nome+" <small> "+pi.info.distInfo+" km </small></a></div>\
                   <div class='panel-body info-trecho'>"+pi.info.pi0.info+"</div>";
             trechosStr+="</div>";



            // trechosStr += "<li class='trecho-"+i+"' data-trecho="+i+"><h3 style='margin:5px'><a class='trechoinfo trecho-"+i+"' href='#'>"+pi.info.nome+" <small><i> - "+pi.info.distInfo+"</i> km </small></a></h3><div class='info-trecho'>"+pi.info.pi0.info+"</li>";
        


        }
        
        var href = $("#menu-principal li a:contains('Imprimir')").attr('href');
        trechosStr+="<a class='btn btn-block' target='_blank' href='"+href+"'>Imprimir Trechos</a></div>";


        this._html = trechosStr;
        return this;
    },

    _createJs: function(){
      $("#trecho-infos .panel-heading").click(function(event) {
         $('.info-trecho').slideUp();
          $(this).parent().find('.info-trecho').slideToggle();
          var tt = $(this).parent().data('trecho');
          vtlTrigger("vEV_TRECHO_CLICADO_MENU",tt);

          // vtlTrigger("vEV_SHOW_TRACADO_TRECHO",this._trechos[index]);


      });
    }
})


















//  Resultado Interativo widget
//-----------------------

vtl.ResultadoWidget = vtl.WidgetBase.extend({
    _nome:'resultado',
    _icon:'#resultadoicon',
    _timeline: null,
    _state:'stop',
    _timescale:0.6,
    // _urlGet:CCM_TOOLS_PATH+'/resultado_equipes.php',
    _urlGet:CCM_TOOLS_PATH+'/resultado_equipes.php?task=edicoes',
    _urlGetResultado:CCM_TOOLS_PATH+'/resultado_equipes.php?task=resultado',



    init:function(data){
       this._super(data);


    },



    _createEdicaoSelect:function(jsonobj){

        var opt = "";
        console.log(jsonobj);
        _.each(jsonobj, function(elem, index) {
          opt = "<option value='"+index+"'>"+elem+"</option>" + opt;
        });

        opt = "<select id='resultado-edicao'>"+opt+"</select>";

        return opt;


    },

    _createHtml: function(jsonobj){
        
        

      
      // o player
      var  strPlayer= '<div class="playcontrol">'
      strPlayer+= '<a dis onClick="vtlTrigger(\'vEV_SIMULADOR_STOP\');vtlTrigger(\'vEV_SIMULADOR_STOP\')"  id="back-res" class="" ><i class="icon-stop"></i></a>'
      strPlayer+= '<a  onClick="vtlTrigger(\'vEV_SIMULADOR_PLAY\')"  id="play-res" class="" ><i class="icon-play"></i></a>'
     
      strPlayer+= '<div id="slider-legenda"><i><small style="font-size:12px;color:gray">velocidade</small></i></div>';
     
      strPlayer+= '<div id="slider-wrap"> <input type="hidden" value="80" id="slider1"/></div>';
      
      strPlayer+= '<div class="tempo" style="margin-left:0px;margin-top:44px;padding-top:20px;border-top:1px solid gray;font-size:14px">&emsp;&emsp;Tempo de corrida:</div> <h3 style="font-style:italic;margin-left:40px;font-size:36px" id="tempocorrida">&emsp;</h3>'


      strPlayer+= '</div>';

      $(strPlayer).appendTo('#lado-page');
      $("#slider1").PPSlider({width: 250}) // vai disparar um vEV_SIMULADOR_SLIDE sempre que mujdar



      var str = "<div class='row-fluid'><div class='span12' id='equipes-resultado-interativo'>";


      str+='<div class="panel panel-default">\
        <div class="panel-heading"><i>1</i>Edição da prova</small></div>\
        <div class="panel-body">'+this._createEdicaoSelect(jsonobj)+'\
      </div>';

      str+='<div class="panel-heading"><i>2</i>Escolhas as equipes</small></div>\
        <div class="panel-body" id="equipes-resultado">\
      </div></div>';







        str+= '<style> .jspPane{min-height:100%} </style>';

      // str+= ' <label style="font-size:13px;margin-left:15px;"><input type="checkbox" id="followrunner" checked="checked" /> Acompanhar os corredores</label>';



       



        // var str = "<br><label> Edição:<br/>"+this._createEdicaoSelect(jsonobj)+"</label>";
        //     str = str+"<div id='equipes-resultado'></div>";

        this._html = str;
        return this;


      },




    _loadResultadoEquipes : function(edicao){

      var _this = this;

        this._data.loadGEOJSON(CCM_TOOLS_PATH+"/percurso.php?eID="+edicao);

        this._percursoAtual =  this._data;


        this.vEV_SIMULADOR_STOP();
        window.simuladorTimeline = undefined;
        window.vltSimuladorTime = 0;

        window.vltSimuladorDate = 0;

       if(this.runners){
           for (var i = 0; i < this.runners.length; i++) {
                  var runner = this.runners[i];
                 runner.remove();
            }  
        }




        this.ajax2 =  $.ajax({
              url: _this._urlGetResultado,
              data:{eID:edicao},
              dataType: 'json',
        })


        this.ajax2.then(function(dataobj) {

          console.log(dataobj);

          var _html = _this._createHtmlEquipes(dataobj);
          $('#equipes-resultado').html(_html);


          _this._createJs2();



        });
     },




    _createHtmlEquipes: function(jsonobj){

        this._eq = jsonobj;


        var str = "<ul style='position:relative;height:auto;' id='trecho-infos' class='unstyled equipesinfo'>";
        
        this._eq = _.sortBy(this._eq,'nome');



        for (var i = 0; i <  this._eq.length; i++) {
           eq = this._eq[i];
            if (eq.nome.length>26)eq.nome = eq.nome.substring(0,32)+"...";

            if (eq.largada!=null && eq.chegada!=null){
              str +=  "<li style='float:left;width:100%;clear:both;' class='equipe'><label style='width:100%;float:left;clear:both;margin:5px;font-size:11px;'><input style='display:block;float:left;margin-right:5px;' onchange='vtlTrigger(\"vEV_LOAD_EQUIPE_RUNNER\",this)'  class='gpxresult' data-file='"+eq.arquivo+"'  data-nome='"+eq.nome+"'  data-largada='"+eq.largada+"' data-chegada='"+eq.chegada+"'  data-categoria='"+eq.catGeral+"' type='checkbox' /><div style=''>"+eq.nome+"<div style='font-size:9px; color:gray;margin:0;line-height:1;'>"+eq.catGeral+"</div></div></label></li>";
            }

        };
        str +="</ul>";
       
      
        return str;
    },




    _createJs: function(){

        _t = this;
        $('select#resultado-edicao').change(function(){
            var val = $(this).val();
             $('#equipes-resultado').html("carregando equipes....");
            _t._loadResultadoEquipes(val);
        }).change();

    
},

    _createJs2: function(){


     

        // $(".equipesinfo").jScrollPane({autoReinitialise:true});

        
        $('#play-res').click(function(event) {  

             // if($(this).hasClass('playing')){

             //      $(this).removeClass('play')
             //      $(this).find('i').attr('class','icon-pause');
             //       vtlTrigger('vEV_PAUSE_RESULTADO_INTERATIVO');
             
             //  }else{
             //      $(this).addClass('playing')
             //      vtlTrigger('vEV_PLAY_RESULTADO_INTERATIVO');
             //      $(this).find('i').attr('class','icon-play');
             //  }

        });
    
    },





   _show:function(){

      //mudo o percurso para o edição selecionada 

      //escondo o percurso atual
      //o data ee o percurso, que passei no directos quando criei a instancia
      //this._data.escondeTudo();


      //crio o novo percurso
      // if(! this._percursoAtual){
      //   this._data.loadGEOJSON(CCM_TOOLS_PATH+"/percurso.php?eID=8");

      //   this._percursoAtual =  this._data;
      // //  this._percursoAtual = new vtl.Percurso({paper: this._data.paper,url:(CCM_TOOLS_PATH+"/percurso.php?eID=8"),callback:this.showKms,context:this}); //

      // }
      
      this._super();
    
    },


   _hide:function(){    






        this.vEV_SIMULADOR_STOP();
        window.simuladorTimeline = undefined;
        window.vltSimuladorTime = 0;

        if(this.runners){
           for (var i = 0; i < this.runners.length; i++) {
                  var runner = this.runners[i];
                 runner.remove();
            }
          
         }


     

      delete this._percursoAtual;

      this._data.loadGEOJSON(CCM_TOOLS_PATH+"/percurso.php");




      this._super();

  },



  vEV_SIMULADOR_SLIDE:function(val){
       if(this._timeline){
               var myval = vtlu.math.fromToInterpolation(0, 100, -7, 10, val, false)
               if(myval>-1 && myval <1) myval = 1;
               this._timescale = myval;
               this._timeline.timeScale(myval);

        }
  },


    vEV_SIMULADOR_PLAY:function(){

         if(this._state=='stop' && this.runners.length >0){
             this._createTimelineFunction();
            $('#play-res i').attr('class','icon-pause');
            this.vEV_PLAY_RESULTADO_INTERATIVO();
            this._state='playing'

         } else if(this._state=='playing'){
            $('#play-res i').attr('class','icon-play');
            this.vEV_PAUSE_RESULTADO_INTERATIVO();
            this._state='stop'
         }

     },

     vEV_SIMULADOR_STOP:function(){

        vtlTrigger("vEV_RUNNINGTIME_END",0)  //é nescessario chamar automaticamente, pois o tween não chama o onUpdate quando pauso ele

        // $('#play-res i').attr('class','icon-play');
     },





     updateTempo: function (secs)
{
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
   
    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    // return obj;


          $("#tempocorrida").text(obj.h+"h "+obj.m+"m "+obj.s+"s ");
},





     vEV_RUNNINGTIME_CHANGE:function(time){

      this.updateTempo(time);

      if(! this.funcaoPos ){
               var _that = this;
          this.funcaoPos = _.throttle(function(){_that.updateCameraPos.apply(_that)}, 200);

        }else{


              this.funcaoPos();
        }


     },



     updateCameraPos: function(){

      return false;
          if($("#followrunner:checked").length == 0) return false;

        //se é para acompanhar os corredores


            //vejo se passou 5 segundos desde a ultima atualizacao -- depois


            //para cada corredor pego a posicao dele

            //faco um bounding das posicoes

            //mando o mapa dar zoom no bound -- mas estando um pouco mais distante, please

             if(! this.runners) return false;


             // var bbox = { x:0,y:0, width:0,height:0}

             // for (var i = 0; i < this.runners.length; i++) {
             //        var runner = this.runners[i];
             //        

             //        if(i==0){
             //          //_px e _py é proriedade especial do runners, que é onde vao estar 1 minuto no futuro
             //          bbox.x =runner._x;
             //          bbox.y =runner._y;
             //          bbox.width =runner._x+20;
             //          bbox.height =runner._y+20;

             //        }else{
             //          var newbbox = { x:0,y:0, width:0,height:0}
             //          newbbox.x =runner._x;
             //          newbbox.y =runner._y;
             //          newbbox.width =runner._x+20;
             //          newbbox.height =runner._y+20;
             //          bbox = this.expandRect(bbox,newbbox);
             //        }
             //  }


          var bbox = { _x:0,_y:0, width:0,height:0}

                    var runner = this.runners[0];
                     bbox._x =runner._x;
                      bbox._y =runner._y;
                      bbox.width =runner._x;
                      bbox.height =runner._y;

             var distanciapeccorida = runner._distPercorrida;

             for (var i = 0; i < this.runners.length; i++) {

                    var runner = this.runners[i];
                    
                    var minhadist = runner._distPercorrida;

                    if(minhadist > distanciapeccorida  ){
                          bbox._x =runner._x;
                          bbox._y =runner._y;
                          bbox.width =runner._x;
                          bbox.height =runner._y;
                    }

              }




               vtlTrigger('vEV_CENTER_VIEW_IN_POINT',bbox);

               return;

               // if(bbox.width < 350){

               //      var dif = 350 - bbox.width;

               //      bbox.width += dif/2;
               //      bbox.x -= dif/2;
               // } 


               //    if(bbox.height < 350){

               //      var dif = 350 - bbox.height;

               //      bbox.height += dif/2;
               //      bbox.y -= dif/2;


               // } 

              bbox.width = bbox.width - bbox.x;
              bbox.height = bbox.height - bbox.y;

               bbox.x -= 130;
               bbox.y -= 130;
               bbox.height += 130;
               bbox.width += 130;



                if(bbox.width < 350){

                    var dif = 350 - bbox.width;

                    bbox.width += dif/2;
                    bbox.x -= dif/2;
               } 


                  if(bbox.height < 350){

                    var dif = 350 - bbox.height;

                    bbox.height += dif/2;
                    bbox.y -= dif/2;


               } 




               console.log(bbox);


             vtlTrigger('vEV_TASK_ZOOMBOUNDBOX_FAST',bbox);
   },



   expandRect:function (rect, nRect) {
      // check left
      if (nRect.x<rect.x) {
     //   rect.width +=     rect.x - nRect.x;
        rect.x=nRect.x;
      }
      // check top
      if (nRect.y<rect.y) {
      //  rect.height += rect.y - nRect.y ; 
        rect.y=nRect.y;  
      }



      // check right
      if ( nRect.width > rect.width ) {
        rect.width =  nRect.width ;      
      }
      // check bottom
      if ( nRect.height > rect.height  ) {
        rect.height =  nRect.height ;      
      }  

      return rect;

    },






     vEV_RUNNINGTIME_END:function(){
          if(this._timeline) this._timeline.pause(0);
          window.vltSimuladorTime = 0;
          this._state='stop'
          $('#play-res i').attr('class','icon-play');
          this._timescale = 1;
     },





    vEV_PAUSE_RESULTADO_INTERATIVO:function(){
           if(this._timeline) this._timeline.pause();
    },


    vEV_PLAY_RESULTADO_INTERATIVO:function(){
        if(this._timeline)  this._timeline.resume();
    },



    //private Functions

    vEV_LOAD_EQUIPE_RUNNER:function(quem){

      

          if(this.runners == undefined) this.runners = []; 

           var eq = {file:$(quem).data("file"),
                            nome:$(quem).data("nome"),
                            largada:$(quem).data("largada"),
                            chegada:$(quem).data("chegada"),
                            categoria:$(quem).data("categoria"),
                            gpx:null,
                            cor:vtl.Util.random_color(),
                            raphaelSet: this.runnersRaphaelSet
                    }


           //https://wtracks.appspot.com/?gpx=http://escritorio.curupiradesign.com.br/voltadolagocaixa.com.br/files/cache/f9abba0ffb01397753a546fd640705e1.gpx&markers=true&labels=true&alts=false


            console.log(eq);
           
           if(quem.checked){
              $(quem).parent().css('color',eq.cor)
              var ppt =     this._percursoAtual.gpx._getPointInKm(1);

              if(eq.categoria.match(/60/g)){
                   var ppt =     this._percursoAtual.gpx._getPointInKm(40);

              }

              var qt = this.runners.length;
              var dir = (qt % 2) ? -1 : 1;
              var runner = new vtl.Runners(ppt, {text: "",
                                                   offsetX:(qt*dir*0),
                                                   gpxfile: eq.file,
                                                   nome:eq.nome,
                                                   largada:eq.largada,
                                                   chegada:eq.chegada,
                                                   categoria: eq.categoria,
                                                   cor:eq.cor,
                                                   percursoAtual:this._percursoAtual
                                                   });
              runner.name = eq.nome
              this.runners.push(runner);
              // runner.drop(0.5);




              runner.setx(ppt._x+Math.random()*40);
              runner.sety(ppt._y+Math.random()*40);

              vtlTrigger('vEV_CENTER_VIEW_IN_POINT',ppt);



            }else{
              $(quem).parent().css('color','white')
              for (var i = 0; i < this.runners.length; i++) {
                var runner = this.runners[i];
                if (runner.name == eq.nome){
                   runner.remove();
                   this.runners.remove(i);
                }
              }

            }

            if(this.runners.length == 0){

                vtlTrigger("vEV_RUNNINGTIME_END",0) 

            }



        this._createTimelineFunction();

    },




    _createTimelineFunction:function(trecho){
          //get list of runners
          
          //pego o maior tempo possivel
          var totaltime = 0
          for (var i = 0; i < this.runners.length; i++) {
              var runner = this.runners[i];
              if (runner.getTotalTime() > totaltime){
                  totaltime = runner.getTotalTime()
              }
            }
          //pego o tempo mais demorado desses


          if(!window.vltSimuladorTime)
                  window.vltSimuladorTime = 0;

          this._timeline = new TimelineMax();
          this._timeline.pause();

          var timeatual =   window.vltSimuladorTime;
          window.vltSimuladorTime = 0;

          this._timeline.to(window,180,{vltSimuladorTime:totaltime/1000,startAt:{vltSimuladorTime:timeatual,autoRemoveChildren:false},ease:Linear.easeInOut,
                                        onStart:function(){
                                            vtlTrigger("vEV_RUNNINGTIME_START",window.vltSimuladorTime)
                                          },
                                          onUpdate:function(){
                                            // console.log(window.vltSimuladorTime);
                                            vtlTrigger("vEV_RUNNINGTIME_CHANGE",window.vltSimuladorTime)
                                          },
                                           onComplete:function(){
                                            vtlTrigger("vEV_RUNNINGTIME_END",window.vltSimuladorTime)
                                          },
                                           onReverseComplete:function(){
                                            vtlTrigger("vEV_RUNNINGTIME_END",window.vltSimuladorTime)
                                          },
                                      }
                              );
     

        //se já estava tocando, continuo
        if(this._state=='playing'){

          this._timeline.resume();
          
          if(this._timescale<1){
            this._timeline.reverse();
          }

        }

         this._timeline.timeScale(this._timescale);

        // this._time.autoRemoveChildren = false;

        window.simuladorTimeline = this._timeline




      }

})







