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
                                    
                                    <h3 >FPE <b>{ _.get(this.props, 'itens.nome') }</b>  </h3>
                                </div>
                            <div className="view-content">
                             
                              <div className="view-group">
                                <label>Telefone</label>
                                <div className='view-texto'>
                                 { _.get(this.props, 'itens.telefone') }
                                   </div>
                              </div>
                              <div className="view-group">
                                <label>Email</label>
                                <div className='view-texto'>
                                  <a href={`mailto:${this.props.itens.email}`} target="_blank"> { _.get(this.props, 'itens.email') }</a>
                                 </div>
                              </div>

                               <div className="view-group">
                                <label>Endereço</label>
                                <div className='view-texto'>
                                     { _.get(this.props, 'itens.endereco') }
                                 </div>
                              </div>
                              
                            </div>
                          </div> 
                        

                        {/* {JSON.stringify(this.props.itens)} */}
                        </div>
                )


        }

}