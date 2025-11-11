import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import {
  Popup,
  Header,
  Dropdown,
  Form,
  Label,
  List,
  Radio,
  Checkbox,
  Icon,
  Input,
  Dimmer,
  Loader,
  Image,
  Segment,
  Button,
  Accordion,
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

import carregaModelo from "hocs/carregaModelo";

import * as util from "util/s3util";
import { createSelector } from "reselect";
import enhanceWithClickOutside from "react-click-outside";
import ReactPlayer from "react-player";

import { FormField } from "components/formfields/index";

// import wkx from 'wkx';

import Formulario from "components/Formulario";
import formHoc from "hocs/formularioHoc";
import { Campo, CampoGrupo } from "components/formfields";

import criaconsole from "util/myconsole";

const _debug = false;
const myconsole = criaconsole(
  _debug,
  " === InputColecaoMidia | ",
  "color:green;font-weight:bold"
);

///======================================================
//     INPUT COLECAO MIDIA - Controlled component
//======================================================

// COLETANIA MIDIA INPUT
// é um Field que controla os midias
// Field
//    |_____ColecaoForm
//    |_____MidiaList
//            |_______MidiaForm
//
//---------------------------

export default class InputColecaoMidiaWrap extends React.Component {
  render() {
    var id = this.props.input.value;

    //letodo - pq so id = 0 garanto que nao vou tentar pegar id da url.
    // isso é especialmente importante quando to abrindo popup
    if (id == "") id = this.props.id;
    if (id == undefined) id = 0;

    return (
      <InputColecaoMidia
        modelo="colecao"
        {...this.props}
        id={id}
        force={true}
      />
    );
  }
}

@carregaModelo
class InputColecaoMidiaTest extends React.Component {
  static defaultProps = {
    nomeTemplate: "_colecao_midia",
    numArquivos: 0,
    modelo: "colecao",
    modeloMidia: "midia",
    multiple: true,
    force: true,
    loader: false,
    types: "all",
    modeloBase: {
      id: "",
      nome: "",
      descricao: "",
      autor: "",
      data: "",
      geom: "",
      midia_set: [],
      tags: ["teste"],
    },
  };
  render() {
    return <div>{JSON.stringify(this.props.itens)}</div>;
  }
}

@carregaModelo
class InputColecaoMidia extends React.Component {
  //lengrando que os props recebem o field tb
  //O ide da colecao vem do porps.input.value
  static defaultProps = {
    nomeTemplate: "_colecao_midia",
    numArquivos: 0,
    id: 0,
    modelo: "colecao",
    modeloMidia: "midia",
    multiple: true,
    types: "all",
    modeloBase: {
      id: "",
      nome: "",
      descricao: "",
      autor: "",
      data: "",
      geom: "",
      midia_set: [],
      tags: ["teste"],
    },
  };

  state = {
    arquivo: "",
    id: 0,
    carregando: true,
    enviando: false,
    addIndex: 0,
    totalFiles: 0,
    ultimoTotal: 0,
    colunas: 5,
    listStyle: true,
    listOpen: true,
    filtroTipo: "",
    filtroNome: "",
    filtroColecao: "",
  };

  overtimeout = 0;

  //eventos REACT
  //------------------
  //
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    // this.mostraArquivo = this.mostraArquivo.bind(this)
    this.preventDefault = this.preventDefault.bind(this);
    this.enviaArquivos = this.enviaArquivos.bind(this);
    this.salvaMidia = this.salvaMidia.bind(this);
  }

  componentDidMount() {
    myconsole.log("CDM %o", this.props.input);
    var value = this.props.input.value || this.props.value;
    //se tenho um id, carregoas midias dele
    // this.props.load(this.props.modelo,{id:value}).
    // then(()=>this.setState({carregando:false}))
  }

  componentWillReceiveProps(np, ns) {
    myconsole.log("CWRP %o", np);
  }

  componentWillUnmount() {
    clearTimeout(this.verificaTamanhoContainer);
  }

  componentDidUpdate(prevProps, prevState) {
    let el = ReactDOM.findDOMNode(this.midiacontainer);
    console.log("el MidiaContainer:", el);
    if (el) {
      var sobra = el.scrollHeight - el.clientHeight;
      console.log("sobra:", sobra);
      //se a lista nao esta aberta e nao tem sobra, sumo com a seta
      if (this.state.listOpen == false && sobra == 0) {
        this.seta.style.visibility = "hidden";
      } else {
        this.seta.style.visibility = "visible";
      }
    }
  }

  //carrego as midias da colecao
  prepareInfo = () => {
    let itens = this.props.modeloBase;
    //vejo se tem algum id
    if (this.props.input.value > 0) {
      return this.props.itens;
    } else {
      return false;
    }
  };

  preventDefault(event) {
    event.preventDefault();
  }

  //eventos dom
  //------------------
  dragOver(event) {
    event.preventDefault();
    clearTimeout(this.overtimeout);
    $(this.dropI).addClass("hover");
  }

  dragEnter(event) {
    clearTimeout(this.overtimeout);
    event.preventDefault();
    $(this.dropI).addClass("hover");
  }

  dragOut(event) {
    event.preventDefault();
    this.overtimeout = setTimeout(
      () => $(this.dropI).removeClass("hover"),
      800
    );
  }

  drop(event) {
    const {
      input: { onChange },
    } = this.props;
    event.preventDefault();
    this.processFiles(event.dataTransfer.files);
    $(this.dropI).removeClass("hover");
  }

  onChange(e) {
    //chama quando clica no input que é escondido
    const {
      input: { onChange },
    } = this.props;
    this.processFiles(e.target.files);
  }

  //eventos component
  //------------------

  showAllToogle = () => {
    this.setState({ listOpen: !this.state.listOpen });
  };

  changeColumnSize = (v) => {
    this.setState({ colunas: v });
  };

  processFiles = (files) => {
    //verifico se existe colecao
    const item = this.prepareInfo();

    //se nao existir eu crio acolecao
    if (item === false) {
      this.props
        .save(this.props.modelo, { nome: this.props.nomeTemplate, tags: [] })
        // .then((data)=>this.props.input.onChange(data.id))
        .then((data) => {
          //pego o id criado
          this.colecaoid = data[0].id;
          //
          this.enviaArquivos(files);
          //e ai aviso o redux form do novo valor
          this.props.input.onChange(this.colecaoid);
        });
    } else {
      this.colecaoid = item.id;
      this.enviaArquivos(files);
    }
  };

  async enviaArquivos(files) {
    var total = this.state.totalFiles + files.length;
    this.setState({ totalFiles: total, ultimoTotal: total });
    for (var i = 0; i < files.length; i++) {
      let file = files[i];
      let salva = await this.salvaMidia(file);
    }
    myconsole.log("RECARREGA COLECAO");
    this.props.load(this.props.modelo, { id: this.props.input.value });
  }

  async salvaMidia(file) {
    //determino o tipo
    const tipo_midia = si3.getMidiaTipo(file);
    const nome = file.name;
    const midia = {
      nome,
      tipo_midia,
      arquivo: file,
      colecao: this.colecaoid, //usoo colecao id ou do props ou do recente criado
    };

    const data = this.props.save(this.props.modeloMidia, midia);

    //de alguma maneira esse save aqui não atualiza a coletania,
    //pois só enviamos uma midia. Então precisamos atualizar a coletania também,
    //ou recarregando o ela ou inserindo o id retornado forcadamente

    return data
      .then((obj) => {
        var total = this.state.totalFiles;
        total--;
        this.setState({ totalFiles: total });
        var el = ReactDOM.findDOMNode(this.midiacontainer);
        setTimeout(() => $(el).scrollTop(el.scrollHeight), 400);
      })
      .catch((data) => {
        if (data.response.status == 400) {
          let objerror = _.mapValues(obj.resources[0], (o) => o[0]);
          // throw new SubmissionError({...objerror, _error: 'Erro' })
          alert("ocorreu um erro");
        }
      });
  }

  options = [
    {
      text: "Todos",
      value: "Filtrar",
      children: (
        <div>
          <Icon name="" /> Todos{" "}
        </div>
      ),
    },
    {
      text: "Fotos",
      value: "Fotos",
      children: (
        <div>
          <Icon name="file picture outline" /> Fotos
        </div>
      ),
    },
    {
      text: "Audio",
      value: "Audio",
      children: (
        <div>
          <Icon name="file audio outline" /> Audio
        </div>
      ),
    },
    {
      text: "Videos",
      value: "Videos",
      children: (
        <div>
          <Icon name="file video outline" /> Videos
        </div>
      ),
    },
    {
      text: "Documentos",
      value: "Documentos",
      children: (
        <div>
          <Icon name="file text outline" /> Documentos
        </div>
      ),
    },
  ];

  onChangeFilterTipo = (e, { name, value }) => {
    const tm = { Filtrar: "", Fotos: 0, Videos: 1, Audio: 2, Documentos: 3 };

    let tipo = tm[value];
    this.setState({ filtroTipo: tipo });
  };

  render() {
    myconsole.log("RENDER props:%o", this.props);

    const {
      input: { value },
    } = this.props;
    const {
      label,
      meta: { touched, error, valid, dirty },
      ...custom
    } = this.props;

    //se o valor for uma imagem
    let imagem = "";
    if (value != "" && this.state.arquivo == "") {
      imagem = value;
    } else {
      imagem = this.state.arquivo;
    }

    const item = this.prepareInfo();

    //deixo so a colecao

    // delete colecao.midia_set;

    //Se Vazio
    if (item === false) {
      return (
        <FormField className="ui InputColecaoMidia" {...this.props}>
          <div
            className="bg-white02 h-bg-white08 t04"
            ref={(i) => (this.dropI = i)}
            style={{ display: "block" }}
            onDragOver={this.dragOver.bind(this)}
            onDragEnter={this.dragEnter.bind(this)}
            onDragLeave={this.dragOut.bind(this)}
            onDrop={this.drop.bind(this)}
            onDoubleClick={this.showAllToogle}
            onClick={() => this.fileInput.click()}
            className="ui colecao-midia-drop"
          >
            {/*this.state.totalFiles > 0 &&
                  
                  */}

            <div className=" upload float-right ta-r col-xs-6">
              <i className="fs2 op04 t02 h-cl-ae1 h-op1 fa fa-cloud-upload" />
            </div>

            <div>
              <input
                style={{ display: "none" }}
                type="file"
                onChange={this.onChange}
                multiple="multiple"
                ref={(input) => (this.fileInput = input)}
              />
            </div>
          </div>
        </FormField>
      );

      //Se existe Colecao
    } else {
      let colecao = { ...item };

      let classeOpen = this.state.listOpen ? "fa-caret-up" : "fa-caret-down";

      return (
        <FormField className=" ui InputColecaoMidia" {...this.props}>
          <div className="row toolbar-top end-xs middle-xs mr05 pb06 op08 h-op1 mt--20px">
            <div className="col-xs-2 ta-r">
              <Header as="h6" className="fl-r">
                <Icon name="filter" />
                <Header.Content>
                  {" "}
                  <Dropdown
                    inline
                    onChange={this.onChangeFilterTipo}
                    options={this.options}
                    defaultValue={this.options[0].value}
                  />
                </Header.Content>
              </Header>
            </div>

            <div className="col-xs-6 end-xs middle-xs">
              <div className="row end-xs middle-xs ">
                {!this.state.listStyle && (
                  <div className="row middle-xs">
                    <div className="col-xs mr05 pt20px">
                      <i className="fa fs09 fa-picture-o op05 iln mt05" />
                    </div>

                    <div className="col-45px mr05 ml05">
                      <input
                        className=""
                        onChange={(e) => this.changeColumnSize(e.target.value)}
                        type="range"
                        min="3"
                        max="10"
                        value={this.state.colunas}
                        id="fader"
                      />
                    </div>

                    <div className="col-xs mr05 pt20px">
                      <i className="fa  fs05 fa-picture-o op05 iln mt05" />
                    </div>
                  </div>
                )}

                {!this.state.listStyle && (
                  <div
                    onClick={() => this.setState({ listStyle: true })}
                    className=" cp ml1 mr05 pt20px"
                  >
                    <i className="fs1 op05 iln mt05 fa fa-list" />
                  </div>
                )}

                {this.state.listStyle && (
                  <div
                    onClick={() => this.setState({ listStyle: false })}
                    className=" cp ml1 mr05 pt20px"
                  >
                    <i className="fs1 op05 iln mt05 fa fa-th" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="bg-white02 h-bg-white08 t04"
            ref={(i) => (this.dropI = i)}
            style={{ display: "block" }}
            onDragOver={this.dragOver.bind(this)}
            onDragEnter={this.dragEnter.bind(this)}
            onDragLeave={this.dragOut.bind(this)}
            onDrop={this.drop.bind(this)}
            onDoubleClick={this.showAllToogle}
            className="ui colecao-midia-drop"
          >
            {this.state.totalFiles > 0 && (
              <div className="full zi10 row center-xs middle-xs bg-cor-laranja06">
                <Loader
                  className="cl-white1"
                  active
                  content={`Enviando ${
                    this.state.ultimoTotal - this.state.totalFiles + 1
                  } de ${this.state.ultimoTotal}`}
                  inline="centered"
                />
              </div>
            )}

            <MidiaList
              colunas={this.state.colunas}
              ref={(el) => (this.midiacontainer = el)}
              colecao={colecao}
              midias={item.midia_set}
              listStyle={this.state.listStyle}
              listOpen={this.state.listOpen}
              filtroTipo={this.state.filtroTipo}
            />

            <div className="mt1 toolbar row">
              <div
                ref={(v) => (this.seta = v)}
                className="loat-left ta-r col-xs-6"
              >
                <i
                  onClick={this.showAllToogle}
                  className={
                    classeOpen +
                    " mr--20px mt--30px fs2 op04 t02 h-cl-ae1 h-op1 fa fr"
                  }
                ></i>
              </div>

              <div className=" upload float-right ta-r col-xs-6">
                <i
                  onClick={() => this.fileInput.click()}
                  className="fs2 op04 t02 h-cl-ae1 h-op1 fa fa-cloud-upload"
                />
              </div>
            </div>

            <Accordion className="mt--2">
              <Accordion.Title>
                {" "}
                <Label> Detalhes da coleção </Label>{" "}
              </Accordion.Title>
              <Accordion.Content>
                <ColecaoForm
                  id={colecao.id}
                  nomeTemplate={this.props.nomeTemplate + "_" + colecao.id}
                />
              </Accordion.Content>
            </Accordion>
          </div>

          <div>
            <input
              style={{ display: "none" }}
              type="file"
              onChange={this.onChange}
              multiple="multiple"
              ref={(input) => (this.fileInput = input)}
            />
          </div>
        </FormField>
      );
    }
  }
}

// const mapstpColetania = (state, ownprops) => {

//       return {items: si3.serializeByModeloID("colecao",ownprops.input.value)}
// }

// //esta ligado ao Store
// InputColecaoMidia = connect(mapstpColetania, si3Actions)(InputColecaoMidia)

// export default InputColecaoMidia

// Colecao Midias
// contem um conjunto de MidiasForm
//---------------------------
export class MidiaList extends React.Component {
  static defaultProps = {
    midias: [],
    colecao: { id: 0 },
    colunas: 8,
    listStype: false,
    listOpen: false,
    filtroTipo: "",
    conteudoAdicionalMidia: () => null,
  };

  componentDidUpdate(prevProps, prevState) {}

  //LETODO
  //talves incluir uma opção de ordenar??
  //Verificar com diegao se tem essa opcao

  render() {
    let midias = this.props.midias;
    if (_.isNumber(this.props.filtroTipo)) {
      midias = _.filter(midias, (m) => m.tipo_midia == this.props.filtroTipo);
    }

    let size = 100 / this.props.colunas + "%";

    let sizeCol = this.props.listStyle ? "100%" : size;

    var style = {};
    style.height = this.props.listOpen ? "auto" : "100px";
    style.overflow = this.props.listOpen ? "auto" : "auto";

    return (
      <div
        ref="midiaContainer"
        className={"midias-container " + (this.props.listOpen && "open")}
        style={style}
      >
        {_.map(midias, (m, k) => (
          <div
            key={"midia" + m.id}
            style={{ width: sizeCol }}
            className="midia-col"
          >
            <MidiaItem
              conteudoAdicionalMidia={this.props.conteudoAdicionalMidia}
              key={"midia" + m.id}
              form={"midia" + m.id}
              initialValues={m}
              midia={m}
              enableReinitialize={true}
              listStyle={this.props.listStyle}
              size={size}
            />
          </div>
        ))}
      </div>
    );
  }
}

// Colecao FORM
//---------------------------
@formHoc
class ColecaoForm extends React.Component {
  static defaultProps = {
    nomeTemplate: "_colecao_midia",
    modelo: "colecao",
    autoForm: false,
    loadFormOptions: false,
    force: true,
    // exclude:["midia_set"],
    modeloBase: {
      nome: "",
      descricao: "",
      autor: "",
      data: "",
      geom: "",
      midia_set: [],
    },
  };

  antesDeSalvar(values) {
    console.log("Antes de Salva Values", values);
    delete values.midia_set;
    // delete values.tags;
    return values;
  }

  depoisDeSalvar(response, dispache) {
    console.log("%cresponse: %o", "color:red;font-size:40px", response);
  }

  render() {
    return (
      <Formulario
        tipo="small"
        {...this.props}
        tipo="placeholder mini"
        butoesOnPristine={true}
      >
        <Campo
          tipo="texto"
          name="nome"
          label="Nome"
          valueInvisible={this.props.nomeTemplate}
        />
        <Campo tipo="texto" name="autor" label="Autor" />
        <Campo tipo="textoarea" name="descricao" label="Descricao" />
        <Campo tipo="data" name="data" label="Data" />
        <Campo tipo="point" name="geom" label="Localização" />
        <Campo tipo="modelo" multiple modelo="tag" name="tags" label="Tags" />
      </Formulario>
    );
  }
}

// Midia Item
//---------------------------

class MidiaItem extends React.Component {
  static defaultProps = {
    modelo: "midia",
    midia: {
      nome: "",
      descricao: "",
      autor: "",
      data: "",
      geom: "",
      arquivo: "",
    },
  };

  state = { open: false };

  toogle = (e) => {
    this.setState({ open: !this.state.open });
  };

  open = (e) => {
    this.setState({ open: true });
  };

  //Funcoes da coletania
  salva = (values) => {
    let varnew = { ...values };
    delete varnew.tags;
    delete varnew.arquivo; //tb pago o arquivo, pois aqui é sempre um patch, e nao posso enviar o nome do arquivo

    const data = this.props.save(this.props.modelo, varnew);
    return data.then((obj) => {
      if (obj.response.status == 400) {
        let objerror = _.mapValues(obj.resources[0], (o) => o[0]);
        throw new SubmissionError({ ...objerror, _error: "Erro" });
      }
    });
  };

  view = (e) => {
    e.preventDefault;
    // this.abrirlink.click();
  };

  render() {
    const { handleSubmit, load, pristine, reset, submitting } = this.props;

    let MidiaRender = <div></div>;

    if (this.props.midia.tipo_midia == 0)
      MidiaRender = (
        <div className="midia-preview" onClick={this.toogle}>
          <div
            className="fundo"
            style={{
              backgroundImage:
                "url(" + util.thumb(this.props.midia.arquivo, 200) + ")",
            }}
          ></div>
          <div
            className="fundo hover"
            style={{
              backgroundImage:
                "url(" + util.thumb(this.props.midia.arquivo, 200) + ")",
            }}
          ></div>
          <div className="opcoes"></div>
        </div>
      );

    if (this.props.midia.tipo_midia == 1)
      MidiaRender = (
        <div className="midia-preview video" onClick={this.toogle}>
          <div className="fundo bg-cor-bege row middle-xs center-xs">
            <div className="col-xs-11">
              <div>
                <i className="fa fa-file-video-o fa-2x"></i>
              </div>
              <div className="ta-c fs07 truncate">{this.props.midia.nome}</div>
            </div>
          </div>
          <div className="opcoes"></div>
        </div>
      );

    if (this.props.midia.tipo_midia == 2)
      MidiaRender = (
        <div className="midia-preview audio" onClick={this.toogle}>
          <div className="fundo bg-cor-bege row middle-xs center-xs ">
            <div className="col-xs-11">
              <div>
                <i className="fa fa-file-audio-o fa-2x"></i>
              </div>
              <div className="ta-c fs07 truncate">{this.props.midia.nome}</div>
            </div>
          </div>
          <div className="opcoes"></div>
        </div>
      );

    if (this.props.midia.tipo_midia == 3)
      MidiaRender = (
        <div className="midia-preview documento" onClick={this.toogle}>
          {(this.props.midia.arquivo.toLowerCase().indexOf(".pdf") > -1 && (
            <div
              className="fundo row middle-xs center-xs "
              style={{
                backgroundImage:
                  "url(" + util.thumb(this.props.midia.arquivo, 200) + ")",
              }}
            >
              <div className="col-xs-11 icone-com-thumb">
                <div>
                  <Label size="mini" color="orange">
                    <i className="fa fa-file-pdf-o fa-2x"></i>
                  </Label>
                </div>
                {/*<div className='ta-c fs07 truncate'><Label size="mini" color="gray">{this.props.midia.nome}</Label></div>*/}
              </div>
            </div>
          )) || (
            <div className="fundo row middle-xs center-xs ">
              <div className="col-xs-11">
                <div>
                  <i className="fa fa-file-text-o fa-2x"></i>
                </div>
                <div className="ta-c fs07 truncate">
                  {this.props.midia.nome}
                </div>
              </div>
            </div>
          )}

          <div className="opcoes"></div>
        </div>
      );

    if (this.props.listStyle) {
      MidiaRender = (
        <div
          onClick={this.toogle}
          className="row h-bg-a02 middle-xs col-xs-12 bbd"
        >
          <div
            className="col-xs-2 mt-05 mb-05"
            style={{ width: this.props.size }}
          >
            {MidiaRender}
          </div>

          <div className="col-xs mr10">
            <b className="cl-ae">{this.props.midia.nome}</b>
            <br />
            {this.props.midia.autor != undefined && (
              <small>
                <i>Autor:{this.props.midia.autor}</i>
                <br />
              </small>
            )}
            {this.props.midia.data != undefined && (
              <small>
                <i>Data:{this.props.midia.data}</i>
                <br />
              </small>
            )}
            <small className="cl-b07">{this.props.midia.descricao}</small>

            <div>
              {/*LETODO - Depois ver com diego a possibilidade de pega a lista de midia ja com o modelo associado,
                          pois quando mostro a midia em lista nao vai requisitar a url para pegar tudo isso*/}
              {/*{this.props.conteudoAdicionalMidia(this.props.midia)}*/}
            </div>
          </div>
        </div>
      );
    }

    var conteudo = (
      <div ref={(e) => (this.detail = e)} style={{ width: "400px" }}>
        <MidiaForm id={this.props.midia.id} />
        <div className="row center-xs">
          <div className="col-xs-10 cl-white">
            {this.props.conteudoAdicionalMidia(this.props.midia)}
          </div>
        </div>
      </div>
    );
    return (
      <div
        ref={(e) => (this.midiaform = e)}
        className={
          "midia-form " +
          (this.state.open && " open ") +
          " " +
          (this.props.listStyle && " lista ")
        }
      >
        <Popup
          trigger={MidiaRender}
          content={conteudo}
          on="click"
          position="bottom center"
          inverted
          flowing
        />
      </div>
    );
  }
}

// Midia Item
//---------------------------

class MidiaItemBak extends React.Component {
  static defaultProps = {
    modelo: "midia",
    midia: {
      nome: "",
      descricao: "",
      autor: "",
      data: "",
      geom: "",
      arquivo: "",
    },
  };

  state = { open: false };

  toogle = (e) => {
    this.setState({ open: !this.state.open });
  };

  open = (e) => {
    this.setState({ open: true });
  };

  componentDidUpdate(pp, ps) {
    if (this.state.open) {
      this.pai = $(this.midiaform).parent().parent()[0];

      this.detailtimeout = setInterval(() => {
        //LETODO! - verificar pq as vezes da erro
        try {
          var pos = this.midiaform.getBoundingClientRect();
          var pos2 = this.detail.getBoundingClientRect();
          var left = pos.left - (pos2.width - pos.width) / 2;
          var top = pos.bottom;

          top += window.scrollY;

          //certifico que o depois da midia aparece dentro da area visivel
          if (left < 60) {
            let dif = 70 - left;
            left = 70;
            $(this.detail)
              .find(".seta")
              .css("marginLeft", -dif + "px");
          }

          var right = left + pos2.width;
          var larg = $(window).width();

          if (right > larg) {
            let dif = right - larg;
            left = left - dif;
            $(this.detail)
              .find(".seta")
              .css("marginLeft", dif + "px");
          }

          var ft = pos.top;
          var fb = pos.bottom;

          var pt = this.pai.getBoundingClientRect().top;
          var pb = this.pai.getBoundingClientRect().bottom;

          if (fb < pt || ft > pb) {
            $(this.detail).css({ display: "none" });
          } else {
            $(this.detail).css({
              display: "block",
              top: top + "px",
              left: left + "px",
            });
          }
        } catch (e) {}
      }, 50);
    } else {
      clearInterval(this.detailtimeout);
    }
  }

  componentWillUnmount() {
    clearInterval(this.detailtimeout);
  }

  //criado pelo HOC click outside
  handleClickOutside() {
    this.setState({ open: false });
  }

  //Funcoes da coletania
  salva = (values) => {
    let varnew = { ...values };
    delete varnew.tags;
    delete varnew.arquivo; //tb pago o arquivo, pois aqui é sempre um patch, e nao posso enviar o nome do arquivo

    const data = this.props.save(this.props.modelo, varnew);
    return data.then((obj) => {
      if (obj.response.status == 400) {
        let objerror = _.mapValues(obj.resources[0], (o) => o[0]);
        throw new SubmissionError({ ...objerror, _error: "Erro" });
      }
    });
  };

  view = (e) => {
    e.preventDefault;
    // this.abrirlink.click();
  };

  render() {
    const { handleSubmit, load, pristine, reset, submitting } = this.props;

    let MidiaRender = <div></div>;

    if (this.props.midia.tipo_midia == 0)
      MidiaRender = (
        <div className="midia-preview" onClick={this.toogle}>
          <div
            className="fundo"
            style={{
              backgroundImage:
                "url(" + util.thumb(this.props.midia.arquivo, 200) + ")",
            }}
          ></div>
          <div
            className="fundo hover"
            style={{
              backgroundImage:
                "url(" + util.thumb(this.props.midia.arquivo, 200) + ")",
            }}
          ></div>
          <div className="opcoes"></div>
        </div>
      );

    if (this.props.midia.tipo_midia == 1)
      MidiaRender = (
        <div className="midia-preview video" onClick={this.toogle}>
          <div className="fundo bg-cor-bege row middle-xs center-xs">
            <div className="col-xs-11">
              <div>
                <i className="fa fa-file-video-o fa-2x"></i>
              </div>
              <div className="ta-c fs07 truncate">{this.props.midia.nome}</div>
            </div>
          </div>
          <div className="opcoes"></div>
        </div>
      );

    if (this.props.midia.tipo_midia == 2)
      MidiaRender = (
        <div className="midia-preview audio" onClick={this.toogle}>
          <div className="fundo bg-cor-bege row middle-xs center-xs ">
            <div className="col-xs-11">
              <div>
                <i className="fa fa-file-audio-o fa-2x"></i>
              </div>
              <div className="ta-c fs07 truncate">{this.props.midia.nome}</div>
            </div>
          </div>
          <div className="opcoes"></div>
        </div>
      );

    if (this.props.midia.tipo_midia == 3)
      MidiaRender = (
        <div className="midia-preview documento" onClick={this.toogle}>
          {(this.props.midia.arquivo.toLowerCase().indexOf(".pdf") > -1 && (
            <div
              className="fundo row middle-xs center-xs "
              style={{
                backgroundImage:
                  "url(" + util.thumb(this.props.midia.arquivo, 200) + ")",
              }}
            >
              <div className="col-xs-11 icone-com-thumb">
                <div>
                  <Label size="mini" color="orange">
                    <i className="fa fa-file-pdf-o fa-2x"></i>
                  </Label>
                </div>
                {/*<div className='ta-c fs07 truncate'><Label size="mini" color="gray">{this.props.midia.nome}</Label></div>*/}
              </div>
            </div>
          )) || (
            <div className="fundo row middle-xs center-xs ">
              <div className="col-xs-11">
                <div>
                  <i className="fa fa-file-text-o fa-2x"></i>
                </div>
                <div className="ta-c fs07 truncate">
                  {this.props.midia.nome}
                </div>
              </div>
            </div>
          )}

          <div className="opcoes"></div>
        </div>
      );

    if (this.props.listStyle) {
      MidiaRender = (
        <div
          onClick={this.toogle}
          className="row h-bg-a02 middle-xs col-xs-12 bbd"
        >
          <div
            className="col-xs-2 mt-05 mb-05"
            style={{ width: this.props.size }}
          >
            {MidiaRender}
          </div>

          <div className="col-xs mr10">
            <b className="cl-ae">{this.props.midia.nome}</b>
            <br />
            {this.props.midia.autor != undefined && (
              <small>
                <i>Autor:{this.props.midia.autor}</i>
                <br />
              </small>
            )}
            {this.props.midia.data != undefined && (
              <small>
                <i>Data:{this.props.midia.data}</i>
                <br />
              </small>
            )}
            <small className="cl-b07">{this.props.midia.descricao}</small>

            <div>
              {/*LETODO - Depois ver com diego a possibilidade de pega a lista de midia ja com o modelo associado,
                          pois quando mostro a midia em lista nao vai requisitar a url para pegar tudo isso*/}
              {/*{this.props.conteudoAdicionalMidia(this.props.midia)}*/}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={(e) => (this.midiaform = e)}
        className={
          "midia-form " +
          (this.state.open && " open ") +
          " " +
          (this.props.listStyle && " lista ")
        }
      >
        {MidiaRender}

        {this.state.open && (
          <div ref={(e) => (this.detail = e)} className="detail p-3">
            <div className="seta"></div>
            <MidiaForm id={this.props.midia.id} />
            <div className="row center-xs">
              <div className="col-xs-10 cl-white">
                {this.props.conteudoAdicionalMidia(this.props.midia)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

MidiaItemBak = enhanceWithClickOutside(MidiaItem);

// Midia Form
//---------------------------
@formHoc
class MidiaForm extends React.Component {
  static defaultProps = {
    modelo: "midia",
    autoForm: false,
    loadFormOptions: true,
    exclud: ["colecao"],
  };

  antesDeSalvar(values) {
    delete values.arquivo; //pq nunca posso salvar o arquivo, so criar. e aqui é so um formulario de edicao
    return values;
  }

  depoisDeSalvar() {
    //nao faco nada
  }

  remove = () => {
    var ok = confirm(
      "Deseja apagar o Arquivo '" + this.props.itens.nome + "'?"
    );

    if (ok === true) {
      this.props.remove(this.props.modelo, { id: this.props.itens.id });
    }
  };

  render() {
    let midia = this.props.itens;

    return (
      <div>
        <div className="row middle-xs mt--1">
          <div className="col-xs-12">
            <Button.Group className="fl-l" basic size="small">
              <Button
                as="a"
                href={midia.arquivo}
                target="_blank"
                className="cl-w h-bg-b05"
                icon="search"
              />
              <Button
                as="a"
                className="cl-w h-bg-b05"
                icon="download"
                href={window.SI3CONFIG.downloadMidia + midia.id}
              />
              <Button
                as="a"
                onClick={this.remove}
                className="cl-b06 h-bg-b05"
                icon="trash"
              />
            </Button.Group>

            {/* <Button.Group className='fl-r' basic size='small'>
                          
                        </Button.Group> */}
          </div>
        </div>

        <div className="row col-xs-12 mt-05">
          {midia.tipo_midia == 2 && (
            <ReactPlayer
              width="100%"
              height="40px"
              url={midia.arquivo}
              controls={true}
              playing
            />
          )}

          {midia.tipo_midia == 1 && (
            <ReactPlayer
              width="100%"
              height="auto"
              url={midia.arquivo}
              controls={true}
              playing
            />
          )}

          {/*LETODO - ver possibilidade de carregar midia usando o thumb_url sem fazer o crop para vizualizar */}
          {midia.tipo_midia == 0 && (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "0",
                paddingBottom: "56%",
              }}
            >
              <img
                src={midia.arquivo}
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
              <div
                className="full bg-contain"
                style={{ backgroundImage: "url(" + midia.arquivo + ")" }}
              ></div>
            </div>
          )}

          {midia.tipo_midia == 3 &&
            midia.arquivo.toLowerCase().indexOf(".pdf") && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "0",
                  paddingBottom: "56%",
                }}
              >
                <img
                  src={util.thumb(midia.arquivo, 600)}
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
                <div
                  className="full bg-contain"
                  style={{
                    backgroundImage:
                      "url(" + util.thumb(midia.arquivo, 600) + ")",
                  }}
                ></div>
              </div>
            )}
        </div>

        <div className="row center-xs col-xs-12">
          <div className="col-xs-12 col-sm-12 col-lg-10">
            <div className="virtualForm formulario formulario-pequeno formulario-invertido">
              <Formulario
                tipo="small placeholder mini"
                {...this.props}
                butoesOnPristine={true}
              >
                <Campo tipo="texto" name="nome" label="Nome" />
                <Campo tipo="texto" name="autor" label="Autor" />
                <Campo tipo="textoarea" name="descricao" label="Descricao" />
                <Campo tipo="data" name="data" label="Data" />
                <Campo tipo="point" name="geom" label="Localização" />
                <Campo
                  tipo="modelo"
                  modelo="tag"
                  multiple
                  name="tags"
                  label="Tags"
                />
              </Formulario>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
