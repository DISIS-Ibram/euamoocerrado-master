import React from "react";
import { connect } from "react-redux";
import Sidebar from "../components/Sidebar";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { si3, si3Actions } from "actions/index";

import Mapa from "components/mapas/Mapa.js";

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
          < Mapa />
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

export default connect(mapStateToProps, si3Actions)(Home);
