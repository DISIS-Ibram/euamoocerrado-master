import React from "react";
import {
  Loader,
  Container,
  Button,
  Icon,
  Table,
  Input,
  Dropdown,
  Message,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import map from "lodash/map";
import { withRouter } from "react-router";
import _ from "lodash";
import { t, d, SI3RC_MODELS } from "models/models";
import { si3, si3Actions } from "actions/index";
import { Field, FieldArray, reduxForm, SubmissionError } from "redux-form";
import carregaModelo from "hocs/carregaModelo"; // Com erro
import Campo from "components/formfields/Campo"; // Com erro
import validacao from "util/validacoes";
import { Coluna, Item } from "components/tabelacolunas/coluna";
import * as model from "models/models";
import onlyDOMProps from "util/onlyDOMProps";

import criaconsole from "util/myconsole";
import JSONTree from "react-json-tree";
const _debug = true;
const myconsole = criaconsole(
  _debug,
  " *** Tabela.js | ",
  "color:green;font-weight:bold"
);

// // ####################### TESTE #####################################
// @carregaModelo
// export default class Tabela extends React.Component {
//   render() {
//     const { modelo } = this.props;

//     if (modelo) {
//       console.log("✅ Recebeu do carregaModelo:", modelo);
//       return (
//         <div>
//           {modelo}
//           <Campo />
//         </div>
//       );
//     } else {
//       console.log("❌ Não recebeu do carregaModelo");
//       return <h1>Tabela</h1>;
//     }
//   }
// }
// // ####################### TESTE #####################################

@carregaModelo
export default class Tabela extends React.Component {
  static defaultProps = {
          autoTable:false,   //se autoTable true, gera automaticamente a tabela
          loadFormOptions:true,
          exclude:[],
          filtros:[], //   [
                      //  {header:'Parecer',path:'',value:''},
                      //  {key:'favoravel', label:'Favoravel',path:'parecersolicitacaocriacaoregistro_set[0].favoravel',value:true},
                      //  {key:'favoravel',label:'Desfavoravel',path:'parecersolicitacaocriacaoregistro_set[0].favoravel',value:false},
                      //  {header:'Registro',path:'',value:''},
                      //  {key:'registro', label:'Com Regisros',path:'',value:''},
                      //  ]
          force:true,               // se tiver algum ghild tipo Campo, usao fornecido ao inves do automatico
          search:'all', //'',false,all, [col1,col2]
          id:'all',
          editLink:'', //link para o edit
  }
  state = {
      itensSelecionados:'',
      filtros:'',
      keyword:'',
      itensFindByKeyword:[],
      colunasVisible:[],  //nome das colunas visibles
      orderBy:"",
      searchFields:"",
      filtering:false,
      orderASC:"descending",//descending
  }
  colunasEncontrados = [];
  colunas = [];
  constructor(props){
    super(props)
    myconsole.log(" contructo | props:%o",props)
    let stateInProps = _.pick(props,_.keys(this.state))
    this.state = _.defaults(stateInProps,this.state);
    this.onBusca = this.onBusca.bind(this)
      // this.filtraPorPalavra = _.throttle(this.filtraPorPalavra,500,{leading:false, trailing:true})
  }
  componentDidMount() {
     this.props.tabelaAdd(this.props.modelo);
  }
  //montagem da tabela
  //Transversa toda a tree atras de componentes "Coluna" e processa eles de acordo
  criaColunas = (colunas)=>{
      // LETODO - fazer mesclado
      //se tenho AutoTable, crio as colunas a partir do formOptions
      //
      if(this.props.autoTable || colunas === undefined ){
           colunas = this.criaColunasFromModel();
      }
          //   _.each(this.colunas, (elm)=>{
          //      if(!elm) return elm;
          //       if( elm.type === Coluna ){
          //           this.colunasEncontrados.push({...elm.props,campo:elm});
          //           return elm; //this.criaValidacaoNoCampo(elm);) )
          //       }
          //     })
          //  return this.colunas;
      // }else{
         // this.colunasEncontrados = this.colunas;
        return React.Children.map(colunas,(elm)=>{
                  if(!elm) return elm;
                  if( elm.type === Coluna ){
                    // myconsole.log("Adicionando Coluna:%o":elm.props)
                    myconsole.log("Adicionando Coluna:%o", elm.props)
                    this.colunasEncontrados.push({...elm.props,campo:elm});
                    return elm; //this.criaValidacaoNoCampo(elm);
                  }
                  if ( _.has(elm.props,'children') ){
                    //retorno um novo elemento com o child processado tb, recursivamento isso funciona
                    let children = this.criaColunas(elm.props.children)
                    return React.cloneElement(elm,{children:children})
                  }else{
                    return elm
                  }
        })
    // }
  }
  criaColunasFromModel = () =>{
      if( _.has(SI3RC_MODELS[this.props.modelo],'tabela.coluna')){
          var colunas = _.map( SI3RC_MODELS[this.props.modelo].tabela.coluna, (v,k)=>{
              //crio uma Coluna com os props passados
              return (<Coluna {...v} />)
          })
          return colunas
      }else{
          return this.criaColunasApi();
      }
  }
  criaColunasApi = ()=>{
       const opcoes = this.props.formOptions;
       var colunas = [];
       colunas = _.map(opcoes,(v,k)=>{
                //excluo colunas que não é para mostrar
                if( _.some(this.props.exclude,v=>v===k) ){
                    return null;
                }
                //
                let label = t(v.label)
                // if(v.type.toLowerCase() === "string"){
                return (<Coluna label={label} name={k} />)
       })
       return _.without(colunas,null);
  }
  // Tabela Methods
  //---------------------------
  orderBy = (name)=>{
      if(this.state.orderBy == name){
            let order = (this.state.orderASC === "ascending") ? "descending" : "ascending";
            this.setState({orderASC:order})
      }else{
          this.setState({orderBy:name,orderASC:"ascending"});
      }
  }
  filtraPorPalavra = async (palavra) =>{
       //pego que campos eu filtro por palavra
       //faço um fuzzy searche
       //retorno os que aparecem
      myconsole.log(" filtroPorPalavras | chamando com palavra %s:", palavra);
      var itenAchados =  await si3.filterItens(this.props.itens, palavra, this.props.search)
      return itenAchados;
  }
  filterBy = (item)=>{
    // item = {key:'favoravel', label:'Favoravel',path:'parecersolicitacaocriacaoregistro_set[0].favoravel',value:true},
    var filtros = this.state.filtros;
    //vejo se ja tem o filtro
    var temfiltro = _.find(filtros, o=> _.isEqual(o, item) )
    //se ja tenho, removo ele
    if(temfiltro){
        filtros = _.omitBy(filtros, o=> _.isEqual(o, item) )
    }else{
      //vejo se ja tem um filtro com essa key
    }
    //se nao tenho, sei la o que
  }
  // Render Auxiliar Methods
  //---------------------------
 criaTableHeads = ()=>{
    //vejo todas as colunas que estao ativas
    const header = _.map(this.colunasEncontrados,col=>{
          let order = (col.orderBy || col.name ) || false;
          let sorted = (this.state.orderBy == order) ? this.state.orderASC : ""
          var sortProp = (sorted != "") ? {sorted:sorted} : {}
          return (
              <Table.HeaderCell key={"header"+col.label} {...sortProp} onClick={(e)=>this.orderBy(order)}>
                  {col.label || col.name}
              </Table.HeaderCell>)
    })
    myconsole.log("headers montados:%o",header)
    return header;
 }
 criaTableRows = ()=>{
      //pego os itens
      let {itens} = this.props;
      const { itensFindByKeyword,keyword } = this.state
      //aqui aplico os filtros normais
      //aqui aplico filtros do keyword
      if( ! _.isEmpty(itensFindByKeyword) && keyword !== ""){
        itens = _.filter(itens,(item)=> _.find( itensFindByKeyword, (v)=> v === item ) );
      }else if(_.isEmpty(itensFindByKeyword) && keyword !== ""){
          //não tenho itens
         itens = [];
         return false;
      }
      //aqui aplico ordens
      if(this.state.orderBy != ""){
         itens = _.sortBy(itens, item=>{
              var val =  item[this.state.orderBy];
              //vejo se é numero
              if(val % 1 === 0){ // Remainder will be 0 if number is integer
                return _.parseInt(val);
              } else{
                return item[this.state.orderBy].toString().toLowerCase()
              }
        });
         if(this.state.orderASC == "descending")  itens = _.reverse(itens)
      }
      return _.map(itens,item=>{
        let cols = this.criaTableCols(item);
        //LETODO - verificar quando o modelo entra como uma array ou objeto
         return(
           <Table.Row key={item._id} to={`${this.props.editLink}/${this.props.modelo}/${item._id}`}>
             <Table.Cell key={'coledit'+item._id} collapsing>
                  <div className='delataIcon' onClick={(e)=> this.props.removeItem(this.props.modelo,item._id)} >
                      <Icon  className='relative  pointer'  size='small' name='trash outline' />
                  </div>
                {this.props.editLink !='' &&
                 <Link to={`${this.props.editLink}/${item._id}`}>
                   {_.get(window,'PERM.'+this.props.modelo+'.add') &&
                    <Icon name="edit" />
                    ||
                    <Icon name="eye" />
                   }
                  </Link>
                  ||
                 <Link to={`/form/${this.props.modelo}/${item._id}`}>
                    {_.get(window,'PERM.'+this.props.modelo+'.add') &&
                    <Icon name="edit" />
                    ||
                    <Icon name="eye" />
                   }
                  </Link>
                }
             </Table.Cell>
            {cols}
           </Table.Row>
           )
      })
 }
//
 criaTableCols = (item)=>{
        return _.map(this.colunasEncontrados,(col,index)=>{
              let {name, orderBy, label, link, render, campo,format,width, ...custom} = col;
              width = (width) ? {width:si3.util.widthToSemantic(width)} : {}
              let colRender =  React.cloneElement(col.campo,{item:item})  //col.campo é o react element
              return (  <Table.Cell key={'col'+label} {...width} {...onlyDOMProps(custom)} >  {colRender} </Table.Cell>  )
          })
 }
//---------------------------
// Tabela Eventos
//---------------------------
onBusca(e){
    const palavra = _.trim(e.target.value);
    this.setState({keyword:palavra,filtering:true})
    this.filtraPorPalavra(palavra).then((data)=>{
          myconsole.log(" filtroPorPalavras | achados os ids: %o:", data);
          this.setState({itensFindByKeyword:data,filtering:false})
    })
}

// RENDER
// ---------------------------
render() {
      //crios as colunas
      this.colunasEncontrados = [] //sempre inicio com as colunas vazias
      this.criaColunas(this.props.children);
      //vejo se tenho itens, senao mensagem sem item
      if(this.props.itens === false){
        return(<div>"== Sem Itens =="</div>)
      }
      //Crios os Headers
      let tableHeads = this.criaTableHeads()
      let tableBody = this.criaTableRows()
      let Tabela;
      if(tableBody === false){
        Tabela =  <Message negative size="tiny">
              <Message.Header>Nenhum item encontrado</Message.Header>
               <p><a>clique aqui apra limpar todos os filtros da tabela</a></p>
        </Message>
      }else{
        Tabela = <Table basic='very'  collapsing celled padded striped sortable={true} definition>
                  <Table.Header fullWidth>
                        <Table.Row>
                        <Table.HeaderCell />
                        {tableHeads}
                        </Table.Row>
                  </Table.Header>
                  <Table.Body>
                      {tableBody}
                  </Table.Body>
            </Table>
      }
      return(
       <div className='t-tabela-wrap'>
          <div style={{maxWidth:'600px'}}>
              <div className="t-acima row mb2 middle-xs mt-2">
                  <div className='ui busca col-xs-8 '>
                          <Input
                            fluid
                            className="normal"
                            size='huge'
                            loading={this.state.filtering}
                            icon='search'
                            iconPosition='left'
                            placeholder='Buscar...'
                            onChange={this.onBusca}
                          />
                  </div>
                   <div className='ui filtro col-xs-2 ta-r'>
                      {/*<Dropdown  floating labeled button icon="filter">
                          <Dropdown.Menu>
                            <Dropdown.Header content='Filtrar por:' />
                            <Dropdown.Divider />
                            {_.map(this.props.filtros, (elm)=>(
                              elm.header &&
                                    <Dropdown.Header key={elm.header} content={elm.header} />
                                    ||
                                    <Dropdown.Item key={elm.label} onClick={(e)=>this.filterBy(elm)}   label={{ color: 'grey', empty: true, circular: true }} text={elm.label+" "}  />
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>*/}
                   </div>
            </div>
          </div>
         <div className="row mt-4 mb-3">
           <div className='col-xs-12 t-tabela'>
              {Tabela}
            </div>
      </div>
    </div>
      )
  }
}
