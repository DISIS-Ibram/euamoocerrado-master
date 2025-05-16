import React from 'react';
import { Accordion,Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import * as _  from 'lodash';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import moment from 'moment'

import Formulario from 'components/Formulario'
import AutoForm from 'components/form/AutoForm'


import formHoc from 'hocs/formularioHoc'
import {Campo, CampoGrupo } from 'components/formfields'

import {ClassificacaoViewLoader} from '../views/viewsfields/classificacao.js'
import carregaModelo from 'hocs/carregaModelo'

import SolicitacaoCriacaoRegistroResumoView from  '../views/SolicitacaoCriacaoRegistroResumoView'

import ColecaoMidia from 'components/formfields/InputColecaoMidia'



import criaconsole from 'util/myconsole'

const _debug = true;
const myconsole = criaconsole(_debug,' === ParecerSolicitacaoCriacaoRegistroForm.js | ', 'color:orange; font-weight:bold')



@formHoc
export default class ParecerSolicitacaoCriacaoRegistroForm extends React.Component{
   
  static defaultProps = {
        modelo: "parecersolicitacaocriacaoregistro",
        autoForm:true,
        loadFormOptions:true,
        // asID:["relatos"]//,"colecao_midia","receptor"],
        include:'all'
  } 

  state = {
    usuario:false,
  }

  static modeloBase = { 
    senha:'',
    ativo:true,
  }

  //os anchange do formulário
  onChange(){
       myconsole.count(" solicitacaoRegistro - onChange")
  }

 


  render(){

      myconsole.count("render")
      
      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
      return (  
          
                 
                  <div className="row">

                        <div className="col-sm-8 pr-3">
                                  <Formulario {...this.props} >

                                  </Formulario>        
                        </div>


                        <div className="col-sm-4 lateral-info">
                                   
                                   <SolicitacaoCriacaoRegistroResumoView id={this.props.initialValues.solicitacao } />
                                   
                        </div>

                  </div>
                

        )
  }
}













@carregaModelo
export class ParecerClassificacaoButton extends React.Component{

      static defaultProps = {
            modelo:'solicitacaoalteracaoclassificacao'
      }


      render(){
            return(
                  <div>
                           <Button primary size="tiny"  > 
                               Parecer para Solicitação de Classificação 
                           </Button>
                        {JSON.stringify(this.props.itens)}
                  </div>
            )
      }

}













/*

class RegistroClassificacaoSet extends React.Component{

      render(){
            
            var item = this.props.item.classificacao

            let nomeStr = " "+item.padrao.nome + " | "+(item.status && item.status.nome)+ " | "+(item.fase && item.fase.nome || "") + " | "+ (item.etapa && item.etapa.nome || "") 

            var nome = (<div>
                              {item.padrao.nome  &&
                              <Popup
                                    wide
                                    trigger={<Label className='padrao' compact >{item.padrao.nome}</Label>}
                                    content={item.padrao.descricao || ''} />
                              }
                              {item.status && item.status.nome  &&
                                    <Popup
                                    wide
                                    trigger={<Label className='status' compact>{item.status.nome}</Label>}
                                    content={item.status.descricao || ''} />
                              }
                              {item.fase && item.fase.nome  &&
                              
                                    <Popup
                                    wide
                                    trigger={<Label className='fase' compact>{item.fase.nome}</Label>}
                                    content={item.fase.descricao || ''} />
                              }
                              {item.etapa && item.etapa.nome  &&
                                    <Popup
                                    wide
                                    trigger={ <Label className='etapa' compact>{item.etapa.nome}</Label>}
                                    content={item.etapa.descricao || ''} />
                              
                              }
                  </div>
            )

            
            return nome
      }


    

}
*/

