import React from 'react';
import { Accordion,Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import * as _  from 'lodash';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import moment from 'moment';

import {ClassificacaoViewLoader} from 'components/views/viewsfields/classificacao.js';

import carregaModelo from 'hocs/carregaModelo';

import criaconsole from 'util/myconsole'

const _debug = false;
const myconsole = criaconsole(_debug,' === SolicitacaoCriacaoRegistroResumoView.js | ', 'color:orange; font-weight:bold')



@carregaModelo
export default class SolicitacaoCriacaoRegistroResumoView extends React.Component{
    
    static defaultProps = {
        modelo:'solicitacaocriacaoregistro',
        id:0,
        loader:true,
        include:['autor__nome','autor__cpf'],
        force:true
    }


    editar = ()=> this.props.openModal( {nome:"modal_solicitacaoalteracaoclassificacao_0",
                                                            tipo:'form',
                                                            modelo:'solicitacaocriacaoregistro',
                                                            id:this.props.itens.id,
                                                            onSave:()=>{}
                                                            }
                                    )


    render(){

            return (
                 <div className="view-resumo">
                        <div className="view-header">
                                <h3 >Solicitação <small>| Criação de Registro</small> <Button onClick={this.editar} size="mini" circular icon='pencil' /> </h3>
                  </div>
                    <div className="view-content">
                            <div className="view-group">
                                    <label>Data</label>
                                    <div className='view-texto'> {moment(this.props.itens.data).format('L') } </div>
                            </div>

                            <div className="view-group">
                                    <label>Justificativa</label>
                                    <div className='view-texto'> {this.props.itens.justificativa} </div>
                            </div>

                            <div className="view-group">
                                    <label>Autor</label>
                                    <div className='view-texto'> {_.get(this.props,'itens.autor.nome')}   </div>
                            </div>

                            <div className="view-group">
                                    <label>Classificação</label>
                                    <div className='view-texto'> 
                    
                                    <ClassificacaoViewLoader key={this.props.itens.classificacao_inicial} id={this.props.itens.classificacao_inicial.id || this.props.itens.classificacao_inicial  } />
                                    
                                    </div>
                            </div>
                          
                    </div>
                    
                </div>
            )


    }

}