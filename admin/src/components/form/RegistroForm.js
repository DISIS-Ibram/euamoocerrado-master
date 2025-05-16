import React from 'react';
import { Accordion,Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import * as _  from 'lodash';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import moment from 'moment'

import Formulario from 'components/Formulario'
import formHoc from 'hocs/formularioHoc'
import {Campo, CampoGrupo } from 'components/formfields'

import ClassificacaoView from '../views/viewsfields/classificacao.js'
import carregaModelo from 'hocs/carregaModelo'

import JSONTree from 'react-json-tree'


import ListaSection from 'components/listas/ListaSection'


import AlteracaoClassificacao from 'components/acao/AlteracaoClassificacao.js'

import ParecerSolicitacaoCriacaoRegistroResumoView from '../views/ParecerSolicitacaoCriacaoRegistroResumoView'


import criaconsole from 'util/myconsole'

const _debug = true;
const myconsole = criaconsole(_debug,' === RegistroForm | ', 'color:orange; font-weight:bold')



@formHoc
export default class RegistroForm extends React.Component{
   
  static defaultProps = {
        modelo: "registro",
        autoForm:false,
        loadFormOptions:false,
        // asID:["relatos"]//,"colecao_midia","receptor"],
      //   include:'all',
  } 

  state = {
    usuario:false,
  }

  static modeloBase = { 
    senha:'',
    ativo:true,
  }

  validar(values){
        myconsole.count('validate RelatoForm')
        // const errors = {}
        // return errors
        return values;
  }



  antesDeSalvar(values){

        // myconsole.log("antes salvar no Component")
        // if(!values.senha && values._new)
        //   values.senha=""
        return values;
  }


  //os anchange do formulário
  onChange(){
       myconsole.count(" solicitacaoRegistro - onChange")
  }

  novaSolicitacaoAlteracaoClassificacao = (elm)=>{
            
           var classificacaoSet = _.sortBy( elm.registroclassificacao_set, 'id');
           var classificacalAtual = _.last(classificacaoSet);
           var classificacalAtualId = classificacalAtual.classificacao.id;
            
           this.props.openModal( {nome:"modal_solicitacaoalteracaoclassificacao_0",
                              tipo:'form',
                              modelo:'solicitacaoalteracaoclassificacao',
                              id:0,
                              onSave:()=>{
                                    this.props.load('registro',{num_registro:elm.id})
                              },
                              value:{
                                registro:elm._id,
                                classificacao_atual: classificacalAtualId
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

      myconsole.count("render")

      var classificacaoSet = _.sortBy( this.props.itens.registroclassificacao_set, 'id');
      var classificacalAtual = _.last(classificacaoSet);

      var solicitacaoClassificacaoSet = _.sortBy( this.props.itens.solicitacaoalteracaoclassificacao_set, 'id');
      var solicitacaoClassificacaoAtual = _.last(solicitacaoClassificacaoSet);

      var parecerAlteracaoClassificacaoSet = _.sortBy( this.props.itens.pareceralteracaoclassificacao_set, 'id');
      var parecerAlteracaoClassificacaoSetAtual = _.last(parecerAlteracaoClassificacaoSet);

      var resolucaoConselhoSet = _.sortBy( this.props.itens.resolucaoconselho_set, 'id');
      var resolucaoConselhoSetAtual = _.last(parecerAlteracaoClassificacaoSet);
    
      //O QUE MOSTRAR
      var mostrar = "solicitacao";
      var classificacaosolicitada = "";

      //Se ja tenho uma solicitacao
      if( ! _.isEmpty(solicitacaoClassificacaoAtual) ){

            classificacaosolicitada = solicitacaoClassificacaoAtual.classificacao_solicitada;

            //pego o parecer
            var parecer = _.find(parecerAlteracaoClassificacaoSet,{solicitacao:solicitacaoClassificacaoAtual.id})

            //vejo se tenho um parecer
            if( _.isEmpty(parecer) ){
                  //se nao tenho vou mostrar para emitir um parecer
                   mostrar = "parecer"
            }else{
                  //se parecer depende de uma resolucao do conselho
                  if(parecer.solucao == "2" ){
                        var resolucao = _.find(resolucaoConselhoSet, {parecer:parecer.id} );
                        //se nnao tenho a resolucao, vou mostrar a emissao desse
                        if(_.isEmpty(resolucao) ){
                            mostrar = "resolucao"   
                        }
                  }
            }
      }



      


      //var solicitacaoClassificacaoSet = _.sortBy( this.props.itens.solicitacaoalteracaoclassificacao_set, 'id');
      //var solicitacaoClassificacaoAtual = _.head(solicitacaoClassificacaoSet);
      
      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
      return (  
            <Formulario {...this.props}  >
                 
 
                  
                  <div className="row">
                        
                        <div className="col-sm-8 pr-3">
                                    <Campo label='Ativo' name='ativo' tipo='checkbox' toggle validate='' />
                                    <Campo label='Número do Registro' name='num_registro' tipo='texto' type='number' req={true} validate='' />
                                    <Campo label='Nome' name='nome' tipo='texto' req={true} validate='' />

                                    <Campo label='Registro Vinculado' name='registro_vinculado' tipo='model' modelo='registro' multiple={false}   allowAdditions={false}  validate='' />

                                    <Campo label='Data de criação' name='data' tipo='data' validate='' />

                                    <CampoGrupo label="Caracterização Étnica">
                                          <Campo label='Povo' name='povo' tipo='model' modelo='povo' multiple={false} validate='' />
                                          <Campo label='Há confirmação do povo?' name='confirmacao_povo' tipo='checkbox' validate='' />
                                          <Campo label='Língua' name='lingua' tipo='model' modelo='lingua' multiple={false} validate='' />
                                          <Campo label='Há confirmação da língua?' name='confirmacao_lingua' tipo='checkbox' validate='' />
                                    </CampoGrupo>
                                  
                                    <CampoGrupo label="Quanto a Localização">
                                          <Campo label='Localização' name='localizacao' tipo='geopoint' req={true} validate='' />
                                          <Campo label='Descrição da Localização' name='descricao_localizacao' tipo='textarea' validate='' />
                                    </CampoGrupo>

                                 

                                     <Campo label='Documentos' name='documentos' tipo='midia' req />

                                    <Campo label='FPE' name='fpe' tipo='model' modelo='fpe' multiple={false} validate='' allowAdditions={false} />
                              
                                    <Campo label='Notas Técnicas' name='notatecnica_set' tipo='model' modelo='notatecnica' multiple={true} validate='' />
                                    <Campo label='Plano de Contingência' name='planodecontingencia_set' tipo='model' modelo='planodecontingencia' multiple={true} validate='' />
                                    <Campo label='Palavras-Chave' name='tags' tipo='model' modelo='tag' multiple={true} validate='' />

                                   
                                   
                                   
                        </div>

                        <div className="col-sm-4 lateral-info">

                              
                              
                                    { (this.props.id == 0) &&
                                      
                                      <div>
                                          <ParecerSolicitacaoCriacaoRegistroResumoView id={this.props.initialValues.autorizacao || 0} /> 
                                      </div>

                                    }

                                    { (this.props.id != 0) &&

                                          <div>

                                           <div className='box mt5'> 
                                                <h3 className='view-header mb2'> Classificação </h3>
                                          
                                                
                                                <AlteracaoClassificacao itens={this.props.itens} />

                                                <div className='mt1'>
                                                  
                                                  { mostrar != "solicitacao" && 
                                                      <div className='campo'>
                                                            <label className='label f-label rotulo'> Nova Classificação Solicitada </label>
                                                            <div className="mt-1 input-wrap ui input fluid">
                                                        
                                                                  <small>
                                                                        <ClassificacaoView item={classificacaosolicitada} />
                                                                  </small>
                                                            </div>
                                                      </div>
                                                      
                                                      }

                                                      
                                                </div>




                                                <div className='campo'>
                                                      <label className='label f-label rotulo'> Classificação Atual </label>
                                                      <div className="mt-1 input-wrap ui input fluid">
                                                           <small>
                                                                  <ClassificacaoView item={classificacalAtual} />
                                                            </small>
                                                      </div>
                                                     
                                                
                                                </div>

                                                <Accordion className='mt--2'>
                                                      <Accordion.Title>
                                                      <small> <Icon name='dropdown' />
                                                            Histórico</small>
                                                      </Accordion.Title>

                                                      <Accordion.Content className='bg-azul'>
                                                            { _.map(classificacaoSet,classificacao=>{
                                                                  
                                                                  return ( <div>
                                                                        <Divider horizontal>{moment(classificacao.data).format('L')}</Divider>
                                                                        <ClassificacaoView item={classificacao} />
                                                                        </div>
                                                                        )
                                                            })}
                                                      </Accordion.Content>
                                                </Accordion>

                                                </div>

                                          
                                       
                                         <div className='box mt5'> 
                                                 <h3 className='mt2 box-title view-header mb2'>Evidencias</h3>
                                          
                                               <ListaSection modelo="sitio" 
                                                      titulo={<small>Sítios</small>}
                                                      onSaveOptions={ {registro:this.props.itens._id} }
                                                      initialValues={ {registro:this.props.itens._id} }
                                                      options={ {registro:this.props.itens._id} }
                                                      />
      
                                                 <ListaSection modelo="vestigio" 
                                                      titulo={<small>Vestigios</small>}
                                                      canAdd={false}
                                                      onSaveOptions={ {registro:this.props.itens._id} }
                                                      initialValues={ {registro:this.props.itens._id} }
                                                      options={ {registro:this.props.itens._id} }
                                                      include={["tipo"]}
                                                      />
      
                                                <ListaSection modelo="avistamento" 
                                                      titulo={<small>Avistamentos</small>}
                                                      canAdd={false}
                                                      onSaveOptions={ {registro:this.props.itens._id} }
                                                      initialValues={ {registro:this.props.itens._id} }
                                                      options={{registro:this.props.itens._id}}
                                                      />
                                                      
                                          </div>
                                          
                                     





                                                 <div className="mt4 box">
                                                        <ParecerSolicitacaoCriacaoRegistroResumoView id={this.props.initialValues.autorizacao || 0}  comsolicitacao={false} /> 
                                                 </div>



                                          </div>
                                    }

                                    { ! this.props.itens &&
                                        <Campo disabled={true} label='Parecer para Criação do Registro' name='autorizacao' tipo='model' modelo='parecersolicitacaocriacaoregistro' multiple={false} req={true} validate='' />
                                          ||
                                        <Campo disabled={true} label='Parecer para Criação do Registro' name='autorizacao' tipo='model' modelo='parecersolicitacaocriacaoregistro' multiple={false} req={true} validate='' />
                                    }                         
                        </div>
                  </div>

  {/*<pre>{JSON.stringify(this.props.itens,null,2)}</pre>*/}

            </Formulario>
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

