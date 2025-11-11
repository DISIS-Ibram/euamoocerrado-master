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
  return <span>{_.get(item, "nome")}</span>;
};

export const descricao = (item) => {
  return <span></span>;
};

//funcaao que renderiza a opcao
export class Item extends React.Component {
  render() {
    var url;
    var regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = this.props.item.url.match(regExp);
    if (match && match[2].length == 11) {
      url = match[2];
    } else {
      //error
      url = "";
    }

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

        <img src={this.props.item.imagem} />

        <List.Content>
          <List.Header as="a" onClick={this.props.onClick}>
            {this.props.item.nome}
            <div></div>
          </List.Header>
          <List.Description>
            <iframe
              width="560"
              height="315"
              style={{ maxWidth: "100%" }}
              src={"https://www.youtube.com/embed/" + url}
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>

            <div className="mt2">{this.props.item.url}</div>
          </List.Description>
        </List.Content>
      </List.Item>
    );
  }
}
