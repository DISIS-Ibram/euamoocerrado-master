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




export default class EspecieTabela extends React.Component
{

  static defaultProps = {
        modelo: "especie",
        id:'all',
        editLink:'/form/especie'
  }; 

  render(){
      
      return(

        <Tabela  search="all"  modelo="especie" {...this.props}>

          <Coluna label="Id" name="id" >
          </Coluna>

          <Coluna label="Nome" name="nome" >
          </Coluna>

          <Coluna label="Categoria" name="categoria" >
          </Coluna>
          
          <Coluna label="Link" name="link" >
          </Coluna>
        
        </Tabela>
      )

  }

}
