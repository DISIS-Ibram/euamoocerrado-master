import React from 'react';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Grid, Divider, Form, Label, Input } from 'semantic-ui-react'
import * as S3 from '../components/elements';
import * as _  from 'lodash';
import ColetaniaMidia from 'components/elements/ColetaniaMidia';

import { Field, Fields, FieldArray , reduxForm, SubmissionError } from 'redux-form';

import { si3, si3Actions }  from 'actions/index';

import { InputGeoPoint, InputDate, InputText } from 'components/formfields/index'
import AutoForm from 'components/form/AutoForm'

import Formulario from 'components/Formulario'
import formHoc from 'hocs/formularioHoc'
import {Campo, CampoGrupo } from 'components/formfields'


/**
 * Home page component
 */
export default class Home extends React.Component {

  componentDidMount() {
    // this.props.load('relatos')
      document.title = "SI3RC :: Início";
  
  }


  render() {

      return(
         <div>                
                <Grid>
                    <Grid.Column width={1}>
                    </Grid.Column>
                     <Grid.Column width={15} className='conteudo '>
                    

                     <ColecaoForm  />
                
                    </Grid.Column>
                </Grid>
            </div>

        )
   
  }


}



// Colecao FORM
//---------------------------
@formHoc
class ColecaoForm extends React.Component {

  static defaultProps = {
      nomeTemplate : '_colecao_midia',
      modelo:"colecao",
      id:8,
      autoForm:false,
      loadFormOptions:true, 
      modeloBase:{
          nome:'',
          descricao:'',
          autor:'',
          data:'',
          geom:'',
          midia_set:[]
      }
  }

  antesDeSalvar(values){
    console.log("Antes de Salva Values",values)
    delete values.midia_set;
    delete values.tags;
    return values;
  }
  
  depoisDeSalvar(response, dispache){
      console.log("%cresponse: %o",'color:red;font-size:40px',response)
  }

 render(){
    return (
       <div>
        
       </div>
  
    )
  }
}








