import React from "react";
import PropTypes from "prop-types";
import { Loader, Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import map from "lodash/map";
import { withRouter } from "react-router";
import * as _ from "lodash";
import { t, d } from "models/models";
import { si3, si3Actions } from "actions/index";
import RelatoFormComponent from "./RelatoFormComponent";
import { createSelector } from "reselect";

import { Field, reduxForm, SubmissionError } from "redux-form";

//======================================================
//  HOC - getItemID
//  retorna um componente com um prop id da url se nao existir
//======================================================

export function getItemID(Wc) {
  let nc = class PP extends React.Component {
    render() {
      let id = 0;

      if (_.has(this.props.params, "item")) {
        id = this.props.params.item;
      }
      if (this.props.id) {
        id = this.props.id;
      }

      return <Wc {...this.props} id={id} />;
    }
  };
  return withRouter(nc);
}

//======================================================
//    HOC - LOADER COMPONENT
//    Usado para carregar um ou mais modelos que colocamos
//    em id
//======================================================

// Props:
// modeloNome - string ou array dos modelos, ou object com {type:xxx,include:array }
// id - string ou array, que vai ser usado para o modeloou primeiro elemento da array do modelo.
//      se modeloNome for objeto, essa propriedade vai ser ignorada

// retorna props.itens se umastring de modelo
//          props.itens.modeloXX se modelos em array
//          props.loading = [ true | false ]

export function loaderComponent(Wc) {
  let newClass = class LoaderComp extends Wc {
    static propTypes = {
      modeloNome: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
      ]).isRequired,
      //LETODO - verificar pq id não esta funcionando
      idd: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      include: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    };

    state = {
      carregando: true,
      erro: false,
      modelosToLoad: {}, //type:,obj:{},opt{includes}
    };

    constructor(props) {
      super(props);
    }

    componentWillMount() {
      let id = "";
      let precisaCarregar = true;

      if (this.props.id) {
        //se nao tem id para carregar

        if (
          this.props.id === "" ||
          this.props.id == "all" ||
          this.props.id == undefined
        ) {
          id = "";
        } else {
          id = this.props.id;
        }
      }

      //se id é zero nao preciso carregar nada, pois pode ser de um form
      if (id === 0) {
        precisaCarregar = false;
      }

      // se tenho ja is itens carregado, não preciso mostrar que estou carregando
      // mesmo assim recarrego ele depois para verificar se continua igual

      const { modeloNome, include } = this.props;
      let modelosToLoad = [];

      //vejo todos os modelos que quero incluir.
      //acho que pode ser geral, e no apiMiddleware verifico se no map do modelo existe
      //para ser carregado.
      let incl = "";
      if (include) {
        incl = include;
      }

      let resources = {};
      if (id != 0 || id != "") {
        resources = { id: id };
      }

      //crio os modelos que vou carregar
      if (_.isArray(modeloNome)) {
        _.forEach(modeloNome, (v, i) => {
          let obj = i == 0 ? resources : {};
          modelosToLoad.push({ type: v, obj: obj, opt: { include: incl } });
        });
      } else if (_.isObject(modeloNome)) {
        modelosToLoad = [modeloNome];
      } else if (_.isString(modeloNome)) {
        modelosToLoad = [
          { type: modeloNome, obj: resources, opt: { include: incl } },
        ];
      } else {
        throw new Error("é nescessario especificar alguma prop modeloNome");
      }

      this.modelosToLoad = modelosToLoad;

      //se ja tenho os modelos carregados, nao preciso carregar mais
      if (this.modelosCarregados() === true) {
        precisaCarregar = false;
      }

      this.state = { ...this.state, id: id, carregando: precisaCarregar };

      console.count(" CWM $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      console.log("state:");
      console.log(this.state);
      console.log("props");
      console.log(this.props.itens);
      console.log("props ID");
      console.log(this.props.id);

      if (super.componentWillMount) super.componentWillMount();
    }

    componentDidMount() {
      //pq zero é quando é form, entao so mando carregar se nao for um form vazio
      if (this.state.id !== 0) {
        this.loadModel();
        //carrego o modelo de qualquer maneira para estar atualizado
      } else {
        //  this.prepareInfo();
      }
    }

    //LETODO - verificar se nao preciso fazer a
    //chamada manualmente para os outros lifecycle do react

    loadModel = () => {
      _.forEach(this.modelosToLoad, (v) => {
        this.props.load(v.type, v.obj, v.opt);
      });
    };

    //pq o props pode ser o next props para comparacao
    modelosCarregados = (props = this.props) => {
      //
      //se é so um modelo vejo se o itens é falso
      if (this.modelosToLoad.length == 1 && _.isString(props.modeloNome)) {
        if (props.itens !== false) return true;

        //se tenho vario modelos vejo se todos os subitens de itens nao é falso
      } else if (this.modelosToLoad.length > 0 && _.isArray(props.modeloNome)) {
        if (props.itens) {
          let temFalse = _.find(props.itens, (v, k) => v === false);
          if (temFalse === undefined) return true;
        }
      }

      return false;
    };

    componentWillReceiveProps(np) {
      //
      //caso ja tenha recebido toods os itens que estava carregando, mostro o render
      if (this.modelosCarregados(np) === true && this.state.carregando) {
        this.setState({ carregando: false });
        this.prepareInfo();
      }
      if (super.componentWillReceiveProps) super.componentWillReceiveProps(np);
    }

    componentWillUpdate(np, ns) {}

    // funcao chamada na preparacao do item depois que carregados
    prepareInfo() {
      if (super.prepareInfo) super.prepareInfo().bind(this);
    }

    render() {
      console.count("RENDER LoaeComp ===================================");
      console.log(this.props.itens);

      // LETODO - vezer renderizar loading opcional, para componentes que nnao sao de pagina inteira
      if (this.state.carregando == true) {
        return (
          <div className="">
            {(this.state.erro && (
              <Loader active content="OCORREU UM ERRO" inline="centered" />
            )) || <Loader active content="Carregando..." inline="centered" />}
          </div>
        );
      } else {
        let itens = this.modelosCarregados() === true ? this.props.itens : [];
        let loading = this.modelosCarregados() === true ? false : true;
        let erro = this.state.erro !== false ? true : false;

        return (
          <Wc
            {...this.props}
            itens={this.props.itens}
            loading={loading}
            erro={erro}
          />
        );
        // return super.render();
      }
    }
  }; // fim classe BaseForm

  //Criando os Selector
  //----------------------

  const makeSelector = (state, props) => {
    let getModeloApi = (state, props) => {
      console.count("chamando getModeloApi Loader Comp");
      // console.log("props")
      // console.log(props)
      //
      //LETODO - verificar o que vafer com array de IDS
      if (props.id) {
        //se tenho id
        if (_.has(state.api.entities[props.modeloNome], props.id)) {
          //utilizando o updeep no reducer garanto a referencia ao objeto se nao mudar,
          // e o reselect === funciona
          return state.api.entities[props.modeloNome][props.id];
        } else {
          return {};
        }
      } else {
        return state.api.entities[props.modeloNome];
      }
    };

    return createSelector([getModeloApi], (objectes) => {
      console.count(
        "======== chamando createSelector Func Load Comp ==========="
      );
      console.log("props");
      console.log(props);
      console.log("objetos recebidos");
      console.log(objectes);
      //
      let id = _.isEmpty(props.id) ? 0 : props.id;

      //retorna array do objeto ou objeto se tiver id
      const itens = si3.serializeAllByModelo(props.modeloNome, id);

      console.log("itens gerados");
      console.log(itens);

      if (itens) {
        if (_.isEmpty(itens)) return false;
        return itens;
      } else {
        return false;
      }
    });
  };

  const makeMapStateToProps = (state, props) => {
    let modelos = props.modeloNome;

    if (_.isArray(modelos)) {
      let getModeloObj = {};
      _.each(modelos, (v) => {
        getModeloObj[v] = makeSelector(state, { ...props, modeloNome: v });
      });

      const mapStateToPropsArray = (state, props) => {
        // console.count("Chamou Map State To Props")

        let retornar = { itens: {} };

        _.each(getModeloObj, (func, model) => {
          retornar.itens[model] = func(state, { ...props, modeloNome: model });
        });
        return retornar;
      };

      return mapStateToPropsArray;
    } else {
      let getModelo = makeSelector(state, props);

      const mapStateToProps = (state, props) => {
        console.count("Chamou Map State To Props");
        return {
          itens: getModelo(state, props),
        };
      };

      return mapStateToProps;
    }
  };

  //HOCs

  //connecto ao store observando a api sempre
  newClass = connect(makeMapStateToProps, si3Actions)(newClass);

  newClass = getItemID(newClass);

  return newClass;
}

