import _ from 'lodash'
import React, {  Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Header, Dropdown, Form, Label, List, Radio, Checkbox, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import { Field, Fields, FieldArray , reduxForm, SubmissionError } from 'redux-form';

import {DayPicker, SingleDatePicker} from 'react-dates';

import StringMask from 'string-mask';

import StringFormatValidation from 'string-format-validation'

import { connect } from 'react-redux';

import { si3, si3Actions }  from 'actions/index';

import * as util from 'util/s3util'
import moment from 'moment'
import { createSelector } from 'reselect'
import enhanceWithClickOutside from 'react-click-outside';
import ReactPlayer from 'react-player'
// import { ModalYesNo } from 'components/modals';
import { Map, Marker, Popup, TileLayer, LayersControl, FeatureGroup, Circle, GeoJSON } from 'react-leaflet';

import Draw from 'leaflet-draw'; // eslint-disable-line

import {FormField, InputDate} from 'components/formfields/index'

import wkx from 'wkx';





const S3Input = (props) => (
    <Form.Field>
      <label>First Name</label>
      <Input placeholder='First Name' />
    </Form.Field>
 )






// //  FORM FIELD BASE
// //---------------------------
// //A base dos forms Fields
// //define as classes, se alterou, dirty, prisme etc.
// //erros, legendas, ajudas etc tb
// //recebe um formfilte como o elemento principal
// class FormField extends React.Component {


//   static defaultProps = {
//     subField: false,
//     req:false,
//     tipo: ''
//   };


//   render () {
//     let { input, label, subField, meta: { touched, error, valid, dirty, active }, ...custom } = this.props;
    
//     let classname = this.props.className || ''
//     classname += (touched && error) && " erro" || ""
//     classname += ((touched && valid) && " valid") || ''
//     classname += (dirty && " dirty") || ""
//     classname += (active && " active") || ""
//     classname += (subField && " subfield") || ""

//     if(input.value != '' ){
//         classname += " preenchido"
//     }


//    if( this.props.tipo == 'input' && input.value === 0){
//       classname += " preenchido"
//    }



//     return (
//        <Form.Field className={classname+' fieldnormal' }>
        

//         {(label != '') &&
//            <label className='ui label '><i className="fa fa-exclamation-triangle" />{label}{custom.req && '*'}</label>
//         }


//         {this.props.children}

//         {(touched && error) &&  
//           <Label className='label-erro' basic pointing>{error}</Label>
//         }

//        {(this.props.dica) &&  
//           <div className='fs07 ui label-dica'>{this.props.dica}</div>
//         }

//        </Form.Field>
//     );

//   }
// }









// FieldSet - Agrupa um bando defields
//---------------------------


// export class Fieldset extends React.Component {

//     renderChildren = ()=>{      
//         return React.Children.map(this.props.children, child => {
//             if (child.type === Field)
//               return React.cloneElement(child, {
//                 subField: true,
//                 placeholder:child.props.label
//               })
//             else
//               return child
//           })
//     }

//     render(){
//         const {label,...custom } = this.props;
//         return (
//            <Form.Field className='fieldset'>
            
//             {(label != '') &&
//                <label className='ui label' ><i className="fa fa-exclamation-triangle" />{label}{custom.req && '*'}</label>
//             }

//             <div className='fields mt-2'>
//               {this.renderChildren()}
//             </div>
//            </Form.Field>
//         );

//     }

// }









// Input Text Area
//---------------------------

// export class InputTextArea extends React.Component {

//   componentDidMount(){
//     //faco a altura inicial ficar conforme o conteudo
//     if(this.input){
//         $(this.input).height( 'auto' ).height( this.input.scrollHeight );
//     }
//   }
//   render (){
//      const { input, label, meta: { touched, error, valid, dirty }, ...custom } = this.props;
//      delete custom.req
//      return (
//         <FormField {...this.props}>
//             <div className="ui fluid input">
//               <textarea rows="1" className='autoheight ui fluid input lh11'  {...input} {...custom} 
//                ref={(input) => this.input = input}
//               />
//             </div>
//          </FormField>
//       )
//    }

//  }



// Endereco
// Textearea com a busca do CEP
//---------------------------


// export class InputEndereco extends React.Component {

//   state = { dicaCEP:'Digite no inicio o CEP para buscar endereco'};

//   mesagemCEP = (msg,delay=6000) =>{
    
//     this.setState({dicaCEP:msg})

//     setTimeout(()=>{
//       this.setState({dicaCEP:'Digite no inicio o CEP para buscar endereco'})
//     }
//     ,delay
//     )
//   }

//   getCEP = (e) => {
//         //pego o valor
//         const v = e.target.value;
//         const text = e.currentTarget;

//         if( v.match(/^\d\d\d\d\d-?\d\d\d/) ){
//             const valueori=v;
//             const num = v.replace(/[^\d]/,'')
//             this.mesagemCEP('Buscando endereço...')

//             $.getJSON( ('http://viacep.com.br/ws/'+num+'/json/') )
//             .then((data) =>{
//                 if(data.erro){
//                     this.mesagemCEP('CEP Inválido')
//                 }else{
//                       // LETODO - FORMATAR MELHOR O ENDERECO< VERIFICANDO UNDEFINED ETC
//                       let endereco = `${data.logradouro}  Nº:   \n${data.bairro} - ${data.localidade}/${data.uf}\nCEP:${data.cep}`;
//                       // this.props.change(field,endereco)
//                       this.props.input.onChange(endereco)
//                       this.setState({dicaCEP:'Digite no inicio o CEP para buscar endereco'})
//                       setTimeout(
//                         ()=>{
//                           $(text).height( 'auto' ).height( text.scrollHeight );
//                           $(text).focus().selectRange(data.logradouro.length+5,data.logradouro.length+7)
//                         },200)
//                       }
//                 }
//             ).catch(()=>{
//                   this.mesagemCEP('Erro na busca do endereço')
//             })
//         }
//         this.props.input.onChange(v)
//   }


//   componentDidMount(){
//     //faco a altura inicial ficar conforme o conteudo
//     if(this.input){
//         $(this.input).height( 'auto' ).height( this.input.scrollHeight );
//     }
//   }


//   render (){
//      const { input, label, meta: { touched, error, valid, dirty }, ...custom } = this.props;
//        delete custom.req
//      // let valuefinal = this.getCEP()

//      return (
//         <FormField {...this.props} dica={this.state.dicaCEP} >
//             <div className="ui fluid input">
//               <textarea rows="1" className='autoheight ui fluid input lh11'  {...input} {...custom} 
//                 autoComplete="off" 
//                 autoCorrect='off' 
//                 spellCheck="false"
//                 onChange={(e)=>{this.getCEP(e)}}
//                 ref={(input) => this.input = input}
//               />
//             </div>
//          </FormField>
//       )
//    }



// }













// Input CHECKBOX
//---------------------------

// export class InputCheckbox extends React.Component {

//    render (){
//      const { input, label, meta: { touched, error, valid, dirty }, ...custom } = this.props;
//            delete custom.req
//      return(
//          <FormField {...this.props} label=''>
//                 <label><i className="fa fa-exclamation-triangle" /> 
//                 <Checkbox checked={input.value ? true : false} onClick={()=>{ input.onChange(!input.value)}} label={label}  /> {custom.req && '*'}</label>
//           </FormField>
//       )
//     }
// }





// // Input Radio
// //---------------------------
// //

// export class InputRadio extends React.Component {
//    render (){
//      const { input, label, meta: { touched, error, valid, dirty }, ...custom } = this.props;
//            delete custom.req
//      return(
//          <FormField {...this.props} label=''>
//                 <label><i className="fa fa-exclamation-triangle" /> 
//                 <Radio checked={input.value ? true : false} onClick={()=>{ input.onChange(!input.value)}} label={label}  />{custom.req && '*'}</label>
//           </FormField>
//       )
//     }
// }





// // Grupo de Radio
// //---------------------------



// export class RadioButtonGroup extends Component {
 
//   constructor(props){
//       super(props) 
//       this.state = {
//           numberCheckedRadioButtons: 0,
//           selected: '',
//       };
//   }

//   componentWillMount() {

//     let cnt = 0;
//     let selected = '';
//     let {valueSelected, defaultSelected} = this.props;
    
//     valueSelected = this.props.input.value;
    
//     if(valueSelected !== undefined && valueSelected != '' ) {
//       selected = valueSelected;
//     } else if (defaultSelected !== undefined) {
//       selected = defaultSelected;
//     }

//     React.Children.forEach(this.props.children, (option) => {
//       if (this.hasCheckAttribute(option)) cnt++;
//     }, this);

//     this.setState({
//       numberCheckedRadioButtons: cnt,
//       selected,
//     });
//   }


//   componentWillReceiveProps(nextProps) {
//     let valueSelected = nextProps.input.value;
//     if (valueSelected) {
//       this.setState({
//         selected: valueSelected,
//       });
//     }

//   }

//   hasCheckAttribute(radioButton) {
//     return radioButton.props.hasOwnProperty('checked') &&
//       radioButton.props.checked;
//   }

//   updateRadioButtons(newSelection) {
//     if (this.state.numberCheckedRadioButtons === 0) {
//       this.setState({selected: newSelection});
//     } else {
//       warning(false, `Material-UI: Cannot select a different radio button while another radio button
//         has the 'checked' property set to true.`);
//     }
//   }

//   handleChange(event, newSelection){
//     this.updateRadioButtons(newSelection.value);
//     // Successful update
//     if (this.state.numberCheckedRadioButtons === 0) {
//       if (this.props.input.onChange) this.props.input.onChange(newSelection.value);
//       if (this.props.onChange) this.props.onChange(newSelection.value);
    
//     }
//   };

//   getSelectedValue() {
//     return this.state.selected;
//   }

//   setSelectedValue(newSelectionValue) {
//     this.updateRadioButtons(newSelectionValue);
//   }

//   clearValue() {
//     this.setSelectedValue('');
//   }

//   render() {

//    const { input, label, meta: { touched, error, valid, dirty }, ...custom } = this.props;
//       delete custom.req

//     const options = React.Children.map(this.props.children, (option) => {
//       const {
//         name, // eslint-disable-line no-unused-vars
//         value, // eslint-disable-line no-unused-vars
//         label, // eslint-disable-line no-unused-vars
//         onCheck, // eslint-disable-line no-unused-vars
//         ...other
//       } = option.props;




//       return (
//        <div className={"ui fluid input radio mt1 "+ (this.props.label  != '' && 'sub') }>
//           <Radio
//           {...other}
//           // ref={option.props.value}
//           name={this.props.name}
//           key={option.props.value}
//           value={option.props.value}
//           label={option.props.label}
//           labelPosition={this.props.labelPosition}
//           onChange={this.handleChange.bind(this)}
//           checked={option.props.value == this.state.selected}
//         /></div>
//       );
//     }, this);

//     return (
//        <FormField className='ui radiogroup' {...this.props} >
//         {options}
//       </FormField>
//     );
//   }
// }









// // Input File
// //---------------------------

// export class InputFile extends React.Component {

//   constructor(props) {
//     super(props)
//     this.onChange = this.onChange.bind(this)
//     this.mostraArquivo = this.mostraArquivo.bind(this)
//     this.state={arquivo:''}
//     this.preventDefault = this.preventDefault.bind(this);

//   }

//   onChange(e) {
//     const { input: { onChange } } = this.props
//     onChange(e.target.files[0])
//     this.mostraArquivo(e.target.files[0])
//   }

//   mostraArquivo(file){
//        let reader = new FileReader();

//        reader.onload = (e) => {
//             var src = reader.result;
//             this.setState({'arquivo':src})
//         }
//        reader.readAsDataURL(file);
//   }

//   preventDefault(event) {
//     event.preventDefault();
//   }

//   componentWillReceiveProps(prevprops, currentprops){

//   }




//   dragOver(event) {
//     event.preventDefault();
//     $(this.dropI).addClass('hover')
//   }

//   dragOut(event) {
//     event.preventDefault();
//     $(this.dropI).removeClass('hover')
//   }

//   drop(event){
//     const { input: { onChange } } = this.props
//     event.preventDefault();
//     var file;
//     // return false;
//     try {
//       file = event.dataTransfer.files[0];
//       onChange(file)
//       this.mostraArquivo(file)
//     } catch (e) {
//       // If the text data isn't parsable we'll just ignore it.
//       return;
//     }
//     $(this.dropI).removeClass('hover')
//   }

//   render() {
//     const { input: { value } } = this.props;
//     const { label, meta: { touched, error, valid, dirty }, ...custom } = this.props
//           delete custom.req
//     //se o valor for uma imagem
//     let imagem='';
//     if(value !='' && this.state.arquivo ==''){
//       imagem = value
//     }else{
//       imagem = this.state.arquivo
//     }

//     return (

//        <FormField className='ui radiogroup' {...this.props} >
          
//           <div>
//               <input
//               style={{display:'none'}}
//               fluid
//               type="file"
//               onChange={this.onChange}
//               ref={(input) => this.fileInput = input}
//               />
         
//             <div ref={(i)=>this.dropI = i} 
//              onDragOver={(event)=>event.preventDefault()}
//              onDragEnter={this.dragOver.bind(this)}
//              onDragLeave={this.dragOut.bind(this)}
//              onDrop={this.drop.bind(this)}
//              onClick={ () => this.fileInput.click() } 
//              className='ui foto foto-circular small'>
//                 <div className='a-foto' style={{backgroundImage:'url('+imagem+')' }}></div>
//                 <Label> selecionar foto </Label>
//             </div>
         
//          </div>
  
//      </FormField>
//     )
//   }
// }







//Input SELECT MODEL
//---------------------------


// class InputSelectModel extends React.Component {
 
//   state = {
//       isFetching: true,
//       multiple: true,
//       search: true,
//       searchQuery: null,
//       value: [],
//       options: [],
//       currentValue: '',
//       valueKey:'id'
//   }


//   componentWillMount() {
//       //carrego todas as opcoes do modelo
//       if(this.props.valueKey)
//         this.state = {...this.state,valueKey:this.props.valueKey}
//   }

//   componentDidMount(){

//       this.props.load(this.props.modelo)
//       .then( ()=>this.setState({isFetching: false}) )
//   }


//   handleSearchChange = (e, value) => this.setState({ searchQuery: value })

  
//   handleAddition = function(e, { value }){
//         //adiciono no servidor
       
//         return e;
//     }

//   handleChange = (e, { value }) => {

//       //LETODO aqui so change se o valor existir na api
//       this.props.input.onChange(value);
//   }


//   onAddItem = (e, { value }) => {
//     console.log("=====VALUE ADD=======")
//     console.log(value)
//     e.preventDefault;
//     return false;
//   }


//   createOptions = (o) => {
//       return {text: o.nome, value:o[this.state.valueKey],
//       children:<div> 
//                  {" "+o.nome} <small className='gray fs07 fw100'>
//                     <br /> {o.descricao}
//               </small></div>
//        }
//   }


//   render (){

//     const { input, label, meta: { touched, error, valid, dirty }, ...custom } = this.props;
//     const { currentValue, multiple, options, isFetching, search, value } = this.state
//     delete custom.req
    
//     let opcoes = [];

//     const tipo = this.props.modelo

//     if( _.has( this.props.api.entities, tipo) ){
//       opcoes = si3.filterItens(si3.serializeModel(this.props.api.entities[tipo],tipo,this.props.api.entities),{nome:''},["nome"]);
//     }

//     opcoes = _.map(opcoes, (o) => this.createOptions(o))

//     const valor = input.value
//     console.log("=====VALUE=======")
//     console.log(valor)
    

//     return (
//         <FormField {...this.props}>
     
//            <Dropdown
//             options={opcoes}
//             {...input} {...custom}
//             placeholder={this.props.placeholder}
//             value={valor}
//             onChange={this.handleChange}
//             onAddItem={this.onAddItem}
//             onBlur={(e)=>input.onBlur(valor)}
//             search
//             selection
//             fluid
//             allowAdditions
//             additionLabel="Adicionar:"
//           />


//        </FormField>
//     );
//   }

// }

// //esta ligado ao Store
// const InputSelectModelCon = connect( (state, ownprops)=> {return {
//   api:state.api,
//  }} , si3Actions)(InputSelectModel)

// export {InputSelectModelCon as InputSelectModel} 





























export { S3Input as Input}





