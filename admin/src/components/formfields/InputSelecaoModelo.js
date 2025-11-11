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
import {
  Field,
  Fields,
  FieldArray,
  reduxForm,
  SubmissionError,
} from "redux-form";

import { connect } from "react-redux";
import { si3, si3Actions } from "actions/index";

import FormField from "components/formfields/FormField";
import carregaModelo from "hocs/carregaModelo";
import onlyDOMProps from "util/onlyDOMProps";

import * as templates from "./InputSelecaoModeloTemplates/index";

import criaconsole from "util/myconsole";

const _debug = false;
const myconsole = criaconsole(
  _debug,
  " === InputSelecaoModelo | ",
  "color:green;font-weight:bold"
);

//!LETODO - IMPORTANTE
//fazer carregar os itens quando abrir o select
//se for pesquisa limitar quantidade de item também

//Input SELECT MODEL
//---------------------------
@carregaModelo
class InputSelecaoModelo extends React.Component {
  static defaultProps = {
    id: "all",
    renderPosition: "top",
    autoForm: false,
    loader: false,
    force: true,
    loadFormOptions: true,
    allowAdditions: true,
    disabled: false,
  };

  state = {
    isFetching: true,
    multiple: false,
    search: true,
    searchQuery: null,
    value: [],
    options: [],
    currentValue: "",
    idKey: "id",
    renderInLine: true,
    rendePosition: "top", //top | bottom
  };

  constructor(props) {
    super(props);

    if (_.has(templates, this.props.modelo + ".renderInLine")) {
      this.state = {
        ...this.state,
        renderInLine: templates[this.props.modelo].renderInLine,
      };
    }

    if (_.has(props, "rendePosition")) {
      this.state = { ...this.state, rendePosition: this.props.rendePosition };
    }

    if (_.has(templates, this.props.modelo + ".rendePosition")) {
      this.state = {
        ...this.state,
        rendePosition: templates[this.props.modelo].rendePosition,
      };
    }
  }

  componentWillMount() {
    //carrego todas as opcoes do modelo

    //determino kem é o IDKEY do modelo
    const idKey = si3.util.getIDKey(this.props.modelo);
    if (idKey) this.state = { ...this.state, idKey: idKey };

    if (this.props.multiple) {
      this.state = { ...this.state, multiple: true };
    }
  }

  componentDidMount() {
    myconsole.count(" CDM ");
    myconsole.log(this.props);

    // this.props.load(this.props.modelo)
    // .then( ()=>this.setState({isFetching: false}) )
  }

  handleSearchChange = (e, value) => this.setState({ searchQuery: value });

  // handleAddition = function(e, { value }){
  //       //adiciono no servidor
  //
  //       this.props.openModal();
  //       return e;
  // }

  handleChange = (e, { value }) => {
    myconsole.log("===== handleChange == %o", value);
    myconsole.log(value);
    //nesse caso, o value so chega o ultimo valor, e nao a array que o dropdown mandaria
    //se tivesemos usando ele
    if (this.state.renderInLine === false && this.state.multiple) {
      let val = this.props.input.value;
      //  value = _.omitBy(value, v=>(v === null || v === undefined));
      val = _.isArray(val) ? val : [];
      val.push(value);
      value = _.uniq(_.flattenDeep(val));
    }

    if (this.state.multiple) {
      value = _.filter(value, (v) => v !== null && v !== undefined);
      if (_.isEmpty(value)) {
        value = [];
      }
    }

    if (_.isArray(value)) {
      value = _.pickBy(value, (valueItem) => {
        return _.find(this.props.itens, (item) => item._id == valueItem);
      });

      //converto values de volta para array
      value = _.valuesIn(value);
    }

    this.props.input.onChange(value);
  };

  //chamada quando incluo um novo modelo
  addFromform = (id) => {
    if (this.state.multiple) {
      //removo o ultimo item que é o que esta escrito no adicionar
      let val = this.props.input.value; //_.dropRight(this.props.input.value);
      val.push(id);
      this.props.input.onChange(val);
      this.forceUpdate();
    } else {
      this.props.input.onChange(id);
    }
  };

  //quando clico em um elemento de multiple select
  elementClick = (e, data) => {
    console.log(e, data);

    this.props.openModal({
      nome: "modal" + this.props.modelo,
      tipo: "form",
      modelo: this.props.modelo,
      onSave: this.addFromform,
      id: data.value,
    });
  };

  editaModelo = (e) => {
    var id = this.props.input.value;
    this.props.openModal({
      nome: "modal" + this.props.modelo,
      tipo: "form",
      modelo: this.props.modelo,
      onSave: this.addFromform,
      id: id,
    });
  };

  onAddItem = (e, { value }) => {
    this.addItemValue = value;

    myconsole.count("==== Adicionar==== %o", this.props);
    //
    //se for tag eu ignoro e só adiciono sem chamar o modelo

    this.props.openModal({
      nome: "modal" + this.props.modelo,
      tipo: "form",
      modelo: this.props.modelo,
      onSave: this.addFromform,
      value: { nome: value },
    });
    //      }
  };

