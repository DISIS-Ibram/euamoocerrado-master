import React from 'react';

import { Accordion,Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';

import { si3, si3Actions }  from 'actions/index';

import moment from 'moment'

import {Link} from 'react-router'

import carregaModelo from 'hocs/carregaModelo'

import criaconsole from 'util/myconsole'

import ListaItem from './ListaItem'

const _debug = false;

const myconsole = criaconsole(_debug,' === Lista.js | ', 'color:orange; font-weight:bold')





@carregaModelo
export default class Lista extends React.Component{
        
        static defaultProps={
            modelo:"relatoriodeexpedicao",
            id:'all',
            loader:true,
            editAsPopup:true, //se edito como popup ou se vou para a pagina do formfulario
            listaItemTemplate:undefined,   //nome da template para usar, vai ser automatico se nao definir
            template:false,
        }


        edita = (id)=>{
            this.props.openModal( {nome:"modal_"+this.props.modelo+"_"+id,
                            tipo:'form',
                            modelo:this.props.modelo,
                            id:id,
                            onSave:()=>{
                                //   this.props.load(this.props.modelo,{},)  //recarrega modelo
                            },
                            value:{}
                            } 
                )
        }


        render(){
            return(
            <div>
                <List divided relaxed size="small" >
                    {_.map(this.props.itens,elm=>{
                        return (<ListaItem 
                                    onClick={ev=>this.edita(elm._id) }  
                                    key={this.props.modelo+elm._id} 
                                    modelo={this.props.modelo} 
                                    item={elm}
                                    template={this.props.template}
                                />)
                    })}
                </List>
            </div>
            )
        }

}


// return (<ListaItem onClick={ev=>this.edita(elm.id) }  key={this.props.modelo+elm.id} item={elm} />)