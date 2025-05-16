import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Modal, Header, Label, List, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import * as _  from 'lodash';
import FlipMove from 'react-flip-move';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import StringMask from 'string-mask';
// import ItemGenericoFormAdd from './form/ItemGenericoFormAdd';

import {InputEndereco, InputText, InputTextArea, InputCheckbox, InputRadio, RadioButtonGroup, InputFile } from 'components/elements/InputText';
import { Field, reduxForm, SubmissionError, submit } from 'redux-form';
import  AutoForm  from 'components/form/AutoForm'

import { SI3RC_MODELS } from 'models/models';

import processaResource from 'util/processaResourcesWithState'

import criaconsole from 'util/myconsole'


import Mapa from 'components/mapas/Mapa.js'


const _debug = true;
const myconsole = criaconsole(_debug,' === ModalTypes.js | ', 'color:orange;font-weight:bold')





// Funcao que cria os modals conforme o tipo de modal
//------------------------------------------------------
// A funcao é chamada pelo App.js para criacao dos modals

export default function criaModal(modal, addProps={}){

        if("form formulario".indexOf(modal.tipo) >-1){
            
            myconsole.count("===== Cria Modal ========")
            return <ModalForm  {...modal} nome={modal.nome} key={"modal"+modal.nome}  modelo={modal.modelo} id={modal.id || 0} {...addProps}/>
        
        }else if("remove delete confirm yesno".indexOf(modal.tipo) >-1){

            return <ModalYesNo {...modal} nome={modal.nome} key={"modal"+modal.nome}  modelo={modal.modelo} id={modal.id} {...addProps} />
        
        }else if("mapa map".indexOf(modal.tipo) >-1){

            return <ModalMapa {...modal} nome={modal.nome} key={"modal"+modal.nome}  modelo={modal.modelo} id={modal.id} {...addProps} />
        }
      

}
















// FORM MODAL
//---------------------------
@connect(null,{...si3Actions,submit})
class ModalForm extends React.Component
{  

  
  onClose = (e) =>{
    myconsole.count("====== Close Modal ====== ")
    myconsole.log("nomeModal:",this.props.nome)
    this.props.closeModal(this.props.nome)
  }

  onSave = (e) =>{

    //this.props.closeModal(this.props.nome)
    //sera que consigo chamar o action de salfar daqui?
    if(this.form){
      myconsole.log("form:",this.form)
      this.props.submit(this.props.modelo+"popup")

        //.then( ()=>this.props.closeModal(this.props.nome) )
        // this.props.closeModal(this.props.nome) //nao posso fechar o modal por aqui pq dependo
    }

  }

  

  depoisDeSalvar = (response,disp,id)=>{

      myconsole.count("====== depois de salvar Modal ====== ")
    

      if ( _.get(SI3RC_MODELS,this.props.modelo+'.form.popupSempreAberto', false) == false ){
        this.props.closeModal(this.props.nome) 
      }
      
      if(this.props.onSave){
        this.props.onSave(id)
      }
  
}




