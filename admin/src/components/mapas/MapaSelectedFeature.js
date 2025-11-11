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
} from "react-leaflet";
import { LayersMapa } from "components/mapas/LayersMapa";
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Button } from "semantic-ui-react";

export class MapaSelectedFeature extends React.Component {
  constructor(props) {
    super(props);
    this.saveAndClose = this.saveAndClose.bind(this);
  }
  static defaultProps = {
    geoJSON: false,
    polyline: true, //type allow to selected
    polygon: true,
    point: false,
    onClose: () => {},
  };

  state = {
    selectedFeatures: [],
  };

  componentDidMount() {
    if (this.refs.map) {
      setTimeout(() => {
        if (this.refs.featured)
          this.refs.map.leafletElement.fitBounds(
            this.refs.featured.leafletElement.getBounds()
          );
      }, 500);
    }
  }

  onGeoJsonClick = (e) => {
    // const geojson = e.target.toGeoJSON();
    if (!e.target.options.selected) {
      e.target.options.selected = true;
      e.target.setStyle({ fillColor: "green", color: "green" });
    } else {
      e.target.options.selected = false;
      e.target.setStyle({
        fillColor: "rgba(50, 136, 255, 1.000)",
        color: "rgba(50, 136, 255, 1.000)",
      });
    }
  };

  saveAndClose = (e) => {
    //get all selected layers
    let layers = this.refs.featured.leafletElement.getLayers();
    let features = [];

    let selectedLayers = [];
    layers.forEach((layer) => {
      if (layer.options.selected) {
        let geoJsonConvert = layer.toGeoJSON();
        let geojson = geoJsonConvert;

        let type = geoJsonConvert.geometry.type;

        if (type == "MultiPolygon" || type == "MultiLineString") {
          type = type == "MultiPolygon" ? "Polygon" : "LineString";

          geoJsonConvert.geometry.coordinates.forEach((coords) => {
            geojson = {
              type: "Feature",
              geometry: { type: type, coordinates: coords },
            };
            features.push(geojson);
          });
        } else {
          features.push(geojson);
        }
      }
    });

    let geoJSON = { type: "FeatureCollection", features: features };

    this.props.onClose(geoJSON);
  };

  render() {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          zIndex: "99999999999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ height: "80%", width: "80%" }}>
          <h2 style={{ color: "white", textAlign: "center" }}>
            {" "}
            Selecione uma ou mais geometrias{" "}
          </h2>

          <Map
            center={[-15, -45]}
            zoom={11}
            ref="map"
            style={{ height: "calc(100% - 40px )", width: "100%" }}
          >
            <LayersMapa />

            {this.props.geoJSON && (
              <GeoJSON
                ref="featured"
                data={this.props.geoJSON}
                onEachFeature={(feature, layer) => {
                  var layerType = layer.feature.geometry.type;

                  if (
                    (layerType == "Polygon" || layerType == "MultiPolygon") &&
                    this.props.polygon === true
                  ) {
                    layer.on("click", this.onGeoJsonClick);
                  } else if (
                    (layerType == "LineString" ||
                      layerType == "MultiLineString") &&
                    this.props.polyline === true
                  ) {
                    layer.on("click", this.onGeoJsonClick);
                  } else if (
                    layerType == "Point" &&
                    this.props.point === true
                  ) {
                    layer.on("click", this.onGeoJsonClick);
                  } else {
                    // layer.setStyle({opacity:0.3,fillColor:'gray',color:'gray'})
                  }
                }}
              />
            )}
          </Map>

          <div style={{ marginTop: "20px", "text-align": "center" }}>
            <Button
              onClick={(e) => this.props.onClose(false)}
              secondary
              size="massive"
            >
              {" "}
              Cancelar{" "}
            </Button>
            <Button primary onClick={this.saveAndClose} size="massive">
              {" "}
              Salvar Seleção{" "}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
