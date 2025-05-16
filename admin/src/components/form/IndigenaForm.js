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
export default class IndiginaForm extends React.Component{
   
  static defaultProps = {
        modelo: "aldeia",
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
                    <Formulario {...this.props} autoForm={false}>


                    <Campo label='Número do identificação' name='numero' tipo='texto' type='number' req={true} validate='' />
                    <Campo label='Observações' name='observacao' tipo='textarea' validate='' />
                    <Campo label='Fotos' name='fotos' tipo='midia' validate='' />
                    <Campo label='Data de Nascimento' name='nascimento' tipo='data' req={true} validate='' />
                    <Campo label='Data de Óbito' name='obito' tipo='data' validate='' />
                    <Campo label='Sexo' name='sexo' tipo='radiogrupo' req={true} validate='' />
                    <Campo label='Casamento' name='casamento' tipo='model' modelo='indigena' multiple={true} validate='' />
                    {/* <Campo label='Aldeias' name='aldeias' tipo='model' disabled={true} modelo='aldeia' multiple={true} allowAdditions={false} validate='' />
                    <Campo label='Filiação' name='filiacao' tipo='model' disabled={true} modelo='indigena' multiple={true} allowAdditions={false} validate='' />
                    <Campo label='Anamnese' name='anamnese' tipo='model' disabled={true} modelo='aparelho' multiple={true} allowAdditions={false} validate='' />
                    <Campo label='Vacinas' name='vacinacao' tipo='model' disabled={true} modelo='vacina' multiple={true} allowAdditions={false} validate='' />
                    <Campo label='Aldeias' name='aldeiaindigena_set' tipo='model' disabled={true} modelo='aldeiaindigena' multiple={true} allowAdditions={false} validate='' /> */}

                    </Formulario>
            </div>
          
            { this.props.id != 0 &&
           
            <div className='col-xs-6 col-sm-5 col-sm-5 lateral-info'>

                <div className='box mt1'> 
               <ListaSection titulo="Nome"
                                modelo="nomeindigena"
                                options={ {indigena:this.props.itens._id} }
                                initialValues={ {indigena:this.props.itens._id} }
                                onSaveOptions={ {indigena:this.props.itens._id} }
                                />
                </div>

                <div className='box mt3'> 
               <ListaSection titulo="Aldeias"
                                modelo="aldeiaindigena"
                                template="aldeiaindigenaIndio"
                                options={ {include:['aldeia__nome','aldeia__id'],indigena:this.props.itens._id} }
                                initialValues={ {indigena:this.props.itens._id} }
                                onSaveOptions={ {indigena:this.props.itens._id} }
                                />
                </div>

                 <div className='box mt3'> 
               <ListaSection titulo="Filiação"
                                modelo="filiacao"
                                options={ {filho:this.props.itens._id} }
                                initialValues={ {filho:this.props.itens._id} }
                                onSaveOptions={ {filho:this.props.itens._id} }
                                />
                </div>

                <div className='box mt3'> 
                <ListaSection titulo="Vacinação"
                                modelo="vacinacao"
                                options={{include:['vacina'],indigena:this.props.itens._id}}
                                initialValues={ {indigena:this.props.itens._id} }
                                onSaveOptions={ {indigena:this.props.itens._id} }
                                />
                </div>
                <div className='box mt3'> 
                <ListaSection titulo="Anamnese"
                                modelo="anamnese"
                                options={{indigena:this.props.itens._id}}
                                initialValues={ {indigena:this.props.itens._id} }
                                onSaveOptions={ {indigena:this.props.itens._id} }
                                />
                </div>


            </div>
           
           ||

             <div className='col-xs-6 col-sm-5 col-sm-5 tac'>
                    <center className="fs1 gray" > Salve o Indigina para incluir mais informações </center>
            </div>
            
            }
        
        </div>
        )
  }
}
