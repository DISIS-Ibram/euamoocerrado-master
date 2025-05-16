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




export default class PessoasTabela extends React.Component
{

  static defaultProps = {
        modelo: "pessoa",
        id:'all',
        editLink:'/pessoa'
  } 

  render(){

    
      return(

        <Tabela orderBy="first_name" search="all" col="1" modelo="pessoa" {...this.props} >

            

            <Coluna width="60%" name="first_name" label="Nome" >
             

            </Coluna>

            <Coluna name="email" label="Email"></Coluna>

        {/* <Coluna label="Tipo" name="tipoDeAcesso" />

            <Coluna label="Contato" orderBy="email">
            <ViewMore height="3em">
               <a href="mailto:%email%"> %email%</a><br />
               <If telefone><Icon name="phone" color="grey" /><ItemAttr name="telefone" format="(00) 0000-0000" /></If><br />
               <If endereco><Icon className='f-l cl-cinza' name="marker" color="grey" /><span className='w-pre d-ilb'>%endereco%</span></If>
            </ViewMore>
           </Coluna> */}

        
        </Tabela>
      )

  }

}
