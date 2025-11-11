import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import {
  Popup,
  Header,
  Dropdown,
  Form,
  Label,
  List,
  Radio,
  Checkbox,
  Icon,
  Accordion,
  Input,
  Dimmer,
  Loader,
  Image,
  Segment,
  Button,
} from "semantic-ui-react";

import { si3, si3Actions } from "actions/index";

//import FormField  from 'components/formfields/FormField'
// import carregaModelo from 'hocs/carregaModelo'
import onlyDOMProps from "util/onlyDOMProps";

// import AutoForm from 'components/form/AutoForm'

const _debug = true;

const myconsole = (function (_debug = true) {
  var obj = {};
  for (var o in window.console) {
    if (_debug) {
      obj[o] = window.console[o];
    } else {
      obj[o] = () => {
        return false;
      };
    }
  }
  return obj;
})(_debug);

//se renderiza o labem inline igual tag.
//ou se renderizo abaixo
export const renderInLine = true;
export const rendePosition = "bottom";

//funcao que gera render
export function list(item) {
  //  let nomeStr = " "+item.padrao.nome + " | "+(item.status && item.status.nome)+ " | "+(item.fase && item.fase.nome || "") + " | "+ (item.etapa && item.etapa.nome || "")

  /*var nome = (<div>
                    {item.padrao.nome  &&
                       <Popup
                        wide
                        trigger={<Label className='padrao' compact >{item.padrao.nome}</Label>}
                        content={item.padrao.descricao || ''} />
                    }
                    {item.status && item.status.nome  &&
                        <Popup
                            wide
                            trigger={<Label className='status' compact>{item.status.nome}</Label>}
                            content={item.status.descricao || ''} />
                    }
                    {item.fase && item.fase.nome  &&
                    
                        <Popup
                            wide
                            trigger={<Label className='fase' compact>{item.fase.nome}</Label>}
                            content={item.fase.descricao || ''} />
                    }
                    {item.etapa && item.etapa.nome  &&
                        <Popup
                            wide
                            trigger={ <Label className='etapa' compact>{item.etapa.nome}</Label>}
                            content={item.etapa.descricao || ''} />
                       
                    }
        </div>
    )*/

  return {
    text: "Solicitacao " + item.id,
    // content:nomeStr,
    value: item.id,
    children: <div>Solicitacao {item.id}</div>,
  };
}

//funcaao que renderiza a opcao
export class renderItem extends React.Component {
  static defaultProps = {
    removeItem: function () {
      return false;
    },
  };

  render() {
    return (
      <div>
        <h3>
          <Icon name="remove" onClick={this.props.removeItem} />
          {this.props.item.id}-{this.props.item.padrao.nome}
        </h3>
      </div>
    );
  }
}

export function renderInLineLabel(item) {}
