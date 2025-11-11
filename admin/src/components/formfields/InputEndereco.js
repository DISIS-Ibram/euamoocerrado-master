import React, { Component } from "react";
import PropTypes from "prop-types";
import StringFormatValidation from "string-format-validation";
import FormField from "./FormField";

import InputTextArea from "./InputTextArea";

import onlyDOMProps from "util/onlyDOMProps";

// Endereco
// Textearea com a busca do CEP
//---------------------------

export default class InputEndereco extends React.Component {
  state = { dicaCEP: "Digite no inicio o CEP para buscar endereco" };

  mesagemCEP = (msg, delay = 6000) => {
    this.setState({ dicaCEP: msg });

    setTimeout(() => {
      this.setState({ dicaCEP: "Digite no inicio o CEP para buscar endereco" });
    }, delay);
  };

  getCEP = (e) => {
    //pego o valor
    const v = e.target.value;
    const text = e.currentTarget;

    if (v.match(/^\d\d\d\d\d-?\d\d\d/)) {
      const valueori = v;
      const num = v.replace(/[^\d]/, "");
      this.mesagemCEP("Buscando endereço...");

      $.getJSON("http://viacep.com.br/ws/" + num + "/json/")
        .then((data) => {
          if (data.erro) {
            this.mesagemCEP("CEP Inválido");
          } else {
            // LETODO - FORMATAR MELHOR O ENDERECO< VERIFICANDO UNDEFINED ETC
            let endereco = `${data.logradouro}  Nº:   \n${data.bairro} - ${data.localidade}/${data.uf}\nCEP:${data.cep}`;
            // this.props.change(field,endereco)
            this.props.input.onChange(endereco);
            this.setState({
              dicaCEP: "Digite no inicio o CEP para buscar endereco",
            });

            setTimeout(() => {
              // $(text).height( 'auto' ).height( text.scrollHeight );
              $(text)
                .focus()[0]
                .setSelectionRange(
                  data.logradouro.length + 5,
                  data.logradouro.length + 7
                );
            }, 200);
          }
        })
        .catch(() => {
          this.mesagemCEP("Erro na busca do endereço");
        });
    }
    this.props.input.onChange(v);
  };

  //LETODO - usar o InputTextarea aqui de alguma maneira tb
  render() {
    const {
      input,
      label,
      meta: { touched, error, valid, dirty },
      ...custom
    } = this.props;
    delete custom.req;

    return (
      <InputTextArea
        {...this.props}
        dica={this.state.dicaCEP}
        rows="1"
        onChange={(e) => {
          this.getCEP(e);
        }}
        autoCorrect="false"
        autoComplete="off"
        spellCheck="false"
      />
    );
  }
}
