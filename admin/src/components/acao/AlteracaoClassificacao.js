import React from 'react';
import { Accordion,Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import * as _  from 'lodash';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';

import Formulario from 'components/Formulario'
import formHoc from 'hocs/formularioHoc'
import {Campo, CampoGrupo } from 'components/formfields'

import ClassificacaoView from '../views/viewsfields/classificacao.js'

import carregaModelo from 'hocs/carregaModelo'

import { connect } from 'react-redux';


import criaconsole from 'util/myconsole'

const _debug = true;
const myconsole = criaconsole(_debug,' === RegistroForm | ', 'color:orange; font-weight:bold')





@connect(null,si3Actions)
export default class AlteracaoClassificacao extends React.Component{




  novaSolicitacaoAlteracaoClassificacao = (elm)=>{
            
        //    var classificacaoSet = _.sortBy( elm.registroclassificacao_set, 'id');
        //    var classificacalAtual = _.last(classificacaoSet);
        //    var classificacalAtualId = classificacalAtual.classificacao.id;
            ;
            
           this.props.openModal( {nome:"modal_solicitacaoalteracaoclassificacao_0",
                              tipo:'form',
                              modelo:'solicitacaoalteracaoclassificacao',
                              id:0,
                              onSave:()=>{
                                    this.props.load('registro',{num_registro:elm.id})
                              },
                              value:{
                                registro:elm._id,
                                classificacao_atual: elm.classificacaoAtual.classificacao.id
                              } 
                             }
            )
  }



  novaParecerSolicitacaoAlteracaoClassificacao = (elm)=>{
            
           var solicitacaoSet = _.sortBy( elm.solicitacaoalteracaoclassificacao_set, 'id');
           var solicitacaoAtual = _.last(solicitacaoSet);
           var solicitacaoAtualId = solicitacaoAtual.id;
            
           this.props.openModal( {nome:"modal_pareceralteracaoclassificacao_0",
                              tipo:'form',
                              modelo:'pareceralteracaoclassificacao',
                              id:0,
                              onSave:()=>{
                                    this.props.load('registro',{num_registro:elm.id})
                              },
                              value:{
                                registro:elm._id,
                                solicitacao: solicitacaoAtualId
                              } 
                             }
            )
  }



  novaResolucaoConselho = (elm)=>{
            
           var perecerSet = _.sortBy( elm.pareceralteracaoclassificacao_set, 'id');
           var parecerAtual = _.last(perecerSet);
           var parecerAtualId = parecerAtual.id;
            
           this.props.openModal( {nome:"modal_resolucaoconselho_0",
                              tipo:'form',
                              modelo:'resolucaoconselho',
                              id:0,
                              onSave:()=>{
                                    this.props.load('registro',{num_registro:elm.id})
                              },
                              value:{
                                registro:elm._id,
                                parecer: parecerAtualId
                              } 
                             }
            )
  }





  render(){
   
     var mostrar = this.props.itens.statusSolicitacaoAlteracaoClassificacao;

      return(
          <div>
            {/* <code>{this.props.itens}</code> */}
              
            { (mostrar == "solicitacao" &&  _.get(window,'PERM.solicitacaoalteracaoclassificacao.add') ) &&
                <Button primary size="tiny" onClick={ (e)=>this.novaSolicitacaoAlteracaoClassificacao(this.props.itens) } > 
                        Solicitar nova classificação 
                </Button>
            }
            { (mostrar == "parecer" &&  _.get(window,'PERM.pareceralteracaoclassificacao.add') ) &&
                <Button  size="small" color="red" onClick={ (e)=>this.novaParecerSolicitacaoAlteracaoClassificacao(this.props.itens) } > 
                    Emitir Parecer 
                </Button>
                }

                { (mostrar == "resolucao" &&  _.get(window,'PERM.resolucaoconselho.add') ) &&
                <Button  size="small" color="blue" onClick={ (e)=>this.novaResolucaoConselho(this.props.itens) } > 
                    Emitir Resolução do Conselho 
                </Button>
                }
            </div>
      )


  }




}