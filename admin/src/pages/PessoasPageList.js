import React, { Component } from 'react';
import { Menu, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
import map from "lodash/map";
import PageInterna from './PageInterna';

import PessoasList from 'components/tabela/PessoaTabela';


import {t,d} from 'models/models';

/**
 * Admin Itens Components
 */
export class Pessoas extends Component
{

  componentDidMount() {
    window.document.title = "SI3RC :: Pessoas";
  }


     menu = ()=>{
        var activeItem = 'home';

        return(  
            <Menu secondary>
                   {_.get(window,'PERM.avatar.add') &&
                <Menu.Item as={Link} activeClassName='active' to="/pessoa/0" icon='add' name='Adicionar' />
                   }
                <Menu.Item as={Link} activeClassName='active' to="/pessoa/lista" icon="list" name='Lista' />
                       
            </Menu>)


    }

  render() {
    
  

    return(
            <PageInterna nome="Pessoas" icon='users' icontipo='fa' menu={this.menu()}>
                
                <div className='ui grid' >
                  <div className="row">
        
             
                    <div className='fourteen wide column'>
                          
                          <PessoasList titulo="pessoas" descricao="pessoas" myid="pessoas" key="pessoas" model="usuarios" />
                    </div>
            

                  </div>
                </div>

            </PageInterna>
        );
  }
}


// function mapStateToProps (state, ownProps) {
//   return {
//     value: state.somestate.someobject[ownProps.variable]
//   }
// } 


function select(state) {
  return { api: state.api};
}

export default connect(select)(Pessoas);