//======================================================
//     BASE FORM
//======================================================

// Modelo usado como base para carregar os dados de um formulario
// se tem um id passado ouy na url carrega o modelo, senão renderiza o formulario sem id

export function getWithForm(Wc) {
  let nc = class PP extends React.Component {
    render() {
      return <Wc {...this.props} />;
    }
  };
  return reduxForm()(nc);
}

export default function connectBaseForm(Wc) {
  // connecto o componente que recebo ao redux Form
  // para quando eu renderizar ele ser ja um redux form
  //Wc = loaderComponent(reduxForm()(Wc))

  let Wcf = reduxForm("modelo.x")(Wc);

  let newClass = class BaseForm extends Wc {
    state = { erro: false };

    constructor(props) {
      super(props);
      this.validate = this.validate.bind(this);
    }

    MC = { props: {} };

    _validate(values) {
      console.count("validate Interno");

      // if(super.validar)
      //
      //
      // var children = this.MC.children;

      // if(children){
      //   children.map((child)=>{
      //     console.log(child)
      //   })
      // }

      // console.log(children)
      // var output = children.map(function(child){

      if (super.validate) super.validate();

      const errors = {};

      return errors;
    }

    componentDidMount() {
      console.count("componentWillMount BaseForm");
      if (super.componentDidMount) super.componentDidMount();

      // this.validate()
    }

    render() {
      console.count("RENDER BaseForm ===================================");
      console.log(this.props);

      if (this.props.loading == true) {
        return (
          <div className="">
            {(this.props.erro && (
              <Loader active content="OCORREU UM ERRO" inline="centered" />
            )) || <Loader active content="Carregando..." inline="centered" />}
          </div>
        );
      } else {
        return (
          <div className="formulario ui">
            <Wcf
              ref={(v) => (this.MC = v)}
              {...this.props}
              itens={this.props.itens}
              initialValues={this.props.itens}
              validate={this._validate.bind(this)}
              form="Modelo X"
            />{" "}
            ;
          </div>
        );
        //return super.render()
      }
    }
  }; // fim classe BaseForm

  newClass = loaderComponent(newClass);
  // newClass = getWithForm(newClass)

  return newClass;
}
