import React from 'react';
import PageInterna from './PageInterna';
import RelatoList from 'components/form/RelatoList';
import {Menu, Icon, Dropdown } from 'semantic-ui-react'
import {Link} from 'react-router'
import { withRouter } from 'react-router'
import AutoForm from 'components/form/AutoForm';
import AutoTable from 'components/tabelas/AutoTable';
import carregaModelo  from 'hocs/carregaModelo';
/**
 * Home page component
 */

@withRouter
export default class Registros extends React.Component
{

   componentDidMount() {
         document.title = "SI3RC :: Registros";
    }


    menu = ()=>{
        var activeItem = 'home';

        return(  

            <Menu secondary>
                <Menu.Item as={Link} activeClassName='active' to="/registro/registro" > <Icon name='list' /> Registros </Menu.Item>
                <Menu.Item as={Link} activeClassName='active' to="/registro/solicitacaocriacaoregistro" > <Icon name='list' /> Solicitações Criação </Menu.Item>
                {/*<Menu.Item as={Link} activeClassName='active' to="/registro/solicitacaoalteracaoclassificacaoregistro" > <Icon name='list' /> Alteração de Status </Menu.Item>*/}
      
                <Dropdown basic pointing='top right' 
                trigger={ <Menu.Item  activeClassName='active' icon='list' name='' /> }  >
                        <Dropdown.Menu>  
                            <Dropdown.Item as={Link} to="/tabela/sitio"  activeClassName='active' > Sitios </Dropdown.Item> 
                            <Dropdown.Item as={Link} to="/tabela/habitacao"  activeClassName='active' > Habitações </Dropdown.Item> 
                            <Dropdown.Item as={Link} to="/tabela/vestigio"  activeClassName='active' > Vestigios </Dropdown.Item>   
                            <Dropdown.Item as={Link} to="/tabela/avistamento"  activeClassName='active' > Avistamentos </Dropdown.Item> 
                            <Dropdown.Divider />
                            <Dropdown.Item as={Link} to="/tabela/notatecnica"  activeClassName='active' > Notas Técnicas </Dropdown.Item>   
                            <Dropdown.Item as={Link} to="/tabela/planodecontingencia"  activeClassName='active' > Planos de Contigência </Dropdown.Item>   
                        </Dropdown.Menu>
                </Dropdown>
      
            </Menu>)


    }
   
   render()
    {
        let renderChild = this.props.children

        let id = this.props.params.id || 0;

        let modelo = this.props.params.item || "";
            modelo = (modelo == 'lista') ? 'solicitacaocriacaoregistro' : modelo;
            modelo = modelo.replace(/[_.-]/g,"/")
        
        //VEJO SE ´E UM FORM
        if(this.props.params.item && id){
            
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
   

        var nomePagina = "Registro";
        switch (modelo){
            case "solicitacaocriacaoregistro":
                nomePagina = "Solicitação de Criação de Reg.";
                break;
        }


        return(

            <PageInterna nome={nomePagina} icon='registros' icontipo='svg' menu={this.menu()}>
                
                
                <div className="row">
                    {renderChild}
                </div>

            </PageInterna>
        );
    }
}
