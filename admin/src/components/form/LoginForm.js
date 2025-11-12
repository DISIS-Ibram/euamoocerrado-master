import React from "react";
import Teste from "../../teste/Teste";
import Formulario from "components/Formulario";
import formHoc from "hocs/formularioHoc";
import { Campo, CampoGrupo } from "components/formfields";

import { browserHistory, Link } from "react-router";

import { loginRequest } from "auth";

import { SubmissionError } from "redux-form";

// @formHoc
export default class LoginForm extends React.Component {
  static defaultProps = {
    modelo: "",
    autoForm: false,
    loadFormOptions: false,
    form: "login",
    item: false,
    id: 0,
    autoForm: false,
    loadFormOptions: false,
    force: false,
  };

  constructor(props) {
    super(props);
  }

  async onSalvar(values) {
    console.log("antes de salvar", values);
    return loginRequest(values).then((resultado) => {
      if (resultado.ok) {
        browserHistory.push("/");
      } else {
        throw new SubmissionError({
          password: "Credenciais Inválidas",
          _error: "Credenciais Inválidas",
          _erro: "Credenciais Invalidas",
        });
      }
    });
  }

  render() {
    return (
      <Formulario
        {...this.props}
        titulo="Entrar"
        tipo="invertido"
        showReset={false}
        salvoLabel="Entrar"
        salvarLabel="Entrar"
        salvandoLabel="Logando..."
        criarLabel="Entrar"
      >
        <div className="row center-xs">
          <div className="col-xs-11">
            <Campo
              req
              tipo="texto"
              name="email"
              label="CPF ou email"
              dica="cpf ou email"
            />
            <Campo
              req
              tipo="texto"
              type="password"
              name="password"
              label="Senha"
            />
          </div>
        </div>
      </Formulario>
    );
  }
}
