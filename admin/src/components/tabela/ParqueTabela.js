import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ViewMore from 'components/ViewMore'
import { Item, Header, Label, List, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
// import * as _  from 'lodash';
// import FlipMove from 'react-flip-move';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import StringMask from 'string-mask';
// import { ModalYesNo } from 'components/modals';
import * as util from 'util/s3util'
import carregaModelo from 'hocs/carregaModelo'

import Avatar from 'components/elements/Avatar'

// import tabelaHoc from 'hocs/tabela'
import Tabela from 'components/tabela'
import {Coluna, ItemAttr, If} from 'components/tabelacolunas/coluna'




export default class EspeciesTabela extends React.Component
{

  static defaultProps = {
        modelo: "parque",
        exclude:['limite','geom'],
        excludes:['limite','geom'],
        id:'all',
        editLink:'/form/parque',
        options:{fields:"id,nome,categoria,imagemparque_set,trilha_set,videoyoutubeparque_set,benfeitoria_set,atrativo_set"}
  } 

  render(){

      return(

        <Tabela  search="all"  modelo="parque" {...this.props}  >

          <Coluna label="Id" name="id" >
          </Coluna>

          <Coluna label="Nome" name="nome" >
          </Coluna>

          {/* <Coluna label="Região Administrativa" name="regiao_administrativa" >
          </Coluna> */}

          <Coluna label="Categoria" name="categoria" >
          </Coluna>

          {/* <Coluna label="Custo Entrada" name="custo_entrada" >
          </Coluna> */}

          {/* <Coluna label="Categoria" name="categoria" >
          </Coluna>
          
          <Coluna label="Link" name="link" >
          </Coluna> */}
        
        </Tabela>
      )

  }

}
