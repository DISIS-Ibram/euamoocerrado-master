import React from 'react';
import { Accordion,Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import { si3, si3Actions }  from 'actions/index';
import moment from 'moment'

import {Link} from 'react-router'

import Formulario from 'components/Formulario'
import formHoc from 'hocs/formularioHoc'
import {Campo, CampoGrupo } from 'components/formfields'

import Avatar from 'components/elements/Avatar'

import carregaModelo from 'hocs/carregaModelo'

import ItemGenericoList from 'components/form/ItemGenericoList';

import criaconsole from 'util/myconsole'

import ViewMore from 'components/ViewMore'


import ListaSection from 'components/listas/ListaSection'
import ParqueAtrativos from 'components/elements/ParqueAtrativos'




const _debug = true;
const myconsole = criaconsole(_debug,' === FpeForm.js | ', 'color:orange; font-weight:bold')





@formHoc
export default class ParqueForm extends React.Component{
   
  static defaultProps = {
        modelo: "parque",
        autoForm:false,
        loadFormOptions:true,
        force:true,
        // asID:["relatos"]//,"colecao_midia","receptor"],
        includes:'all',
        excludeOnLoad:['visitantes']
  } 


    novoPlanejamento = (e)=>{

     this.props.openModal( { nome:"modal_planejamentoexpedicao",
                              tipo:'form',
                              modelo:"especie",
                              onSave:()=>{
                                this.props.load('especie',{},{especie:this.props.itens.id})
                             },
                              value:{especie:this.props.itens.id}
                            } 
                            )

  }





  render(){
      
      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
      return (  
          <div className='row'>
              <div className='col-xs-4 col-sm-4 pr-3'>
                    <Formulario {...this.props} >
                            <Campo label='Nome' name='nome' tipo='text' validate='' />
                            <Campo label='Nome decreto' name='nome_decreto' tipo='text' validate='' />
                            <Campo label='Categoria' name='categoria' tipo='text' validate='' />
                            <Campo label='Limite' name='geom' tipo='geo' geom='area' validate='' />
                            <Campo label='Custo entrada' name='custo_entrada' tipo='text' validate='' />
                            <Campo label='Periodo abertura' name='periodo_abertura' tipo='text' validate='' />
                            <Campo label='Descrição' name='descricao' tipo='textarea' validate='' />
                            <Campo label='Regiao administrativa' name='regiao_administrativa' tipo='text' validate='' />
                            {/* <Campo label='Tipo' name='tipo' tipo='textarea' validate='' />
                            <Campo label='Limite' name='center' tipo='texto' className='undefined hidden' validate='' />
                            <Campo label='Visitantes' name='visitantes' tipo='texto' disabled={true} allowAdditions={false} className='undefined hidden' validate='' />
                            <Campo label='Vídeos no Youtube' name='videoyoutube_set' tipo='texto' disabled={true} allowAdditions={false} validate='' />
                            <Campo label='Contatos' name='contatoparque' tipo='texto' disabled={true} allowAdditions={false} className='undefined hidden' validate='' />
                            <Campo label='Estrutura' name='benfeitoria_set' tipo='texto' disabled={true} allowAdditions={false} className='undefined hidden' validate='' />
                            <Campo label='Atrativos' name='atrativo_set' tipo='texto' disabled={true} allowAdditions={false} className='undefined hidden' validate='' />
                            <Campo label='Ocorrências' name='ocorrencia_set' tipo='texto' disabled={true} allowAdditions={false} className='undefined hidden' validate='' /> */}
                    </Formulario>
            </div>
          


            { this.props.id != 0 &&
           
            <div className='col-xs-8 col-sm-8  lateral-info'>


               

           
            {/* <ListaSection modelo="atrativo" 
                          titulo="Atrativos"
                          onSaveOptions={ {parque:this.props.itens.id} }
                          initialValues={ {parque:this.props.itens.id} }
                          options={{parque:this.props.itens._id}}
                        /> */}

            <ParqueAtrativos idparque={this.props.itens.id} />


            <ListaSection modelo="videoyoutubeparque" 
                            className="mt-4 mt4"
                          titulo="Videos"
                          onSaveOptions={ {parque:this.props.itens.id} }
                          initialValues={ {parque:this.props.itens.id} }
                          options={{parque:this.props.itens._id}}
                       
                           />


        <ListaSection modelo="imagemparque" 
                          titulo="Imagens Parque"
                          onSaveOptions={ {parque:this.props.itens.id} }
                          initialValues={ {parque:this.props.itens.id} }
                          options={{parque:this.props.itens._id}}
                          template="imagemespecie"
                           />

            {/* <ListaSection modelo="relatoriodeexpedicao" 
                          titulo="Relatório"
                          onSaveOptions={ {expedicao:this.props.itens.id} }
                          initialValues={ {expedicao:this.props.itens.id}}
                          options={{expedicao:this.props.itens._id}}
                           /> */}


           
            </div>
           
           ||

             <div className='col-xs-6 col-sm-5 col-sm-5 tac'>
                    <center className="fs1 gray" > Salve para mais opções </center>
            </div>
            
            }
        
        </div>
        )
  }
}


/*
@carregaModelo
class PlanejamentoList extends React.Component{
        
        static defaultProps={
            modelo:"planejamentoexpedicao",
            id:'all',
            loader:true,
        }


        edita = (id)=>{

            this.props.openModal( {nome:"modal_planejamentoexpedicao",
                                    tipo:'form',
                                    modelo:"planejamentoexpedicao",
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
                        return (<PlanejamentoView onClick={ev=>this.edita(elm.id) }  key={"elm"+elm.id} planejamento={elm} />)
                    })}
                </List>
            </div>
            )
        }

}





class PlanejamentoView extends React.Component{

        render(){
            return(
             <List.Item  >
             
                <List.Content>
                    <List.Header as="a" onClick={this.props.onClick} >
                        
                        {moment(this.props.planejamento.previsao_inicio).format('L')}&ensp;-&ensp; 
                        {moment(this.props.planejamento.previsao_fim).format('L') }

                    </List.Header>
                    <List.Description>

                       
                        
                        <div>  
                            <small> <b> Detalhamento Logístico:</b> </small> <br />
                            <ViewMore>
                                 <small>  {this.props.planejamento.detalhamento_logistico} </small>
                            </ViewMore>
                        </div>

                        <div>  
                            <small> <b> Orçamento:</b> </small> <br />
                            <ViewMore>
                                <small> {this.props.planejamento.orcamento_resumido} </small>
                            </ViewMore>
                        </div>
                        
                       


                         <div className='mt2'>
                           
                        </div>
                    
                    </List.Description>

                </List.Content>
            </List.Item>
            )
        }

}







@carregaModelo
class RelatorioList extends React.Component{
        
        static defaultProps={
            modelo:"relatoriodeexpedicao",
            id:'all',
            loader:true,
        }


        edita = (id)=>{

            this.props.openModal( {nome:"modal_relatoriodeexpedicao",
                                    tipo:'form',
                                    modelo:"relatoriodeexpedicao",
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
                        return (<RelatorioView onClick={ev=>this.edita(elm.id) }  key={"relatoriodeexpedicao"+elm.id} relatorio={elm} />)
                    })}
                </List>
            </div>
            )
        }

}



class RelatorioView extends React.Component{

        render(){
            return(
             <List.Item  >
                

                <List.Content>
                    <List.Header as={Link} to={"/form/relatoriodeexpedicao/"+this.props.relatorio._id }  >
                        {this.props.relatorio.titulo} 
                    </List.Header>
                    <List.Description>
                        
                        <div>  
                            <small> <b>Autor:</b> </small> 
                            
                                 <small>  {this.props.relatorio.autor.nome} </small>
                        </div>

                        <div><small>          
                            {moment(this.props.relatorio.data_inicio).format('L')}&ensp;-&ensp; 
                            {moment(this.props.relatorio.data_fim).format('L') }
                        </small></div> 

                         <div>  
                            <small> <b> Resultados:</b> </small> <br />
                            <ViewMore>
                                <small> {this.props.relatorio.resultados} </small>
                            </ViewMore>
                        </div>

                         


                    
                    </List.Description>

                </List.Content>
            </List.Item>
            )
        }

}
*/
