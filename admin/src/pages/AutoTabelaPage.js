import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import _ from "lodash";
import { withRouter } from "react-router";
import { t, d } from "models/models.js";
import PageInterna from "./PageInterna";

import AutoTabela from "components/tabela/AutoTable";

export class AutoTabelaForm extends Component {
  render() {
    // let modelo = this.props.params.item || "";
    // modelo = modelo.replace(/[_.-]/g, "/");

    // let id = this.props.params.id || 0;

    return (
      // <h1>Teste AutoTabelaPage</h1>
      <AutoTabela />

      //       <PageInterna nome={t(modelo)} icon="list" icontipo="fa">
      //         <div className="ui grid">
      //           <div className="row">
      //             <div className="col-xs-12">
      //               <AutoTabela modelo={modelo} id={id} />
      //             </div>
      //           </div>
      //         </div>
      //       </PageInterna>
    );
  }
}

export default withRouter(AutoTabelaForm);
