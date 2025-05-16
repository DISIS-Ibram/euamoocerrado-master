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




export default class AvistamentoTabela extends React.Component
{

  static defaultProps = {
        modelo: "ocorrencia",
        id:'all',
        editLink:'/form/ocorrencia',
        
  }; 


  render(){

      return(

        <div>

            <Tabela  search="all"  modelo="ocorrencia" {...this.props}>

              <Coluna label="ID" name="id" >
              </Coluna>

              <Coluna label="Especie" >
                %especie.nome%
                <br />
                <small> %especie.categoria% </small>
              </Coluna>
      

              <Coluna label="Usuário" >
                %user.first_name% <br />
                <small> %user.email% </small>
              </Coluna>

              <Coluna label="Oficial" name="oficial" >
              </Coluna>

              <Coluna label="Publicado" name="publico"  render={ e=>{
                  return  ( <PublicoButton id={e._id} value={e.publico} modelo="ocorrencia"> </PublicoButton> )
              }} >
                
              </Coluna>

            </Tabela>

        </div>
      )

  }

}
