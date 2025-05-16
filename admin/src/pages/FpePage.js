import React from 'react';
import PageInterna from './PageInterna';
import RelatoList from 'components/form/RelatoList';
import {Menu } from 'semantic-ui-react'
import {Link} from 'react-router'
import { withRouter } from 'react-router'
import AutoForm from 'components/form/AutoForm';
import AutoTable from 'components/tabelas/AutoTable';
import carregaModelo  from 'hocs/carregaModelo';
import { connect } from 'react-redux';
/**w
 * Home page component
 */

@withRouter
@connect( state => ({ usuario: state.usuario }) )
export default class ExpedicaoPage extends React.Component
{
    //LETODO - so para reenderizar sempre que um desses modelos mudar

   componentDidMount() {
         document.title = "SI3RC :: FPE";
    }


    menu = ()=>{
        var activeItem = 'home';

        return(  
            <Menu secondary>
                {_.get(window,'PERM.fpe.add') &&
                    <Menu.Item as={Link} activeClassName='active' to="/fpe/fpe/0" icon='add' name='Adicionar' />
                }
                <Menu.Item as={Link} activeClassName='active' to="/fpe/lista" icon="list" name='FPE' />
                <Menu.Item as={Link} activeClassName='active' to="/fpe/bape" icon="list" name='BAPE' />
                       
            </Menu>
            
            )


    }
   
   render()
    {
        let renderChild = this.props.children

        let id = this.props.params.id || 0;

        let modelo = this.props.params.item || "";
            modelo = (modelo == 'lista') ? 'fpe' : modelo;
            modelo = modelo.replace(/[_.-]/g,"/")
        //VEJO SE ´E UM FORM
        if(this.props.params.item=="fpe" && id){
            
                  renderChild = (
                    <div key={this.props.params.item} className='col-xs-12'>  
                
                          <AutoForm modelo={modelo} id={id} />
                    </div>
                    );      

        }else if(this.props.params.item){
                 renderChild = (
                    <div key={this.props.params.item} className='col-xs-12'>  
                      <AutoTable modelo={modelo} />
                    </div>
                    );     
        }
   

        return(

            <PageInterna nome="FPE" icon='fpe' icontipo='svg' menu={this.menu()}>
                
                
                <div className="row">
                    {renderChild}
                </div>

            </PageInterna>
        );
    }
}
