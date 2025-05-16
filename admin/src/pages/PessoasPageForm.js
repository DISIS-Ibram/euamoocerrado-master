import React, { Component } from 'react';
import { Menu, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
import PageInterna from './PageInterna';
import { withRouter } from 'react-router'
import PessoasForm from 'components/form/PessoasForm';

/**
 * Admin Itens Components
 */
export class PessoasPageForm extends Component
{

   menu = ()=>{
        var activeItem = 'home';

        return(  
            <Menu secondary>
                <Menu.Item as={Link} activeClassName='active' to="/pessoa/0" icon='add' name='Adicionar' />
                <Menu.Item as={Link} activeClassName='active' to="/pessoa/lista" icon='list'  name='Lista' />
                       
            </Menu>)


    }
  
  render() {

    return(

            <PageInterna nome="Pessoa" icon='users' icontipo='fa' menu={this.menu()}>
                   
                <div className='ui grid' >
                  <div className="row">
             
                    <div className='fourteen wide column'>       
                          <PessoasForm  />
                    </div>
            
                  </div>
                </div>

            </PageInterna>
        );
  }
}


export default withRouter(PessoasPageForm)
