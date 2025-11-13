import React from "react";
import Sidebar from "../components/Sidebar";
import {
  DefaultRoute,
  Route,
  Router,
  Link,
  browserHistory,
} from "react-router";
import { Divider, Form, Label, Input, Statistic } from "semantic-ui-react";
import Slider from "react-slick";
import * as util from "util/s3util";
import carregaModelo from "hocs/carregaModelo";
import { SI3RC_MODELS } from "models/models";
import LoginForm from "components/form/LoginForm";
import criaconsole from "util/myconsole";
import { loginRequest, logout } from "auth";

const _debug = false;
const myconsole = criaconsole(
  _debug,
  " *** login.js | ",
  "color:black;font-weight:bold"
);

class Fundo extends React.Component {
  static defaultProps = {
    id: "all",
    autoForm: false,
    loadFormOptions: false,
    modelo: "fotohomelist",
    loader: false,
  };

  render() {
    const settings = {
      dots: true,
      fade: true,
      autoplay: true,
      autoplaySpeed: 1000,
      speed: 3000,
    };

    return (
      <div className="fundo">
        <Slider {...settings}>
          <div
            className="slider"
            style={{ backgroundImage: "url(images/cerrado-wwf.jpg)" }}
          >
            <div className="description"> </div>
          </div>
        </Slider>
      </div>
    );
  }
}

@carregaModelo
class Estatisticas extends React.Component {
  static defaultProps = {
    id: "all",
    autoForm: false,
    loadFormOptions: false,
    modelo: "/obter_relatorio/?model=relato,registro",
    loader: false,
  };

  render() {
    const { itens } = this.props;
    if (!itens) return null;

    return (
      <div className="estatisticas">
        <Statistic label="relatos" value={itens[0].relato} />
        {_.map(itens[0].registro, (v, k) => (
          <Statistic key={v.nome} label={v.nome} value={v.count} />
        ))}
      </div>
    );
  }
}

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: false };
  }

  componentDidMount() {
    // ❌ Removido logout automático
    // ✅ Apenas limpeza de cache local de models
    _.forEach(SI3RC_MODELS, (v, k) => {
      try {
        localStorage.removeItem(k + "_options");
      } catch (e) {}
    });

    const resizePage = () => {
      const h = $(window).height();
      $(".login-page").height(h + 250);
    };

    resizePage();
    $(window).resize(resizePage);
  }

  render() {
    return (
      <div className="login-page" key="loginpage">
        <Fundo modelo="fotohomelist" />

        <div className="barra-lateral borda-container">
          <div className="borda br"></div>
        </div>

        <Estatisticas />

        <div id="footer">
          <div className="col-xs-7 pv4 f6 gray lh-copy pl5">
            Eu Amo o Cerrado
          </div>
          <div className="assinaturas">
            {/* <img src='images/assinaturas.png' /> */}
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-sm-4 col-sm-offset-2">
            <div className="formulario ">
              <div className="column logowrap">
                <img className="logo" src="images/euamocerrado.png" />
                <h3> Eu Amo o Cerrado </h3>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
