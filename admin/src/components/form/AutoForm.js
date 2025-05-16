import React from 'react';
// import { Label, List, Icon, Radio, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
// import * as _  from 'lodash';
// import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';

import formHoc from 'hocs/formularioHoc'
import Formulario from 'components/Formulario.js'
import {Campo, CampoGrupo } from 'components/formfields'

//Formularios
import * as forms from './index'
import criaconsole from 'util/myconsole'

const _debug = true;
const myconsole = criaconsole(_debug,' === AutoForm.js | ', 'color:orange;font-weight:bold')



// myconsole.log("forms:%o",forms);





class AutoForm extends React.Component{

  static defaultProps = {
      id:0,
      autoForm:true,
      loadFormOptions:true,
  }

  render(){
      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
    let { modelo } = this.props;
    modelo = modelo.toLowerCase();

    if(forms[modelo]){
      
      const Component = forms[modelo];

      let p = {...this.props};

      if(p.autoForm) delete p.autoForm

      return <Component {...p} /> //React.createElement(forms[modelo].type,this.props)
    
    }else{
    
      return (  
        <div>
          <AutoFormComponent key={this.props.modelo+this.props.id} {...this.props} />
        </div>       
      )
    }
  }


}






@formHoc
class AutoFormComponent extends React.Component{
  
  static defaultProps = {
      id:0,
      autoForm:true,
      loadFormOptions:true,
  }
  
  render(){


      myconsole.log('autoform modelo: %s id: %s :',this.props.modelo, this.props.id)
      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
      return (  
            <Formulario {...this.props} >
            </Formulario>
        )
  }
}

export default AutoForm;



