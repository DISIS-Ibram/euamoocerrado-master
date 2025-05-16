import React from 'react';
import { Accordion, Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import { t, d } from 'models/models';
import { si3, si3Actions } from 'actions/index';
import moment from 'moment';


import carregaModelo from 'hocs/carregaModelo';

import criaconsole from 'util/myconsole'

import ClassificacaoView from 'components/views/viewsfields/classificacao.js'

const _debug = false;
const myconsole = criaconsole(_debug, ' === SolicitacaoCriacaoRegistroResumoView.js | ', 'color:orange; font-weight:bold')



@carregaModelo
export default class RegistroView extends React.Component {

        static defaultProps = {
                modelo: 'registro',
                id: 0,
                loader: true,
                comsolicitacao: true,
                // include: ['autor__nome', 'autor__cpf'],
                force: true,
                store:window.STORE
        }

        render() {

                return (

                        <div>
                            
                           <div className='view-resumo'>
                                <div className="view-header">
                                    
                                    <h3 >Registro <b>{ _.get(this.props, 'itens.nome') }</b> <small> | { _.get(this.props, 'itens.num_registro') } </small> </h3>
                                </div>
                            <div className="view-content">
                             
                              <div className="view-group">
                                <label>Classificação Atual</label>
                                <div className='view-texto'>
                                  <ClassificacaoView item={this.props.itens.classificacaoAtual} /> </div>
                              </div>
                              <div className="view-group">
                                <label>Descrição Loc.</label>
                                <div className='view-texto'>
                                  { this.props.itens.descricao_localizacao } </div>
                              </div>
                              <div className="view-group">
                                <label>Localização</label>
                                <div className='view-texto'>
                                  { _.get(this.props, 'itens.localizacao_nome') } </div>
                              </div>
                            </div>
                          </div> 
                        

                        {/* {JSON.stringify(this.props.itens)} */}
                        </div>
                )


        }

}