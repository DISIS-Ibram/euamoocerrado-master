import React from "react";
import Teste from "../../teste/Teste";
import Formulario from "components/Formulario";
import formHoc from "hocs/formularioHoc";
import { Campo, CampoGrupo } from "components/formfields";

import { browserHistory, Link } from "react-router";

import { loginRequest } from "auth";

import { SubmissionError } from "redux-form";

import { store } from "../../configStore";

@formHoc
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
    try {
      const resultado = await loginRequest(values);

      if (resultado.ok) {
        console.log("Login bem-sucedido:", resultado.data);

        // Garante que o token foi salvo
        if (resultado.data.key)
          localStorage.setItem("token", resultado.data.key);

        console.log("Resultado: ", resultado);

        // ✅ Atualiza o Redux com o usuário autenticado
        store.dispatch({ type: "USER_LOGIN", payload: resultado.data });

        // Redireciona e recarrega
        browserHistory.push("/");
        // // window.location.reload();
      } else {
        throw new SubmissionError({
          password: "Credenciais Inválidas",
          _error: "Credenciais Inválidas",
          _erro: "Credenciais Inválidas",
        });
      }
    } catch (err) {
      console.error("Erro ao logar:", err);
      throw new SubmissionError({
        _error: "Erro de conexão ou credenciais inválidas",
      });
    }
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
