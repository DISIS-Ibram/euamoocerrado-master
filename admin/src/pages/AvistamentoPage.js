import React from 'react';
import Sidebar from '../components/Sidebar';
import PageInterna from './PageInterna';
import AvistamentoTabela from 'components/tabela/AvistamentoTabela';
import MapaAvistamentos from 'components/elements/MapaAvistamentos';
import {Menu} from 'semantic-ui-react';
import { Link } from 'react-router';

/**
 * Home page component
 */
export default class Relatos extends React.Component
{
    componentDidMount() {
    document.title = "Avistamento";
  }

   menu = ()=>{
        var activeItem = 'home';

        return(  
            <Menu secondary>
                {/* {_.get(window,'PERM.relato.add') &&
                    <Menu.Item as={Link} activeClassName='active' to="/relato/0" icon='add' name='Adicionar' />
                }
                <Menu.Item as={Link} activeClassName='active' to="/relato/lista" icon="list" name='Lista' />
                        */}
            </Menu>)


    }

    render()
    {
        return(
            <PageInterna nome="Avistamentos" icon='fa-binoculars' icontipo='fa' menu={this.menu()}>
                
                <div className='' >
                           
                          <AvistamentoTabela  />
                          {/* <MapaAvistamentos  /> */}
               
                </div>

            </PageInterna>
        );
    }
}
