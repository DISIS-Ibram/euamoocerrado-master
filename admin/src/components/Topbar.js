import React from 'react';
import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
// import Icon from '../components/icons/Icon';
import { Menu, Icon, Dropdown } from 'semantic-ui-react'

import { connect } from 'react-redux';
import Avatar from 'components/elements/Avatar'


const trigger = (<a className="right icon item" ><i className="fa fa-cog"></i></a>)

@connect( state => ({usuario:state.usuario}) )
export default class Topbar extends React.Component {
    render(){
        return (
        <Menu id="barra-topo" className='borda-container' >
            <Menu.Menu position='right'>
                
                {/* <Menu.Item  as={Link}  to='/midias'> <Icon name='picture' /> <small>Midias</small> </Menu.Item> */}
                <Menu.Item as={Link} to="/pessoa" ><Icon name='users' /> <small>Pessoas</small> </Menu.Item>
                <Menu.Item as={Link} to="/conteudo/lista" > <small>Textos</small> </Menu.Item>


                <Dropdown basic trigger={<a className="right icon item" ><i className="fa fa-cog"></i></a>}  pointing='top right' >
                <Dropdown.Menu>      
                    <Dropdown.Header > Administrar </Dropdown.Header>
                    <Dropdown.Divider />
                  <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/itensdesistema/atividade"  ><Icon name='list layout' /> Itens do sistema</Dropdown.Item>
                    <Dropdown.Divider />
                </Dropdown.Menu>
                </Dropdown>


               <Dropdown basic trigger={ <small>
                        <a className="right icon item" >
                            <Avatar  url={ _.get(this.props,'usuario.user.avatar.foto')} /> {_.truncate( _.get(this.props,'usuario.user.avatar.nome') || _.get(this.props,'usuario.user.username') ) } </a>
                        </small> }  pointing='top right' >
                        <Dropdown.Menu>   
                            <Dropdown.Item as={Link} to={"/pessoa/"+_.get(this.props,'usuario.user.username')} ><Icon name='user' /> Meus Dados</Dropdown.Item>   

                            <Dropdown.Item as={Link} to="/login" ><Icon name='power' /> Sair</Dropdown.Item>   
                        </Dropdown.Menu>
                </Dropdown>


            </Menu.Menu>
        <div className='bd bb'></div>
        </Menu>
    )
    }
}