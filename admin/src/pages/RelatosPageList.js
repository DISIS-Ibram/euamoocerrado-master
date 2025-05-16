import React from 'react';
import Sidebar from '../components/Sidebar';
import PageInterna from './PageInterna';
import RelatoTabela from 'components/tabelas/RelatoTabela';
import {Menu} from 'semantic-ui-react';
import { Link } from 'react-router';

/**
 * Home page component
 */
export default class Relatos extends React.Component
{
    componentDidMount() {
    document.title = "SI3RC :: Relatos";
  }

   menu = ()=>{
        var activeItem = 'home';

        return(  
            <Menu secondary>
                {_.get(window,'PERM.relato.add') &&
                    <Menu.Item as={Link} activeClassName='active' to="/relato/0" icon='add' name='Adicionar' />
                }
                <Menu.Item as={Link} activeClassName='active' to="/relato/lista" icon="list" name='Lista' />
                       
            </Menu>)


    }

    render()
    {
        return(
            <PageInterna nome="Relatos" icon='relatos' icontipo='svg' menu={this.menu()}>
                
                <div className='' >
                           
                          <RelatoTabela  />
               
                </div>

            </PageInterna>
        );
    }
}
