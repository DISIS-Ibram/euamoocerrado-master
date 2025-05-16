import React from 'react';
import _  from 'lodash';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import CPF from 'gerador-validador-cpf'
//import { withRouter, Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';




import Formulario from 'components/Formulario'
import formHoc from 'hocs/formularioHoc'
import {Campo, CampoGrupo} from 'components/formfields'



const _debug = true;

const myconsole = (function(_debug = true){
  var obj = {}
  for(var o in window.console){
      if(_debug){
          obj[o] = window.console[o]
      }else{
          obj[o] = ()=>{return false}
      }
  }
  return obj
})(_debug)




@formHoc
export default class PessoasForm extends React.Component{
   
  static defaultProps = {
        modelo: "pessoa",
        autoForm:false,
        loadFormOptions:false
  } 

  state = {
    usuario:false,
  }

  static modeloBase = { 
    senha:'' 
  }

  componentWillMount(){

      if(this.props.itens.usuario_s)
        this.state.usuario = true

  }

  validar(values){
        myconsole.count('validate Pessoa Form')
        const errors = {}
        return errors
  }

  antesDeSalvar(values){
    // debugger;

        myconsole.log("Antes salvar no Component")

        if(!values.senha && values._new){
          values.senha
        }

        if(!values.senha && !values._new){
          delete values.senha
        }

        // debugger;
        delete values.senha 

        //removo a foto se é so uma senha
        //nao preciso mais pq o patch tira essa possibilidade
        // if(_.isString(values.foto)){
        //     delete values.foto
        // }

        return values;
  }



  //os anchange do formulário
  onChange(){
       myconsole.count(" PessoasForm - onChange")
  }

  
  
  render(){
      myconsole.log("%%%%%%%%%%%%%%%  RENDER DO PESSOA FORM",this.props);

      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
      return (  
            <Formulario {...this.props} >
                        
             
                          <div className='row'>
                          
                           <div className='col-xs-12 col-sm-2'>
                              <div style={{width:'90%',maxWidth:128}}>
                               {/* <Campo label="Foto" name="foto" tipo="arquivo"/> */}
                              </div>                           
                           </div>

                           <div className='col-xs-12 col-sm-8'>

                            
                                  {/* <Campo disabled={this.props.id != 0} req name="cpf" tipo="texto" label="CPF" mask="999.999.999-99" maskChar="0"  maxChar="15" parse={ (v)=>{ return v.replace(/[^\d]/g, '') } } /> */}

                                  <Campo req name="first_name" tipo="texto" label="Nome"/>

                                  <Campo  email name="email" tipo="texto" label="Email"/>
                                 
                                  {/* <Campo  name="telefone" tipo="texto" label="Telefone" mask="(99) 9999-99999" maskChar=" "/>

                                  <Campo name="matricula" tipo="texto" label="Matrícula"/> */}
                            
                             
                                  {/* <Campo  name="endereco" tipo="endereco" label="Endereço"  /> */}
  
                                  {/* <Campo tipo="RadioGrupo"  label="Tipo de acesso" onChange={ v=>this.setState({usuario:v})} name="usuario_s" defaultSelected={false} >
                                        <Campo tipo="radio" value={false} label="Colaborador" />
                                        <Campo tipo="radio" value={true} label="Usuário" />
                                  </Campo> */}

                                 
                                  <Campo className='sub' name="is_superuser" tipo="checkbox" value='true' label="Administrador"/>
                                  {/* <Campo className='sub' name="is_superuser" tipo="checkbox" value='true' label="Administrador"/> */}



                                  <Campo placeholder='Digite uma senha' name="password_new" tipo="text" type="password" label="Senha" />
                                         

                                         

                                 
                          
                           </div>

                      </div>
            </Formulario>
        )
  }
}











//Validations
//========================

// const validate = values => {
//   const errors = {}
//   const requiredFields = [ 'nome', 'cpf', 'email','foto']

//   requiredFields.forEach(field => {
//     if (!values[ field ]) {
//       errors[ field ] = 'Preenchimento Obrigatório'
//     }
//   })

//   if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
//     errors.email = 'Formato de email inválido'
//   }
  
//   if(values['cpf'] && !CPF.validate(values['cpf'])){
//       errors.cpf = 'CPF inválido'
//   }

//   return errors
// }


// const formataCPF = (value) => {
//   //pego so os numeros
//   var num = value //.replace(/[^\d]/g, '')
//   var mask = '000.000.000-00';
//   var formatter = new StringMask(mask,{reverse: false});
//   var result = formatter.apply(num);
//   //se a variavel termina com um caractere da mascara, remove ele para o backspace funcionar
//   result = result.replace(/[.-]*$/,'')
//   return result;      
// }


// const formataTel = (value) => {
//   //pego so os numeros
//   var num = value.replace(/[^\d]/g, '')
//   var mask = '(00) 00009-00009';
//   var formatter = new StringMask(mask,{reverse: false});
//   var result = formatter.apply(num);
//    result = result.replace(/[.-\s]*$/,'')
//   //se a variavel termina com um caractere da mascara, remove ele para o backspace funcionar
//   // result = result.replace(/[.-\\(\\)]*$/,'')
//   return result;      
// }




// Vantagen HOC
//  extendo um novo cycle
//  o proprio redux form é um hoc

//Vantagens component
//   acesso ao children









