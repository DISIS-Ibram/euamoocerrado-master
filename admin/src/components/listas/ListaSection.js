import React from 'react';

import { Accordion,Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';

import { si3, si3Actions }  from 'actions/index';

import { t, d }  from 'models/models';

import { connect } from 'react-redux';

import Lista from './Lista';


@connect(null,si3Actions)
class ListaSection extends React.Component {

    static defaultProps = {
        modelo:"relatorio",  //nome modelo
        canAdd:true,
        titulo:null,
        options:{}, //o options que passo para o modelo, ex {expedicao:this.props.itens.id}
        initialValues:{}, //os valores defaults dos objetos criados
        onSaveOptions:{}, //o options que passo para o modelo, ex {expedicao:this.props.itens.id}
        include:[],
        template:false,
    }


    novoItem = (e)=>{
            
            this.props.openModal( { nome:"modal_"+this.props.modelo,
                        tipo:'form',
                        modelo:this.props.modelo,
                        onSave:()=>{
                            console.log("---SALVANDO DE UM LIST SECTION----")
                            //this.props.load(this.props.modelo,{},this.props.onSaveOptions)
                        },
                        value:this.props.initialValues
                    } 
            )
    }


    render() {
        return(
         <div className='view-resumo'>
                    <div className="view-header">
                        
                        <h3 >{this.props.titulo && this.props.titulo || t(this.props.modelo) }  
                            
                             { (_.get(window,'PERM.'+this.props.modelo+'.add') && this.props.canAdd) &&
                                <Button size="mini" compact className=''  primary onClick={this.novoItem}> 
                                    <Icon name="plus" /> Adicionar 
                                </Button>
                             }
    
                         </h3>
                    </div>

                    <div className="view-content">    
                        
                        <Lista template={this.props.template} modelo={this.props.modelo} include={this.props.include} options={{...this.props.options}} />

                    </div>
             </div>
        )
     }

}


export default ListaSection;
