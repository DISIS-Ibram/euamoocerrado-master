import React from 'react';
import { connect } from 'react-redux';
import { input } from 'semantic-ui-react';
import * as _  from 'lodash';
import { Field, reduxForm } from 'redux-form';
import TextareaAutosize from 'components/elements/Textarea';
import { si3, si3Actions }  from 'actions/index';
import { Grid, Icon, Button } from 'semantic-ui-react'





class ItemGenericoFormAdd extends React.Component {

  //LETODO - Talvez o formulario deva ser autoconiente??

  constructor(props){
        super(props)
        this.onFormChange = this.onFormChange.bind(this);
  }


  renderField(field){
    return(
    <div className="input-row ui mini input">
      <input {...field.input} type="text"/>
      {field.meta.touched && field.meta.error && 
       <span className="error">{field.meta.error}</span>}
    </div>
    )
  }


  onFormChange(e) {
    const { name, value } = e.target
    if (!name) return
    if(name=="nome"){
      this.props.filter(value);
    }

 }


  render() {
    const { handleSubmit, removeItem, reset, pristine, submitting } = this.props;
    
    let className;

    if( pristine || submitting){
       className = 'inativo';
    }else{
       className = 'ativo';
    }

    return (
      <form onSubmit={handleSubmit} className={className}  onChange={(e)=>this.onFormChange(e)} > 
        <div>
          <Field className="nome ui input" autoComplete="off" component="input" name="nome" placeholder=" + Adicionar"  type="text" value=""/>
        </div>
        <div>
          <Field className="autoheight descricao" autoComplete="off" name="descricao" placeholder="Descrição" component="textarea"  type="text"/>
        </div>
         <Button.Group className='botoes' disabled={pristine || submitting}>
        <Button  disabled={pristine || submitting}  onClick={handleSubmit} size='mini' color='orange' compact><Icon name="check" /><div>Adicionar</div></Button>
        <Button disabled={pristine || submitting}  onClick={reset} size='mini' compact><Icon name="undo" /><div>Cancelar</div></Button>
      
      </Button.Group>
      </form>
    );
  }
}


// Decorate the form component

ItemGenericoFormAdd = reduxForm({
})(ItemGenericoFormAdd);



// LETODO - fazer o initialState do for puxar do redux state ao inves do propr fornecido pelo itemGenericoList
connect( 
  (state,ownprops) => ({
    initialValues: [state.api[ownprops.model][ownprops.id]] // pull initial values from account reducer
  }),
  si3Actions)(ItemGenericoFormAdd);

export default ItemGenericoFormAdd;