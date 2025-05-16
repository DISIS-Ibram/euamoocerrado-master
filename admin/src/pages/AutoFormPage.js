import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
import _ from "lodash";
import PageInterna from './PageInterna';
import { withRouter } from 'react-router'
import {t,d} from 'models/models'
import AutoForm from 'components/form/AutoForm';



export class AutoPageForm extends Component
{

  render() {
    let modelo = this.props.params.item || "";
    modelo = modelo.replace(/[.-]/g,"/")

    let id = this.props.params.id || 0


    return(

            <PageInterna nome={t(modelo)} icon='edit' icontipo='fa'>
                   
                <div className='ui grid' >
                  <div className="row">
        
                    <div className='col-xs-12'>  
                      
                      <AutoForm modelo={modelo} id={id} />

                    </div>

                  </div>
                </div>

            </PageInterna>
        );
  }
}


export default withRouter(AutoPageForm)
