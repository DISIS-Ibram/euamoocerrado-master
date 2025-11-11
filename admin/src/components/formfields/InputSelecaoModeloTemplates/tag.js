import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
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

//funcao que gera render
export function list(item) {
  return {
    text: item.nome,
    value: item.nome,
  };
}

//funcaao que renderiza a opcao
export class Item extends React.Component {}
