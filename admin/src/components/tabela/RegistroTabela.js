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




@connect(null,si3Actions)
export default class RegistroTabela extends React.Component
{




  abreModalRegistro = (elm)=>{
                 
           this.props.openModal( {nome:"mapapopup",
                              tipo:'mapa',
                              modelo:'registro',
                              id:elm.num_registro,
                              location:elm.localizacao,
                              onSave:()=>{
                                    this.props.load('registro',{num_registro:elm.id})
                              },
                              value:{
                                registro:elm._id,
                                classificacao_atual: elm.classificacaoAtual.id
                              } 
                             }
            )
  }



  static defaultProps = {
        // include:['retricao_de_uso','','registroSet','estado__geocod','estado__nome','municipio__geocod','municipio__nome','terra_indigena__cod_ti','terra_indigena__nome','lingua','lingua__nome'],
        include:["lingua__nome"],//"lingua__nome","estado__sigla","municipio__nome","terra_indigena__nome"],
        editLink:'/registro/registro',
        options:{fields:"num_registro,nome,localizacao,localizacao_nome,descricao_localizacao,registroclassificacao_set,lingua"},
        force:true,
        orderASC:"ascending"
  } 


  render(){

      return(
        <div>

        <Tabela orderBy="num_registro" search='all' col="1" {...this.props} modelo="registro" id="all" >
            
            <Coluna name="num_registro" label="Nº Registro" />
            {/*<Coluna name="data" tipo='data' label="Data" />*/}
            <Coluna name="nome" width="20%" label="Nome" ><b>%nome%</b></Coluna>
            <Coluna name="descricao_localizacao"   width="30%" label="Descrição local" >
                <ViewMore height="3em;"> %descricao_localizacao%</ViewMore>
            </Coluna>
            <Coluna name="lingua.nome"  label="Lingua" />
         
            <Coluna label="Localização" name="localizacao_nome" /> 


          

            <Coluna label="Classif. Atual" name="classificacaoAtualStr"
               render={(elm)=><small><ClassificacaoView item={elm.classificacaoAtual} /></small>}
            /> 





           <Coluna label=""
               render={(elm)=>{
                    return (<small><AlteracaoClassificacao itens={elm} /></small>)
                }}
            />  

            <Coluna label="Ver Mapa"
               render={(elm)=>{
                return (<Button primary size="tiny" onClick={ (e)=>this.abreModalRegistro(elm) } > 
                        Ver mapa 
                </Button>)

                    
                }}
            />  


             

            

        </Tabela>

        </div>
      )

  }

}














