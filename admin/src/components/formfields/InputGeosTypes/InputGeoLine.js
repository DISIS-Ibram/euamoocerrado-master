import React, {  Component, PropTypes } from 'react'

import ReactDOM from 'react-dom';

import { Header, Dropdown, Form, Label, List, Radio, Checkbox, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';

import { connect } from 'react-redux';

import { si3, si3Actions }  from 'actions/index';

import { markers}  from 'config.js';

import * as util from 'util/s3util'

import { Map, Marker, Popup, TileLayer, LayersControl, FeatureGroup, Circle, CircleMarker, GeoJSON, Polygon } from 'react-leaflet';

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
@connect((state,ownprops)=>{
      return {
            prefs:state.prefs
      }
},si3Actions)
export default class InputGeoArea extends React.Component {
    //o static é NESCESSARIO
    static defaultProps = {
      marker:'generico',
      geom:"point",  //point, area, line
    }

    state = {
      open:false,
      fullscreen:false,
      point:[],
      areaGEOJSON:{},
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



    zoom = 9.5


    



    // REACT LIFECYCLE
    //---------------------------
      
    constructor(props){
       super(props)
    }


    //components lifecycles
    componentWillMount() {
          
         const vv = this.props.input.value
        
       
         if (vv == ''){
          this.area = "";
         }else{
          this.area = util.geo.convertGeomFromWKT(vv);
         }

         this.originalArea = this.area;
         this.setState({GeoJSON:this.area})
    }



    componentDidMount() {
      this.getLocation(); 
      this.__wrappedComponent = this.refs.wrappedComponent;
    }


    componentWillReceiveProps(np){    
      
          if(np.input.value == ''){
            this.area = "";
          } else if(this.props.input.value != np.input.value){
            this.area = util.geo.convertGeomFromWKT(np.input.value);
              this.setState({GeoJSON:this.area})
            // this.setState({GeoJSON:this.area})
            //talve precise regenarar o dropdowmGeo se ele tiver aperto aqui
          }
           // this.originalpoint = this.point;
    }



    componentWillUpdate(nextProps, nextState){

        if(nextState.display !='' && this.state.display != nextState.display ){
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
        }
      
        if( this.state.open && prevState.open === false ){
          if(this.refs.map){
            setTimeout(()=>{
                try{
                  this.refs.map.leafletElement.fitBounds(this.refs.geojson.leafletElement.getBounds())
                }catch(e){
                  console.warn(e);
                  
                }
            },100)
          }
        }
        if(prevProps.input.value != this.props.input.value){
          this.getLocation(); 
        }

        if(prevState.fullscreen != this.state.fullscreen){
          setTimeout(()=>{
            // // debugger;
            this.refs.map.leafletElement._onResize()
          }, 100)
        }


    }

    componentWillUnmount(){
       
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


   //onChangeInput
   onInputChange = (e) =>{
       
       return false;
    }





    onInputKeyDown = (e) =>{
     
    }





    
    handleClickOutside = (e) => {
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






    getLocation = () =>{

        // 
        if(this.props.input.value != ''){  
          
          //pego o meu poligno
          this.area = util.geo.convertGeomFromWKT(this.props.input.value);
          var layer = L.geoJSON(this.area).getLayers()[0];
        
          var coord = layer.getLatLngs()
         
        //  var comprimento = L.GeometryUtil.length(coord[0]);
        // 

         var  comprimento = 0;
         

          // var areaTotal = L.GeometryUtil.geodesicArea(coord[0]);

          // var areatotalstr = L.GeometryUtil.readableDistance(areaTotal,true)
           // Calculating the distance of the polyline
          var tempLatLng = null;
          var totalDistance = 0.00000;
         
          _.each(coord, function(latlng){
              if(tempLatLng == null){
                  tempLatLng = latlng;
                  return;
              }
              totalDistance += tempLatLng.distanceTo(latlng);
              tempLatLng = latlng;
          });

          totalDistance = (totalDistance/1000).toFixed(2);

          // var center = layer.getBounds().getCenter();
          this.setState({display: "Comprimento: "+totalDistance+ " km"})

          util.geo.getAreasName( this.props.input.value ,
              (end)=>{
                  this.locationvalue = end;
                  this.setState({display: "Comprimento: "+totalDistance+ " km -  TIS: "+ this.locationvalue });
              }, this)  

          

        }else{
              this.setState({display: ""});
        }
    }





  layerantigo = null






  _onEditPath = (e) => {
  

    // var polyline = e.layers.getLayers();
    let layers = this.refs.featured.leafletElement.getLayers();
    let geojson = {type:"Feature",geometry:{
      type:"MultiPolygon",
      coordinates:[],
    } }
    
    layers.forEach(layer=>{
        let feature = layer.toGeoJSON();
        geojson.geometry.coordinates.push(feature.geometry.coordinates);
    })

    // const a = polyline.toGeoJSON();
    // // this.setState({'areaGEOJSON':a})
    
    const geo = si3.util.geo.convertGeomToWKT(geojson.geometry);
  
    this.props.input.onChange(geo);

  

  }


  _onCreate = (e) => {
    // var polyline = e.layer;
  
    let layers = [ e.layer ]
    
    // if(this.refs.featured){
    //     layers = this.refs.featured.leafletElement.getLayers();
    // }else{
    //   layers.push( e.layer )
    // }
    
    let geojson = {type:"Feature",geometry:{
      type:"LineString",
      coordinates:[],
    } }
    
    layers.forEach(layer=>{
        let feature = layer.toGeoJSON();
        geojson.geometry.coordinates = feature.geometry.coordinates;
    })

    // const a = polyline.toGeoJSON();
    // // this.setState({'areaGEOJSON':a})
    
    const geo = si3.util.geo.convertGeomToWKT(geojson.geometry);
  
    this.props.input.onChange(geo);

    return true;

    
}


  _onDeleted = (e) => {
    console.log('Path deleted !');
    // this.props.input.onChange("");
  }



  _mounted = (drawControl)=> {

    // // debugger;
    const vv = this.props.input.value     

        if (vv == ''){
                this.area = "";
                return false;
        }else{
                this.area = util.geo.convertGeomFromWKT(vv);
        }

    // // if( _.get(this.area,'coordinates') ){
        
        this.layerantigo = L.geoJSON(this.area).getLayers();

        var layer = L.geoJSON(this.area).getLayers()
        
        // if( _.has(this.refs,'featured') ){
        layer.forEach( (l)=>{
              drawControl.options.edit.featureGroup.addLayer(l)
        })
        
        this.refs.map.leafletElement.fitBounds(drawControl.options.edit.featureGroup.getBounds())
        // }
        //   var coordenadas = _.get(this.area,'coordinates')
        //   polygno = (<Polygon latLngList={[coordenadas]} /> );
    // }

    // console.log('Component mounted !');



  }





  _onEditStart(e) {
    console.log('Edit is starting !');
  }

  _onEditStop(e) {
    console.log('Edit is stopping !');
    // // debugger;    

    // var polyline = e.layers.getLayers();
    // const a = polyline.toGeoJSON();
    // // this.setState({'areaGEOJSON':a})
    
    // const geo = si3.util.geo.convertGeomToWKT(a.geometry);
    // this.props.input.onChange(geo);

  
  }

  _onDeleteStart() {
    console.log('Delete is starting !');
  }

  _onDeleteStop() {
    console.log('Delete is stopping !');

    
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
      
    }


    onGeoJsonClickPolygno = (e) =>{

            
            // const a = e.target.toGeoJSON();
            // // this.setState({'areaGEOJSON':a})
            // const geo = si3.util.geo.convertGeomToWKT(a.geometry);

            // this.props.input.onChange(geo);

            // var my_polyline =new L.Polygon(e.target.getLatLngs());

            // this.refs.featured.leafletElement.addLayer(my_polyline);

            // if(this.layerantigo)
            //       this.layerantigo.remove();
            
            // this.layerantigo = my_polyline;

            // console.log('Path created !');

            

    }




    baseLayerChange = (e) =>{
      //salvo meu baselayer preferencias
      if(e.name){
        this.props.setPref({tileSel:e.name})
      }
    }




    // Funcoes do MAPA
    //---------------------------
    
    centerMapOnPoint = (x,y)=> {
          
          //aviso o leaflet o with real dele
          this.refs.map.leafletElement.invalidateSize()
          this.refs.map.leafletElement.panTo(new L.LatLng(x,y));
    }

    


    render (){

      const { input, label, meta: { active, touched, error, valid, dirty }, ...custom } = this.props;    
      delete custom.req


      this.point = { x: -15.47, y:-47.52 };
      this.originalpoint = this.point;

      let mapmode = (this.state.insertModeShift) ? 'insertmode' : 'dragmode';
      mapmode += (this.state.fullscreen) ? ' fullscreen' : ' ';
    
      let position = [this.point.x, this.point.y];

      let positioninicialmapa = [this.originalpoint.x, this.originalpoint.y];

  
    

      let GEOJSONFINAL2 = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -51.9873046875,
                    -12.511665400971019
                  ],
                  [
                    -55.85449218749999,
                    -15.919073517982413
                  ],
                  [
                    -47.9443359375,
                    -16.34122561920748
                  ],
                  [
                    -42.275390625,
                    -13.496472765758952
                  ],
                  [
                    -51.9873046875,
                    -12.511665400971019
                  ]
                ]
              ]
            }
          }
        ]
      }


      // GEOJSONFINAL = {
      //     "type": "FeatureCollection",
      //     "features": [{
      //         "type": "Feature",
      //         "properties": {},
      //         "geometry": {
      //             "type": "MultiPolygon",
      //             "coordinates": [
      //                 [
      //                     [
      //                         [-48.018065015320374, -15.861242036202652],
      //                         [-48.021375337985475, -15.863347127458997],
      //                         [-48.024241434785736, -15.857978345161404],
      //                         [-48.02320259431184, -15.857462205861172],
      //                         [-48.022307657816164, -15.857062540695184],
      //                         [-48.02043939187498, -15.856380498390951],
      //                         [-48.01996055366426, -15.857689762021197],
      //                         [-48.02091460560776, -15.857826776628334],
      //                         [-48.020954637128625, -15.85924455849614],
      //                         [-48.020797122605835, -15.859484951874913],
      //                         [-48.019620489758644, -15.860228865061991],
      //                         [-48.01807257730681, -15.861170718183066],
      //                         [-48.018065015320374, -15.861242036202652]
      //                     ]
      //                 ],
      //                 [
      //                     [
      //                         [-48.02456205021163, -15.853015694809152],
      //                         [-48.02661891472923, -15.85555944932587],
      //                         [-48.02549205917027, -15.856638983572722],
      //                         [-48.026417254288184, -15.85677497869786],
      //                         [-48.0286985084161, -15.855759777427295],
      //                         [-48.02669426030547, -15.853125474812],
      //                         [-48.02621882451921, -15.853216077383554],
      //                         [-48.02600369072549, -15.852459544538368],
      //                         [-48.026193543186615, -15.852349468456548],
      //                         [-48.02592334891413, -15.851611848410275],
      //                         [-48.02456205021163, -15.853015694809152]
      //                     ]
      //                 ]
      //             ]
      //         }
      //     }]
      // }
            
      let GEOJSONFINAL = this.state.GeoJSON


      let polygons = [  
                    <Polygon key={"polygonedit1"} positions={[
                              [-49.02456205021163, -15.853015694809152],
                              [-48.02661891472923, -15.85555944932587],
                              [-48.02549205917027, -15.856638983572722],
                              [-48.026417254288184, -15.85677497869786],
                              [-48.0286985084161, -15.855759777427295],
                              [-48.02669426030547, -15.853125474812],
                              [-48.02621882451921, -15.853216077383554],
                              [-48.02600369072549, -15.852459544538368],
                              [-48.026193543186615, -15.852349468456548],
                              [-48.02592334891413, -15.851611848410275],
                              [-48.02456205021163, -15.853015694809152]
                          ]} />
                          
                            ]
      
      // if(GEOJSONFINAL.features){
      //       GEOJSONFINAL.features.forEach(  (feature,index)=>
      //                                 polygons.push( <Polygon key={"polygonedit"+index} positions={feature.geometry.coordinates} /> )
      //                            )

      // 
      // }
    
      return (

        <div className='geopointwraper rel' ref="wrappedComponent">

        <div className={'geoinput dragandrop modo-'+this.state.modoExibicao+(this.state.open && " open") } ref={(el) => this.dropI = el} 
              onDragOver={this.dragOver}
              onDragEnter={this.dragEnter}
              onDragLeave={this.dragOut}
              onDrop={this.drop} 
          >
         
          <FormField {...this.props}  dica='Desenhe a área, ou ARRASTE aqui os arquivos de geo para selecionar'>
            
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
                          ref='map'
                          onBaselayerchange={this.baseLayerChange}
                          onClick={(e)=>{this.onMapClick(e)}}  
                          center={positioninicialmapa} 
                          zoom={this.zoom} 
                          className='col-xs-12 row-xs-12'>
                         
                              <LayersMapa  />

                          

                            <FeatureGroup ref='featured' >                 

                                <DrawEditControl
                                    position='topleft'
                                    onEdited={this._onEditPath.bind(this) }
                                    onCreated={this._onCreate.bind(this)}
                                    onDeleted={this._onDeleted}
                                    onMounted={this._mounted}
                                    onEditStart={this._onEditStart}
                                    onEditStop={this._onEditStop}
                                    onDeleteStart={this._onDeleteStart}
                                    onDeleteStop={this._onDeleteStop}
                                    draw={{
                                      rectangle: true,
                                      circle: false,
                                      polygon:false,
                                      polyline:true,
                                      marker: false,
                                      edit: {
                                        remove: true
                                      }
                                    }}
                                />

                                {/* <Circle center={  [-51.9873046875, -12.511665400971019] } radius={200} />  */}

              
            
                            </FeatureGroup>

                             
                            
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

















