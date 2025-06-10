import React from 'react';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { si3Actions } from '../actions/index';
// import { si3, si3Actions } from '../actions/index';
// import actions from '../actions/index';

// import Mapa from '../components/mapas/Mapa'

class Home extends React.Component {

  render() {
    return ( 
      < div className="row conteudo row-xs-12">
        < div className="col-xs-12 row-xs-12">
          <h1>Home</h1>
          <h2>Mapa</h2>
          {/* < Mapa /> */}
        </div>
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

export default connect(mapStateToProps, si3Actions)(Home);
// export default connect(mapStateToProps, actions.si3Actions)(Home);
