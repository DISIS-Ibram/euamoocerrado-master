import React from 'react';
import { Accordion, Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import { si3, si3Actions } from 'actions/index';
import moment from 'moment';

import { Link } from 'react-router';

import criaconsole from 'util/myconsole';

import ViewMore from 'components/ViewMore';

import { connect } from 'react-redux';

import * as templates from './ListaItemTemplates/index'

const _debug = false;

const myconsole = criaconsole(_debug, ' === ListaItem.js | ', 'color:orange; font-weight:bold');

@connect(null,si3Actions)
export default class ListaItem extends React.Component {



        //renderiza o item da lista
        renderTitle = (elm)=>{
            const { modelo,template } = this.props;

           if(_.has(templates,template)){
              return templates[template].titulo(elm) 
           }
           
            if( _.has(templates,modelo) ){
                return templates[modelo].titulo(elm)
            }else{
                
                //check if have name
                var nome = this.props.modelo+" - "+elm._id;
            
                return  this.props.modelo+" - "+elm._id
            }
            

        }

        //renderiza outra coisa
        renderDescricao = (elm)=>{
           
           const { modelo,template } = this.props;

           if(_.has(templates,template)){
              return templates[template].descricao(elm) 
           }

           if( _.has(templates,modelo) ){
                return templates[modelo].descricao(elm)
           }else{
                return  null
           }
        }


        removeItem = (e)=>{
  
            this.props.removeItem(this.props.modelo,this.props.item._id);
         }


        render() {
            const { modelo, template } = this.props;


            var ItemFianl;
            //Se tenho o objeto Item no template, renderizo ele

            if( _.has(templates,template+".Item") ){

                var Item = templates[template].Item
                return (<Item {...this.props} removeItem={this.removeItem} />)
             
            
            }else if( _.has(templates,modelo+".Item") ){

                var Item = templates[modelo].Item
                return (<Item {...this.props} removeItem={this.removeItem} />)
           
                
            }else{
               
              return (

                    <List.Item className='relative' key={'modelo'+this.props.item._id}>
                       { _.get(window,'PERM.'+this.props.modelo+'.delete') &&
                            <Icon onClick={this.removeItem} className='relative z-999 delete fl-r o-50 dim pointer'  size='small' name='trash outline' />
                       }
                        
                       
                        <List.Content>
                                <List.Header as="a" onClick={this.props.onClick} >
                                    {this.renderTitle(this.props.item)} 
                                </List.Header>
                                
                                <List.Description>
                                    {this.renderDescricao(this.props.item)}
                                </List.Description>

                    </List.Content>
                    </List.Item>
                    );
             }

        }

}
