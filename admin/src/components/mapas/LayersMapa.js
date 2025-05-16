import React, {  Component, PropTypes } from 'react'

import ReactDOM from 'react-dom';

import { Header, Dropdown, Form, Label, List, Radio, Checkbox, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';

import { connect } from 'react-redux';

import carregaModelo from 'hocs/carregaModelo'

import { si3, si3Actions }  from 'actions/index';

import { markers}  from 'config.js';

import * as util from 'util/s3util'

import moment from 'moment'

import { Map, Marker, Popup, TileLayer, WMSTileLayer, LayersControl, FeatureGroup, Circle, CircleMarker, GeoJSON } from 'react-leaflet';

import Draw from 'leaflet-draw'; // eslint-disable-line

import onlyDOMProps from 'util/onlyDOMProps'


//======================================================
//     LAYER MAPA - CRIAR OS SATELITE LAYERS
//======================================================

// @carregaModelo
class LayersMapa extends React.Component {

  static defaultProps = {
    modelo:'basemap',
    id:'all',
    autoForm:false,
    loadFormOptions:false,
    loader:false
  }
  
  state = {
    sel:''
  }

  layers = [
        {nome:"OpenStreetMap", 
          url:'http://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
          creditos:'OpenStreetMap',
          link:'http://osm.org/copyright'
        },
        {nome:"Satélite (Esri)", 
          url:'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          creditos:'Esri',
          link:'http://www.esri.com/'
        },
  ]


  constructor(props){
    super(props)
  }


  componentWillMount() {

  
    
      var sel = this.props.tileSel;

      if(_.isEmpty(this.sel)){
        sel = _.get(this.props,'itens[0].nome','')
      }

      this.setState({sel:sel})
      
    
  }



  renderLayer = (obj) =>{
          
          var sel = this.state.sel;
          if(_.isEmpty(sel)) sel = "Satélite (Esri)";
          let chk = (sel == obj.nome) ? true : false;

          // chk = true
          if(obj.tipo_mapa == 0){
              return(
                    <LayersControl.BaseLayer 
                      key={obj.nome} name={obj.nome} checked={chk}  >
                        <WMSTileLayer
                          attribution={`&copy; <a href="${obj.link}">${obj.creditos}</a> contributors`}
                          url={obj.url}
                          layers ={obj.layer}
                          />
                    </LayersControl.BaseLayer>
                ) 
          }else{
            return(
                <LayersControl.Overlay 
                      key={obj.nome} name={obj.nome} checked={chk}  >
                        <WMSTileLayer
                          attribution={`&copy; <a href="${obj.link}">${obj.creditos}</a> contributors`}
                          url={obj.url}
                          layers ={obj.layer}
                          transparent={true}
                          format="image/png"
                          />
                    </LayersControl.Overlay>
              )
          }
  }


  render(){
        var layers;
        if(this.props.itens){
          layers = this.props.itens;
        }else{
          layers = this.layers;
        }
        
        return(
                   <LayersControl position='topright' >

                          {  _.map(  _.sortBy(layers, o => o.tipo_mapa ), elm =>
                              this.renderLayer(elm)
                          )}
                                            
                   </LayersControl>
           )
  }
}


LayersMapa = connect((state,ownprops)=>{
      return {
            tileSel:state.prefs.tileSel
      }
},si3Actions)(LayersMapa)


export { LayersMapa as LayersMapa }





