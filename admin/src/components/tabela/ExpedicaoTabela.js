import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ViewMore from 'components/ViewMore'
import { Item, Header, Label, List, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
// import * as _  from 'lodash';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import StringMask from 'string-mask';
// import { ModalYesNo } from 'components/modals';
import * as util from 'util/s3util'
import carregaModelo from 'hocs/carregaModelo'

import ClassificacaoView from 'components/views/viewsfields/classificacao.js'
import AlteracaoClassificacao from 'components/acao/AlteracaoClassificacao.js'

// import tabelaHoc from 'hocs/tabela'
import Tabela from 'components/tabela'
import {Coluna, ItemAttr, If} from 'components/tabelacolunas/coluna'



export default class ExpedicaoTabela extends React.Component
{

  static defaultProps = {
        modelo: "expedicao",
        id:'all',
                // include:['retricao_de_uso','','registroSet','estado__geocod','estado__nome','municipio__geocod','municipio__nome','terra_indigena__cod_ti','terra_indigena__nome','lingua','lingua__nome'],
        editLink:'/expedicao/expedicao'
  } 


  render(){

      return(
        <div>


        <Tabela orderBy="id" search='all' col="1" {...this.props}   modelo="expedicao" id="all" >
            
            <Coluna name="id" label="id" />
            <Coluna name="nome_regiao" width="20%" label="Nome" />
            <Coluna name='responsavel.nome' label='Responsável' />
            <Coluna name='justificativa' label='Justificativa'>
                <ViewMore>
                    %justificativa%
                </ViewMore>
            </Coluna>
            <Coluna name='objetivos' label='Objetivos'>
                <ViewMore>
                    %objetivos%
                </ViewMore>
            </Coluna>

            <Coluna  label="Registro Assos."
                render={expedicao=>
                        _.map(expedicao.registros, elm=>
                        <Button compact size='mini' as={Link} to={"/registro/registro/"+elm.num_registro}>
                        {elm.num_registro+" - "+elm.nome}
                    </Button>)
                }
            />


            <Coluna  label="FPEs Assos."
                render={expedicao=>
                        _.map(expedicao.fpe, elm=>
                        <Button compact size='mini' as={Link} to={"/fpe/fpe/"+elm._id}>
                        {elm.nome}
                    </Button>)
                }
            />

        


               {/*REGISTROS E FPE*/}
          
        

        </Tabela>

        </div>
      )

  }

}














