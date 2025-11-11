import React from "react";
import { connect } from "react-redux";
import Sidebar from "../components/Sidebar";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
// import { Grid, Divider, Form, Label, Input } from 'semantic-ui-react'
// import * as S3 from '../components/elements';
// import { apiActions, deserialize } from "../bibliotecas/redux-jsonapi/";
// import * as _  from 'lodash';
// import ColetaniaMidia from 'components/elements/ColetaniaMidia';
// import { Field, Fields, FieldArray, reduxForm, SubmissionError } from 'redux-form';
import { si3, si3Actions } from "actions/index";
// import {  InputColecaoMidia, InputSelectPessoaModel, InputSelectModel, InputEndereco, InputSelect, Fieldset, InputDate, InputTextArea, InputCheckbox, InputRadio, RadioButtonGroup, InputFile } from 'components/elements/InputText';

// import { Map, Marker, Popup, TileLayer, LayersControl, FeatureGroup, Circle, CircleMarker, GeoJSON } from 'react-leaflet';

// import { markers } from 'config.js';

// import Draw from 'leaflet-draw'; // eslint-disable-line

// import { InputGeoPoint, DrawControl } from 'components/formfields/InputGeos'

// import { EditControl as DrawEditControl } from "react-leaflet-draw"

// import simplify from 'simplify-geometry';
// import * as topojson from "topojson";

// import { InputText } from 'components/formfields/index.js'

// import carregaModelo from 'hocs/carregaModelo'

// import { LayersMapa } from 'components/mapas/LayersMapa'

// import GeoJsonCluster from 'react-leaflet-geojson-cluster';

import Mapa from "components/mapas/Mapa.js";

/**
 * Home page component
 */
export class Home extends React.Component {
  componentDidMount() {
    //  this.props.load('relatos')
    // this.props.load('funcao')
    // this.props.load('usuarios')
  }

  render() {
    return (
      <div className="row conteudo row-xs-12">
        <div className="col-xs-12 row-xs-12">
          {/* < Mapa /> */}
          <h1> Daniel</h1>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { api, app } = state;
  return {
    api: api,
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     fetchArticles: () => dispatch(fetchArticles()),
//   };
// }

export default connect(mapStateToProps, si3Actions)(Home);
