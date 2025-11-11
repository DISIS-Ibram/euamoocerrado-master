// import React, {  Component } from 'react';
import React, { Component } from "react";
import PropTypes from "prop-types";

import ReactDOM from "react-dom";

import {
  Header,
  Dropdown,
  Form,
  Label,
  List,
  Radio,
  Checkbox,
  Icon,
  Accordion,
  Input,
  Dimmer,
  Loader,
  Image,
  Segment,
  Button,
} from "semantic-ui-react";

import { connect } from "react-redux";

import { si3, si3Actions } from "actions/index";

import { markers } from "config.js";

import * as util from "util/s3util";

import {
  Map,
  Marker,
  Tooltip,
  Popup,
  TileLayer,
  LayersControl,
  FeatureGroup,
  Circle,
  CircleMarker,
  GeoJSON,
  Polygon,
  Polyline,
} from "react-leaflet";

import { EditControl as DrawEditControl } from "react-leaflet-draw";

import FormField from "components/formfields/FormField";

import wkx from "wkx";

import { Utm, Dms } from "geodesy";

import { LatLonEllipsoidal as LatLon } from "geodesy";

import onlyDOMProps from "util/onlyDOMProps";

import { LayersMapa } from "components/mapas/LayersMapa";
import { MapaSelectedFeature } from "components/mapas/MapaSelectedFeature";

import carregaModelo from "hocs/carregaModelo";

@connect((state, ownprops) => {
  return {
    prefs: state.prefs,
  };
}, si3Actions)
@carregaModelo
export default class MapaAtrativosDefault extends React.Component {
  static defaultProps = {
    modelo: "tipoatrativo",
    id: "all",
    idtrilha: 0,
    //options:{includes:['atrativotrilha_set']},
    loader: true,
    force: true,
  };

  state = {
    selected: false,
  };

