import React from "react";
import {
  Menu,
  Container,
  Grid,
  Image,
  Icon as Icone,
  Button,
} from "semantic-ui-react";
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import Icon from "../components/elements/S3Icon";
import { routerActions } from "react-router-redux";
import { connect } from "react-redux";
import Teste from "../teste/Teste";

//Usado como Templates das páginas internas
//

@connect((state) => ({ usuario: state.usuario }))
export class PageInterna extends React.Component {
  static defaultProps = {
    cabecalho: true,
    nome: "",
    icon: "",
    icontipo: "", //[fa, svg]
    goBack: true,
    menu: "",
  };

  componentDidMount() {
    console.log("PROPS RECEBIDAS:", this.props);
  }

  upOneLevel = () => {
    //so quero que seja um voltar mesmo
    browserHistory.goBack();

    //pego o nivel que estou
    // let path = window.location.pathname

    // //e vou para o anterior
    // let newPath = path.replace(/[^/]*\/?$/,"")

    // console.log("newPath",newPath)

    // browserHistory.push(newPath);
  };

  render() {
    //so renderizo a pagina interna se tiver ussuario
    //   if( _.get(this.props,'usuario.user.pk') == undefined){
    //         return null
    //   }

    //se ja tiver prosigo normalmente
    return (
      <div className="page">
        {this.props.cabecalho && (
          <div className="cabecalho bg-bege pt-6">
            <div className="">
              <div className="row middle-xs between-xs ">
                <div className="col-xs col-xs-offset-1 ta-l">
                  <div className="row middle-xs">
                    {this.props.goBack && (
                      <div className="col-xs-1 col-50px ta-r bd-d-1">
                        <Button
                          circular
                          icon="chevron left"
                          onClick={this.upOneLevel}
                        />
                      </div>
                    )}
                    <div className="col-xs">
                      <h1 className="page-title hidden-xs">
                        <Icon
                          size="3rem"
                          tipo={this.props.icontipo || "fa"}
                          name={this.props.icon}
                        />{" "}
                        <span>{this.props.nome || ""}</span>
                      </h1>
                    </div>
                  </div>
                </div>

                <div
                  className="col-xs ta-l"
                  key={
                    "menu_topo_usuario" + _.get(this.props, "usuario.user.pk")
                  }
                >
                  {this.props.menu}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row center-xs">
          <div className="conteudo container-fluid col-xs-12 ta-l ">
            <div className="row">
              <div
                className="col-xs-11 col-xs-offset-1"
                key={"conteudo_usuario" + _.get(this.props, "usuario.user.pk")}
              >
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, routerActions)(PageInterna);
