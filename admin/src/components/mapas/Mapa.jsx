import React from 'react'
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { si3, si3Actions } from 'actions/index';

import { Map, Marker, Popup, TileLayer, LayersControl, FeatureGroup, Circle, CircleMarker, GeoJSON } from 'react-leaflet';
import { markersMap } from 'config.js';

import { EditControl as DrawEditControl } from "react-leaflet-draw"
import simplify from 'simplify-geometry';
import * as topojson from "topojson";
import carregaModelo from 'hocs/carregaModelo'
import { LayersMapa } from 'components/mapas/LayersMapa'
import AutoView  from 'components/views/AutoView.js'

import * as turf from '@turf/turf'
import bezierSpline from '@turf/bezier-spline'




//---------------------------
@carregaModelo
class Mapa extends React.Component {

    static defaultProps = {
        marker: 'relato',
        modelo: 'basemap', //pq so renderizo o mapa depois de carregar o layers mapas
        id: 'all',
        autoForm: false,
        loadFormOptions: false,
        loader: true,
        modelos: ['relato', 'registro','fpe','fpe_abrangencia','bape','planejamentoexpedicao','relatoriodeexpedicao','vestigio','expedicao','sitio','avistamento','aldeia','habitacao'], //lista de modelos que devo receber
       //modelos: ['relato'],
        destaqueModelo:false, //modelo name to destaque
        destaqueId:false, //id do destaque
        destaqueLocation:false, //id do destaque
  
    }

