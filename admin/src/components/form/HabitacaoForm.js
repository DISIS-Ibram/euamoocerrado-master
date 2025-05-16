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



const _debug = true;
const myconsole = criaconsole(_debug,' === FpeForm.js | ', 'color:orange; font-weight:bold')





@formHoc
export default class HabitacaoForm extends React.Component{
   
  static defaultProps = {
        modelo: "habitacao",
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
              <div className='col-xs-12'>
                    <Formulario {...this.props} >
                    </Formulario>
            </div>
        
        </div>
        )
  }
}
