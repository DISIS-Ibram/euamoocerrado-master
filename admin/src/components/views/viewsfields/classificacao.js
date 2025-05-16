import React from 'react';
import { Popup, Label } from 'semantic-ui-react';
import carregaModelo from 'hocs/carregaModelo'





export default class ClassificacaoView extends React.Component{

      render(){
            
            var item = _.get(this.props,'item.classificacao') || _.get(this.props,'item');
            
            // Se tenho so o id, preciso é carregar
            if(_.isNumber(this.props.item)){
                  return (<div>
                        <ClassificacaoViewLoader id={this.props.item} />
                    </div>)
            }

            // else if (!_.has(item,'padrao.nome') && _.has(this.props,'item.classificacao')) {
            //        return (<div>
            //             <ClassificacaoViewLoader id={_.get(this.props,'item.classificacao')} />
            //         </div>)
            // }


            if( !_.has(item,'padrao.nome') ){
                return null
            }
            
            // let nomeStr = " "+item.padrao.nome + " | "+(item.status && item.status.nome)+ " | "+(item.fase && item.fase.nome || "") + " | "+ (item.etapa && item.etapa.nome || "")     
            var nome = (<div>
                              {/* {item.padrao.nome  &&
                              <Popup
                                    wide
                                    trigger={<Label className='padrao' compact >{item.padrao.nome}</Label>}
                                    content={item.padrao.descricao || ' -- descrição não fornecida --'} />
                              } */}
                          
                              {item.status && item.status.nome  &&
                                    <Popup
                                    wide
                              trigger={<Label style={{background:item.status.cor}}  className='' compact>{item.status.nome}</Label>}
                                    content={item.status.descricao || ' -- descrição não fornecida --'} />
                              }
                              {item.fase && item.fase.nome  &&
                              
                                    <Popup
                                    wide
                                    trigger={<Label className='fase' compact>{item.fase.nome}</Label>}
                                    content={item.fase.descricao || ' -- descrição não fornecida --'} />
                              }
                              {item.etapa && item.etapa.nome  &&
                                    <Popup
                                    wide
                                    trigger={ <Label className='etapa' compact>{item.etapa.nome}</Label>}
                                    content={item.etapa.descricao || ' -- descrição não fornecida --'} />
                              
                              }
                  </div>
            )

            
            return nome
      }

}




export class ClassificacaoViewLoader extends React.Component{
      static defaultProps = {
            modelo:'classificacao',
            loader:false,
            id:0
      }

      render(){
                  
            return (<div>
                        <ClassificacaoView item={this.props.itens} />
             </div>)
            
      }


}
