import React from 'react';
import { connect } from 'react-redux';
import { input } from 'semantic-ui-react';
import * as _  from 'lodash';
import { Field, reduxForm } from 'redux-form';
import { Grid, Icon, Button } from 'semantic-ui-react'
import { si3, si3Actions }  from 'actions/index';


class ItemGenericoForm extends React.Component {

  //LETODO - Talvez o formulario deva ser autoconiente??





  render() {
    const { handleSubmit, removeItem, reset, pristine, submitting } = this.props;
    
    let className;

    if( pristine || submitting){
      className = 'inativo';
    }else{
      className = 'ativo';
    }


    return (
      <form onSubmit={handleSubmit} className={className}>
        <div>
          <Field autoComplete="off" spellCheck="false" className="nome ui input" name="nome" placeholder="Nome" component="input" type="text" value="meu nomee"/>
        </div>
        <div>
          <Field autoComplete="off" autoCorrect='off' spellCheck="false" className="descricao autoheight" name="descricao" placeholder="Descrição" component="textarea"  type="text"/>
        </div>
        

      <Button.Group className='botoes' disabled={pristine || submitting}>
        <Button  disabled={pristine || submitting}  onClick={handleSubmit} size='mini' color='orange' compact><Icon name="check" /><div>Salvar</div></Button>  
        <Button disabled={pristine || submitting}  onClick={reset} size='mini' compact><Icon name="undo" /><div>Cancelar</div></Button>
       </Button.Group>


      {/*  <Button circular compact icon='times circle' content='cancelar' disabled={pristine || submitting}  onClick={reset} />     
        <Button circular compact icon='check' content='salvar' disabled={pristine || submitting}  onClick={handleSubmit} />
      */}
      
       <Icon className='delete' onClick={ ()=> removeItem(this.props.item.id) } circular name='trash outline' />
      </form>
    );
  }
}


// Decorate the form component

ItemGenericoForm = reduxForm({
})(ItemGenericoForm);


// LETODO - fazer o initialState do for puxar do redux state ao inves do propr fornecido pelo itemGenericoList

connect( 
  (state,ownprops) => ({
    initialValues: [state.api[ownprops.model][ownprops.id]] // pull initial values from account reducer
  }),
  si3Actions)(ItemGenericoForm);

export default ItemGenericoForm;