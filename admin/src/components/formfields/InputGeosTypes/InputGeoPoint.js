import _ from 'lodash'
import React, {  Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Header, Dropdown, Form, Label, List, Radio, Checkbox, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import { Field, Fields, FieldArray , reduxForm, SubmissionError } from 'redux-form';

import {DayPicker, SingleDatePicker} from 'react-dates';

import StringMask from 'string-mask';

import StringFormatValidation from 'string-format-validation'

import { connect } from 'react-redux';

import { si3, si3Actions }  from 'actions/index';

import { markers}  from 'config.js';

import * as util from 'util/s3util'

import { Map, Marker, Popup, TileLayer, LayersControl, FeatureGroup, Circle, CircleMarker, GeoJSON } from 'react-leaflet';

import { EditControl as DrawEditControl } from "react-leaflet-draw"

import FormField from 'components/formfields/FormField'


import wkx from 'wkx';

import { Utm, Dms} from 'geodesy'
import { LatLonEllipsoidal as LatLon } from 'geodesy'

import onlyDOMProps from 'util/onlyDOMProps'

import { LayersMapa } from 'components/mapas/LayersMapa'












//======================================================
//  
//======================================================
//======================================================
//     INPUT GEO POINT
//======================================================
//======================================================
//     
//======================================================




// Input Date
//---------------------------
class InputGeoPoint extends React.Component {
    //o static é NESCESSARIO
    static defaultProps = {
      marker:'generico',
      geom:"point",  //point, area, line
    }

    state = {
      open:false,
      fullscreen:false,
      point:[],
      insertModeShift:false,
      insertModeBtn:false,
      display:'',
      GeoJSON:false,
      selIndex:0,
      geogsonid:0,  //pq mudo o key quando muda o json apra reenderizar
      isFetchingGeo:false,
      isFetchingLocation:false,
      modoEntrada:'mapa',  // [mapa, digitado, localidade]  -- COMO FOI A ENTRADA DA LOCALIDADE
      modoExibicao:'mapa',  //[fullmapa, mapa, menu] -- COMO DEVE SER EXIBIDO O MAPA
      valorEntrada:'',
      dropdowOpcoes:[],
      dropdownTipo:''  //GEO,LOCALIDADE,''
    }

    //fora pqnao quero ser state pois é referencia, meu componente nao precisa alterar na sua conversao,
    //soquando o imput que é o valor mudar
    
    geoPref = 'gd';
    tipoGeoQueDigitou = "gd"; //o tipo de geo que o cara esta escrevendo

    //o ponto corrent
    point = {x:0, y:0};
    previewPoint = {x:0, y:0}
    
    pointOnFocus = this.point;
      
    // é o nome da localidade no ponto  
    locDisplay = ''

    estado = ''
    
    municipio = ''
    
    localidade = ''
    
    modoEntrada = 'point'

    estadolist = ''
    
    municipioList = ''
    
    overtimeout = 0


    typingvalue = ''
    locationvalue = ''

    clickInside = false

    //a logica é a seguinte

    //o objeto principal é o point, certo?
    //entao quando damos o focus mostramos a lat, long ou o estilo preferido, beleza?
    // quando perdemos o focus mostramos o nome da localidade
    // quando mudamos clicando no mapa tb mostramos o nome da localidade
    // quando digito
    //  |----- verifico se é formato lat long, ou qualquer outro GEO
    //            |---se sim vou mostrando temporariamente no mapa o ponto
    //                    |----se aperto o esc volto ao valor antigo
    //     
    //  |-----  verifico se é estado
    //            |--AI ABRO O DROPDOW
    //                |----SELECIONANDO
    //                        |-------SET O POINT
    //                        |--------ABRE O MUNICIPIO



    zoom = 5


    



    // REACT LIFECYCLE
    //---------------------------
      
    constructor(props){
       super(props)
    }

    //components lifecycles
    componentWillMount() {
          
         const vv = this.props.input.value
         if (vv == ''){
          this.point = {x:-10, y:-52};
         }else{
          this.point = util.geo.convertPointFromWKT(vv);
         }
         this.originalpoint = this.point;
    }


    componentDidMount() {
      this.getLocation(); 
      this.__wrappedComponent = this.refs.wrappedComponent;
    //   document.addEventListener('mousedown', this.handleClickOutside, true);

      
    }


    componentWillReceiveProps(np){    
          if(np.input.value == ''){
            this.point = {x:-10, y:-52};
          } else if(this.props.input.value != np.input.value){
            this.point = util.geo.convertPointFromWKT(np.input.value);
            //talve precise regenarar o dropdowmGeo se ele tiver aperto aqui

          }
           // this.originalpoint = this.point;
    }


    componentWillUpdate(nextProps, nextState){

        if(nextState.display !='' && 
            this.state.display != nextState.display
          ){
            this.val = nextState.display
        }


        if(nextState.open){
            document.addEventListener('mousedown', this.handleClickOutside, true);
        }else{
            document.removeEventListener('mousedown', this.handleClickOutside, true);
        }
    }

    //nao é chamado no primeiro render
    componentDidUpdate(prevProps, prevState){
        // vejo se entrou geogson.
        // se sim falo para o leaflet mostrar seus bounds
        if(!_.isEqual(prevState.GeoJSON, this.state.GeoJSON)){
                this.refs.map.leafletElement.fitBounds(this.refs.geojson.leafletElement.getBounds())
        }
        if( this.refs.map ){
          this.refs.map.leafletElement.on('baselayerchange',this.baseLayerChange)
        }

        // // debugger;
        if(prevState.fullscreen != this.state.fullscreen){
          setTimeout(()=>{
            // // debugger;
            this.refs.map.leafletElement._onResize()
          }, 100)
        }
    }

    componentWillUnmount(){
    //    document.removeEventListener('mousedown', this.handleClickOutside, true);
    }



    // EVENTOS DOM
    //---------------------------
    
    _focus = false;
    
    onInputBlur = (e) =>{
       console.log('blur')
       if(this.clickInside === false){
           this._focus = false;
           this.close(100);
           this.props.input.onBlur() 
        }
    }

    onInputFocus = (e) => {
      this.props.input.onFocus();
      setTimeout(()=>this._focus = true,100)      
      //so abroo mapa se tiver fechado
      if(! this.state.open){
          this.open()
        }  
      
      if(this.state.modoEntrada == 'mapa'){
          this.inputEl.select();
          this.setState({modoExibicao:'mapa'})
      }

      const { modoEntrada, valorEntrada } = this.state;
      
      if(modoEntrada == 'digitado' || modoEntrada=='localidade' ){
          this.setState({display:valorEntrada})
       }
       

    }



    onInputClick = (e) =>{
      // if(this._focus && this.state.open){
      //     this.close()
      //   }else{
      // this.open()
        // }
    }



     //onChangeInput
    onInputChange = (e) =>{

        this.val = e.target.value;
        
        var vl = this.val;

        if(vl == ''){
          this.setState({modoExibicao:'mapa'})
          this.tipoGeoQueDigitou = '';
          this.props.input.onChange('');
        }else{
          this.setState({modoExibicao:'menu'})
        }



        //verifico se é uma localidade
        
        let geoCoord = [
            //percentual de chance de ser UTM     0 - 1
            {tipo:"utm",v:this.checkUTM(vl)},
            //percentual de change se ser GMS     0 - 1
            {tipo:"gms",v: this.checkGMS(vl)},
            //percentual de chance de ser GD      0 - 1
            {tipo:"gd", v: this.checkGD(vl)}
          ]
        

        //pego o preferencial e adiciono ao percentual +0.3
         _.forEach(geoCoord, o => { 
              if (o.tipo == this.geoPref)  
                  o.v += 0.2
                return o;
          })


        //vejo quem temos a maior chance de ser        
        console.log(`UTM: ${geoCoord[0].v} GMS:${geoCoord[1].v} GD:${geoCoord[2].v}`)

        let geoCoordOrder = (_.sortBy(geoCoord,(v)=>v.v)).reverse()

        //console.log(geoCoordOrder);
        
        this.tipoGeoQueDigitou = geoCoordOrder[0].tipo;  //salvo qual o tipo geo que o cara ta entrando

        //pego um latlog objeto(geodesy) do input como tipo que mais combina
        let latlng = this.getLatLngFromInput(vl,geoCoordOrder[0].tipo) 

        this.previewPoint = {x:latlng.x, y:latlng.y}

        //gero os dropdown        
        const dropgeos = this.dropdownGeos(geoCoordOrder, latlng);

        this.setState({dropdowOpcoes:dropgeos, display: vl })
      
        //mostro o mapa no centro
        this.centerMapOnPoint(this.previewPoint.x,this.previewPoint.y)
    }



    onInputKeyDown = (e) =>{
          console.log(e.keyCode);
          
          //se ENTER salvo o valor como valor de entrada
          if (e.keyCode == 13) {
              e.preventDefault();
              this.setState({valorEntrada:this.state.display})

              //set tenho um index e um dropdown,chamo o click dele
              if(this.state.selIndex > -1){
                let idx = this.state.selIndex;
                console.log(idx)
                console.log(this.state.dropdowOpcoes[idx]);
                if(this.state.dropdowOpcoes[idx]){
                    let click = this.state.dropdowOpcoes[idx].onClick;
                    if( _.isFunction(click) ){
                        click.call(this)
                    }
                }
              }



          //se ESC cancelo tudo,so close
          }else if (e.keyCode == 27) {
               e.preventDefault();
               this.props.input.onBlur();
               this.inputEl.blur();
               this.close();
          } else {
            if(this.state.open == false){
                this.open();
            }
          }

          //DOWN KEY
          if(e.keyCode == 40){
              e.preventDefault();

              if((this.state.selIndex+1) < this.state.dropdowOpcoes.length){
                 let sel = this.state.selIndex+1
                 this.setState({selIndex:sel})
              }



          }

          //UP KEY
          if(e.keyCode == 38){
            e.preventDefault();
              if(this.state.selIndex > 0){
                let sel = this.state.selIndex-1
                this.setState({selIndex:sel})
              }
          }
    }





    
    handleClickOutside = (e) => {
      // // debugger;
      const domNode = ReactDOM.findDOMNode(this);
      if ((!domNode || !domNode.contains(e.target)) ) {
          this.close();
          this._focus = false;
          this.clickInside = false;
      }else{
        //pq quando clicamos nos control do leaflet o click nao épassado adiante, e preciso nao fechar o mapa quando perco o blur do input
        this.clickInside = true;
        setTimeout(()=>this.clickInside = false,200)
      }
    }


    detectaShift = (e) => {
        if(e.shiftKey && this.state.insertModeShift === false){
          this.setState({'insertModeShift':true})
        }else if(e.shiftKey== false && this.state.insertModeShift === true){
          this.setState({'insertModeShift':false})
        }
    }

    
    dragOver = (event) => {
      event.preventDefault();
      clearTimeout(this.overtimeout);
      $(this.dropI).addClass('hover')
    }

    dragEnter = (event) => {
      clearTimeout(this.overtimeout);
      event.preventDefault();
      $(this.dropI).addClass('hover')
    }

    dragOut = (event) => {
      event.preventDefault();
      this.overtimeout = setTimeout(()=>
        $(this.dropI).removeClass('hover')
      ,800);
    }

    drop = (event) =>{
      const { input: { onChange } } = this.props
      event.preventDefault();
      this.processFiles(event.dataTransfer.files)
      $(this.dropI).removeClass('hover')
    }

   


    // Funcoes do componente
    //---------------------------
    
    //*****open and close
    
    open = () =>{
        //salvo o ponto de quando abrimos
        this.originalpoint = this.point
        this.setState({open:true})
     
    }

    close = (time = 300) =>{
          //salvo o ponto quando fechamos
         this.originalpoint = this.point;
         console.log('vai fechar em '+time) 
         this.closeTimeout = setTimeout(
           () =>{ 
                console.log('fechou') 
               this.setState({open:false,fullscreen:false})
               this.originalpoint = this.point;
               this.getLocation()
             }
         ,time)     
    }

    delayCloseCal = (t=200) => {
        this.close(t)   
    } 

    toogle = () => {
        //se tiver aberto fecho
        //se tiver fechado abro
        if(this.state.open){ 
          this.close(50)
        }else{
          this.open()
        }
    }

    canceloDelayClose = () => {
       console.log('cancelo delay close')
       clearTimeout(this.closeTimeout)
    }



    // Geo utilits
    //----------------------------
    
    getDisplayFormat = (x='',y='') => {

      if(x == ''){
          x = this.point.x;
          y = this.point.y;
      }
      
      if(this.geoPref == 'utm'){
          
          return util.geo.toUTM(x,y);
         
       }
      
      if(this.geoPref == 'gd'){
          return  util.geo.toGD(x,y);
      }
      
      if(this.geoPref == 'gms'){
         return util.geo.toGMS(x,y);
      }

      return `${x} | ${y}`;

    }


    getLocation = () =>{
        if(this.props.input.value != ''){  
          util.geo.getLocationName(this.point,
              (end)=>{

                  if (end === false){
                    end = this.formatLatLngDisplay(this.point)
                  }
                  this.locationvalue = end;
                  this.setState({display: this.locationvalue });
              }, this)         
        }
    }

    

    // Pego a latlng do valor digitado do input
    // vl - o valor
    // tipo - o tipo do valor entrado "utm","gd","gsm"
    getLatLngFromInput = (vl, tipo) => {
        let lat = 0;
        let lng = 0;
        let point = {x:0,y:0};
        let pointT;
        
        if (tipo == 'utm'){
          pointT = this.getUTM(vl);
        }else if (tipo == 'gd'){
          pointT = this.getGD(vl);
        }else if (tipo == 'gms'){
          pointT = this.getGMS(vl);
        }
        if(pointT){
          lat = pointT.lat
          lng = pointT.lon
          point = {y:lng,x:lat};
        }
       
        return point;
    
    }

    

    //LETODO - colocar os chek e os ge de geo no utilitarios
   checkUTM = (vl) => {
        //se tenho um numero muito grande antes da casa decimal
        // Zona Brasil 19 - 25 [N-h]
        // Lat - Sul - 9999999.99 6000000.00  (7 casas) 
        //       Norte - 0 999999.99 (6 casas)  POUCO PROVAVEL
        // Lng  - 100000.00  900000.00 (6 casas en cada zona n)
        //checo se tem um numero maior que 100.000,00
        let c = 0
        if( vl.match(/\d{6,9}\.?\d{0,2}/g) ){
          c += 1
          return c  //com certezaé utm pois so ele tem tanto numeros.
                    //ja retorno para economizar processo
        }

        if( vl.match(/\bZ\b\d\d\s?[NML]?/ig) ){  //se tiver z 22 N
          c += 0.7
        }

        if( vl.match(/\bzone\b/ig) ){
          c += 0.6
        }

        if( vl.match(/\bzone\b|\bz\b/ig) ){
          c += 0.3
        }

        if( vl.match(/\d{3}/g) ){
          c += 0.5
        }

        if( vl.match(/\d{4,9}/g) ){
          c += 0.6
        }
        
        return c
    }



    getUTM = (vl) =>{
          let x = 0
          let y = 0
          let z = 21 // so defino um padrao
          let hem = 'S'

          //THE ZONA
          //vejo quantos numeros ate 2 digitos eu tenho, 
          var vl2 = vl.replace(/\./g,'')  //tiro os pontos para o word bondary funcionar embaixo, pois ele considera ponto. sem ele pego os numeros depois de ponto, como 2323.12  ia pegar o 12
          var zonas = vl2.match(/[z]?\b(\d\d)(?=[ns\s])\s*[ns]?/ig)
          console.log(zonas);

          if(zonas){
              //vejo quantos numeros ate 2 digitos achei
              let zonaT = _.trim(zonas[0]); //uso o trim pq o regex de cima captura espacos tb
              if(zonas.length > 1){
                  let tam = zonaT.length;
                 //se achei mais que um, pego o que tiver a string maior, pois deve ter Z ou N/s no final
                 _.each(zonas, o => {
                    let oo = _.trim(o) //uso trim pq o regex captura espacos tb
                    if(oo.length > tam ){
                      tam = oo.length
                      zonaT = oo
                    }
                 })
              }
              z = parseInt(zonaT,10)
              let hemt = zonaT.match(/[ns]/ig)
              hem = (hemt) ? hemt[0] : hem;
              //REMOVO A ZONA DA STRING
              vl = vl.replace(zonaT,'')
          }

          //LAT E LNG in METERS
          var latlng = vl.match(/(\b\d{1,9}\.?\d*[\snswelo]{0,2}\b)/ig);
          if(latlng){
            if(latlng.length == 2){

              x = latlng[0]
              y = latlng[1]
            

               //Setiver leste e oeste na lat ou ns na long
              if( x.match(/[owle]/i) || y.match(/[ns]/i) ){
                  // inverto quem é quem
                  console.log("INVERTEU UTM")
                  x = latlng[1]
                  y = latlng[0]
              }

              x = x.replace(/[^\d\.-]/g,'');   
              y = y.replace(/[^\d\.-]/g,'');   


            }else{
              x = latlng[0]
            }
          }

          // Numero Zona [NS] lat long          
          console.log(`parse:${z} ${hem} ${x} ${y}`);

          try{
            let vlf = `${z} ${hem} ${x} ${y}`
            var utm = Utm.parse(vlf);
            var latlonObj = utm.toLatLonE();
          }catch(e){
            console.warn(e);
            latlonObj = LatLon(0,0);
          }
          // console.log(latlon);
          return latlonObj; //{lat:latlonObj.lat, lng:latlonObj.lon}
    }



   checkGD = (vl) => {
        // LAT: 05.000000º a -32º (-90 a 90)
        // LNG: -80 a -33º    (-180 a 180)
        let c = 0

        if( vl.match(/\b\d{1,2}\.\d{3,10}/g) ){
            c += 1
            return c  //com certezaé utm pois so ele tem tanto numeros.
                      //ja retorno para economizar processo
        }

          //OBS: so considero o angulo ates 2 digitos pq é o que engloba o brasil

        if( vl.match(/\b\d{2}/g) ) {
            c += 0.2 
        }

        if( vl.match(/\b\d{1}\s/g) ) {
            c += 0.2 
        }

        return c;
    }


    getGD = (vl) =>{
          let x = 0
          let y = 0

          console.log("get GD")

          var latlng = vl.match(/([-+\s]?\d{1,3}\.?\d*[\snswelo]{0,2}\b)/ig);

          if(latlng){
            if(latlng.length == 2){
              x = latlng[0]
              y = latlng[1]

              //Setiver leste e oeste na lat ou ns na long
              if( x.match(/[owle]/i) || y.match(/[ns]/i) ){
                  // inverto quem é quem
                  x = latlng[1]
                  y = latlng[0]
              }
     
              if( x.match(/[s]/i) && !x.match(/[-]/) ){
                x = "-"+x;
              }else if ( x.match(/[s]/i) && x.match(/[-]/) ){
                x = x.replace(/[-]/g,'')
              }

              if( y.match(/[ow]/i) && !y.match(/[-]/) ){
                y = "-"+y;
              }else if( y.match(/[ow]/i) && !y.match(/[-]/) ){
                y = y.replace(/[-]/g,'')
              }

              x = x.replace(/[^\d\.-]/g,'');   
              y = y.replace(/[^\d\.-]/g,'');   


            }else{
              x = latlng[0]
            }
          }



          const latlonObj = LatLon(x,y);

          console.log(latlonObj);

          return latlonObj;

    }



   checkGMS = (vl) => {
        //se tenho sinal de grau ou minuto ou segundo
        //ou se tenho DDºDD'DD.DD"
        // Lat: 9º N a uns 34º Sul 
        // Lng: 82º a 32º
        
        //OBS: so considero o angulo ates 2 digitos pq é o que engloba o brasil

         let c = 0

        //se tenho numeros com grau e minutos já é bem provavel
        if( vl.match(/\d\d\s?[°º]\d*[′']/g) ){    
          c += 2  //bem mais alto que os outros,pois ninguem mais usa minutos
          return c 
        }

        //se tenho simbulo de grau minutos e segundos tb é provavel
        if( vl.match(/[º°]/g) ){  
           c += 0.2
        }

        if( vl.match(/['"′″]/g) ){  
           c += 0.4
        }

        //se tenho a formacao numerica tb é provavel
         if( vl.match(/(?:[+-\s]|^)\d{1,3}\s*?\d{1,3}\s*\d{1,3}/g) ){  
           c += 0.5
        }

        return c

    }



    getGMS = (vl) =>{
          let x = 0
          let y = 0

          var latlng = vl.match(/(?:[+-\s]|^)?\d{1,3}[°º\s]*\d{1,2}['′\s]*\d{1,2}\.?\d*["″\s]*[\snswelo]{0,2}/ig);;

          if(latlng){
            if(latlng.length == 2){
              x = latlng[0]
              y = latlng[1]
              
               //Setiver leste e oeste na lat ou ns na long
              if( x.match(/[owle]/i) || y.match(/[ns]/i) ){
                  // inverto quem é quem
                  x = latlng[1]
                  y = latlng[0]
              }
     
              if( x.match(/[s]/i) && !x.match(/[-]/) ){
                x = "-"+_.trim(x);
              }else if ( x.match(/[s]/i) && x.match(/[-]/) ){
                x = x.replace(/[-]/g,'')
              }

              if( y.match(/[ow]/i) && !y.match(/[-]/) ){
                y = "-"+_.trim(y);
              }else if( y.match(/[ow]/i) && !y.match(/[-]/) ){
                y = y.replace(/[-]/g,'')
              }

              x = x.replace(/[+nswelo]/g,'');   
              y = y.replace(/[+nswelo]/g,'');   


            }else{
              x = latlng[0]
            }
          }

          
          // try{
         
            let vlf = `${x} ${y}`
            var lat = Dms.parseDMS(x);
            var lng = Dms.parseDMS(y);
            const latlonObj = LatLon(lat,lng);
            // var latlonObj = utm.toLatLonE();
          // }catch(e){
          //   console.warn(e);
          //   latlonObj = LatLon(0,0);
          // }


          return latlonObj;
    }





    formatLatLngDisplay = (point) =>{
         let x = point.x
         let y = point.y
         return x.toFixed(6) + "º  |  " + y.toFixed(6)+"º";
    }






    // Dropdown Utilits
    //---------------------------
    

    //dropdown creator
    dropdownObj = (value="",conteudo="",legenda="",onClick=undefined) => {

          return {
                value:value,
                conteudo:conteudo,
                legenda:legenda,
                onClick:onClick
          }


    }

    //DropDown Creator for GEOS
    //-----------------------------
    dropdownGeos = (arr, point) =>{

        let drops = [];
        let x = point.x;  //point geodesy obj
        let y = point.y;
        

        _.each(arr, (o,i) =>{
              const tipo = o.tipo;

              if(tipo == 'utm'){
                  
                  let utmstr = util.geo.toUTM(x,y);
                  drops.push(this.dropdownObj(tipo,utmstr," UTM",()=>this.dropdownGeosOnClick(point,'utm',utmstr) )
                  )
              }
              if(tipo == 'gd'){
                  let gdstr =  util.geo.toGD(x,y);
                  drops.push(this.dropdownObj(tipo,gdstr," GD",
                    ()=>this.dropdownGeosOnClick(point,'gd',gdstr) )
                    )              
              }
              if(tipo == 'gms'){
                  let gsmstr = util.geo.toGMS(x,y);
                  drops.push(this.dropdownObj(tipo,gsmstr," GMS",
                     ()=>this.dropdownGeosOnClick(point,'gms',gsmstr))
                    )
              }

        })

        return drops;
    }

    
    dropdownGeosOnClick = (point,tipo = "",displayVal="") =>{

        let x = point.x;
        let y = point.y;

        this.saveEntradaViaDigitando(x,y);

        console.log(`tipo:${tipo} tipoquedigitou:${this.tipoGeoQueDigitou}`)

        if(tipo != this.tipoGeoQueDigitou){
          
          this.tipoGeoQueDigitou = tipo;
          this.geoPref = tipo;
          
          this.setState({display:displayVal,valorEntrada:displayVal})
          //LETODO - setar a preferencia do display de GEO no STORE
          
        }

        this.previewPoint = {x:0,y:0} //assim o preview point nao aparece mais
    
    }








    processFiles = (filelist)=>{
            //envio os arquivos
            //processo o json
             var data = new FormData();
              for (var i = filelist.length - 1; i >= 0; i--) {
               data.append('file_field',filelist[i])
             }

            //  data.append('csrfmiddlewaretoken','19n4TDykn5YlhdmyXIjsspuYfrMeAvAV')

             this.setState({isFetchingGeo:true})

             si3.sendGeoFiles(data)
             .then((data)=> {
                // console.log(data)
                this.setState({modoExibicao:'mapa',isFetchingGeo:false,GeoJSON:data,geogsonid:(this.state.geogsonid+1)});
              })

    }


    //Quando salvo os valores
    // ll - latlong leaflet object
    saveEntradaViaMapa = (ll) =>{
          // ja salvo no ponto intero quem é
          // this.point = util.geo.getPointinXY(ll)
          const wktString = util.geo.convertPointToWKT(ll);
          this.props.input.onChange(wktString);


          //se eu estoudigitando
          if( this.state.modoExibicao != "menu" ){
           this.getLocation();
           this.setState({modoEntrada:'mapa'});
          
          }else{ //posso estar mexendo no mapa quando tenho dropdown geos
            //LETODO - melhorar isso aqui, 
            //se for via dropdowgeo
            
            //pego o valor exibicao
            const vv = this.getDisplayFormat(ll.lat,ll.lng);

            this.setState({valorEntrada:vv,display:vv})

            this.onInputChange({target:{value:vv}})  //simulo que o input mudou para renovar o dropdown

            this.previewPoint = {x:0,y:0} //assim o preview point nao aparece mais tb


          }
    }






    //Quando salvo os valores
    saveEntradaViaDigitando = (lat,lng) =>{
          
          let ll = {lat:lat,lng:lng}
          
          const wktString = util.geo.convertPointToWKT(ll);

          

          this.props.input.onChange(wktString);
          // this.getLocation() //nao get o location pq to digitando, né?
          


          this.setState({modoEntrada:'digitado',valorEntrada:this.state.display})

        
        this.previewPoint = {x:0,y:0} //assim o preview point nao aparece mais
         this.centerMapOnPoint(lat,lng);
    }




    // Eventos no Mapa
    //---------------------------    

    onMapClick = (e) => 
    {  
        if(e.originalEvent.shiftKey){
            let ll = e.latlng
            this.saveEntradaViaMapa(ll)
        }
    }

    onGeoJsonClick = (e) =>{
        let ll = e.latlng
        this.saveEntradaViaMapa(ll)
    }

    markerDragEnd = (e) =>{
        let ll = e.target.getLatLng();
        this.saveEntradaViaMapa(ll)
    }

    markCreated = (e) =>{
      //pego a latitude lng desse novo ponto
      var ll = e.layer._latlng;
      //movo o meu point para la
      this.saveEntradaViaMapa(ll)
      //removo ele
      e.layer.remove()
    }

    markEdited = (e) =>{
         var ll = e.layer._latlng;
         this.saveEntradaViaMapa(ll)
    }


   baseLayerChange = (e) => {
        console.log(e.name);
        
        //salvo meu baselayer preferencias
        if (e.name) {
            this.props.setPref({
                tileSel: e.name
            })
        }
    }




    // Funcoes do MAPA
    //---------------------------
    
    centerMapOnPoint = (x,y)=> {
          
          //aviso o leaflet o with real dele
          // 
          this.refs.map.leafletElement.invalidateSize()
          this.refs.map.leafletElement.panTo(new L.LatLng(x,y));
    }

    


    render (){

      const { input, label, meta: { active, touched, error, valid, dirty }, ...custom } = this.props;    
      //crio a data conrespondente
      //para nao passar req para os fildes interno
      delete custom.req


      let mapmode = (this.state.insertModeShift) ? 'insertmode' : 'dragmode';
      mapmode += (this.state.fullscreen) ? ' fullscreen' : ' ';
    
      let position = [this.point.x, this.point.y];
      let positioninicialmapa = [this.originalpoint.x, this.originalpoint.y]
      let previewPosition = [this.previewPoint.x, this.previewPoint.y];

      console.log('render====')

     


      return (

        <div className='geopointwraper rel' ref="wrappedComponent">

        <div className={'geoinput dragandrop modo-'+this.state.modoExibicao+(this.state.open && " open") } ref={(el) => this.dropI = el} 
              onDragOver={this.dragOver}
              onDragEnter={this.dragEnter}
              onDragLeave={this.dragOut}
              onDrop={this.drop}
        >
         
          <FormField {...this.props}  dica='Digite as coordenadas no formato que desejar, ou ARRASTE aqui os arquivos de geo para selecionar'>
            
            <div ref={e=> this.coorddisplay = e} className='coorddisplay '>
                  ({this.getDisplayFormat(this.point.x,this.point.y)})
            </div>

            <div className='ui input-wrap fluid right icon'>
                <input className=''
                  type='text'
                  ref={(e)=>this.inputEl = e}       
                  disabled={this.props.disabled}  
                  {...onlyDOMProps(custom)}
                  {...input}
                  onClick={this.onInputClick} 
                  onChange={this.onInputChange}
                  onBlur={this.onInputBlur}
                  onFocus={this.onInputFocus}
                  onKeyDown={this.onInputKeyDown}
                  value={this.state.display}  
                  autoComplete="off"
                  placeholder=''
                />
               
               <div className='ui icon icone'> { this.props.icone && this.props.icone || <i className='fa fa-map-marker'></i> } </div>
            </div>

           

       

            {this.state.open &&
            <div className="elemento-complemento">
            <div className='geoDropdown row-400px '>
                    
                    {this.state.isFetchingGeo &&
                        <div className='full zi100 row center-xs middle-xs bg-cor-laranja06'>
                          <Loader className='cl-white1' active content={`Enviando Geometria`} inline='centered' />
                        </div>                 
                    }

                  selIndex:{this.state.selIndex}
                    <div className='menuwrap'>
                       <div className='dropdown ui'>
                           <div className="menu">

                        {_.map(this.state.dropdowOpcoes,(obj, i)=>
                           
                            <div className={"rel pt-2 pb-2 bbd item " + (this.state.selIndex == i && " selected")} 

                              onClick={()=>{this.setState({selIndex:i});obj.onClick()}}
                            >
                              <div>{obj.conteudo}<div className="cl-preto04 abs psr-10px pst-0 ta-r fs09 fw100"><br />{obj.legenda}</div></div>
                            </div>
                       
                      )}
                        </div>
                    </div>
                    </div>
                  

                    <div className={`${mapmode} mapwrap`}
                          onMouseMove={this.detectaShift} 
                          onKeyDown={this.detectaShift} 
                          >
                          <div className='fullscreentoogle' onClick={(e)=>{ this.setState({'fullscreen':!this.state.fullscreen})}}>
                           {this.state.fullscreen &&
                            <i className='fa fa-2x fa-times'></i>
                            ||
                            <i className='fa fa-plus'></i>
                           }
                          </div>
                        
                          <Map 
                          ref={(node) => this.mapref = node} 
                          ref='map'
                          onBaselayerchange={this.baseLayerChange}
                          onClick={(e)=>{this.onMapClick(e)}}  
                          center={positioninicialmapa} zoom={this.zoom} className=''  style={{width: '100%', height: '100%'}}>
                         
                              <LayersMapa  />

                              { this.state.GeoJSON &&

                                  <GeoJSON  key={'geogjon'+this.state.geogsonid}  ref='geojson' opacity={0.4} data={this.state.GeoJSON} onClick={this.onGeoJsonClick} />
                              }

                             

                             <FeatureGroup >
                                

                                <DrawEditControl
                                  position='topleft'
                                  onCreated={this.markCreated}
                                  onEdited={this.markEdited}
                                  draw={{
                                      rectangle:  false,
                                      circle:  false,
                                      polygon: false,
                                      polyline:false,
                                      marker: {
                                          icon: markers.generico,
                                      },
                                  }}
                                  
                                  edit= {{edit: false, delete:false }}
                                />
                               

                                <Marker 
                                    ref='marker'
                                    icon={markers.generico} 
                                    zIndexOffset={100}
                                    onDragEnd={this.markerDragEnd} ref={(e)=> this.marker = e } position={position} draggable={true}>
                      
                                </Marker>
                            

                            </FeatureGroup>


                          { previewPosition.x != 0 &&
                            <FeatureGroup >

                              <CircleMarker 
                                ref='circlemarker'
                                zIndexOffset={110}
                                ref={(e)=> this.circlemarker = e } 
                                center={previewPosition} 
                                radius={10}
                                color="#770610"
                                fillColor="#BC383D"
                                />
        
                            </FeatureGroup>
                          }



                            
                            </Map>
                       </div>





              </div>


               
            </div>
            }

         </FormField>
       </div>
       </div>
      );
    }
}


InputGeoPoint = connect((state,ownprops)=>{
      return {
            prefs:state.prefs
      }
},si3Actions)(InputGeoPoint)

// InputGeoPoint = enhanceWithClickOutside(InputGeoPoint);

export default InputGeoPoint