    state = {
        open: false,
        geoEstados: false,
        geoTi: false,
        geoMunicipio: false,
        geoRelatos: false,
        geoRegistro: false,
        selectLayer: false,
        popupLocation:[-15,-45],
        popupModelo:false,
        popupId:false,
        filter:{},
        linhasRelacoesGeoJSON:{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            -51.78955078125,
            -13.902075852500483
          ],
          [
            -54.29443359375,
            -15.347761924346937
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            -51.5478515625,
            -14.200488387358332
          ],
          [
            -50.38330078125,
            -16.088042220148807
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            -51.52587890625,
            -13.966054081318301
          ],
          [
            -47.79052734375,
            -13.88074584202559
          ]
        ]
      }
    }
  ]
}
    }

    constructor(props) {
            super(props);
            // this.mapref = React.createRef();
  }


    componentDidMount() {

        si3.getGeoJson("terraindigena")
            .then((data) => {

                dataFinal = topojson.this.setState({
                    geoTi: data
                })
                // const dataSTR = JSON.stringify(data);
                console.log("====ti carregada =====")

            // localStorage.setItem('si3tisTiles',dataSTR);
            // const a = localStorage.getItem('si3tisTiles')
        })

        si3.getGeoJson("estado")
            .then((data) => {
                ;
                var dataFinal = topojson.feature(data, data.objects.estado);

                this.setState({
                    geoEstados: dataFinal
                })
                console.log("====Estados Carregadas=====")
            //  localStorage.setItem('si3estadosTiles',JSON.stringify(data))
            })


        si3.getGeoJson("municipio")
            .then((data) => {
                var dataFinal = topojson.feature(data, data.objects.municipio);
                this.setState({
                    geoMunicipio: dataFinal
                })
            //  localStorage.setItem('si3estadosTiles',JSON.stringify(data))
        })

        this.carregaModelosBusca();
        
        //Adiciono os eventos pq o do react-leaflet nao esta funcionado
        this.mapref.leafletElement.on('baselayerchange',this.baseLayerChange)

    }


    componentWillUnmount() {
        // alert('unmont')
    }





    //Carrega o modelos dos mapas
    carregaModelosBusca = (geo = "", options = {}) => {
       

       //mostro nenhum modelo
       var stateModelos = {} 
       _.each(this.props.modelos,k=>{ stateModelos[k]=false })
       this.setState(stateModelos)


        var optionsFinal = {};
        if (geo != "") {
            optionsFinal.geom = geo
        } else {
            optionsFinal = options;
        }


        //limpo as linhas
        this.setState({linhasRelacoesGeoJSON:{type:"FeatureCollection",features:[]}})

        // var lineString

        //loop em todos os modelos que eu quero
          _.each(this.props.modelos,modelo=>{
               si3.getGeoJson(modelo, optionsFinal)
                   .then((data) => {


                        if(!_.isEmpty(this.state.filter)){

                            var features = [] //this.state.linhasRelacoesGeoJSON];

                            //create the line string
                            _.each(data.features,feature=>{
                         
                                    var pointdest = turf.center(feature);
                                    var linefeature = turf.lineString([ [this.state.popupLocation[1],this.state.popupLocation[0]], pointdest.geometry.coordinates ],{name: 'line 1'});

                                    // Calculate the distance in kilometers between route start/end point.
                                    // var lineDistance = turf.lineDistance(linefeature, 'kilometers');
                                  
                                    // var arc = [];

                                    // // Number of steps to use in the arc and animation, more steps means
                                    // // a smoother arc and animation, but too many steps will result in a
                                    // // low frame rate
                                    // var steps = 500;

                                    // // Draw an arc between the `origin` & `destination` of the two points
                                    // for (var i = 0; i < lineDistance; i += lineDistance / steps) {
                                    //     var segment = turf.along(linefeature, i, 'kilometers');
                                    //     arc.push(segment.geometry.coordinates);
                                    // }

                                    // // Update the route with calculated arc coordinates
                                    // linefeature.geometry.coordinates = arc;

                                    // linefeature = bezierSpline(linefeature)
                                    features.push(linefeature);
                         
                            })

                            var final = [...this.state.linhasRelacoesGeoJSON.features,...features]

                            this.setState({linhasRelacoesGeoJSON:{type:"FeatureCollection",features:final}})

                        }

                        console.log(JSON.stringify(this.state.linhasRelacoesGeoJSON));
                        var obj = {}
                        obj[modelo] = data
                        this.setState({...obj})
                   })
          })



        // si3.getGeoJson("relato", optionsFinal)
        //     .then((data) => {
        //         this.setState({
        //             geoRelatos: data
        //         })
        //     })

        // si3.getGeoJson("registro", optionsFinal)
        //     .then((data) => {
        //         this.setState({
        //             geoRegistro: data
        //         })
        //     })

    }





    //quando clico em gson
    onGeoJsonClick = (e, tipo = "estado") => {

        

        if (this.layerantigo) {
            this.layerantigo.remove();
            this.layerantigo = undefined
        }

        if (this.selectLayer) {
            this.selectLayer.setStyle({
                color: this.selectLayer.defaultOptions.color
            })
        }

        if (this.selectLayer && this.selectLayer === e.layer) {
            this.selectLayer = undefined;
            this.carregaModelosBusca("", {})
            return;
        } else {

            e.layer.setStyle({
                color: 'green'
            })
            this.selectLayer = e.layer
        }



        if (e.layer.feature.properties.pk) {
            var options = [];
            options[tipo] = e.layer.feature.properties.pk;
            this.carregaModelosBusca("", options)

        } else {
            const a = e.layer.toGeoJSON();
            a.geometry.coordinates = simplify(a.geometry.coordinates, 5)
            const geo = si3.util.geo.convertGeomToWKT(a.geometry);
            this.carregaModelosBusca(geo, options)

        }

    }

    layerantigo = null
    polyCreated = (e) => {

        if (this.selectLayer) {
            this.selectLayer.setStyle({
                color: this.selectLayer.defaultOptions.color
            })
            this.selectLayer = undefined;
        }

        const a = e.layer.toGeoJSON();
        // 
        //pego a latitude lng desse novo ponto
        const geo = si3.util.geo.convertGeomToWKT(a.geometry);

        // console.log(geo);
        // 
        this.carregaModelosBusca(geo)

        if (this.layerantigo)
            this.layerantigo.remove();

        this.layerantigo = e.layer;

        e.layer.on('click',
            (e) => {
                this.layerantigo.remove();
                this.layerantigo = undefined;
                this.carregaModelosBusca()
            }
        )

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

    render() {

        let center = [-15, -50];
        let zoom = 4;

        if(this.props.destaqueLocation != false){
            zoom = 13
            center = si3.util.geo.convertPointFromWKT(this.props.destaqueLocation)
            center = [center.x,center.y]
        }

        ;

        return ( 
                <div className={ `mapwrap col-xs-12 row-xs-12` } style={ { height: '100%', paddingTop: 0 } } >
            
                   <Map ref='map' onBaselayerchange={ this.baseLayerChange }
                    ref={(node) => this.mapref = node} 
                    center={ center } zoom={ zoom } className='col-xs-12 row-xs-12'>
                     
                
                     
                   



                     <LayersControl position='topright' collapsed={ true }>


                       
                        { _.map(this.props.modelos ,modelo=>(
                           
                           _.isArray( _.get(this.state, modelo+'.features') )  &&
                           
                            <LayersControl.Overlay key={ 'geooverlay'+modelo }  name={ modelo+"(" + _.get(this.state[modelo],'features.length',0) + ")" } checked={ true }>
                                 
                                 <GeoJSON 
                                    key={ 'geo'+modelo } 
                                    ref={'georelatos'+modelo}
                                    data={ this.state[modelo] } 


                                    pointToLayer={ (f, l) => {
                                    
                                     return  L.marker(l, {icon:markersMap(modelo,f.properties)} )  
                                    
                                    }}

                                    onEachFeature={ (feature, layer) => { 
                                           
                                            layer.on('click',(e)=>{
                                                    this.setState({popupModelo:false,popupId:false})  
                                                //   alert(feature.geometry.coordinates);
                                                  this.setState({
                                                        popupLocation:[feature.geometry.coordinates[1],feature.geometry.coordinates[0]],
                                                        popupModelo:modelo,
                                                        popupId: feature.properties.pk
                                                  });
                                            })
                                            // var prop = feature.properties 
                                            // var html = `<div> <div> <b> ${modelo} ${prop.pk} </b></div> <div> </div> 
                                            //             <div> <a href="/form/${modelo}/${prop.pk}"> <i class="fa fa-pencil"></i> Editar </a></div> </div>`
                                            // layer.bindPopup(html) 
                                        } }
                                   
                                />
                             </LayersControl.Overlay> 
                            
                        
                        ))
                        
                        
                        }


                     </LayersControl>

                    <GeoJSON key={this.state.linhasRelacoesGeoJSON.features.length} ref='linhasReferencia' opacity={1} color="white" stroke="white" data={ this.state.linhasRelacoesGeoJSON } />

                    

                      <LayersControl position='topright' collapsed={ true }> 
                    
                       { this.state.geoTi &&
                         <LayersControl.Overlay name="Terras Indigenas" checked={ true }>
                           <GeoJSON key={ 'geogjonti' } ref='geojsonti' opacity={ 0.4 } data={ this.state.geoTi } onClickNO={ (e) => this.onGeoJsonClick(e, 'terra_indigena') } fillColor="red" color="red"
                           />
                         </LayersControl.Overlay> }
                       { this.state.geoEstados &&
                         <LayersControl.Overlay name="Estados" checked={ true } key={ 'estado' }>
                           <GeoJSON key={ 'geogjonestados' } ref='geojsonEstados' color="blue" opacity={ 0.4 } data={ this.state.geoEstados } onClickNO={ (e) => this.onGeoJsonClick(e, 'estados') }  />
                         </LayersControl.Overlay> }
                       { this.state.geoMunicipio &&
                         <LayersControl.Overlay name="Municipio" checked={ false }>
                           <GeoJSON key={ 'geomunicipio' } ref='geomunicipio' color="orange" opacity={ 0.4 } data={ this.state.geoMunicipio } onClickNO={ (e) => this.onGeoJsonClick(e, 'municipio') } />
                         </LayersControl.Overlay> }

                     

                     </LayersControl>



                      <LayersMapa />


                    

                     { this.state.popupModelo != false &&

                      <Popup ref="popup" minWidth={300} offset={[0,-46]} key={"loc"+this.state.popupLocation[0]} position={this.state.popupLocation}
                        // onClose={(e)=>{ alert('aaaaaa'); this.setState({popupModelo:false,popupId:false}) }  }
                        onOpen={(e)=>{ console.log('abriu');}}

                      >
                        <span>
                          <AutoView store={window.STORE} modelo={this.state.popupModelo}  id={this.state.popupId} /> 
                          <div> 
                              <a href={`/form/${this.state.popupModelo}/${this.state.popupId}`}> <i className="fa fa-pencil"></i> Editar </a> 
                                
                              
                                
                                { _.isEmpty(this.state.filter) &&
                                
                                  <a onClick={(e)=> {
                                        var filter = {};
                                        filter[this.state.popupModelo] = this.state.popupId
                                        this.setState({filter:filter})
                                        this.carregaModelosBusca("",filter)
                                    }}> 
                                    <i className="fa fa-filter"></i> Filtrar 
                                 </a> 
                                 
                                 ||
                                   <a onClick={(e)=> {
                                        var filter = {};
                                        filter[this.state.popupModelo] = this.state.popupId
                                        this.setState({filter:{}})
                                        this.carregaModelosBusca("",{})
                                    }}> 
                                    <i className="fa fa-erase"></i> Remover Filtro 
                                    </a> 
                                 }

                          </div>
                        </span>

                    </Popup>
                     }



                    {/* <Marker position={[-15,-45]}>
                        <Popup><span> A pretty CSS3 popup.<br />Easily customizable.</span></Popup>
                     </Marker> 
                    */}


                     <FeatureGroup>
                       <DrawEditControl position='topleft' onCreated={ this.polyCreated } onEdited={ this.polyCreated } draw={ { rectangle: true, circle: false, polygon: true, polyline: false, marker: false, } } />
                     </FeatureGroup>
                   </Map>
                   </div>
        )



    }

}


function mapStateToProps(state) {
    const {api, app} = state;
    return {
        api: api
    };
}


Mapa = connect(mapStateToProps, si3Actions)(Mapa);
export default Mapa