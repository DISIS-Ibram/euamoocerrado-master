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
export default class AtrativoForm extends React.Component{
   
  static defaultProps = {
        modelo: "atrativotrilha",
        autoForm:false,
        loadFormOptions:true,
        force:true,
        // asID:["relatos"]//,"colecao_midia","receptor"],
      //   include:'all',
  } 


// novoPlanejamento = (e)=>{

//      this.props.openModal( { nome:"modal_planejamentoexpedicao",
//                               tipo:'form',
//                               modelo:"especie",
//                               onSave:()=>{
//                                 this.props.load('especie',{},{especie:this.props.itens.id})
//                              },
//                               value:{especie:this.props.itens.id}
//                             } 
//                             )

//   }





  render(){
      
      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
      return (  
          <div className='row'>
              <div className='col-xs-6 col-sm-6 pr-3'>

                    <Formulario {...this.props} >
                          <Campo label='Tipo atrativo' name='tipo_atrativo' tipo='model' modelo='tipoatrativo' multiple={false} req={true} validate='' />
                          <Campo label='Cor' name='cor' tipo='color' validate='' />
                          <Campo label='Descricao' name='descricao' tipo='textarea' validate='' />
                          {/* <Campo label='Limitacao' name='limitacao' tipo='textarea' validate='' /> */}
                          {/* <Campo label='Geom' name='geom' tipo='geo' geom='point' req={true} validate='' /> */}
                          {/* <Campo label='Imagens' name='imagematrativotrilha_set' tipo='model' disabled={true} modelo='imagematrativotrilha' multiple={true} allowAdditions={false} className='undefined hidden' validate='' />
                          <Campo label='Vídeos no Youtube' name='videoatrativotrilha_set' tipo='model' disabled={true} modelo='videoatrativotrilha' multiple={true} allowAdditions={false} className='undefined hidden' validate='' /> */}
                    </Formulario>
            </div>
          


            { this.props.id != 0 &&
           
            <div className='col-xs-6 col-sm-6  lateral-info'>




         <ListaSection modelo="videoatrativotrilha" 
                          className="mt-4 mt4"
                          titulo="Videos Atrativos"
                          onSaveOptions={ {atrativo:this.props.itens.id} }
                          initialValues={ {atrativo:this.props.itens.id} }
                          options={{atrativo:this.props.itens._id}}
                          template="videoyoutube"
                       
                           />


         <ListaSection modelo="imagematrativotrilha" 
                          titulo="Imagens do Atrativo"
                          onSaveOptions={ {atrativo:this.props.itens.id} }
                          initialValues={ {atrativo:this.props.itens.id} }
                          options={{atrativo:this.props.itens._id}}
                          template="imagemespecie"
                           />
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