  render(){

        myconsole.count("===== Render ModalForm ========")

          var nomes = processaResource({
            titulo: '$api.modelOptions.'+this.props.modelo+'.name',
              description: '$api.modelOptions.'+this.props.modelo+'.description',
        })

      return(
          
          <Modal defaultOpen={true} size='large' onClose={this.onClose} 
          
              closeOnDimmerClick={false}
              closeIcon={true}
          >
                       
                      <Modal.Header>
                        {nomes.titulo}
                       
                        {  ( nomes.description.replace(/[-\s"]/g,'') != "") && 
                            
                            <small className='fs10 cl-cor-cinza'> - {nomes.description} </small>
                        
                        }
                     
                      </Modal.Header>
            

                      <Modal.Content>

                         <AutoForm  ref={ (v)=>this.form = v } 
                                    modelo={this.props.modelo} 
                                    id={this.props.id} 
                                    tipo="popup"
                                    value={this.props.value}
                                    form={ this.props.modelo+"popup" }
                                    depoisDeSalvar={this.depoisDeSalvar}
                                    />
                                    
                   
                      </Modal.Content>
                      
                     {_.get(window,'PERM.'+this.props.modelo+'.change') &&
                      <Modal.Actions>

                              { ! _.get(SI3RC_MODELS,this.props.modelo+'.form.popupSempreAberto') &&
                              <Button onClick={this.onClose}  color='red' inverted>
                                <Icon name='remove' /> Cancelar
                              </Button>
                              }


                               { _.get(SI3RC_MODELS,this.props.modelo+'.form.popupSempreAberto') &&
                                <Button color='brown' inverted onClick={this.onClose} >
                                   <Icon name='checkmark' /> Fechar
                                </Button>
                              }
                          
                              <Button color='green' inverted onClick={this.onSave} >
                                <Icon name='checkmark' /> Salvar
                              </Button>

                      

                      </Modal.Actions>
                     ||
                      <Modal.Actions>
                          
                              <Button onClick={this.onClose}  color='brow' >
                                <Icon name='close' /> Fechar
                              </Button>
               
                      </Modal.Actions>
                     
                     }
            </Modal>
      )
  }

}












@connect(null,{...si3Actions})
export class ModalYesNo extends React.Component
{  

  state = {nome:'modal'}

  componentDidMount() {
      this.setState({nome:this.props.nome})    
  }

  onClose = (e) =>{
    this.props.closeModal(this.props.nome)

  }


  render(){
    return(
       <Modal key={this.state.nome+Math.random()} defaultOpen={true} basic size='small'  onClose={this.onClose}  >
                        <Header icon={this.props.icon} content={this.props.titulo} />
                        <Modal.Content>
                         {this.props.texto}
                        </Modal.Content>
                       
                       
                        <Modal.Actions>
                          <Button onClick={this.onClose}  color='red' inverted>
                            <Icon name='remove' /> Não
                          </Button>
                          <Button color='green' inverted onClick={()=>{this.props.onYes();this.onClose()}} >
                            <Icon name='checkmark' /> Sim
                          </Button>
                        </Modal.Actions>

                        
         </Modal>
      )
  }

}







// FORM MODAL
//---------------------------
@connect(null,{...si3Actions,submit})
class ModalMapa extends React.Component
{  

  
  onClose = (e) =>{
    myconsole.count("====== Close Modal ====== ")
    myconsole.log("nomeModal:",this.props.nome)
    this.props.closeModal(this.props.nome)
  }

  onSave = (e) =>{

    //this.props.closeModal(this.props.nome)
    //sera que consigo chamar o action de salfar daqui?
    if(this.form){
      myconsole.log("form:",this.form)
      this.props.submit(this.props.modelo+"popup")

        //.then( ()=>this.props.closeModal(this.props.nome) )
        // this.props.closeModal(this.props.nome) //nao posso fechar o modal por aqui pq dependo
    }

  }

  

  depoisDeSalvar = (response,disp,id)=>{

      myconsole.count("====== depois de salvar Modal ====== ")
    

      if ( _.get(SI3RC_MODELS,this.props.modelo+'.form.popupSempreAberto', false) == false ){
        this.props.closeModal(this.props.nome) 
      }
      
      if(this.props.onSave){
        this.props.onSave(id)
      }
  
}




  render(){

        myconsole.count("===== Render ModalForm ========")

          var nomes = processaResource({
            titulo: '$api.modelOptions.'+this.props.modelo+'.name',
            description: '$api.modelOptions.'+this.props.modelo+'.description',
        })

      return(
          
          <Modal defaultOpen={true} size='large' onClose={this.onClose} 
              closeOnDimmerClick={false}
              closeIcon={true}
          >
                       
                      {/* <Modal.Header>
                        {nomes.titulo}
                       
                        {  ( nomes.description.replace(/[-\s"]/g,'') != "") && 
                            
                            <small className='fs10 cl-cor-cinza'> - {nomes.description} </small>
                        
                        }
                     
                      </Modal.Header> */}
            

                      <Modal.Content>
                            <div style={{height:'85vh'}}> 
                              {this.props.modelo}
                              < Mapa destaqueId={this.props.modelo}  destaqueId={this.props.id}   destaqueLocation={this.props.location} />
                            </div>  
                   
                      </Modal.Content>
                      
                   
            </Modal>
      )
  }

}




