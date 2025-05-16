import _ from 'lodash'
import React, {  Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Header, Dropdown, Form, Label, List, Radio, Checkbox, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';

import { si3, si3Actions }  from 'actions/index';

//import FormField  from 'components/formfields/FormField'
// import carregaModelo from 'hocs/carregaModelo'
import onlyDOMProps from 'util/onlyDOMProps'

// import AutoForm from 'components/form/AutoForm'

const _debug = true;

const myconsole = (function(_debug = true){
  var obj = {}
  for(var o in window.console){
      if(_debug){
          obj[o] = window.console[o]
      }else{
          obj[o] = ()=>{return false}
      }
  }
  return obj
})(_debug)




//funcao que gera render
export function list(item){
      // myconsole.log("relato item list===  %o",item)
     return {text: item.name,
            value:item.id,
            children:
                <div className='row  middle-xs '> 
                    <div className='col-xs'> 
                        {" "+item.name} 
                    </div>
                </div>
         }

}


//funcaao que renderiza a opcao
export class Item extends React.Component{


}
