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

      let nome = item.nome;//" "+item.padrao.nome + " | "+(item.status && item.status.nome)+ " | "+(item.fase && item.fase.nome || "")

      return {
        text:nome, 
        value:item.id,
        children:<div> 
                 {nome} <small className='gray fs07 fw100'>
                    <br /> {item.descricao}
              </small></div>
      }


}

//se renderiza o labem inline igual tag.
//ou se renderizo abaixo
export const renderInLine = false;
export const rendePosition = "bottom";


//funcaao que renderiza a opcao
export class renderItem extends React.Component{
   
   static defaultProps={
    removeItem:function(){return false}
  }



    render(){
        return(
            <div><h3><Icon name="remove" onClick={this.props.removeItem} />{this.props.item.id}-{this.props.item.nome}</h3></div>
          )
    }
}

export function renderInLineLabel(item){

}