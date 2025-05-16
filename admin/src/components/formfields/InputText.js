import React, {  Component, PropTypes } from 'react'
import {  Input } from 'semantic-ui-react';
import { Field } from 'redux-form';
// import StringFormatValidation from 'string-format-validation'
import FormField from "./FormField"
import InputElement from "react-input-mask"
import onlyDOMProps from 'util/onlyDOMProps'

// Input Text
//---------------------------
export default class InputText extends React.Component {
 
  //existe a situação que temos um valor, mas mostramos so um placeholder,
  //isso para quando tem um valor padrao interno
  //nesse caso so trocamos o vamos padrao interno quando escrevemos
   
  static defaultProps = {
    valueInvisible:'',   //valor que nao mostro quando esta parecido, mas fica sendo o valor interno
    req:false
  }

  change = (e) => {
      this.props.input.onChange(e.target.value)
      if(this.props._onChange)
        this.props._onChange(e)
  }

  componentWillReceiveProps(nextProps){
      const { valueInvisible, input} = this.props;  
      if(nextProps.input.value =='' && valueInvisible!=''){
          input.onChange(valueInvisible) 
      }
  }

  render (){
    
    let { maxChar, req, valueInvisible, input, label, meta: { touched, error, valid, dirty }, ...custom } = this.props;

    let valor;
    if(input.value == valueInvisible){
      valor = "";
    }else{
      valor = input.value;
    }

    // if(this.props.req && this.props.subField){
    //   custom.placeholder += "*"
    // }
    custom.placeholder = ""

    return (
        <FormField {...this.props} tipo='input'>
                

          <div className="ui fluid input input-wrap">

                <InputElement type="text"  
                       id={"input-"+input.name}
                       disabled={this.props.disabled} 
                       {...input} 
                       {...onlyDOMProps(custom)} 
                       onChange={this.change}
                       value={valor} 
                       autoCorrect="false"
                       spellCheck="false"
                       autoComplete="false"
                       />

            <div className='ui icon icone'> { this.props.icone && this.props.icone || <i className=''></i> } </div>

          </div>



                {/* <Input disabled={this.props.disabled} fluid {...input} {...custom} 
                 onChange={this.change}
                 value={valor}
                 />
                    */}      
          

       </FormField>

    );
  }

}

