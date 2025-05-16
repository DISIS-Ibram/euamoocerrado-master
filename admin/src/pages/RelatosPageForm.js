import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
import map from "lodash/map";
import PageInterna from './PageInterna';
import { withRouter } from 'react-router'
import RelatoForm from 'components/form/RelatoForm';
import {Menu} from 'semantic-ui-react';


export class RelatosPageForm extends Component
{
 menu = ()=>{
        var activeItem = 'home';

        return(  
            <Menu secondary>
                <Menu.Item as={Link} activeClassName='active' to="/relato/0" icon='add' name='Adicionar' />
                <Menu.Item as={Link} activeClassName='active' to="/relato/lista" icon="list" name='Lista' />
                       
            </Menu>)


    }
  render() {
    
    return(

            <PageInterna nome="Relatos" icon='relatos' icontipo='svg' menu={this.menu()}>
                   
                <div className='container' >
                  <div className="row">
        
                    <div className='col-xs-12'>   
                      
                      <RelatoForm  />

                    </div>

                  </div>
                </div>

            </PageInterna>
        );
  }
}


export default withRouter(RelatosPageForm)
