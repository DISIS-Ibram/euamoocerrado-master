import _ from 'lodash'
import React, {  Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Header, Dropdown, Form, Label, List, Radio, Checkbox, Icon,  Input,  } from 'semantic-ui-react';
// import { Field, Fields, FieldArray , reduxForm, SubmissionError } from 'redux-form';

import { si3, si3Actions }  from 'actions/index';

import * as util from 'util/s3util'

import FormField from 'components/formfields/FormField'








// Input Radio
//---------------------------
//

export class InputRadio extends React.Component {
   render (){
     const { input, label, meta: { touched, error, valid, dirty }, ...custom } = this.props;
           delete custom.req
     return(
       
        <Radio checked={input.value ? true : false} onClick={()=>{ input.onChange(!input.value)}} label={label}  />
         
      )
    }
}





// Grupo de Radio
//---------------------------



export default class InputRadioGroup extends Component {
 
  constructor(props){
      super(props) 
      this.state = {
          numberCheckedRadioButtons: 0,
          selected: '',
      };
  }

  componentWillMount() {

    let cnt = 0;
    let selected = '';
    let {valueSelected, defaultSelected} = this.props;
    
    valueSelected = this.props.input.value;
    
    if(valueSelected !== undefined && valueSelected != '' ) {
      selected = valueSelected;
    } else if (defaultSelected !== undefined) {
      selected = defaultSelected;
    }

    React.Children.forEach(this.props.children, (option) => {
      if (this.hasCheckAttribute(option)) cnt++;
    }, this);

    this.setState({
      numberCheckedRadioButtons: cnt,
      selected,
    });
  }


  componentWillReceiveProps(nextProps) {
    let valueSelected = nextProps.input.value;
    if (valueSelected) {
      this.setState({
        selected: valueSelected,
      });
    }

  }

  hasCheckAttribute(radioButton) {
    return radioButton.props.hasOwnProperty('checked') &&
      radioButton.props.checked;
  }

  updateRadioButtons(newSelection) {
    if (this.state.numberCheckedRadioButtons === 0) {
      this.setState({selected: newSelection});
    } else {
      warning(false, `Material-UI: Cannot select a different radio button while another radio button
        has the 'checked' property set to true.`);
    }
  }

  handleChange(event, newSelection){
    this.updateRadioButtons(newSelection.value);
    // Successful update
    if (this.state.numberCheckedRadioButtons === 0) {
      if (this.props.input.onChange) this.props.input.onChange(newSelection.value);
      if (this.props._onChange) this.props._onChange(newSelection.value);
    
    }
  };

  getSelectedValue() {
    return this.state.selected;
  }

  setSelectedValue(newSelectionValue) {
    this.updateRadioButtons(newSelectionValue);
  }

  clearValue() {
    this.setSelectedValue('');
  }

  render() {

   const { input, label, meta: { touched, error, valid, dirty }, ...custom } = this.props;
      delete custom.req

    let options;

    if(this.props.choices){

        options = _.map(this.props.choices,choice=>{

                    return (
                            <div className={"ui fluid input radio mt1 "+ (this.props.label  != '' && 'sub') }>
                                <Radio
                                name={this.props.name}
                                key={choice.value}
                                value={choice.value}
                                label={choice.display_name}
                                labelPosition={this.props.labelPosition}
                                onChange={this.handleChange.bind(this)}
                                checked={choice.value == this.state.selected}
                              /></div>
                            );
        })

    }else{

         options = React.Children.map(this.props.children, (option) => {
                            const {
                              name, // eslint-disable-line no-unused-vars
                              value, // eslint-disable-line no-unused-vars
                              label, // eslint-disable-line no-unused-vars
                              onCheck, // eslint-disable-line no-unused-vars
                              ...other
                            } = option.props;


                          return (
                            <div className={"ui fluid input radio mt1 "+ (this.props.label  != '' && 'sub') }>
                                <Radio
                                {...other}
                                // ref={option.props.value}
                                name={this.props.name}
                                key={option.props.value}
                                value={option.props.value}
                                label={option.props.label}
                                labelPosition={this.props.labelPosition}
                                onChange={this.handleChange.bind(this)}
                                checked={option.props.value == this.state.selected}
                              /></div>
                            );
                          }, this);
    }

    return (
       <FormField className='ui radiogroup' {...this.props} >
        <div className="ui input input-wrap">{options}</div>
      </FormField>
    );
  }
}