  render() {
    let items = [];

    _.each(this.props.itens, (item) => {
      items.push({
        ...item,
        _tipo: "atrativotrilha",
        _tipoGeom: "point",
        _identifier: item.id + "tipoatrativo",
      });
    });

    const atrativosById = _.keyBy(items, "id");

    // debugger;
    // _.each(this.props.itens.tipobenfeitoria, item=>{
    //   items.push( {...item, _tipo:'benfeitoria',  _tipoGeom:'point',  _identifier:item.id+'tipobenfeitoria'} )
    // })

    return (
      <div className="row">
        <div className="col-xs-12">
          <h3>Trilha </h3>

          <p>
            <small>Crie ou importe a trilha abaixo</small>
          </p>

          <div className="row">
            <div className="col-xs-12">
              <div className="row">
                {items.map((item) => (
                  <div
                    key={item._identifier}
                    onClick={(e) => this.setState({ selected: item })}
                    style={{
                      display: "inline-block",
                      width: "60px",
                      height: "60px",
                      marginRight: "2px",
                      marginBottom: "2px",
                      cursor: "pointer",
                      padding: "10px",
                      background:
                        (_.get(this.state.selected, "_identifier") ==
                          item._identifier &&
                          "lightblue") ||
                        "white",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    <img
                      style={{ width: "25px", maxHeight: "25px" }}
                      src={item.icone}
                    />
                    <div style={{ fontSize: "8px", lineHeight: "7px" }}>
                      {item.nome}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <MapaAtrativos
            id={this.props.idtrilha}
            tipobenfeitoria={[]}
            tipoatrativo={this.props.itens.tipoatrativo}
            currentAtrativo={this.state.selected}
            atrativosById={atrativosById}
          />
        </div>
      </div>
    );
  }
}

@connect((state, ownprops) => {
  return {
    prefs: state.prefs,
  };
}, si3Actions)
@carregaModelo
export class MapaAtrativos extends React.Component {
  //o static é NESCESSARIO
  static defaultProps = {
    marker: "generico",
    geom: "point", //point, area, line
    modelo: "trilha",
    id: "1",
    // options:{includes:['atrativotrilha_set']},
    loader: true,
    tipoatrativo: [],
    tipobenfeitoria: [],
    currentAtrativo: false,
    atrativosById: {},
  };

  state = {
    polygonLayers: [],
    open: false,
    fullscreen: false,
    point: [],
    areaGEOJSON: {},
    insertModeShift: false,
    insertModeBtn: false,
    display: "",
    GeoJSON: false,
    uploaded_GeoJSON: false,
    selIndex: 0,
    geogsonid: 0, //pq mudo o key quando muda o json apra reenderizar
    isFetchingGeo: false,
    isFetchingLocation: false,
    modoEntrada: "mapa", // [mapa, digitado, localidade]  -- COMO FOI A ENTRADA DA LOCALIDADE
    modoExibicao: "mapa", //[fullmapa, mapa, menu] -- COMO DEVE SER EXIBIDO O MAPA
    valorEntrada: "",
    dropdowOpcoes: [],
    dropdownTipo: "", //GEO,LOCALIDADE,''
  };

  //fora pqnao quero ser state pois é referencia, meu componente nao precisa alterar na sua conversao,
  //soquando o imput que é o valor mudar

  geoPref = "gd";
  tipoGeoQueDigitou = "gd"; //o tipo de geo que o cara esta escrevendo

  //o ponto corrent
  point = { x: 0, y: 0 };
  previewPoint = { x: 0, y: 0 };

  pointOnFocus = this.point;

  // é o nome da localidade no ponto
  locDisplay = "";

  estado = "";

  municipio = "";

  localidade = "";

  modoEntrada = "point";

  estadolist = "";

  municipioList = "";

  overtimeout = 0;

  typingvalue = "";
  locationvalue = "";

  clickInside = false;

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

  zoom = 5;

  // REACT LIFECYCLE
  //---------------------------

  constructor(props) {
    super(props);
  }

  //components lifecycles
  componentWillMount() {
    //  const vv = "" //this.props.input.value
    //
    //  if (vv == ''){
    //   this.area = "";
    //  }else{
    //   this.area = util.geo.convertGeomFromWKT(vv);
    //  }
    //  this.originalArea = this.area;
    //  this.setState({GeoJSON:this.area})
  }

  componentDidMount() {
    //salvo o polygno inicial para utilizar ele como base
    let polygons = util.geo.convertGeomFromWKT(this.props.itens.geom);
    let polygonLayers = L.geoJSON(polygons).getLayers();
    this.setState({ polygonLayers });

    if (this.refs.map) {
      setTimeout(() => {
        this.refs.map.leafletElement.fitBounds(
          this.refs.featured.leafletElement.getBounds()
        );
      }, 400);

      setTimeout(() => {
        let featureGroup = this.refs.featured.leafletElement;
        if (featureGroup) {
          featureGroup.on("click", (e) => {
            if (e.layer.options.model === "atrativotrilha") {
              let atrativoid = e.layer.options.item.id;

              this.props.openModal({
                nome: "atrativotrilha",
                tipo: "form",
                modelo: "atrativotrilha",
                onSave: () => {
                  this.props.load("trilha", {}, { id: this.props.id });
                },
                id: atrativoid,
                value: {},
              });
            }
          });
        }
      }, 1000);
    }
  }

  componentWillReceiveProps(np) {
    // // debugger;
    //   if(np.input.value == ''){
    //     this.area = "";
    //   } else if(this.props.input.value != np.input.value){
    //     this.area = util.geo.convertGeomFromWKT(np.input.value);
    //       this.setState({GeoJSON:this.area})
    //     // this.setState({GeoJSON:this.area})
    //     //talve precise regenarar o dropdowmGeo se ele tiver aperto aqui
    //   }
    // this.originalpoint = this.point;
  }

  componentWillUpdate(nextProps, nextState) {}

  //nao é chamado no primeiro render
  componentDidUpdate(prevProps, prevState) {
    if (this.refs.map) {
      window.d = this.refs.drawlayer;
      setTimeout(() => {
        try {
          document.querySelector(".leaflet-draw-draw-marker").click();
        } catch (error) {
          console.warn(error);
        }
      }, 200);
    }

    if (prevState.fullscreen != this.state.fullscreen) {
      setTimeout(() => {
        this.refs.map.leafletElement._onResize();
      }, 100);
    }
  }

  componentWillUnmount() {}

  handleClickOutside = (e) => {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || !domNode.contains(e.target)) {
      this.close();
      this._focus = false;
      this.clickInside = false;
    } else {
      //pq quando clicamos nos control do leaflet o click nao épassado adiante, e preciso nao fechar o mapa quando perco o blur do input
      this.clickInside = true;
      setTimeout(() => (this.clickInside = false), 200);
    }
  };

  detectaShift = (e) => {
    if (e.shiftKey && this.state.insertModeShift === false) {
      this.setState({ insertModeShift: true });
    } else if (e.shiftKey == false && this.state.insertModeShift === true) {
      this.setState({ insertModeShift: false });
    }
  };

  dragOver = (event) => {
    event.preventDefault();
    clearTimeout(this.overtimeout);
    $(this.dropI).addClass("hover");
  };

  dragEnter = (event) => {
    clearTimeout(this.overtimeout);
    event.preventDefault();
    $(this.dropI).addClass("hover");
  };

  dragOut = (event) => {
    event.preventDefault();
    this.overtimeout = setTimeout(
      () => $(this.dropI).removeClass("hover"),
      800
    );
  };

  drop = (event) => {
    const {
      input: { onChange },
    } = this.props;
    event.preventDefault();
    this.processFiles(event.dataTransfer.files);
    $(this.dropI).removeClass("hover");
  };

  // Funcoes do componente
  //---------------------------

  //*****open and close

  open = () => {
    //salvo o ponto de quando abrimos
    this.originalpoint = this.point;
    this.setState({ open: true });
  };

  close = (time = 300) => {
    //salvo o ponto quando fechamos
    this.originalpoint = this.point;
    console.log("vai fechar em " + time);
    this.closeTimeout = setTimeout(() => {
      console.log("fechou");
      this.setState({ open: false, fullscreen: false });
      this.originalpoint = this.point;
      this.getLocation();
    }, time);
  };

  delayCloseCal = (t = 200) => {
    this.close(t);
  };

  toogle = () => {
    //se tiver aberto fecho
    //se tiver fechado abro
    if (this.state.open) {
      this.close(50);
    } else {
      this.open();
    }
  };

  canceloDelayClose = () => {
    console.log("cancelo delay close");
    clearTimeout(this.closeTimeout);
  };

  getLocation = () => {
    //
    if (this.props.input.value != "") {
      //pego o meu poligno
      this.area = util.geo.convertGeomFromWKT(this.props.input.value);
      var layer = L.geoJSON(this.area).getLayers()[0];
      var coord = layer.getLatLngs();
      var areaTotal = L.GeometryUtil.geodesicArea(coord[0]);

      var areatotalstr = L.GeometryUtil.readableArea(areaTotal, true);

      var center = layer.getBounds().getCenter();

      this.setState({ display: "Área: " + areatotalstr });

      util.geo.getAreasName(
        this.props.input.value,
        (end) => {
          this.locationvalue = end;
          this.setState({
            display: "Área: " + areatotalstr + " -  TIS: " + this.locationvalue,
          });
        },
        this
      );
    } else {
      this.setState({ display: "" });
    }
  };

  layerantigo = null;

  saveParqueGeom = async () => {
    let geojson = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    };

    let allLayers = this.refs.featured.leafletElement.getLayers();
    let polygonsLayers = [];

    allLayers.forEach((layer) => {
      if (layer instanceof L.Polyline) {
        polygonsLayers.push(layer);
      }
    });

    polygonsLayers.forEach(async (layer) => {
      let feature = layer.toGeoJSON();
      geojson.geometry.coordinates = feature.geometry.coordinates;
    });

    const geom = si3.util.geo.convertGeomToWKT(geojson.geometry);
    let res = await this.props.save("trilha", { id: this.props.id, geom });
    console.log("salvou");
    console.log(res);
  };

  _onCreate = async (e) => {
    if (e.layerType == "marker") {
      if (this.props.currentAtrativo) {
        let model = this.props.currentAtrativo;
        let obj = {};

        if (model._tipo == "benfeitoria") {
          obj.tipo_benfeitoria = model.id;
        } else if (model._tipo == "atrativotrilha") {
          obj.tipo_atrativo = model.id;
        }
        let l = e.layer.toGeoJSON();
        obj.geom = si3.util.geo.convertGeomToWKT(l.geometry);
        obj.trilha = this.props.id;
        let res = await this.props.save(model._tipo, obj);
        //set options in layer to edit work, since i used <Marker>
        e.layer.options.item = res[0];
        e.layer.options.model = model._tipo;

        console.log("salvou");
        console.log(res);
      }
    } else if (e.layerType == "polyline") {
      this.saveParqueGeom();
    }
  };

  _onDeleted = (e) => {
    console.log("Path deleted !");
    // this.props.input.onChange("");
  };

  _mounted = (drawControl) => {
    console.log(drawControl);
    const map = drawControl._map;

    setTimeout(() => {
      debugger;
      let featuredGroup = this.refs.featured.leafletElement;

      // featuredGroup.on('click',(e)=>{
      // debugger;

      // let layers = e.target
      // layers.forEach(async layer=>{
      //   if(layer instanceof L.Polygon){
      //     polygonsLayers.push(layer)
      //   } else if(layer instanceof L.Marker){
      //     markerLayers.push(layer)
      //   } else if(layer instanceof L.Polyline){
      //     polylineLayers.push(layer)
      //   }
      // })

      // })
    }, 1000);
  };

  _onEditStart(e) {
    console.log("Edit is starting !");
  }

  _onEditPath = async (e) => {
    let polygonsLayers = [];
    let markerLayers = [];
    let polylineLayers = [];

    e.layers.eachLayer(async (layer) => {
      if (layer instanceof L.Polygon) {
        polygonsLayers.push(layer);
      } else if (layer instanceof L.Marker) {
        markerLayers.push(layer);
      } else if (layer instanceof L.Polyline) {
        polylineLayers.push(layer);
      }
    });

    if (!_.isEmpty(markerLayers)) {
      markerLayers.forEach(async (layer) => {
        let item = layer.options.item;
        let model = layer.options.model;
        let l = layer.toGeoJSON();
        item.geom = si3.util.geo.convertGeomToWKT(l.geometry);
        let res = await this.props.save(model, {
          id: item.id,
          geom: item.geom,
        });
        console.log("salvou");
        console.log(res);
      });
    }

    //now for each polygon, merge and sabe the parque geom
    if (!_.isEmpty(polylineLayers)) {
      this.saveParqueGeom();
    }

    return e;
  };

  _onEditStop(e) {
    console.log("Edit is stopping !");
  }

  _onDeleteStart(e) {
    console.log("Delete is starting !");
  }

  _onDeleted = async (e) => {
    let polygonsLayers = [];
    let markerLayers = [];
    let polylineLayers = [];

    let layers = e.layers.getLayers();

    layers.forEach(async (layer) => {
      if (layer instanceof L.Polygon) {
        polygonsLayers.push(layer);
      } else if (layer instanceof L.Marker) {
        markerLayers.push(layer);
      } else if (layer instanceof L.Polyline) {
        polylineLayers.push(layer);
      }
    });

    if (!_.isEmpty(markerLayers)) {
      markerLayers.forEach(async (layer) => {
        let item = layer.options.item;
        let model = layer.options.model;
        let res = await this.props.remove(model, { id: item.id });
        console.log("apagou");
        console.log(res);
      });
    }

    //if delete a polygon, i have to get all tolygom to save map

    if (!_.isEmpty(polygonsLayers)) {
      this.saveParqueGeom();
    }
  };
  _onDeleteStop(e) {
    console.log("Delete is stopping !");
  }

  fileSelected = (e) => {
    let filelist = e.currentTarget.files;
    this.processFiles(filelist);
  };

  processFiles = (filelist) => {
    //envio os arquivos
    //processo o json
    var data = new FormData();
    for (var i = filelist.length - 1; i >= 0; i--) {
      data.append("file_field", filelist[i]);
    }

    this.setState({ isFetchingGeo: true });
    si3.sendGeoFiles(data).then((data) => {
      // console.log(data)
      this.setState({
        modoExibicao: "selecao",
        isFetchingGeo: false,
        uploaded_GeoJSON: data,
        geogsonid: this.state.geogsonid + 1,
      });
    });
  };

  selectedPolygonLayers = (geoJSON) => {
    if (geoJSON != false) {
      let layers = L.geoJSON(geoJSON).getLayers();
      this.setState({ polygonLayers: layers, uploaded_GeoJSON: false });

      if (this.refs.map) {
        setTimeout(() => {
          this.refs.map.leafletElement.fitBounds(
            this.refs.featured.leafletElement.getBounds()
          );
          this.saveParqueGeom();
        }, 400);
      }
    } else {
      this.setState({ uploaded_GeoJSON: false });
    }
  };

  //Quando salvo os valores
  // ll - latlong leaflet object
  saveEntradaViaMapa = (ll) => {
    // ja salvo no ponto intero quem é
    // this.point = util.geo.getPointinXY(ll)
    const wktString = util.geo.convertPointToWKT(ll);
    this.props.input.onChange(wktString);

    //se eu estoudigitando
    if (this.state.modoExibicao != "menu") {
      this.getLocation();
      this.setState({ modoEntrada: "mapa" });
    } else {
      //posso estar mexendo no mapa quando tenho dropdown geos
      //LETODO - melhorar isso aqui,
      //se for via dropdowgeo

      //pego o valor exibicao
      const vv = this.getDisplayFormat(ll.lat, ll.lng);

      this.setState({ valorEntrada: vv, display: vv });

      this.onInputChange({ target: { value: vv } }); //simulo que o input mudou para renovar o dropdown

      this.previewPoint = { x: 0, y: 0 }; //assim o preview point nao aparece mais tb
    }
  };

  //Quando salvo os valores
  saveEntradaViaDigitando = (lat, lng) => {
    let ll = { lat: lat, lng: lng };

    const wktString = util.geo.convertPointToWKT(ll);

    this.props.input.onChange(wktString);
    // this.getLocation() //nao get o location pq to digitando, né?

    this.setState({
      modoEntrada: "digitado",
      valorEntrada: this.state.display,
    });

    this.previewPoint = { x: 0, y: 0 }; //assim o preview point nao aparece mais
    this.centerMapOnPoint(lat, lng);
  };

  // Eventos no Mapa
  //---------------------------

  onMapClick = (e) => {
    debugger;
  };
  onAtrativoClick = (e) => {
    debugger;
  };

  onGeoJsonClickPolygno = (e) => {
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
  };

  baseLayerChange = (e) => {
    //salvo meu baselayer preferencias
    if (e.name) {
      this.props.setPref({ tileSel: e.name });
    }
  };

  // Funcoes do MAPA
  //---------------------------

  centerMapOnPoint = (x, y) => {
    //aviso o leaflet o with real dele
    this.refs.map.leafletElement.invalidateSize();
    this.refs.map.leafletElement.panTo(new L.LatLng(x, y));
  };

  getTipoBenfeitoria = (id) => {
    let tipo = _.find(this.props.tipobenfeitoria, { id });
    return tipo;
  };

  render() {
    this.point = { x: -13, y: -45 };
    this.originalpoint = this.point;

    let mapmode = this.state.insertModeShift ? "insertmode" : "dragmode";
    mapmode += this.state.fullscreen ? " fullscreen" : " ";

    let position = [this.point.x, this.point.y];

    let positioninicialmapa = [this.originalpoint.x, this.originalpoint.y];

    console.log(
      "********************************************************************"
    );
    console.log(this.props.itens.atrativotrilha_set);

    let GEOJSONFINAL_PARQUEAREA = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: this.props.itens.geom,
        },
      ],
    };

    let marker = false;
    if (this.props.currentAtrativo) {
      marker = {
        repeatMode: true,
        icon: L.icon({
          iconUrl:
            window.SI3CONFIG.url +
            "obtericone/?url=" +
            this.props.currentAtrativo.icone, //_.get(item,'[0].tipo_benfeitoria.icone',''),
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [-3, -76],
        }),
      };
    }

    let atrativosTrilha = this.props.itens.atrativotrilha_set.map(
      (atrativo) => {
        let iconeurl =
          window.SI3CONFIG.url +
          "obtericone/?url=" +
          _.get(this.props.atrativosById, `[${atrativo.tipo_atrativo}].icone`);
        if (atrativo.cor) {
          iconeurl += "&color=" + atrativo.cor.replace(/^#/, "");
        }
        return { ...atrativo, icone: iconeurl };
      }
    );

    return (
      <div
        className={"geoinput dragandrop"}
        ref={(el) => (this.dropI = el)}
        onDragOver={this.dragOver}
        onDragEnter={this.dragEnter}
        onDragLeave={this.dragOut}
        onDrop={this.drop}
      >
        {this.state.uploaded_GeoJSON && (
          <MapaSelectedFeature
            geoJSON={this.state.uploaded_GeoJSON}
            point={false}
            polyline={true}
            polygon={true}
            onClose={this.selectedPolygonLayers}
          />
        )}

        <Map
          ref="map"
          onBaselayerchange={this.baseLayerChange}
          onClick={this.onMapClick.bind(this)}
          center={positioninicialmapa}
          zoom={this.zoom}
          style={{ height: "400px" }}
          className="col-xs-12 row-xs-12"
        >
          <LayersMapa />

          <FeatureGroup ref="featured">
            <DrawEditControl
              ref="drawlayer"
              position="topleft"
              onCreated={this._onCreate.bind(this)}
              onDeleted={this._onDeleted}
              onMounted={this._mounted}
              onEditStart={this._onEditStart}
              onEdited={this._onEditPath.bind(this)}
              onEditStop={this._onEditStop}
              onDeleteStart={this._onDeleteStart}
              onDeleted={this._onDeleted.bind(this)}
              onDeleteStop={this._onDeleteStop}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                polygon: false,
                polyline: true,
                marker: marker,
                edit: {
                  remove: true,
                },
              }}
            />

            <div>
              {this.state.polygonLayers.map((item) => (
                <Polyline positions={item._latlngs} />
              ))}

              {atrativosTrilha.map((item, i) => (
                // <Marker position={[-15,-45]} />
                <Marker
                  key={"atrativotrilha" + i}
                  position={[
                    item.geom.coordinates[1],
                    item.geom.coordinates[0],
                  ]}
                  item={item}
                  onClick={(e) => console.log("marker clicked")}
                  onMousedown={(e) => console.log("marker clicked")}
                  model="atrativotrilha"
                  icon={L.icon({
                    iconUrl: item.icone,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                    popupAnchor: [-3, -76],
                  })}
                />
              ))}
            </div>
          </FeatureGroup>
        </Map>

        <br />
        <Button
          primary
          onClick={(e) => {
            this.refs.fileinput.value = "";
            this.refs.fileinput.click();
          }}
        >
          {" "}
          Carregar Arquivo com Geometria da Trilha{" "}
        </Button>
        <input
          type="file"
          ref="fileinput"
          style={{ display: "none" }}
          onChange={(e) => this.fileSelected(e).bind(this)}
        />
      </div>
    );
  }
}
