import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
import map from "lodash/map";
import PageInterna from './PageInterna';

import ItemGenericoList from 'components/form/ItemGenericoList';
import StatusRegistroList from 'components/form/StatusRegistroList';

import {t,d} from 'models/models';



// const MenuItensAdmin = [

//     {nome:'territórios',itens:['tipolegislacao','legislacao','faseterraindigena','modalidadeterraindigena'] },
//     {nome:'gestão',itens:['funcao'] },
//     {nome:'expedição',itens:['tipodeexpedicao','tipoderecurso','caracterizacaotipoambiente','caracterizacaotipoinundacao','caracterizacaotipohidrografia','CaracterizacaoPosicaoHidrografica','tipovestigio','material','ferramenta'] },
//     {nome:'COPIRC',itens:['programa','tipoevento','aparelho','vacina'] },
//     {nome:'COPLII',itens:['lingua','situacao','padrao'] },
// ]


/**
 * Admin Itens Components
 */
export class Admin extends Component
{

  componentDidMount() {

  }

  render() {
    
    let Lista;
    const item = this.props.params.item;

    if(item == 'classificacao'){
         Lista = <StatusRegistroList titulo={t(item)} descricao={d(item)} id='all' />
    }else{
         Lista = <ItemGenericoList titulo={t(item)} descricao={d(item)} id='all' key={item}  modelo={item} />
    }

    return(
            <PageInterna nome="Itens do Sistema" icon='list layout' icontipo='fa'>
             
                <div className='row start-xs'>

                    <div className='col-xs-3 col-sm-offset-1 col-sm-3'>

                      <Menu  vertical  secondary fluid tabular>

                        <Menu.Header  > Admin </Menu.Header>


                        <Menu.Item as={Link} activeClassName='active' to="" > <b>PARQUE</b> </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/tipoatividade/" > Tipos de Atividades </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/tipobenfeitoria/" > Tipos Benfeitoria </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/tipoatrativo/" >  Tipos Atrativos </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="" > <b>TRILHA</b> </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/tipoatrativotrilha/" >Tipos Atrativos </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="" > <b>GERAL</b> </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/conteudo/" > Textos </Menu.Item>
                        {/* <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/faseterraindigena/" > Fase - Terra Indígena </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/legislacao/" > Legislação </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/modalidadeterraindigena/" > Modalidade - Terra Indígena </Menu.Item> */}
{/* 
                        <Menu.Header  > Gestão </Menu.Header>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/funcao/" > Função </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/atribuicao/" > Atribuição </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/acesso/" > Acesso </Menu.Item>

                         <Menu.Header  > Expedição </Menu.Header>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/tipodeexpedicao/" >Tipo de Expedição </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/tipoderecurso/" > Tipo de Recurso </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/caracterizacaotipoambiente/" > Caracterização do Ambiente </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/caracterizacaotipoinundacao/" > Caracterização Inundação </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/caracterizacaotipohidrografia/" > Caracterização da Hidrografia Principal </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/caracterizacaoposicaohidrografica/" > Posição em relação a Hidrografia Principal</Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/tipovestigio/" > Tipo de Vestígio </Menu.Item>
     

                        <Menu.Header  > Recente Contato </Menu.Header>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/programa/"  > Políticas Públicas Acessadas </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/tipoevento/"  > Tipo de Ocorrência </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/aparelho/"  > Parte do Corpo </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/vacina/"  > Vacina </Menu.Item>

                        <Menu.Header  > Isolados </Menu.Header>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/lingua/"  > Lingua </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/situacao/"  > Perfil </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/classificacao/"  > Classificação Registro </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/finalidadehabitacao/" > Finalidade da Habitação </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/povo/" > Povo </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/adorno/" > Adorno </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/contato/" > Contato </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/graudecomunicacao/" > Grau de Comunicação </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/recursonatural/" > Recursos Naturais Utilizados </Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/culturamaterial/" > Cultura Material </Menu.Item>


                         <Menu.Header  > Preferencias de Sistema </Menu.Header>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/fotohome/"  > Fotografia da HOME</Menu.Item>
                        <Menu.Item as={Link} activeClassName='active' to="/itensdesistema/basemap/"  > Mapa Base </Menu.Item> */}


                      </Menu>
                    
                    </div>

                    <div className='col-xs-9 col-sm-6 pl-5 mb-10'>
                       {Lista}
    
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

export default connect(select)(Admin);
