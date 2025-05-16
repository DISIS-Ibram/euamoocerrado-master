// import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {Icon} from 'semantic-ui-react';

import FormField from 'components/formfields/FormField'






// Input File
//---------------------------

export default class InputFile extends React.Component {


  static defaultProps = {
    imagem: false,
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.mostraArquivo = this.mostraArquivo.bind(this)
   
    this.state = {
      arquivo: props.input.value,
      imagem:props.imagem
    }
    this.preventDefault = this.preventDefault.bind(this);

  }

  onChange(e) {
    // debugger;
    const {input: {onChange}} = this.props
    onChange(e.target.files[0])
    // this.props.input.onChange("aaaa")
    this.mostraArquivo(e.target.files[0])
  }

  removeFile = ()=>{
     this.props.input.onChange(null);
     this.setState({arquivo:'',imagem:this.props.imagem})
  }

  viewFile = (e)=>{
     window.open(this.props.input.value, '_blank')
  }


  mostraArquivo(file) {
    let reader = new FileReader();
    reader.onload = (e) => {
      var src = reader.result;
      this.setState({
        'arquivo': src,
        'imagem': true
      })
    }
    reader.readAsDataURL(file);

  }

  preventDefault(event) {
    event.preventDefault();
  }

  componentWillReceiveProps(prevprops, currentprops) {}

  dragOver(event) {
    event.preventDefault();
    $(this.dropI).addClass('hover')
  }

  dragOut(event) {
    event.preventDefault();
    $(this.dropI).removeClass('hover')
  }

  drop(event) {
    const {input: {onChange}} = this.props
    event.preventDefault();
    var file;
    // return false;
    try {
      file = event.dataTransfer.files[0];
      onChange(file)
       
       if(file.type.match(/image/)){
          //checo para ver se é imagem
          this.mostraArquivo(file)
       }else{
           this.setState({
              'arquivo': file.name,
              'imagem': false
          })
       }
   
  
 } catch (e) {
      // If the text data isn't parsable we'll just ignore it.
      return;
    }
    $(this.dropI).removeClass('hover')
  }



  render() {
    const {input: {value}} = this.props;
    const {label, meta: {touched, error, valid, dirty}, ...custom} = this.props
    delete custom.req

    //se o valor for uma imagem
    let imagem = '';

    if (value != '' && this.state.arquivo == '') {
      imagem = value
    } else {
      imagem = this.state.arquivo
    }

    let ehImagem = this.state.imagem;
    
    let nomeArquivo = ""
    let tipoArquivo = ""

    // try{
    //     imagem.replace(/.*?([^\/]*?$)/,'$1');
    //     tipoArquivo = imagem.replace(/.*?([^.]*?$)/,'$1');

    //     if(tipoArquivo.toLowerCase() === 'pdf'){
    //         nomeArquivo = (<span><i className='fa fa-file-pdf-o'></i> {nomeArquivo}</span>);

    //     }else if(tipoArquivo.toLowerCase() === 'doc' || tipoArquivo.toLowerCase() === 'docx'){
    //         nomeArquivo = (<span><i className='fa fa-file-word-o'></i> {nomeArquivo}</span>);
        
    //     }else if(tipoArquivo.toLowerCase() === 'xsl' || tipoArquivo.toLowerCase() === 'xslx'){
    //         nomeArquivo = (<span><i className='fa fa-file-excel-o'></i> {nomeArquivo}</span>);
      
    //     }else if(tipoArquivo.toLowerCase() === 'jpg' || tipoArquivo.toLowerCase() === 'png'){
    //         ehImagem = true;
        
    //   }else{
    //         nomeArquivo = (<span><i className='fa fa-file-o'></i> {nomeArquivo}</span>);
    //   }
    // }catch(e){
    //     console.warn(e)
    // }


    //se resetei o formulario, nao mostro mais a imagem
    if(value === ""){
      imagem = '';
    }




    //LETODO - opcao para limpar a foto ja existente ou selecionada
    return (

      <FormField className='' {...this.props}>

        <div className={"ui fluid input-wrap arquivo-wrap " + (ehImagem && " imagem" || "semimagem") + (imagem !== "" && " comarquivo") }>

          <div className='responsive-wrap'>
         
            {value != '' &&
              <Icon className='removeFile' name="trash" onClick={this.removeFile} size="small" />
            }

            { (_.isString(this.props.input.value) && this.props.input.value != '' ) &&
              <Icon className='viewFile' name="eye" onClick={this.viewFile} size="small" />
            }

            {/*o input escondido */}
            <input style={ { display: 'none' } } 
                fluid type="file" 
                onChange={ this.onChange } 
                ref={ (input) => this.fileInput = input } />


            <div  className='ui arquivo foto-circular small' 
              style={{width:'80px',height:'80px'}}
              ref={ (i) => this.dropI = i } 
              onDragOver={ (event) => event.preventDefault() } 
              onDragEnter={ this.dragOver.bind(this) } 
              onDragLeave={ this.dragOut.bind(this) } 
              onDrop={ this.drop.bind(this) } 
              onClick={ () => this.fileInput.click() }
             >
         
                  <div className='a-foto' style={ { backgroundImage: 'url(' + imagem + ')' } }></div>
                  
                   {value != '' &&
                       <div className='ui label nomeArquivo'> {nomeArquivo} </div>
                   ||

                    <div className='ui label'> selecionar arquivo </div>
                   }


            </div>
          </div>

        </div>
        {/* {JSON.stringify(this.props.input)} */}

      </FormField>
    )
  }
}




