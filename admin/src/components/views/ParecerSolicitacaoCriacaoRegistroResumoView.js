import React from 'react';
import { Accordion, Divider, Popup, Label, List, Icon, Radio, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import { t, d } from 'models/models';
import { si3, si3Actions } from 'actions/index';
import moment from 'moment';

import { ClassificacaoViewLoader } from 'components/views/viewsfields/classificacao.js';

import SolicitacaoCriacaoRegistroResumoView from 'components/views/SolicitacaoCriacaoRegistroResumoView'

import carregaModelo from 'hocs/carregaModelo';

import criaconsole from 'util/myconsole'

const _debug = false;
const myconsole = criaconsole(_debug, ' === SolicitacaoCriacaoRegistroResumoView.js | ', 'color:orange; font-weight:bold')



@carregaModelo
export default class ParecerSolicitacaoCriacaoRegistroResumoView extends React.Component {

        static defaultProps = {
                modelo: 'parecersolicitacaocriacaoregistro',
                id: 0,
                loader: true,
                comsolicitacao: true,
                include: ['autor__nome', 'autor__cpf'],
                force: true
        }

        editarParecer = () => this.props.openModal({
                                nome: "modal_parecersolicitacaocriacaoregistro_0",
                                tipo: 'form',
                                modelo: 'parecersolicitacaocriacaoregistro',
                                id: this.props.itens.id,
                                onSave: () => {
                                }
                            })


        render() {

                return (

                        <div>
                          <div className='view-resumo'>
                                <div className="view-header">
                                    
                                    <h3 >Autorização <small>| Criação de Reg.</small> <Button onClick={this.editarParecer} size="mini" circular icon='pencil' /></h3>
                                </div>
                            <div className="view-content">
                              <div className="view-group">
                                <label>Data</label>
                                <div className='view-texto'>
                                  { moment(this.props.itens.data).format('L') } </div>
                              </div>
                              <div className="view-group">
                                <label>Justificativa</label>
                                <div className='view-texto'>
                                  { this.props.itens.justificativa } </div>
                              </div>
                              <div className="view-group">
                                <label>Autor</label>
                                <div className='view-texto'>
                                  { _.get(this.props, 'itens.autor.nome') } </div>
                              </div>
                              <Button compact size="mini" onClick={this.editarParecer}>
                                Editar Parecer</Button>
                            </div>
                          </div>
                          { this.props.comsolicitacao &&
                            <div className='mt3'>
                              <SolicitacaoCriacaoRegistroResumoView id={ this.props.itens.solicitacao.id || this.props.itens.solicitacao } />
                            </div> }
                        </div>
                )


        }

}