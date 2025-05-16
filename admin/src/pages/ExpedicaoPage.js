import React from 'react';
import PageInterna from './PageInterna';
import RelatoList from 'components/form/RelatoList';
import {Menu, Dropdown, Icon } from 'semantic-ui-react'
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
export default class FpePage extends React.Component
{
    //LETODO - so para reenderizar sempre que um desses modelos mudar

   componentDidMount() {
         document.title = "SI3RC :: Expedição";
   }

    menu = ()=>{
        var activeItem = 'home';

        return(  
            <Menu secondary>
                
                {/*<Dropdown basic pointing='top right' 
                trigger={ <Menu.Item  activeClassName='active' icon='add' name='Adicionar' /> }  >
                        <Dropdown.Menu>  
                             {_.get(window,'PERM.expedicao.add') &&
                            <Dropdown.Item as={Link} to="/expedicao/expedicao/0"  activeClassName='active' ><Icon name='plus' /> Nova Expedição </Dropdown.Item> 
                             }
                             {_.get(window,'PERM.planejamentoexpedicao.add') &&
                            <Dropdown.Item as={Link} to="/expedicao/planejamentoexpedicao/0"  activeClassName='active' ><Icon name='plus' /> Planejamento Expedição </Dropdown.Item>   
                             }
                        </Dropdown.Menu>
                </Dropdown>
*/}

                <Menu.Item as={Link} activeClassName='active' to="/expedicao/expedicao/0" icon="plus" name=' Adicionar' />

                <Menu.Item as={Link} activeClassName='active' to="/expedicao/lista" icon="list" name=' Lista' />

                {/*<Dropdown basic pointing='top right' 
                trigger={ <Menu.Item  activeClassName='active' icon='list' name='' /> }  >
                        <Dropdown.Menu>  
                            <Dropdown.Item as={Link} to="/expedicao/avistamento"  activeClassName='active' ><Icon name='list' /> Avistamentos </Dropdown.Item> 
                            <Dropdown.Item as={Link} to="/expedicao/aeronave"  activeClassName='active' ><Icon name='list' /> Aeronave </Dropdown.Item> 
                            <Dropdown.Item as={Link} to="/expedicao/piloto"  activeClassName='active' ><Icon name='list' /> Piloto </Dropdown.Item>   
                        </Dropdown.Menu>
                </Dropdown>*/}
                       
            </Menu>
            
            )


    }
   
   render()
    {
        
        let renderChild = this.props.children

        let id = this.props.params.id || 0;

        let item = this.props.params.item || "";
        
        let modelo = (item == 'lista') ? 'expedicao' : item;
            modelo = modelo.replace(/[_.-]/g,"/")
        
        //VEJO SE ´E UM FORM
        if( this.props.params.id ){
            
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

            <PageInterna nome="Expedição" icon='campo' icontipo='svg' menu={this.menu()}>
                
                
                <div className="row">
                    {renderChild}
                </div>

            </PageInterna>
        );
    }
}
