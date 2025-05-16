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



@connect((state)=>({user:state.usuario}),si3Actions)
export default class RelatoTabela extends React.Component
{

  static defaultProps = {
        modelo: "solicitacaocriacaoregistro",
        id:'all',
        editLink:'/registro/solicitacaocriacaoregistro',
        //LETODO - so pode editar link se tiver parecer
        include:'all'
      
  } 


  novaSolicitacao = (e)=>{

     this.props.openModal( {nome:"modal"+this.props.modelo,
                              tipo:'form',
                              modelo:this.props.modelo,
                              onSave:()=>{
                                 //   this.props.load('solicitacaocriacaoregistro')  //recarrega modelo
                              },
                              value:{}} 
                            )

  }


  novaParecer = (idsolicitacao,parecerid=0)=>{
             this.props.openModal( {nome:"modal_parecersolicitacaocriacaoregistro",
                              tipo:'form',
                              modelo:'parecersolicitacaocriacaoregistro',
                              id:parecerid,
                              onSave:()=>{
                                    this.props.load('solicitacaocriacaoregistro')  //recarrega modelo
                              },
                              value:{solicitacao:idsolicitacao} 
                             }
                        )
  }


  novaRegistro = (idparecer,registroid=0)=>{
     this.props.openModal( {nome:"modal_registro",
                              tipo:'form',
                              modelo:'registro',
                              id:registroid,
                              onSave:()=>{
                                 this.props.load('solicitacaocriacaoregistro')   //recarrega modelo
                              },
                              value:{autorizacao:idparecer} 
                             }
                        )
  }





  

  render(){

    var filtros =
            [
                {header:'Parecer',path:'',value:''},
                {key:'parecer', label:'Favoravel',path:'parecersolicitacaocriacaoregistro_set[0].favoravel',value:true},
                {key:'parecer',label:'Desfavoravel',path:'parecersolicitacaocriacaoregistro_set[0].favoravel',value:false},
                {key:'parecer',label:'Sem parecer',path:'parecersolicitacaocriacaoregistro_set[0].favoravel',value:undefined},
            
                {header:'Registro',path:'',value:''},
                {key:'registro', label:'Com Regisros',path:'',value:''},
                {key:'registro', label:'Sem Regisros',path:'',value:''},
            ]

      return(
        <div>

        {_.get(window,'PERM.solicitacaocriacaoregistro.add') &&
        <Button className='mt-2 mb-2'  primary onClick={this.novaSolicitacao}> 
            <Icon name="plus" /> Nova Solicitacao 
        </Button>
        }

        <Tabela filtros={filtros} orderBy="id" search={"all"} col="1" {...this.props} modelo="solicitacaocriacaoregistro" id="all" >
            
            <Coluna name="id" label="id" />
            
            <Coluna name="data" tipo='data' label="Data" />
            
            <Coluna name="autor.nome"  label="Autor" />
            
            <Coluna name="justificativa" label="Justificativa" />

            <Coluna orderBy="parecersolicitacaocriacaoregistro_set[0].favoravel" label='Parecer' className='ta-c' render={ (elm)=>{ 
                     
                     if(_.isEmpty(elm.parecersolicitacaocriacaoregistro_set)){
                            return (
                                <div>
                                {_.get(window,'PERM.parecersolicitacaocriacaoregistro.add') &&
                                <Button fluid primary onClick={(e)=>this.novaParecer(elm.id)}> 
                                        <Icon name="plus" /> Emitir Parecer
                                </Button>
                                }
                                </div>
                            )
                     }else{
                        //LETODO - solicitacao com registro criado não pode mudar o parecer
                        if(elm.parecersolicitacaocriacaoregistro_set[0].favoravel){
                            return (
                                <div>
                                <Button fluid color="green" size="tiny" onClick={(e)=>this.novaParecer(elm.id,elm.parecersolicitacaocriacaoregistro_set[0].id)}> 
                                        <Icon name="thumbs up" /> Favorável
                                </Button>
   
                                </div>

                            )
                        }else{
                            return (<div>
                                <Button fluid color="red" size="tiny" onClick={(e)=>this.novaParecer(elm.id,elm.parecersolicitacaocriacaoregistro_set[0].id)}> 
                                        <Icon name="thumbs down" /> Desfavorável
                                </Button></div>)
                        }


                     }
                  
                     
                  

             } } />


               
            <Coluna label='Registro' render={ (elm)=>{ 
                
                    //pego o numero do registro, ou do objeto registro existente ou do id
                    var numeroRegistro =  _.get(elm,'parecersolicitacaocriacaoregistro_set[0].registro.num_registro',0);
                    if(numeroRegistro == 0){
                            numeroRegistro = _.get(elm,'parecersolicitacaocriacaoregistro_set[0].registro',0);
                    }

                     if(_.isEmpty(elm.parecersolicitacaocriacaoregistro_set)){
                            return (
                                <div></div>
                            )
                     }else{
                        
                        if( numeroRegistro > 0 ){
                              return (
                                <div>
                            
                                 <Button size="small" compact fluid color="blue" onClick={(e)=>this.novaRegistro(elm.parecersolicitacaocriacaoregistro_set[0].id,elm.parecersolicitacaocriacaoregistro_set[0].registro.num_registro)}> 
                                        Ver Registro
                                </Button>
   
                                </div>

                            )

                        }else if(elm.parecersolicitacaocriacaoregistro_set[0].favoravel){
                            return (
                                <div>
                           
                                    {_.get(window,'PERM.registro.add') &&
                                    <Button size="small" primary fluid onClick={(e)=>this.novaRegistro(elm.parecersolicitacaocriacaoregistro_set[0].id)}> 
                                            <Icon name="plus" /> Criar Registro
                                    </Button>
                                    }
   
                                </div>

                            )
                        }

                   


                     }
                  
                     
                  

             } } />




            {/*<Coluna name="receptor.nome"  label="Receptor" />
            <Coluna name="informante_nome"  label="Informante" >
                <b>%informante_nome%</b><br/>
                %informante_situacao.nome%
            </Coluna>
            <Coluna name="estado.nome" label="Localização" > 
                <span>%municipio.nome% </span>| <span>%estado.nome%</span>
            </Coluna>
            <Coluna  width="30%" label="Caracterízação Ambiente" >
                <ViewMore>
                     <div>%caracterizacao_local%</div>
                     <small>
                        Inundação: <b>%caracterizacao_inundacao.nome%</b><br />
                        Tipo Hidrografia: <b>%caracterizacao_tipo_hidrografia.nome%</b><br />
                        Posição Hidrografia: <b>%caracterizacao_posicao_hidrografia.nome%</b><br />
                    </small>
                </ViewMore>
            </Coluna>
            <Coluna name="outras_informacoes" label="Outras Info" />*/}


        
        </Tabela>

        </div>
      )

  }

}














