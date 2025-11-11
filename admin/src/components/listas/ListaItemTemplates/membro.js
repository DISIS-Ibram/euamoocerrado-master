import React, { Component } from "react";
import PropTypes from "prop-types";

import {
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

//import FormField  from 'components/formfields/FormField'
// import carregaModelo from 'hocs/carregaModelo'
import onlyDOMProps from "util/onlyDOMProps";

// import AutoForm from 'components/form/AutoForm'
import Avatar from "components/elements/Avatar";
import moment from "moment";

export const titulo = (item) => {
  return <span>{_.get(item, "integrante.nome")}</span>;
};

export const descricao = (item) => {
  return <span>{_.get(item.integrante.nome)}</span>;
};

//funcaao que renderiza a opcao
export class Item extends React.Component {
  render() {
    return (
      <List.Item className="relative">
        {_.get(window, "PERM." + this.props.modelo + ".delete") && (
          <Icon
            onClick={this.props.removeItem}
            className="relative z-999 delete fl-r o-50 dim pointer"
            size="small"
            name="trash outline"
          />
        )}

        <Avatar url={this.props.item.integrante.foto} />

        <List.Content>
          {/*<pre> {JSON.stringify(this.props.item,null,2)}</pre>*/}

          <List.Header as="a" onClick={this.props.onClick}>
            {this.props.item.integrante.nome}
            <div></div>
          </List.Header>
          <List.Description>
            {this.props.item.funcao.nome}

            <div className="mt2"></div>
          </List.Description>
        </List.Content>
      </List.Item>
    );
  }
}