  createOptions = (o) => {
    //verifico se existe no templates
    if (_.has(templates, this.props.modelo + ".list")) {
      let func = templates[this.props.modelo].list;
      return func(o, this.props.input.value);
    } else {
      var nome = _.has(o, "nome")
        ? o.nome
        : _.get(this.props.modelOptions, "name", this.props.modelo) +
          " " +
          o._id;
      nome = _.has(o, "titulo") ? o.titulo : nome;
      var descricao = _.has(o, "descricao") ? o.descricao : "";
      var value = o._id;

      return {
        text: nome,
        value: value,
        children: (
          <div>
            {" " + nome}
            {descricao != "" && (
              <small className="gray fs07 fw100">
                <br />
                {descricao}
              </small>
            )}
          </div>
        ),
      };
    }
  };

  removeItem = (id) => {
    myconsole.log(" removeItem  %s", id);
    let value = this.props.input.value;
    if (_.isArray(value)) value = _.remove(value, (idVal) => id !== idVal);

    if (_.isEmpty(value)) {
      value = [];
    }

    this.props.input.onChange(value);
  };

  renderItens = () => {
    //so renderizo se nao for para ver inline
    if (this.state.renderInLine === true) return null;

    let selecionados;
    if (this.state.multiple) {
      selecionados = _.map(this.props.input.value, (value) =>
        _.find(this.props.itens, (v, k) => v[this.state.idKey] == value)
      );
    } else {
      selecionados = _.filter(this.props.items, (item) => {
        let achou = _.findIndex(
          this.props.input.value,
          (idSel) => idSel == item[this.state.idKey]
        );
        if (achou > -1) {
          return item;
        }
      });
    }

    return _.map(selecionados || [], (item) => {
      let ItemComponent = templates[this.props.modelo].renderItem;
      let removeItem = (e) => this.removeItem(item[this.state.idKey]);
      return (
        <div>
          <ItemComponent item={item} removeItem={removeItem} />
        </div>
      );
    });
  };

  render() {
    const {
      req,
      input,
      label,
      meta: { touched, error, valid, dirty },
      ...custom
    } = this.props;
    const { currentValue, multiple, options, isFetching, search, value } =
      this.state;

    let opcoes = this.props.itens;

    const tipo = this.props.modelo;

    //LETODO - ver subfield com req se placeholder esta ficando ok
    if (this.props.req && this.props.subField) {
      custom.placeholder += "*";
    }

    let placeholder = this.props.placeholder;

    let valor = this.props.input.value || "";

    //LETODO - verificar pq o value ta vindo como objeto nesse tipo de campo
    // Provavelmente vem do formulario HOC que nnao esta tratando o initial value do redux form direito
    // FIX temporario
    if (_.isObject(valor) && !_.isArray(valor)) {
      valor = _.get(this.props.input.value, "id");
    }

    //se nao é inline, coloco o valor selecionado vazio para o dropdown nao mostrar ninguem
    if (this.state.renderInLine === false && this.state.multiple) {
      //e removo as opcoes ja selecionadas
      opcoes = _.filter(opcoes, (item) => {
        let id = item[this.state.idKey];
        //
        let achou = _.findIndex(input.value, (idSel) => idSel == id);

        if (achou === -1) {
          return item;
        }
      });

      valor = [];
      placeholder = "Buscar...";
    }

    opcoes = _.map(opcoes, (o) => this.createOptions(o));
    opcoes = _.filter(opcoes, (o) => _.isObject(o));

    //quando nao é multiplo, coloco a opcao de nenhum
    if (this.state.multiple == false) {
      opcoes = _.concat(
        {
          value: null,
          children: <span className="cl-cor-cinza">---nenhum---</span>,
        },
        opcoes
      );
    }

    //sertifico que quando for multiple é sempre array que recebemos, mesmo se for uma coisa vazia
    if (this.props.multiple && _.isArray(valor) == false) {
      valor = [valor];
    }

    //LETODO - allowAdition fazer pegar do formOptions
    return (
      <FormField {...this.props}>
        <div className="input-wrap ui input fluid input-selecao-modelo">
          {/*{JSON.stringify(this.props.input.value)}*/}

          {this.state.rendePosition === "top" && this.renderItens()}

          {/*<span> valur: {valor} </span>*/}

          {this.props.multiple === false && this.props.input.value != 0 && (
            <Icon
              onClick={this.editaModelo}
              className="edit-icon"
              name="pencil"
              size="small"
            />
          )}

          <Dropdown
            options={opcoes}
            {...input}
            {...onlyDOMProps(custom)}
            placeholder={placeholder}
            onLabelClick={this.elementClick}
            value={valor}
            onChange={this.handleChange}
            onBlur={(e) => input.onBlur()}
            search
            selection
            fluid
            multiple={this.state.multiple}
            allowAdditions={this.props.allowAdditions}
            onAddItem={this.onAddItem}
            additionLabel={<Adicionar />}
            noResultsMessage="----Nenhum encontrado---"
            labeled={true}
            inline={true}
            onSearchChange={this.searchChange}
            loading={this.props.loading}
            disabled={this.props.disabled}
          />

          {this.state.rendePosition === "bottom" && this.renderItens()}
        </div>
      </FormField>
    );
  }
}

//esta ligado ao Store
// InputSelecaoModelo = connect( (state, ownprops)=> {return {
//   itens:state.api.entities[ownprops.modelo],
// }} , si3Actions)(InputSelecaoModelo)

export default InputSelecaoModelo;

const Adicionar = (props) => (
  <Label content="Adicionar" color="gray" size="mini" icon="plus" />
);
