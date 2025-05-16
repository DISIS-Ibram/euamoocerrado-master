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



import ListaSection from 'components/listas/ListaSection'



const _debug = true;
const myconsole = criaconsole(_debug,' === FpeForm.js | ', 'color:orange; font-weight:bold')



@formHoc
export default class FPEForm extends React.Component{
   
  static defaultProps = {
        modelo: "fpe",
        autoForm:true,
        loadFormOptions:true,
        // asID:["relatos"]//,"colecao_midia","receptor"],
      //   include:'all',
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


               <ListaSection titulo="BAPEs"
                                modelo="bape"
                                options={ {frente:this.props.itens._id} }
                                initialValues={ {frente:this.props.itens._id} }
                                onSaveOptions={ {frente:this.props.itens._id} }
                                />



                <ListaSection titulo="Equipe"
                                modelo="membro"
                                options={{include:['funcao','integrante'],fpe:this.props.itens._id}}
                                initialValues={ {fpe:this.props.itens._id} }
                                onSaveOptions={ {fpe:this.props.itens._id} }
                                />


            </div>
           
           ||

             <div className='col-xs-6 col-sm-5 col-sm-5 tac'>
                    <center className="fs1 gray" > Salve a FPE para incluir membro e BAPE </center>
            </div>
            
            }
        
        </div>
        )
  }
}
