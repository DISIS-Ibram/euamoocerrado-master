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

import PublicoButton from 'components/acao/PublicoButton'

// import tabelaHoc from 'hocs/tabela'
import Tabela from 'components/tabela'
import {Coluna, ItemAttr, If} from 'components/tabelacolunas/coluna'




export default class EspeciesTabela extends React.Component
{

  static defaultProps = {
        modelo: "trilha",
        exclude:['limite','geom'],
        id:'all',
        editLink:'/form/trilha',
        // options:{fields:"id,nome,descricao"}
  } 

  render(){

      return(

        <Tabela  search="all"  modelo="parque" {...this.props}  >

          <Coluna label="Id" name="id" >
          </Coluna>

          <Coluna width="20%" label="Nome" name="nome" >
            <b>%nome%</b>
          </Coluna>

          <Coluna label="Descrição" name="descricao"  render={(elm)=>{
              return ( <div dangerouslySetInnerHTML={{__html: elm.descricao }} /> )
          }}>

          </Coluna>

          <Coluna label="Oficial" name="oficial" >
            %oficial%
          </Coluna>

          <Coluna label="Publicado" name="publico"  render={ e=>{
              return  ( <PublicoButton id={e._id} value={e.publico} modelo="trilha"> </PublicoButton> )
              }} >
          </Coluna>

     

          {/* <Coluna label="Categoria" name="categoria" >
          </Coluna>
          
          <Coluna label="Link" name="link" >
          </Coluna> */}
        
        </Tabela>
      )

  }

}
