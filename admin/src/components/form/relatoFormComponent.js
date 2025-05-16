import React from 'react';
import { connect } from 'react-redux';
import { Label, List, Icon, Radio, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import * as _  from 'lodash';
import FlipMove from 'react-flip-move';
import { Field, Fields, FieldArray , reduxForm, SubmissionError } from 'redux-form';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import * as S3 from 'components/elements';
import Dropzone from 'react-dropzone';
import CPF from 'gerador-validador-cpf'
import StringMask from 'string-mask';
import { InputColecaoMidia, InputSelectPessoaModel, InputSelectModel, InputEndereco, InputSelect, Fieldset, InputTextArea, InputCheckbox, InputRadio, RadioButtonGroup, InputFile } from 'components/elements/InputText';

import { InputGeoPoint, InputDate, InputText } from 'components/formfields/index'

import { withRouter, Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';

const Ui = S3.UI; 



//Validations
//========================

const validate = values => {
  const errors = {}
  const requiredFields = [ 'informante_nome', 'informante_situacao', 'receptor','data_relato','localizacao','caracterizacao_local','num_indios_crianca', 'num_indios_mulher','num_indios_homem']

  requiredFields.forEach(field => {
    if( _.has(values,field) ){
      if (!values[ field ]) {
        errors[ field ] = 'Preenchimento Obrigatório'
      }
    }
  })



  return errors
}


export class RelatoFormComponent extends React.Component
{  

    constructor(props){
        
        super(props)
        // this.state = { carregando:true, filter:'', addindex:0, usuario:false };
        // this.getFaseEtapa = this.getFaseEtapa.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.enviaForm = this.enviaForm.bind(this);

    }

    //posso usar ES7 Especification
    state = { dicaCEP:'Digite no inicio o CEP para buscar endereco', carregando:true, filter:'', addindex:0, usuario:false };

    componentDidMount() {
        this.setState({carregando:true, usuario:this.props.initialValues.usuario_s})
        // let data = this.props.load(this.props.model,{'cpf':this.props.myid})
        // .then(()=>this.setState({carregando:false}))
    }


    enviaForm(values){


        const modelo="relatos"

        //se estiver editando,
        //so vou enviar o que alterei e o id, claro
        //LETODO - porenquanto so no file para agilizar a vida, rsrsr
        
        let dataFinel = {...values};
    
        if(dataFinel.id == '' || dataFinel.id == 0)
          delete dataFinel.id
    
        const data =  this.props.save(modelo, dataFinel);
   
           //Se estou editando so envio os campos que foram TOCADOS
        return data.then((obj)=>{
            // 
            if(obj.response.status == 400){
                  let objerror = _.mapValues(obj.resources[0],(o)=>o[0])
                  throw new SubmissionError({...objerror, _error: 'Erro' })
            }
         
         }).then(
            (obj)=>alert("Salvo com sucesso")
            // (obj)=>browserHistory.push('/pessoas')
        )

   }






   createModel(values){
        this.props.save(this.props.model, values);
        this.setState({filter:''})
        const i = this.state.addindex+1;
        this.setState({addindex:i})
        return true;
   }

   removeItem(id,modelo){
        this.props.remove(modelo,{id:id});  
        // this.render();
   }


   filterItem(nome){
        // console.log(ev);
        this.setState({filter:nome});
   }


   toogle(e){
      let quem = e.currentTarget;
      let pai = $(quem).parent();
      if(pai.hasClass('close')){
          pai.css('max-height',pai[0].scrollHeight+400);
          pai.removeClass('close')
      }else{
        pai.addClass('close')
      }

   }

   openAll(){
      $('.sublist.close').removeClass('close');
   }

   closeAll(){
      $('.sublist').addClass('close');
   }

  
   render() { 
       
       const {invalid, submitFailed, handleSubmit, pristine, reset, submitting } = this.props
       // const item = this.props.params;
       const editing = (this.props.myid==0) ? 'new' : 'edit';
       

       // const id = this.props.params.item;
      
             return (
                <div className="pessoasForm">
                  <div className={"formulario ui page page-relatos"+" "+editing+" "+((submitFailed && !submitting) && ' submitfailed') + ' '+(invalid && 'com-erro')} >
                   <form  onSubmit={handleSubmit(this.enviaForm)} >

                      {/*JSON.stringify(this.props.initialValues)*/}
         
                      <div className='row'>
                          
                       

                           <div className='col-xs-12 col-sm-10'>


                                  
                                  <Field req name="data_relato" saveFormat='YYYY-MM-DD' component={InputDate} label="Data do Relato" />

                                  <Field  name="data_cadastro" saveFormat='YYYY-MM-DD' component={InputDate} label="Data da Coleta" />


                                  <Fieldset req label='Dados do informante'>

                                      <Field req name='informante_nome' label="Nome" component={InputText} />

                                      <Field  name="informante_endereco"  label="Endereço"  component={InputEndereco} />

                                      <Field req name='informante_situacao' label="Perfil"  modelo='situacao' component={InputSelectModel}  />
                                         
                                  </Fieldset>


                                  <Fieldset req label='Receptor do relato'>

                                        <Field req name='receptor' valueKey='cpf' label="Nome"  modelo='usuarios' component={InputSelectPessoaModel}  />
                                         
                                  </Fieldset>


                                 <Fieldset label='Midias'> 
                                  
                                      <Field 
                                        name='colecao_midia' 
                                        nomeTemplate='_relato_midia'
                                        component={InputColecaoMidia}  />
                                  
                                 </Fieldset> 



                                  <Fieldset req label='Localização'>

                                        <Field req name='localizacao' label="Localização" component={InputGeoPoint} 
                                         marker="relato"
                                        />

                                       

                                  </Fieldset>

                                   <Field req name="caracterizacao_local"  label="Caracteristicas"  component={InputTextArea} />

                                   <Fieldset req label='Número de Índios'>

                                        <div className="row middle-xs">

                                              <Field req subField={true} className='col-xs' req name='num_indios_crianca' label="Crianças" placeholder="Crianças"  component={InputText} />

                                              <Field req subField={true} className='col-xs' req name="num_indios_mulher"  label="Mulheres"  placeholder="Mulheres"  component={InputText} />

                                              <Field req subField={true} className='col-xs' req name='num_indios_homem' label="Homens" placeholder="Homens" component={InputText} />
                                        </div>
                                  </Fieldset>


                                <Field name="tipo_adorno"  label="Tipo de Adorno"  component={InputTextArea} />

                                <Field name="tipo_contato"  label="Tipo de Contato"  component={InputTextArea} />

                                <Field name="tipo_comunicacao"  label="Tipo de Comunicação"  component={InputTextArea} />

                                <Field name="compreensao"  label="Compreensão"  component={InputTextArea} />

                                <Field name="outras_informacoes"  label="Outras Informações"  component={InputTextArea} />
        

                                  <div className="className mt3 ta-center">
                                  <Ui.Button type="submit" primary loading={submitting} ><Ui.Icon name='check' />{submitting && 'Salvando' || 'Salvar'}</Ui.Button>
                                  {!pristine &&
                                    <Ui.Button type="button" onClick={reset}>Resetar</Ui.Button>
                                  }
                                  </div>

                           </div>

                      </div>

                    </form>
               
                </div>
                    

                </div>
            );
    }
}


// Decorate the form component

RelatoFormComponent = reduxForm({
  validate
})(RelatoFormComponent);

RelatoFormComponent = connect( (state, ownprops)=> {return {
  api:state.api,
 }} , si3Actions)(RelatoFormComponent)

export default withRouter(RelatoFormComponent)
