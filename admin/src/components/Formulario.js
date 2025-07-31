import React, { Component } from 'react';
import { Loader, Container, Button, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
import map from "lodash/map";
import { withRouter } from 'react-router'
import _  from 'lodash';
import {t,d, SI3RC_MODELS, getModel} from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import { Field,FieldArray, reduxForm, SubmissionError } from 'redux-form';
import carregaModelo from 'hocs/carregaModelo'
import { Campo } from 'components/formfields'
import validacao from 'util/validacoes'

import criaconsole from 'util/myconsole'
const _debug = false;
const myconsole = criaconsole(_debug,' *** Formulario.js | ', 'color:green;font-weight:bold')





// @connect(null,si3Actions)
export default class Formulario extends Component{

  static defaultProps = {
          titulo:'',
          tipo:'normal', // small, placeholder, compacto
          autoForm:false,   //se autoform true, gera automaticamente o formulario
          loadFormOptions:true,
          exclude:[],                // se tiver algum ghild tipo Campo, usao fornecido ao inves do automatico
          deletable:false,  //se pode deletar ou nao, aparece icone de deletar quando Hover
          butoesOnPristine: false,
          resetAfterSave: false,
          showReset:true,
          salvarLabel:'Salvar',
          salvandoLabel:'Salvando...',
          salvoLabel:'Salvo',
          criarLabel:'Salvo',
          
          value:{} //é o Default Value para usar
    }

  camposEncontrados = [];

  constructor(props){
    super(props)
    myconsole.log(" contructo | props:%o",props)

  //   // this.exclude = 
  }



  //Transversa toda a tree atras de componentes "Campo" e processa eles de acordo
  processaCamposApi = (campos,bag) => {
      // return campos;

      // return React.Children.map(campos,(elm)=>{
      //       return elm
      // })
      return React.Children.map(campos,(elm)=>{

                if(!elm) return elm;
                if(!elm.type) return elm;

                if( elm.type === Campo ){                  
                  this.camposEncontrados.push(elm.props.name);
                  return this.criaValidacaoEtcNoCampo(elm);
                }
                
                if ( _.has(elm.props,'children') ){
                  //retorno um novo elemento com o child processado tb, recursivamento isso funciona
                  let children = this.processaCamposApi(elm.props.children)
                  return React.cloneElement(elm,{children:children})
               
                }else{
                  return elm
                }
      })
  }






  criaCamposApi = ()=>{

       const opcoes = this.props.formOptions;

       var campos = [];

       campos = _.map(opcoes,(v,k)=>{
                    
                
                    // myconsole.log( "%c EXCLUD PROPS %o, k:%o", "font-size:40px;color:red;", this.props.exclude, k )
                    if( _.some(this.props.exclude,v=>v===k) ){
                        return false;
                    } 

                    //Exclude os que estiverem configurado nos models
                    var model = getModel(this.props.modelo)
                    if(_.has(model,'form.exclude') ){
                         if( _.some(model.form.exclude,v=>v===k) ){
                            return false;
                         } 
                    }


             
                    let tipo = "texto"
                    let adicionalProps={};


                   
                    if(v.read_only === true){
                        adicionalProps.disabled = true;
                    }
                    
                    switch(v.type.toLowerCase()){    
                        case  "string":
                            tipo = "texto"

                            if(v.max_length === undefined){
                                tipo = "textarea"  
                            }
                            if(v.max_length  && v.max_length > 350){
                                tipo = "textarea"
                            }
                            if(k=="link"){ //pq a api tras um max_length muito grande para o link
                                tipo = "input"
                            }

                            if(k.match(/endere.o/gi)){
                                tipo = "endereco"
                            }
                            break;
                        
                        case  "integer":
                            tipo = "texto";
                             //LETODO - criar campo tipo number mesmo
                             adicionalProps.type = "number" 
                            break;
                        
                        case "date":
                            tipo = "data"
                            break;
                        
                        case "datetime":
                            tipo = "data"
                            break;
                        
                        case "choice":
                  
                            tipo = "radiogrupo"
                            adicionalProps.choices = v.choices

                            // if(v.choices.length > 3){
                            // tipo = "selecao"
                            // }
                            break;
                        
                        case "boolean":
                            tipo = "checkbox"
                            break;
                        
                        case "image upload":
                            tipo = "arquivo"
                            adicionalProps.imagem = true;
                            break;
                        
                        case "file upload":
                            tipo = "arquivo"
                            adicionalProps.imagem = false;
                            break;

                        case "field":
                            if("localizacao geom".indexOf(k)>-1){
                                tipo = "geopoint"
                            }else if(!_.has(v,'model')){
                                tipo = "texto"
                            }else if(v.model.toLowerCase() == "colecao"){
                                tipo = "midia"
                            }else{
                                tipo = "model"
                                adicionalProps.modelo = v.model.toLowerCase()
                                adicionalProps.multiple = v.many
                            }

                            //LETODO - ver se o diego pode incluir uma chave falando se pode ou não adicionar novo modelo
                            if(v.read_only || "classificacao_inicial".indexOf(k)>-1 ){
                                adicionalProps.allowAdditions = false;
                            }
                        
                            break;
                    }
                        
                    let label = v.label; //t(v.label)
                    let descricao = v.help_text;


                     //Incluo os props que tenho no campo do models.js
                    if(_.has(model,'form.campo.'+k) ){
                        adicionalProps = {...adicionalProps,..._.get(model,'form.campo.'+k)}
                        //tipo é um caso a parte
                        if (_.has(adicionalProps,'tipo')){
                            tipo = _.get(adicionalProps,'tipo')
                        }
                    }



                    //isso tem grande chance de ser o id
                    if(k != "id"){
                        //so crioum campo se ele nao existir no child do form
                        if( ! _.find(this.camposEncontrados,(v)=>v==k) ){
                                return this.criaValidacaoEtcNoCampo(<Campo key={k} label={label} name={k} descricao={descricao} tipo={tipo} {...adicionalProps} />)
                        }
                    }


       })  /// fim do map

        //    console.log('CAMPOS GERADOS ',campos)
       var camposTemplates ="";
       _.each(campos,(campo)=>{
           var propsStr = ""
           if(campo){
            _.forOwn(campo.props,(v,k)=>{
                if(v !== true && v!== false && v !== undefined && v!=="" && k != 'descricao'){
                    propsStr += k+"='"+v+"' ";
                }else if(v == true || v ==false){
                    propsStr += k+"={"+v+"} ";
                }
            });
           }
           
           camposTemplates += '<Campo '+propsStr+'/>\n';
       })

      console.log('CAMPOS GERADOS ',camposTemplates)

      return campos;
      
        
  }




  //pego um elemento campo e incluo os props 
  //de validacao neles conforma o descrito na api

  criaValidacaoEtcNoCampo = (elm) =>{
        
        const { name, descricao, label  } = elm.props;

        const opcoes = this.props.formOptions;

        let validate = [];
        let newPropsForCampos = {};


        if( _.has(opcoes,name) ){

          const ref = opcoes[name]

          //VALIDACOES
          if(ref.required === true){   
              //o proprio campo criara a validacao requeride com o prop req
              newPropsForCampos['req']=true;
             // validate.push(validacao.requerido)
          }

         // READONLY
         if(ref.read_only === true){
             newPropsForCampos['disabled']=true;
         }




        if(ref.max_length){
              //se não tenho um maxChar sp qie crio, se tiver ifnoro
              if(!elm.props.maxChar){
                  newPropsForCampos['maxChar']=elm.props.maxChar;
                  // validate.push( validacao.maxLength(ref.max_length) )
              }
        }
          
        if(ref.type.toLowerCase() == "email"){
               newPropsForCampos['email']=true;
               //o proprio campo criara a validacao requeride com o prop req
               // validate.push( validacao.email )
        }


          // DESCRICAO
          if(_.has(ref,'help_text') && !descricao){
           newPropsForCampos['descricao']=_.get(ref,'help_text'); 
          }
         
          // LABEL
         if(_.has(ref,'label') && !label){
           newPropsForCampos['label']=_.get(ref,'label'); 
          }  

          //SELECTION - get choices from api if not set
        if(!_.has(elm,'props.choices')){
            newPropsForCampos['choices']=_.get(ref,'choices'); 
        }

        }



        //configuracoes adicionais atribuidas no models.js
        var model = getModel(this.props.modelo)

        //se campo deve ser escondido ou não
        if( _.has(model,'form.hidden') ){
             if( _.some(model.form.hidden,v=>v===elm.props.name) ){
                    newPropsForCampos['className'] = _.get(elm,'props.className')+" hidden";
              } 
         }


    //    //vejo itens que não tem no campo
    //     if( _.has(model,'form.hidden') ){
    //          
    //          if( _.some(model.form.hidden,v=>v===elm.props.name) ){
    //                 newPropsForCampos['className'] = _.get(elm,'props.className')+" hidden";
    //           } 
    //      }



        return React.cloneElement(elm,{...newPropsForCampos,validate:validate})
  }

    
  removeItem = (e)=>{
        this.props.removeItem(this.props.modelo,this.props.id);
  }






  //!LETODO - verificar se o processaCamposApi e o criaCamposApi devem ficar no render ou fora para economizar processo?

  render(){

      myconsole.count('RENDER | props: %o',this.props)

      const { invalid, submitFailed, handleSubmit, pristine, reset, submitting } = this.props
      const editing = (this.props.id==0) ? 'new' : 'edit';

  


      let className = (this.props.tipo == "small") ? "formulario-pequeno" : "formulario";


      var tipos = _.split(this.props.tipo," ");
      tipos = _.map(tipos,v=>(' formulario-'+v+' '))

      className += (this.props.tipo) ? " "+tipos+" " : "";

      return(

         <div className={'formulario '+className+" ui "+" "+editing+" "+((submitFailed && !submitting) && ' submitfailed') + ' '+(invalid && 'com-erro')} >
  
                 {/* {this.props.deletable && this.props.id > 0 &&
                   <a style={{cursor:'pointer',display:'block',position:'absolute','zIndex':600,right:'0px',top:'-10px'}} onClick={this.removeItem}><Icon className='delete fl-r'   size='small' name='trash outline' /></a>
                 } */}
    


               <div className='campogrupo'>
                  

                 {(this.props.titulo != '') &&
                  <h2 className='titulo'>
                      {this.props.titulo}
                  </h2>
                  }


                  { this.processaCamposApi(this.props.children) }

                  {this.props.autoForm &&
                    this.criaCamposApi() 
                  }

             
              </div>
             
 
          



          { this.props.butoesOnPristine === false &&  this.props.tipo != "popup" &&
            <div className="row">
              <div className="acao  col-8  mt-1 mb-2"> 
                   <Button.Group className='botoes' >
                  {!pristine &&
                      <div>
                      <Button type="submit" primary loading={submitting} onClick={handleSubmit} >
                          <Icon name='check' />{submitting && this.props.salvandoLabel || this.props.salvarLabel }
                      </Button>

                      {this.props.showReset &&
                      <Button type="button" onClick={reset}>Resetar</Button>
                      }

                      </div>
                  }

                   {pristine &&
                      <div>
                      <Button type="submit"  >
                          <Icon name='check' />{this.props.id == 0 && this.props.criarLabel || this.props.salvoLabel }
                      </Button>
                      
                      </div>
                  }


               
                 </Button.Group>

     {this.props.deletable && this.props.id > 0 &&
                         <Button type="button" color="red" className="fl-r ml-5" onClick={this.removeItem}>
                             <Icon name='trash' />Apagar
                      </Button>
                 
                 }

              </div>
                 </div>
          }


          { this.props.butoesOnPristine === true && this.props.tipo != "popup" &&
           <div className="acao ta-center mt-0 mb-2 "> 
            {!pristine &&
              <Button.Group className='botoes' disabled={pristine || submitting}>
                    
                    <Button className='bg-l08 h-bg-l1 cl-w' disabled={pristine || submitting} onClick={handleSubmit} size='mini'  compact>
                    <Icon name="check" /><div></div>
                    </Button>

                    {this.props.showReset &&
                    <Button className='' disabled={pristine || submitting}  onClick={reset} size='mini' compact>
                        <Icon name="undo" /><div></div>
                    </Button>
                    }                
              </Button.Group>
            }
            </div>
           }


            {/*
              {process.env.NODE_ENV !== 'production' &&
                <div>
                    <small>  <pre className='ta-l'>{JSON.stringify(this.props.formOptions,null,2)}</pre> </small>
                    <small>  <pre className='ta-l'>{JSON.stringify(this.props.itens,null,2)}</pre> </small>
                </div>
            }*/}
         
       
        </div>
        )
  }

}




   