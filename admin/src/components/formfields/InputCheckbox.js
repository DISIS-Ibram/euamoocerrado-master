
import _ from 'lodash'
import React, {  Component, PropTypes } from 'react'
import { Checkbox }  from 'semantic-ui-react';
import FormField from 'components/formfields/FormField'

// Input CHECKBOX
//---------------------------

export default class InputCheckbox extends React.Component {

      static defaultProps = {
            toggle:false,
            ivertido:false,
            disabled:false,
      }

   render (){
     let { input, label, meta: { touched, error, valid, dirty }, ...custom } = this.props;
           delete custom.req
    

     return(

        <FormField {...this.props} label="" >     

          <div className="ui fluid input input-wrap">
                <label> <Checkbox  disabled={this.props.disabled} toggle={this.props.toggle} checked={input.value ? true : false} onClick={()=>{ input.onChange(!input.value)}} label={label}  /> {custom.req && '*'}</label>
                <div className='ui icon icone'> { this.props.icone && this.props.icone || <i className=''></i> } </div>
          </div>

       </FormField>
      )
    }
}



//        {  <FormField {...this.props} label=''>
//                 <label><i className="fa fa-exclamation-triangle" /> 
//                <div className="input-wrap ui input fluid">
//                 <Checkbox checked={input.value ? true : false} onClick={()=>{ input.onChange(!input.value)}} label={label}  /> {custom.req && '*'}</label>
            
//           </FormField>

// }