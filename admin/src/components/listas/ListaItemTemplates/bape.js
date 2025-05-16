
import React, {  Component, PropTypes } from 'react'

import { Header, Dropdown, Form, Label, List, Radio, Checkbox, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';

//import FormField  from 'components/formfields/FormField'
// import carregaModelo from 'hocs/carregaModelo'
import onlyDOMProps from 'util/onlyDOMProps'

// import AutoForm from 'components/form/AutoForm'
import moment from 'moment'





export const titulo = (item)=>{
      
        return  (<span>{ _.get(item,'nome') }</span>)
}


export const descricao = (item)=>{
          return  ( <div><small> 
                        
                          <div>  Tipo Acesso:<br />
                              { _.map(item.tipo_acesso, acesso=>{ return <Label size="mini">{acesso.nome}</Label> } ) }</div>

                          <div>  Attribuição:<br />
                              { _.map(item.tipo_atribuicao, atribuicao=>{ return <Label size="mini">{atribuicao.nome}</Label> } ) }</div>
                  
                        </small></div> )
}



/*
//funcaao que renderiza a opcao
export class Item extends React.Component{


         render(){
             
            return(
             <List.Item  >
                    { _.get(window,'PERM.'+this.props.modelo+'.delete') &&
                                      <Icon onClick={this.props.removeItem} className='relative z-999 delete fl-r o-50 dim pointer'  size='small' name='trash outline' />
                 }
                <Avatar url={this.props.item.integrante.foto} />

                <List.Content>
                    <List.Header as="a" onClick={this.props.onClick} >
                        {this.props.item.integrante.nome} 
                            <div>
                          
                            </div>

                    </List.Header>
                    <List.Description>
                        
                        {this.props.item.funcao.nome} 
                       
                        <div><small> 
                        
                            {moment(this.props.item.inicio).format('L')}&ensp;-&ensp; 
                            {this.props.item.fim && moment(this.props.item.fim).format('L') || "atual"}
                        
                        </small></div> 

                         <div className='mt2'>
                           
                        </div>
                    
                    </List.Description>

                </List.Content>
            </List.Item>
            )
        }


}*/
