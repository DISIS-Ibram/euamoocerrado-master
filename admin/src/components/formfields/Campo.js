import React from "react";

import { Field, reduxForm, SubmissionError } from "redux-form";
import isArray from "lodash/isArray";

import * as TipoCampos from "./index"; // Com erro

import { Radio } from "semantic-ui-react";
import validacao from "util/validacoes";

const _debug = false;

const myconsole = (function (_debug = true) {
  var obj = {};
  for (var o in window.console) {
    if (_debug) {
      obj[o] = window.console[o];
    } else {
      obj[o] = () => {
        return false;
      };
    }
  }
  return obj;
})(_debug);

// ####################### TESTE #####################################
export default class Campo extends React.Component {
  render() {
    return <h1>Campo.js</h1>;
  }
}
// ####################### TESTE #####################################

// export default class Campo extends React.Component {
//     static type = "Campo"
//     render(){
//          let {validate, tipo, req, requerido, maxChar, minChar, email,...custom} = this.props

//           //verifico as validacoes
//           validate = isArray(validate) ? validate : [];

//           if(req){
//              validate.push( validacao.requerido )
//              custom.req = true; //passo para baixo que é requerido ou nao
//           }

//            if(email){
//              validate.push( validacao.email )
//           }
//           if(maxChar){
//              validate.push( validacao.maxLength(maxChar) )
//           }
//           if(minChar){
//              validate.push( validacao.minLength(maxChar) )
//           }

//           //verifico o tipo do componente
//           tipo = tipo.toLowerCase();
//           let component;

//           if( "inputtext texto text input".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputText

//           }else if("inputdate data date".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputDate

//           }else if("inputcolor color cor".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputColor

//           }else if("inputtextarea textarea areatexto areadetexto textoarea areadetexto".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputTextArea

//           }else if("endereco".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputEndereco

//           }else if("geopoint point ponto mapaponto".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputGeoPoint

//           }else if("arquivo".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputFile

//           }else if("modelo model select".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputSelecaoModelo

//           }else if("checkbox bolleano bollean".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputCheckbox

//           }else if("radiogrupo radiogrup".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputRadioGroup

//           }else if("radio".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputRadio

//           }else if("midia colecao colecao_midia colecaomidia".indexOf(tipo) > -1 ){
//               component=TipoCampos.InputColecaoMidia
//           }else{
//               component = tipo;
//           }

//           myconsole.count("********* RENDER CAMPO *************")
//           myconsole.log("props:",this.props)

//           //converto qualquer onChange para uma versnao interna do onChange
//           let _onChange = custom.onChange;

//            return(
//                <Field {...custom}  component={component} validate={validate} _onChange={_onChange} >
//                      {this.props.children}
//                </Field>
//              )

//     }

// }

// //validate={validate}

// // FieldSet - Agrupa um bando defields
// //---------------------------

// export class CampoGrupo extends React.Component {

//     renderChildren = ()=>{
//         return React.Children.map(this.props.children, child => {
//             if (child.type && child.type === Campo)
//               return React.cloneElement(child, {
//                 subField: true,
//                 // placeholder:child.props.label
//               })
//             else
//               return child
//           })
//     }

//     render(){
//         const {req, label,...custom } = this.props;
//         return (

//            <div className='field fieldnormal campogrupo subgrupo placeholder'>

//           {(label != '') &&
//            <label className='ui label titulo '>
//               <span className='icone-erro erro-icone'><i className="fa fa-exclamation-triangle" /></span> <span className='requerido'>{req && '*'}</span>{label}
//           </label>
//           }

//            {/* <div className='fields campogrupo subgrupo'>*/}
//               {this.renderChildren()}
//         {/*    </div>*/}
//            </div>
//         );

//     }

// }
