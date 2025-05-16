import React, { Component } from 'react';
import { Loader, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
// import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
// import map from "lodash/map";
// import { withRouter } from 'react-router'
import _ from 'lodash';
import {t,d, getIDKey, getIDKeyFromMap} from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import { createSelector } from 'reselect';
import { Field, reduxForm, SubmissionError,getFormValues } from 'redux-form';
import getItemID from './getItemID'
import carregaModelo from './carregaModelo'
import { browserHistory} from 'react-router';


import criaconsole from 'util/myconsole'
const _debug = false;
const myconsole = criaconsole(_debug,' *** formularioHOC | ', 'color:red;font-weight:bold')





// //======================================================
// //     BASE FORM
// //======================================================

// // Modelo usado como base para carregar os dados de um formulario
// // se tem um id passado ouy na url carrega o modelo, senão renderiza o formulario sem id



// export function getWithForm(Wc){

//     let nc = class PP extends React.Component {
          
//         render() {

//             return <Wc {...this.props} />            
//         }
//     }
//     return reduxForm()(nc);
// }






//Passar os props iniciais
        // modelo: ["funcao"],
        // loadFormOptions:true,
        // autoForm:true,

export default function connectBaseForm(WrapComp){

    // connecto o componente que recebo ao redux Form
    // para quando eu renderizar ele ser ja um redux form
    let WrapCompWithReduxForm = reduxForm({form:"modeloTemporario"})(WrapComp)


    //crio a nova classe extendendo a que passei
    let newClass = class BaseForm extends WrapComp{

          constructor(props){
              super(props);
              this._antesDeSalvar = this._antesDeSalvar.bind(this);
              this._depoisDeSalvar = this._depoisDeSalvar.bind(this);
              this._onChange = this._onChange.bind(this);
              this._salvar = this._salvar.bind(this);
          }


          static defaultProps = {
            // modelo: "",
            loadFormOptions:true,   //carrego opcoes do formulario, criando as validacoes antes do servidor
            // autoForm:true,         // se desejo criar o formulario automaticamente
            // excluir:[],              // LETODO - nome dos campos que devo excluir do formulario
            // autoMerge:true,        //LETODO - se devo criar o formulario automaticamente, mas sealgum campo tiver sido especificado, uso ele
            asID:"all",//asID:['atributo']  //o que trato como id se for objeto
            force:true
        } 


          componentWillMount(){

              //salvo o nome do form aqui,
              //pq se tenho um formulario novo, e salvo ele, o id dele muda,
              //e se esse nome fica no render o nome do formulario ia mudar
              //também, e ai o redux form ia perder referencia a ele.
             this.formNome = this.props.form ? this.props.form : this.props.modelo+"_"+this.props.id;
          }


          componentWillReceiveProps(nextProps) {
              //checo se o values é diferente do props atual
              //se for atualizo ele
              this._onChange(nextProps.values)
          }


          state = {erro:false }
          MC = {props:{}};

          // Novos Methodos
          //---------------------------
         _validate(values){
              myconsole.count('validate Interno')
              
              //valido se tiver alguma coisa no component
              let erros = {}
              if(super.validate){
                  erros = super.validate();
              }
              if(super.validar){
                  erros = super.validar();
              }
              return erros
          }



          _prepararInfo(item){

              let itemPreparado = {};
              let asID;

             if(super.prepararInfo){
                  itemPreparado = super.prepararInfo(itemPreparado);
              }else if(super.prepareInfo){
                  itemPreparado = super.prepareInfo(itemPreparado);
              }
              //removo os atributos internos
              // itemPreparado = _.pickBy(itemPreparado,(v,k)=> k.indexOf("_") !== 0)

              //tudo que quero como id e nao como objeto converto aqui,
              //pois no formulario muitas vezes quero o id e não objeto das coisas
              //esse vai ser um principio basico
              
              if(item === false && this.props.modelo == ""){
                  return itemPreparado;
              }

              if(this.props.asID == "all"){
                    //pego o item completamente normalizado
                    // 
                    let itemPreparadoTemp = si3.normalizerModel([item],this.props.modelo)
                    itemPreparado = itemPreparadoTemp.entities[this.props.modelo][this.props.id];

              }else{

                  asID = _.isArray( this.props.asID ) ? this.props.asID : [this.props.asID]
                  
                  
                  for (var i = asID.length - 1; i >= 0; i--) {
                    let attr = asID[i];
                    
                    if( _.isObject(item[attr]) ){
                        //pego a chave id do modelo
                        //LETODO - fazer utilizar o idkey das coisas
                        let idkey = getIDKeyFromMap(this.props.modelo,attr)
                        itemPreparado[attr] = item[attr][idkey];
                    }

                  }
              }


          
              if( _.isEmpty(itemPreparado) ){  //o initial values precisa ser sempre um objeto, nesse caso se tiver false ou algum erro, retorno objeto vazio
                  
                  if(this.props.value){
                    return {...this.props.value}  //LETODO ser o campo de identificacao principal do modelo
                  }else{
                    return {};
                  }

              }
              

              //e removo os atributos internos para o initial value


              return itemPreparado;
          

          }


          //o salvar do redux form entra aqui
          _antesDeSalvar(values){
                
                myconsole.log("_antesDeSalvar");

                myconsole.log("antes salvar %o",values)

                if(this.props.id == 0 || this.props.id == "new"){
                  values._new = true;
                }

                //methodo nao pode ser arrow func =>
                if(super.antesDeSalvar){
                  values = super.antesDeSalvar(values);
                //methodo nao pode ser arrow func =>
                }else if(super.beforeSave){
                  values = super.beforeSave(values);
                }

                if(this.props.antesDeSalvar){
                  values = this.props.antesDeSalvar(values);
                }else if(this.props.beforeSave){
                  values = this.props.beforeSave(values);
                }

               
                //se eu tiver editando, eu so dou um PATCH nos elementos que alteraram
                if(!values._new){
                      let inicial = this._prepararInfo(this.props.itens)
                      let atual = values

                      values = _.pickBy(atual,(v,k)=>{   
                                myconsole.log("key:",k," atual:",v," inicial:",inicial[k]," é diferente:", (v != inicial[k]))

                                if(! _.isObjectLike(v)){
                                    return true;
                                }
                                if(v != inicial[k]){
                                     return true
                                }
                       })

                      //ai preciso me certificar que o id também esta incluso aqui para salvar quem é certo
                      values.id = this.props.id; //posso usar o idKey id, mesmo para modelos que possuem o idkey diferente, que a api middleware vai lidar com esses casos
                       myconsole.log("valoresAlterado:",values)
                }


                myconsole.log("valores a salvar: ",values)
                return this._salvar(values);




          }

          _salvar(values){

              //aqui eu salvo o modelo
              myconsole.log("salvar");

              if(this.props.modelo == ""){
                     if(super.onSalvar){
                        return super.onSalvar(values)
                     }

              }else{
                return this.props.save(this.props.modelo, values)
                        .catch((response)=>{
                            if(response.status == 400 || response.status == 422 ){ //400 é bad request
                                //o response é um objeto to fetch ainda, entao retorno
                                //o json() que gera um promisse também e pega o valor do body do erro
                                return response.json().then((data)=>{
                                    throw new SubmissionError({...data, _error: 'Erro' })
                                })
                            }
                        })
                }
          }

          _depoisDeSalvar(response,dispatch){
            
              //LETODO- verificar se tem modelos temporarios criados,
              //tipo coletania midia, e renomear tirando o temporario
              //se for o caso
              //
              if(response === undefined)
                    return false;
            
              if(_.isArray(response) && response.length == 1){
                  response = response[0];
              }

                //se defini o que fazer depois de salvar salvo aqui
                ////senao utilio o padrao abaixo
              if(super.depoisDeSalvar){
               
                    super.depoisDeSalvar(response, dispatch);


              }else if(this.props.depoisDeSalvar){
                    
                     response = response[0] || response;
                    //   }
                      let id = response._id;
                    this.props.depoisDeSalvar(response, dispatch, id);
               
              }else if(this.props.tipo != "popup"){
                     
                     //LETODO. especificar os casos que quero substituir o formulario novo na url
                    //  return true;

                     console.log("depois de salvar:",response)
                      // this.forceUpdate();
                      
                      //pedo o id na resposta
                    //   if(_.isArray(response)){
                     response = response[0] || response;
                    //   }
                   //   let id = response._id;

                      console.log("id:",response._id)


                      //se o id na url é new ou 0, é provavel que esteja editando um novo formulario
                      var idNaUrl = window.location.pathname.match(/[^/]*?$/)[0];
                      

                      if(response._id && (idNaUrl === 0 || idNaUrl == 'new')){
                          

                           let path = window.location.pathname

                            //e vou para o anterior
                            let newPath = path.replace(/\/?[^/]*\/?$/,"")

                            console.log("newPath",newPath);
                            browserHistory.replace(newPath+"/"+response._id )
                           
                      }
                }else  if(this.props.tipo == "popup"){

                    //  alert("salvou, vamos fechar o popup agora e retornar o id??")

                }

                //aqui redireciono para a url do formulario
              
                //aqui preciso 
          }


          _erroAoSalvar(erros,dispatch,submitError){
              if(super.erroAoSalvar){
                 super.erroAoSalvar(erros,dispatch,submitError)
              }
                 myconsole.log("erro ao salvar")
          }


          //é nescessario Implementar
          _onChange(values){
              myconsole.count("onChange");
              if(super.onChange){
                 super.onChange(values)
              }
              if(super.emAlteracao){
                 super.emAlteracao(values)
              }

          }


          componentDidMount(){
             myconsole.count('componentWillMount')
             if (super.componentDidMount)
                 super.componentDidMount()

            // this.validate()
           }





          render() {

              myconsole.count('RENDER ')
              myconsole.log("render | props:%o",this.props)

           
              if(this.props.loading == true && this.props.modelo !=""){
                return (
                    <div className="">  
                        {this.props.erro &&         
                          <Loader active content='OCORREU UM ERRO' inline='centered' />
                          ||
                          <Loader active content='Carregando...' inline='centered' />
                        }
                    </div>
                )

              }else{


                myconsole.log("render | itens %o",this.props.itens)
                //preparo as minhas infos
                let initialValues = this._prepararInfo(this.props.itens)

                myconsole.log("render | initialValues:%o",initialValues)
                
                return (

                  <div className="formulario ui">
                      <WrapCompWithReduxForm 
                          ref={(v)=>this.MC = v}  
                          {...this.props} 
                          itens={this.props.itens} 
                          initialValues={initialValues} 
                          validate={this._validate.bind(this)} 
                          onChange={(e)=>console.log(e)}
                          form={this.formNome}
                          onSubmit={(data)=>this._antesDeSalvar(data)}
                          enableReinitialize={true}  //para os dirty ficarem falsos quando salvar o formulario
                          onSubmitSuccess={this._depoisDeSalvar}
                          shouldValidate={()=>true}
                          touchOnChange={false}  // so com isso que o validade do nivel do field funcionam sem da o blur, pois marcamos o campo quando alterado ja tocado
                           /> 
          
                 </div>
                 )
                 //return super.render()
              }

          }

        } // fim classe BaseForm

    // console.log(newClass);
    //  if(newClass.props.modelo != "") 

    // 

    newClass = connect(  (state,ownprops) =>{
        let formNome = ownprops.form ? ownprops.form : ownprops.modelo+"_"+ownprops.id;
        return { values: getFormValues(formNome)(state) }
    }
    )(carregaModelo(newClass))
    // newClass = getWithForm(newClass)
   
    return newClass;
}












