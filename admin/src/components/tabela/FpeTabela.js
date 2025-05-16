import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ViewMore from 'components/ViewMore'
import { Item, Header, Label, List, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
// import * as _  from 'lodash';
import FlipMove from 'react-flip-move';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import StringMask from 'string-mask';
// import { ModalYesNo } from 'components/modals';
import * as util from 'util/s3util'
import carregaModelo from 'hocs/carregaModelo'
import JSONTree from 'react-json-tree'

import ClassificacaoView from 'components/views/viewsfields/classificacao.js'
import AlteracaoClassificacao from 'components/acao/AlteracaoClassificacao.js'

// import tabelaHoc from 'hocs/tabela'
import Tabela from 'components/tabela'
import {Coluna, ItemAttr, If} from 'components/tabelacolunas/coluna'




export default class FpeTabela extends React.Component
{

  static defaultProps = {
        modelo: "fpe",
        id:'all',
        // include:['retricao_de_uso','','registroSet','estado__geocod','estado__nome','municipio__geocod','municipio__nome','terra_indigena__cod_ti','terra_indigena__nome','lingua','lingua__nome'],
        editLink:'/fpe/fpe'
  } 


  render(){

      return(
        <div>


        <Tabela orderBy="id" search='all' col="1" {...this.props}   modelo="fpe" id="all" >
            
            {/* <Coluna name="id" label="id" /> */}
            <Coluna name="nome" width="40%" label="Nome" ><b>%nome%</b></Coluna>
            <Coluna name="email"  label="email" />
            <Coluna name="telefone"  label="Telefone" />
         
            <Coluna label="Endereço" width="20%">
                %endereco%
            </Coluna>


               <Coluna  label="Nº. BAPEs" render={elm=><span>{ elm.bape_set.length }</span>} />

            



        

        </Tabela>

        </div>
      )

  }

}














