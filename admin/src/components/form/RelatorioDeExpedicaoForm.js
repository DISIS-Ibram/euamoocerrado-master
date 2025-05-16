import React from 'react';
import { Accordion,Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import { si3, si3Actions }  from 'actions/index';
import moment from 'moment'

import Formulario from 'components/Formulario'
import formHoc from 'hocs/formularioHoc'
import {Campo, CampoGrupo } from 'components/formfields'

import Avatar from 'components/elements/Avatar'

import carregaModelo from 'hocs/carregaModelo'

import ItemGenericoList from 'components/form/ItemGenericoList';

import criaconsole from 'util/myconsole'

import ViewMore from 'components/ViewMore'

import ListaSection from 'components/listas/ListaSection'


import { Link } from 'react-router'

const _debug = false;
const myconsole = criaconsole(_debug,' === RelatorioExpedicaoForm.js | ', 'color:orange; font-weight:bold')



@formHoc
export default class RelatorioDeExpedicaoForm extends React.Component{
   
  static defaultProps = {
        modelo: "relatoriodeexpedicao",
        autoForm:true,
        loadFormOptions:true,
        // asID:["relatos"]//,"colecao_midia","receptor"],
      //   include:'all',
  } 


    // LETODO - incluir expedicao id da url se for o caso e não mostrar o expedicao aqui  


    novoAvistamento = (e)=>{

                this.props.openModal( { nome:"modal_avistamento",
                              tipo:'form',
                              modelo:"avistamento",
                              onSave:()=>{
                                this.props.load('avistamento',{},{relatorio:this.props.itens._id})
                             },
                              value:{relatorio:this.props.itens._id}
                            } 
                            )

  }


  novoVestigio = (e)=>{

                this.props.openModal( { nome:"modal_vestigio",
                              tipo:'form',
                              modelo:"vestigio",
                              onSave:()=>{
                                this.props.load('vestigio',{},{relatorio:this.props.itens.id})
                             },
                              value:{relatorio:this.props.itens._id}
                            } 
                            )
  }


    novoSitioRel = (e)=>{

                this.props.openModal( { nome:"modal_sitios_rel",
                              tipo:'form',
                              modelo:"sitios_rel",
                              onSave:()=>{
                                this.props.load('sitios_rel',{},{relatorio:this.props.itens.id})
                             },
                              value:{relatorio:this.props.itens._id}
                            } 
                            )
  }



   novoVestigio = (e)=>{

     this.props.openModal( {nome:"modal_vestigio",
                              tipo:'form',
                              modelo:"vestigio",
                              onSave:()=>{
                                this.props.load('vestigio',{},{relatorio:this.props.itens.id})
                             },
                              value:{relatorio:this.props.itens.id}
                            } 
                            )

  }




  render(){
      
      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
      return (  
          <div className='row'>
              <div className='col-xs-6 col-sm-6 pr-3'>
                    <Formulario {...this.props} >
                    </Formulario>
            </div>
          


            { this.props.id != 0 &&
           
            <div className='col-xs-6 col-sm-5 col-sm-5 lateral-info'>

                
                    <ListaSection modelo="avistamento" 
                          titulo="Avistamentos"
                          onSaveOptions={ {relatorio:this.props.itens._id} }
                          initialValues={ {relatorio:this.props.itens._id} }
                          options={{relatorio:this.props.itens.id}}
                          />


                    <ListaSection modelo="vestigio" 
                          titulo="Vestigios"
                          onSaveOptions={ {relatorio:this.props.itens._id} }
                          initialValues={ {relatorio:this.props.itens._id} }
                          options={ {relatorio:this.props.itens._id} }
                          include={["tipo"]}
                          />

                    
                     <ListaSection modelo="sitios_rel" 
                          titulo="Sítios Visitados "
                          onSaveOptions={ {relatorio:this.props.itens._id} }
                          initialValues={ {relatorio:this.props.itens._id} }
                          options={ {relatorio:this.props.itens._id} }
                          />



{/*


                    <div className='view-resumo'>
                            <div className="view-header">
                                
                                <h3 >Avistamentos  
                                    {_.get(window,'PERM.avistamento.add') &&
                                        <Button size="mini" compact className=''  primary onClick={this.novoAvistamento}> 
                                            <Icon name="plus" /> Adicionar 
                                        </Button>
                                    }
            
                                </h3>
                            </div>
                            <div className="view-content">
                                
                                <AvistamentoList options={{relatorio:this.props.itens.id}} />

                            </div>
                    </div>





                    <div className='view-resumo'>
                        <div className="view-header">
                            
                            <h3 >Vestigios  
                                {_.get(window,'PERM.vestigio.add') &&
                                    <Button size="mini" compact className=''  primary onClick={this.novoVestigio}> 
                                        <Icon name="plus" /> Adicionar 
                                    </Button>
                                }
        
                            </h3>
                        </div>
                        <div className="view-content">
                            
                            <VestigioList options={{relatorio:this.props.itens._id}} />

                        </div>
                    </div>



                    <div className='view-resumo'>
                        <div className="view-header">
                            
                            <h3 >Sítios Visitados 
                                {_.get(window,'PERM.sitios_rel.add') &&
                                    <Button size="mini" compact className=''  primary onClick={this.novoSitioRel}> 
                                        <Icon name="plus" /> Adicionar 
                                    </Button>
                                }
        
                            </h3>
                        </div>
                        <div className="view-content">
                            
                            <SitioRelList options={{relatorio:this.props.itens._id}} />

                        </div>
                    </div>
                */}





               

            </div>
           
           ||

             <div className='col-xs-6 col-sm-5 col-sm-5 tac'>
                    <center className="fs1 gray" > Salve o Relatório da Expedição para incluir Sítios, Vestígios e Avistamentos </center>
            </div>
            
            }
        
        </div>
        )
  }
}







@carregaModelo
class AvistamentoList extends React.Component{
        
        static defaultProps={
            modelo:"avistamento",
            id:'all',
            loader:true,
        }


        edita = (id)=>{

            this.props.openModal( {nome:"modal_avistamento",
                                    tipo:'form',
                                    modelo:"avistamento",
                                    id:id,
                                    onSave:()=>{
                                        //   this.props.load('solicitacaocriacaoregistro')  //recarrega modelo
                                    },
                                    value:{}
                                    } 
                                 )
        }


        render(){
            return(
            <div>
                <List divided relaxed size="small" >
                    {_.map(this.props.itens,elm=>{
                        return (<AvistamentoView onClick={ev=>this.edita(elm.id) }  key={"elm"+elm.id} avistamento={elm} />)
                    })}
                </List>
            </div>
            )
        }

}





class AvistamentoView extends React.Component{

        render(){
            return(
             <List.Item  >
             
                <List.Content>
                    <List.Header as="a" onClick={this.props.onClick} >
                        Avistamento {this.props.avistamento._id}
                    </List.Header>
                    <List.Description>

                     <div>
                          <small>  { _.get(this.props.vestigio,'localizacaostr') } </small>
                     </div>

                        <div>  
                            <small> <b> Detalhamento:</b> </small> <br />
                            <ViewMore>
                                 <small>  {this.props.avistamento.observacoes} </small>
                            </ViewMore>
                        </div>                       

                    </List.Description>

                </List.Content>
            </List.Item>
            )
        }

}









@carregaModelo
class VestigioList extends React.Component{
        
        static defaultProps={
            modelo:"vestigio",
            id:'all',
            loader:true,
            include:['tipo'],
        }


        edita = (id)=>{

            this.props.openModal( {nome:"modal_vestigio",
                                    tipo:'form',
                                    modelo:"vestigio",
                                    id:id,
                                    onSave:()=>{
                                        //   this.props.load('solicitacaocriacaoregistro')  //recarrega modelo
                                    },
                                    value:{}
                                    } 
                                 )
        }

        render(){
            return(
            <div>
                <List divided relaxed size="small" >
                    {_.map(this.props.itens,elm=>{
                        return (<VestigioView onClick={ev=>this.edita(elm.id) }  key={"vestigio"+elm.id} vestigio={elm} />)
                    })}
                </List>
            </div>
            )
        }

}



class VestigioView extends React.Component{

        render(){
            return(
             <List.Item  >
             
                <List.Content>
                    <List.Header as="a" onClick={this.props.onClick} >
                        <small>Vestigio</small> { _.get(this.props,'vestigio.tipo.nome') }
                    </List.Header>
                    <List.Description>


                        <div>  
                           
                       
                                 <small>  {this.props.vestigio.localizacaostr} </small>
                           
                        </div>         

                        <div>  
                            <small> <b> Detalhamento:</b> </small> <br />
                            <ViewMore>
                                 <small>  {this.props.vestigio.observacoes} </small>
                            </ViewMore>
                        </div>                       

                    </List.Description>

                </List.Content>
            </List.Item>
            )
        }

}







@carregaModelo
class SitioRelList extends React.Component{
        
        static defaultProps={
            modelo:"sitios_rel",
            id:'all',
            loader:true,
          
        }



        edita = (id)=>{

            this.props.openModal( {nome:"modal_vestigio",
                                    tipo:'form',
                                    modelo:"sitios_rel",
                                    id:id,
                                    onSave:()=>{
                                        //   this.props.load('solicitacaocriacaoregistro')  //recarrega modelo
                                    },
                                    value:{}
                                    } 
                                 )
        }


        render(){
            return(
            <div>
                <List divided relaxed size="small" >
                    {_.map(this.props.itens,elm=>{
                        return (<SitioRelView onClick={ev=>this.edita(elm.id) }  key={"vestigio"+elm.id} sitiorel={elm} />)
                    })}
                </List>
            </div>
            )
        }

}



class SitioRelView extends React.Component{

        render(){
            return(
             <List.Item  >
             
                <List.Content>
                    <List.Header as="a" onClick={this.props.onClick} >
                       { moment(this.props.sitiorel.data).format('L') } - Sitio nº { _.get(this.props,'sitiorel.sitio.numero_sitio') }
                    </List.Header>
                    <List.Description>
                        

                        

                        <div>  
                            <small> <b> Detalhamento:</b> </small> <br />
                            <ViewMore>
                                 <small>  {this.props.sitiorel.descricao} </small>
                            </ViewMore>
                        </div>                       

                    </List.Description>

                </List.Content>
            </List.Item>
            )
        }

}

