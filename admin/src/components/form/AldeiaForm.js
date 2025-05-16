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
export default class AldeiaForm extends React.Component{
   
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
                    <Formulario {...this.props} >

                            <Campo label='Nome' name='nome' tipo='texto' req={true} validate='' />
                            <Campo label='Descrição' name='descricao' tipo='textarea' validate='' />
                            <Campo label='Registro' name='registro' tipo='model' modelo='registro' multiple={false} validate='' />
                            
                             <CampoGrupo label="Povo">
                                <Campo label='Povo' name='povo' tipo='model' modelo='povo' multiple={false} validate='' />
                                <Campo label='Há confirmação do povo?' name='confirmacao_povo' tipo='checkbox' validate='' />
                            </CampoGrupo>
                            
                            <CampoGrupo label="Língua">
                                <Campo label='Língua' name='lingua' tipo='model' modelo='lingua' multiple={false} validate='' />
                                <Campo label='Há confirmação da língua?' name='confirmacao_lingua' tipo='checkbox' validate='' />
                            </CampoGrupo>
                            
                            <Campo label='Localização' name='localizacao' tipo='geopoint' req={true} validate='' />
                            <Campo label='Estado' name='estado' tipo='model' modelo='estado' multiple={false} className='undefined hidden' validate='' />
                            <Campo label='Municipio' name='municipio' tipo='model' modelo='municipio' multiple={false} className='undefined hidden' validate='' />
                            <Campo label='Mídias' name='colecao_midia' tipo='midia' validate='' />
                            <Campo label='Terra Indígena' name='terra_indigena' tipo='model' modelo='terraindigena' multiple={true} className='undefined hidden' validate='' />
                            <Campo label='Eventos' name='ocorrencia_set' tipo='model' disabled={true} modelo='ocorrencia' multiple={true} allowAdditions={false} validate='' />
                            <Campo label='População' name='aldeiaindigena_set' tipo='model' disabled={true} modelo='aldeiaindigena' multiple={true} allowAdditions={false} validate='' />

                    </Formulario>
            </div>
          
            { this.props.id != 0 &&
           
            <div className='col-xs-6 col-sm-5 col-sm-5 lateral-info'>

                <div className='box mt2'> 
               <ListaSection titulo="Indígenas"
                                modelo="aldeiaindigena"
                                options={ {aldeia:this.props.itens._id} }
                                initialValues={ {aldeia:this.props.itens._id} }
                                onSaveOptions={ {aldeia:this.props.itens._id} }
                                />
                </div>


                <div className='box mt3'> 
                <ListaSection titulo="Eventos/Ocorrências"
                                modelo="ocorrencia"
                                options={{aldeia:this.props.itens._id}}
                                initialValues={ {aldeia:this.props.itens._id} }
                                onSaveOptions={ {aldeia:this.props.itens._id} }
                                />
                </div>

                <div className='box mt3'> 
                <ListaSection titulo="Políticas Publicas Acessadas"
                                modelo="politicapublicaacessada"
                                options={{include:['programa__nome'],aldeia:this.props.itens._id}}
                                initialValues={ {aldeia:this.props.itens._id} }
                                onSaveOptions={ {aldeia:this.props.itens._id} }
                                />
                </div>


            </div>
           
           ||

             <div className='col-xs-6 col-sm-5 col-sm-5 tac'>
                    <center className="fs1 gray" > Salve a Aldeia para incluir a População </center>
            </div>
            
            }
        
        </div>
        )
  }
}
