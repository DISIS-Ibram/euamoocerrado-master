
import React, {  Component, PropTypes } from 'react'
import { Label, Popup, Icon } from 'semantic-ui-react';


//  FORM FIELD BASE
//---------------------------
//A base dos forms Fields
//define as classes, se alterou, dirty, prisme etc.
//erros, legendas, ajudas etc tb
//recebe um formfilte como o elemento principal
export default class FormField extends React.Component {

  static defaultProps = {
    subField: false,
    req:false,
    tipo: '',
    descricao:''
  };


  renderMyChild = ()=>{      
        // return this.props.children
        return React.Children.map(this.props.children, child => {

            // return React.cloneElement(child, {
            //     placeholder:"*"
            // })
            
            if(_.has(child,'props')){
              
              return React.cloneElement(child, {
                    placeholder:"*",
              })
                // 
              if(this.props.subField && this.props.req && this.props.placeholder){

                  return React.cloneElement(child, {
                    placeholder:this.props.placeholder+"*",
                  })
              }
            
            }
            return child

          })
  }




 //tento focalizar o label que pertence
 onLabelClick = (e)=>{
  //  alert("a");
  
   e.preventDefault();
  //  
   $(e.target).parents(".campo").find("input").focus()
   $(e.target).parents(".campo").find("textarea").focus()
 
}



  render () {
    let { input, req, label, subField, meta: { touched, error, valid, dirty, active }, ...custom } = this.props;
    
    let classname = this.props.className || ''
    classname += (touched && error) && " erro" || ""
    classname += ((touched && valid) && " valid") || ''
    classname += (dirty && " dirty") || ""
    classname += (active && " active") || ""
    // classname += (subField && " subfield") || ""
    classname += (req && " requerido") || ""

    if(input.value != '' ){
        classname += " preenchido"
    }

   if( this.props.tipo == 'input' && input.value === 0){
      classname += " preenchido"
   }


   var LabelElement =  (<label onClick={this.onLabelClick} className='ui f-label label rotulo '>
                             
                              <span className='icone-erro erro-icone'><i className="fa fa-exclamation-triangle" /></span> <span className='requerido'>{req && '*'}</span><span className='textolabel'>{label}</span>

                              {(this.props.descricao != '') &&
                                    <Popup trigger={<Icon className='icone-descricao' name='help circle' size='small' />}
                                     content={this.props.descricao}
                                      on='hover'
                                       hideOnScroll />
                                 }
                          </label>)



  return (

       <div className={classname+' campo f-campo field fieldnormal  semsubgrupo' }>
          
            {(label != '') &&
               LabelElement
            }


            {this.props.children}


            {(touched && error) &&  
              <label className='erro f-erro label-erro' >{error}</label>
            }

          {(this.props.dica) &&  
              <div className=' f-dica dica ui label-dica'>{this.props.dica}</div>
            }

       </div>
    );

  }
}


