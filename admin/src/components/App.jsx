import React from 'react';
import { input } from 'semantic-ui-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// import { connect } from 'react-redux';
// import { Header, Modal, Label, List, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
// import { si3, si3Actions }  from 'actions/index';
// import { withRouter, Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';


const App = () => (
  <div style={{ padding: 50 }}>
    <h1 style={{ color: 'green' }}>React funcionando sem Redux e sem Router</h1>
    <p>Esse é um teste simples com Webpack.</p>

    <Sidebar />


    <Topbar />
  </div>
);

export default App;
