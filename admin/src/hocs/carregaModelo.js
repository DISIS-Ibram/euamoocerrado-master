import React, { Component } from 'react';
// import PropTypes from 'prop-types'
// React.PropTypes = PropTypes;
import { Loader, Container, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
// import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
// import map from "lodash/map";
// import { withRouter } from 'react-router'
// import _ from 'lodash';
import { t, d } from 'models/models';
import { si3, si3Actions } from 'actions/index';
import { createSelector } from 'reselect';
// import { Field, reduxForm, SubmissionError } from 'redux-form';
import getItemID from './getItemID'

import processaResources from '../util/processaResourcesWithState.js'
import criaconsole from 'util/myconsole'

const _debug = false;
const myconsole = criaconsole(false, ' *** CarregaModelo.js | ', 'color:blue;font-weight:bold')
const myconsoleCS = criaconsole(false, ' *** createSelector | ', 'color:red;font-weight:bold')
const myconsoleMP = criaconsole(false, ' *** mapStateToProps | ', 'color:orange;font-weight:bold')

//======================================================
//    HOC - LOADER COMPONENT
//    Usado para carregar um ou mais modelos que colocamos no props modelo
//    em id
//======================================================

// Props:
// modelo - string ou array dos modelos, ou object com {type:xxx,include:array }
// include - que modelo relacionado eu incluo no modelo - so no caso do modelo ser string
// id       string ou array, que vai ser usado para o modeloou primeiro elemento da array do modelo. 
//          se modeloNome for objeto, essa propriedade vai ser ignorada
// resources - algum resource a mais que passo para carregar o modelo.  Ustil para utilizar alguma coisa na minha redux store como $usuario.is


// retorna  um component incluindo as seguintes situacoes
//          props.itens se uma string de modelo
//          props.itens.modeloXX se modelos em array
//          props.loadingStatus = [ start | loading | loaded | erro ]




export default function carregaModelo(Wc) {

    let newClass = class CarregaModeloComponent extends Wc {

        static propTypes = {
            modelo: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.array,
                React.PropTypes.object,
            ]).isRequired,
            //LETODO - verificar pq id não esta funcionando
            idd: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.array
            ]),
            include: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.array,
            ]),
        }


        static defaultProps = {
            loadFormOptions: true,
            autoForm: false,
            loader:true,
            force:false,
            resources:{},
            options:{}
             //objeto que envio para a api
        }


        state = {
            carregando: true,
            erro: false,
            id:0,
            totalDeModelosToLoad: 0,
            modelosToLoad: {}, //type:,obj:{},opt{includes},
            loadingStatus: 'start'
        }


        constructor(props) {
            super(props)
        }


        componentWillMount() {

            //SETUP VARS
            let id = "";
            let precisaCarregar = true;
            var props = processaResources(this.props);
             
            let loadingStatus = 'start';



            if (props.id) {
                if (props.id === '' || props.id == 'all' || props.id == undefined) {
                    id = ''
                } else {
                    id = props.id;
                }
            }

            // coloco um id dentro do resource se existir, isso para ajudar na requesicao a api em casos especiais
            this.resources = this.props.resources;
            if (id != 0 && id != 'new') { //so 0 ou new, vazio como "" eu nao considero como um id
                this.resources.id = id;
            }



            //Crio os modelos que vou carregar
            this.criaModelos();

            
            //se ja tenho os modelos carregados, nao preciso carregar mais
            if (this.modelosCarregados() === true) {
                precisaCarregar = false;
                loadingStatus = 'loaded';
            }

            if(this.props.force){
                precisaCarregar = true;
                loadingStatus = 'start';
            }
            

            this.state = {
                ...this.state,
                id: id,
                carregando: precisaCarregar,
                loadingStatus:loadingStatus
            }

            if (super.componentWillMount) super.componentWillMount();

    
        }





        componentDidMount() {
            
            if(this.props.force || this.state.loadingStatus != 'loaded'){
                // this.setState({loadingStatus:'start',precisoCarregar:trus})
                this.loadModel();
            }else{
                myconsole.log('Nao preciso carregar pois ja tenho itens:',this.props.itens)
            }
        }


        //LETODO - verificar se nao preciso fazer a 
        //chamada manualmente para os outros lifecycle do react
        loadModel = () => {
            let total = 0;
            var props = processaResources(this.props);
                   
            
            this.setState({'loadingStatus':'loading'})

            _.forEach(this.modelosToLoad, v => {
                if (props.loadFormOptions === true) {
                    props.loadOptions(v.type)
                    myconsole.log('load form option para:',v.type)
                }
                total++;
                this.props.load(v.type, v.obj, v.opt)
                    .then((data) => {    
                        myconsole.log('this.props.load retornou:',data)
                        var totalDeModelosToLoad = this.totalDeModelosToLoad;
                        this.totalDeModelosToLoad-- //totalDeModelosToLoad--;
                        // this.setState({ "totalDeModelosToLoad": totalDeModelosToLoad });
                        this.modelosCarregados(); //nao sei pq ainda, mas preciso forcar a verificacao dos modelos carregados. provavelment pq nao recebo um props diferente quando carrego um modelo vazio

                    })
                    .catch((erro) => {
                        myconsole.count("erro")
                        myconsole.log('ERRO: ', erro);
                        let msg = erro.statusText;
                        if (erro.status == 404) {
                            msg = "O objeto requisitado não existe";
                        }
                        this.setState({'loadingStatus':'erro', erro: msg})
                        this.modelosCarregados();
                    }
                )
            })

            this.setState({
                modeloToLoad: total
            })

        }




        //CHECO SE TUDO JA FOI CARREGADO OU NÃO
        modelosCarregados = (props = this.props) => {
   
            props = processaResources(props);

            if(this.state.loadingStatus=='loaded'){
                return true;
            }

    
            //CHECAR quando o modelos nao existe tambem

            //LETODO - tem que ver opcao em que vai carregar uma lista mas ja veio de um form, 
            //nesse caso o itens já não é falso


            let carregouItens = false;
            let carregouFormOptions = false;

            //Verifico os modelos

            //se é so um modelo vejo se o itens é falso
            if (this.modelosToLoad.length == 1 && _.isString(props.modelo)) {
                if (props.itens !== false)  carregouItens = true
            //se tenho vario modelos vejo se todos os subitens de itens nao é falso   
            } else if (this.modelosToLoad.length > 0 && _.isArray(props.modelo)) {
                if (props.itens) {
                    let temFalse = _.find(props.itens, (v, k) => v === false)
                    if (temFalse === undefined)
                        carregouItens = true
                }
            }


            //aqui verifico se ja carreguei os modelos, mesmo que nao tenha retornado nada
            if(this.jaRodouAPrimeiraVez){
                if(this.totalDeModelosToLoad == 0){
                    carregouItens = true
                }
            }
            this.jaRodouAPrimeiraVez = true

            //Verifico os formOptions
            if (props.loadFormOptions === true) {
                //se é so um modelo vejo se o itens é falso
                if (this.modelosToLoad.length == 1 && _.isString(props.modelo)) {
                    if (_.isEmpty(props.formOptions) == false)
                        carregouFormOptions = true
                //se tenho vario modelos vejo se todos os subitens de itens nao é falso   
                } else if (this.modelosToLoad.length > 0 && _.isArray(props.modelo)) {
                    if (props.formOptions) {
                        let temFalse = _.find(props.formOptions, (v, k) => _.isEmpty(v))
                        if (temFalse === undefined)
                            carregouFormOptions = true
                    }
                }
            } else {
                carregouFormOptions = true
            }



            if (props.id === 0 || props.id === "0" || props.id == "new") {
                carregouItens = true
            }

            if (this.state.modeloToLoad == 0 && this.state.loadingStatus == 'loading') {
                carregouItens = true;
            }

            if(carregouItens && carregouFormOptions){
                this.setState({'loadingStatus':'loaded'})
            }
            
            return (carregouItens && carregouFormOptions);
        }



        componentWillReceiveProps(np) {

            // myconsole.count(" CarregaModeloComponent -> componentWillReceiveProps  ===================================")
            // myconsole.log("nextProps:")
            // myconsole.log(np)
            // myconsole.log("Props:")
            // myconsole.log(this.props)

            //caso ja tenha recebido toods os itens que estava carregando, mostro o render
            if (this.modelosCarregados(np) === true && this.state.carregando) {
                this.setState({
                    carregando: false
                })
                this.prepareInfo()
            }
            if (super.componentWillReceiveProps) super.componentWillReceiveProps(np);
        }



        componentWillUpdate(np, ns) {
                this.modelosCarregados(np);
        }


        // funcao chamada na preparacao do item depois que carregados
        prepareInfo() {
            if (super.prepareInfo) super.prepareInfo().bind(this);
        }





        // CRIO UM OBJETO MODELOS, USO ELE PARA CARREGAR
        criaModelos = ()=>{
              const {modelo, include, resources} = this.props;
                let modelosToLoad = [];
                
                //crio os modelos que vou carregar
                if (_.isArray(modelo)) {
                    _.forEach(modelo, (v, i) => {
                        let obj = (i == 0) ? resources : {}
                        modelosToLoad.push({
                            type: v,
                            obj: obj,
                            opt: {
                                include: include
                            }
                        })
                    })
                } else if (_.isObject(modelo)) {

                    modelosToLoad = [modelo]
                
                } else if (_.isString(modelo)) {

                    modelosToLoad = [{
                        type: modelo,
                        obj: {...this.resources},
                        opt: {
                            include: include,
                            ...this.props.options
                        }
                    }]

                } else {
                    
                    throw new Error("é nescessario especificar alguma prop modelo")

                }

                this.modelosToLoad = modelosToLoad;
                this.totalDeModelosToLoad = this.modelosToLoad.length
                this.state = {...this.state}
                return this.modelosToLoad
        }







        //RENDER
        render() {

            myconsole.count('RENDER CarregaModeloComponent '+this.props.modelo)
            myconsole.log(this.props)

            // LETODO - vezer renderizar loading opcional, 
            // para componentes que nnao sao de pagina inteira
            if (this.state.loadingStatus == 'start' || this.state.loadingStatus == 'loading' && this.props.loader === true ) {
                return (
                    <div className="">
                      { this.state.erro &&
                        <Message negative>
                          <Message.Header>Ocorreu um erro</Message.Header>
                          <p>
                            { this.state.erro }
                          </p>
                        </Message>
                        ||
                        <Loader active content='Carregando...' inline='centered' /> }
                    </div>
                )

            } else {

                let itens = (this.state.loadingStatus == 'loaded') ? this.props.itens : []
                let loading = (this.state.loadingStatus == 'loaded' || this.state.loadingStatus == 'erro' ) ? false : true;
                let erro = (this.state.erro !== false) ? true : false;

                return <Wc {...this.props} itens={ this.props.itens } loading={ loading } erro={ erro } />;
            }

         }

    } // fim classe BaseForm





    //Criando os Selector
    //----------------------
    //
    const makeSelector = (state, props) => {
        // props = processaResources(props);

        let getModeloApi = (state, props) => {
            // props = processaResources(props);
            // myconsole.log("%cchamando getModeloApi Loader Comp",'color:brown');
            //LETODO - verificar o que fazer com array de IDS 
            if (props.id != 'all') { //se tenho id- tem que ser o ID só para o primeiro modelo
                if (_.has(state.api.entities[props.modelo], props.id)) {
                    //utilizando o updeep no reducer garanto a referencia ao objeto se nao mudar,
                    // e o reselect === funciona
                    return state.api.entities[props.modelo][props.id]
                } else {
                    return ""
                }
            } else {
                return state.api.entities[props.modelo]
            }
        }


        let getFormOptions = (state, props) => {
            if ( _.has(state.api.modelOptions[props.modelo], 'actions.POST') ) {
                return state.api.modelOptions[props.modelo].actions.POST
            }else if ( _.has(state.api.modelOptions[props.modelo], 'actions.GET') ) {
                return state.api.modelOptions[props.modelo].actions.GET
            } else {
                return false
            }
        }

       let getModelOptions = (state, props) => {
            if ( _.has(state.api.modelOptions,props.modelo) ) {
                return state.api.modelOptions[props.modelo]
            } else {
                return false
            }
        }

        let getIDVal = (state, props) => {
        //    props = processaResources(props);
            myconsoleCS.count("chamando getIDVal Loader Comp:", props);
            if (props.id) { //se tenho id- tem que ser o ID só para o primeiro modelo
                return props.id
            } else {
                return ""
            }
        }

        return createSelector(
            [getModeloApi, getIDVal,getModelOptions, getFormOptions],
            (objectes, id, modelOptions, formOptions) => {
                
                myconsoleCS.log("modelo:", props);
                myconsoleCS.log("recebido (quer dizer que mudou os objetos). getModeloApi:%o,getIDVal:%o, formOptions:%o",objectes,id,formOptions)

                let itens = false;
                //retorna array do objeto ou objeto se tiver id
                
                if (id != 0 && id != 'new') {
                    itens = si3.serializeAllByModelo(props.modelo, id)
                }



                //aqui em incorporo no meu carrega modelo os filtros passados

               // LETODO - pick retorna objeto, ver um jeito de voltar a array
               //prestar atencao quando estou carregando um objeto somente ou uma array de objetos
              if(_.isArray(itens)){
               var itens2 = _.pickBy(itens,item=>{
                    
               
                    var valorRetorno = true

                    if( _.has(props,'options') ){
                        
                        
                        _.each(props.options, (valorNoOptions,k)=>{
                            //se a key do option existe no iten
                            if( _.has(item,k)){
                                valorRetorno = false
                                var valorNoItem = _.get(item,k)
                               
                                if( _.isObject(valorNoItem) ){
                                    

                                    //LETODO - considerar arrays etc e melhorar a logica de quando é objeto
                                    if(valorNoOptions == valorNoItem._id){ 
                                        valorRetorno = true
                                    }
                                     if(valorNoOptions == valorNoItem.id){ 
                                        valorRetorno = true
                                    }
                                }else{
                                    if(valorNoOptions == valorNoItem){
                                        valorRetorno = true
                                    }
                                }

                            }else{
                                //se não existe, eu retorno o objeto
                                valorRetorno = true
                            }
                        })
                    }
                        return valorRetorno;


                })
                
                itens = _.values(itens2)
              }

               
               myconsoleCS.log("itens gerados:", itens)

                if (itens) {
                    if (_.isEmpty(itens)){ 
                        return {itens:false, formOptions:formOptions, modelOptions:modelOptions};
                    };
                    return {itens:itens, formOptions:formOptions, modelOptions:modelOptions};
                } else {
                    return {itens:false, formOptions:formOptions, modelOptions:modelOptions};
                }
            }
        )
    }



    //funcao qeu cria o selector para os modelos
    const makeMapStateToProps = (state, props) => {

        props = processaResources(props);
        let modelos = props.modelo;

        if (_.isString(modelos)) {
            modelos = [modelos]
        }

        //vou rciar
        let getModeloObj = {}
        let count = 0
        _.each(modelos, modelo => {
            let id = (count == 0) ? props.id : undefined // so passo o id para o primeiro item
            getModeloObj[modelo] = makeSelector(state, {
                ...props,
                modelo: modelo,
                id: id
            })
            count++
        })


        const mapStateToPropsArray = (state, props) => {
            // myconsole.count("modelosCarregados -> mapStateToPropsArray ***************")
            let retornar = {}

            if (modelos.length == 1) {
                _.each(getModeloObj, (selector, model) => {
                   
                    myconsoleMP.log("modelo :", model)
                    myconsoleMP.log("state.api.formOptions.modelo", state.api.formOptions[model])
                   
                    retornar = selector(state, {
                        ...props,
                        modelo: model,
                        user:state.usuario
                    })
                })

            } else {

                retornar = {
                    user:{},
                    itens: {},
                    formOptions: {},
                    modelOptions: {}
                }

                _.each(getModeloObj, (func, model) => {
                  
                    var itensDoModelo = func(state, {
                        ...props,
                        modelo: model
                    })

                    retornar.user =  state.usuario;
                    retornar.itens[model] = itensDoModelo.itens;
                    retornar.formOptions[model] = itensDoModelo.formOptions;
                    retornar.modelOptions[model] = itensDoModelo.modelOptions;

                    // retornar.formOptions[model] = _.get(state.api.modelOptions[model],'actions.POST') || false
                    count++
                })
            }

            return retornar
        }

        return mapStateToPropsArray
    }

    //HOCs

    //connecto ao store observando a api sempre
    newClass = connect(
        makeMapStateToProps,
        si3Actions
    )(newClass);


    newClass = getItemID(newClass)

    return newClass;
}








































