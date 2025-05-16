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
import MapaTrilha from 'components/elements/MapaTrilha'




const _debug = true;
const myconsole = criaconsole(_debug,' === FpeForm.js | ', 'color:orange; font-weight:bold')





@formHoc
export default class TrilhaForm extends React.Component{
   
  static defaultProps = {
        modelo: "trilha",
        autoForm:false,
        loadFormOptions:true,
        force:true,
        // asID:["relatos"]//,"colecao_midia","receptor"],
      //   include:'all',
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
                    <Campo label='Nome' name='nome' tipo='texto' req={true} validate='' />
                    <Campo label='Descrição' name='descricao' tipo='textarea' req={true} validate='' />
                    <Campo label='Regiao administrativa' name='regiao_administrativa' tipo='texto' validate='' />
                    <Campo label='Categoria' name='categoria' tipo='radiogrupo'  validate='' />
                    <Campo label='Atividades' name='atividades' tipo='model' modelo='atividade' multiple={true} validate='' />
                  
                    <Campo label='Sinalizada' name='sinalizada' tipo='checkbox' validate='' />
                    <Campo label='Oficial' name='oficial' tipo='checkbox' validate='' />
                    <Campo label='Publico' name='publico' tipo='checkbox' validate='' />
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

            <MapaTrilha  idtrilha={this.props.itens.id} />




         <ListaSection modelo="videoyoutubetrilha" 
                          className="mt-4 mt4"
                          titulo="Videos"
                          onSaveOptions={ {trilha:this.props.itens.id} }
                          initialValues={ {trilha:this.props.itens.id} }
                          options={{trilha:this.props.itens._id}}
                          template="videoyoutube"
                       
                           />


         <ListaSection modelo="imagemtrilha" 
                          titulo="Imagens"
                          onSaveOptions={ {trilha:this.props.itens.id} }
                          initialValues={ {trilha:this.props.itens.id} }
                          options={{trilha:this.props.itens._id}}
                          template="imagemespecie"
                           />


            {/* <ListaSection modelo="videoyoutube" 
                            className="mt-4 mt4"
                          titulo="Videos"
                          onSaveOptions={ {parque:this.props.itens.id} }
                          initialValues={ {parque:this.props.itens.id} }
                          options={{parque:this.props.itens._id}}
                       
                           /> */}


        {/* <ListaSection modelo="imagemparque" 
                          titulo="Imagens Parque"
                          onSaveOptions={ {especie:this.props.itens.id} }
                          initialValues={ {especie:this.props.itens.id} }
                          options={{especie:this.props.itens._id}}
                          template="imagemespecie"
                           /> */}

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
