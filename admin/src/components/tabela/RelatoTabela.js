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


// import tabelaHoc from 'hocs/tabela'
import Tabela from 'components/tabela'
import {Coluna, ItemAttr, If} from 'components/tabelacolunas/coluna'




export default class RelatoTabela extends React.Component
{

  static defaultProps = {
        modelo: "relato",
        id:'all',
        editLink:'/relato',
        include:['registro_associado___num_registro','registro_associado___nome','estado__sigla','estado__geocod','estado__nome','municipio__geocod','municipio__nome','terra_indigena__cod_ti','terra_indigena__nome','receptor','informante_situacao','caracterizacao_inundacao','caracterizacao_tipo_hidrografia','caracterizacao_posicao_hidrografia']
  } 

  render(){

      return(
        <div className='col-sm-10'>
        <Tabela orderBy="data_fato" search={'all'} col="1" modelo="relato" {...this.props} >

            <Coluna name="id" label="id" />
            
            <Coluna name="data_fato" tipo='data' label="Data do Fato" />

            <Coluna name="registro_associado.num_registro"  label="Registro Assos." >
                <Button compact size='mini' as={Link} to="/registro/registro/%registro_associado.num_registro%">
                  %registro_associado.num_registro% - %registro_associado.nome%
               </Button>
            </Coluna>
           
            <Coluna width="30%" label="Relato" >
            
                 <ViewMore height="5.1em">
                     <div>%relato%</div>
                </ViewMore>
            
             </Coluna>
             
            
            <Coluna name="informante_nome"  label="Informante" />
            
          
            <Coluna label="Localização" name="localizacaoNome" /> 


            
                
        
     
        
        </Tabela>

        </div>
      )

  }

}














