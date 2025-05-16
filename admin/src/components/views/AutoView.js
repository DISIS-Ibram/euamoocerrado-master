import React from 'react';
// import { Label, List, Icon, Radio, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
// import * as _  from 'lodash';
// import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';

import formHoc from 'hocs/formularioHoc'
import Formulario from 'components/Formulario.js'
import {Campo, CampoGrupo } from 'components/formfields'

import Tabela from 'components/tabela'
import {Coluna, ItemAttr, If} from 'components/tabelacolunas/coluna'

//Formularios
import * as tables from './index'


import criaconsole from 'util/myconsole'

const _debug = true;
const myconsole = criaconsole(_debug,' *** AutoTable.js | ', 'color:green;font-weight:bold')





// myconsole.log("forms:%o",forms);



class AutoTable extends React.Component{

  static defaultProps = {
      id:0,
      autoForm:true,
      loadFormOptions:true,
      store:window.STORE
  }

  render(){
      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
    let { modelo } = this.props;
    modelo = modelo.toLowerCase();

    if(tables[modelo]){
      const Component = tables[modelo]
      return (
      <div>
        <Component {...this.props} store={window.STORE} />
      </div>
      ) //React.createElement(forms[modelo].type,this.props)
    
    }else{
    
      return (  
        <div>
          <AutoTableComponent {...this.props} />
        </div>       
      )
    }
  }

}




class AutoTableComponent extends React.Component{
  static defaultProps = {
      autoTable:true,
      loadFormOptions:true,
  }
  
  render(){
    
      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
      return (
          <div>
            <Tabela {...this.props} store={window.STORE} id="all">
            </Tabela>
          </div>
        )
  }
}


export default AutoTable;



