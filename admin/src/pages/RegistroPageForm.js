import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
import map from "lodash/map";
import PageInterna from './PageInterna';
import { withRouter } from 'react-router'
import RegistroForm from 'components/form/RegistroForm';


export class RegistroPageForm extends Component
{

  render() {
    
    return(

            <PageInterna nome="Editar Solicitação de Registro" icon='registro' icontipo='svg'>
                   
                <div className='ui grid' >
                  <div className="row">
        
                    <div className='col-xs-12'>  
                      
                      <RegistroForm  />

                    </div>

                  </div>
                </div>

            </PageInterna>
        );
  }
}


export default withRouter(RegistroPageForm)
