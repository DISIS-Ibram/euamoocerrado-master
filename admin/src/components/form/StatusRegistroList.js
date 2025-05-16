import React from 'react';
import { connect } from 'react-redux';
import { Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button, Divider } from 'semantic-ui-react';
import FlipMove from 'react-flip-move';
import StatusRegistroForm from './StatusRegistroForm';
import StatusRegistroFormAdd from './StatusRegistroFormAdd';
import { t, d } from 'models/models';

import { si3, si3Actions } from 'actions/index';
import formHoc from 'hocs/formularioHoc'
import Autoform from 'components/form/AutoForm'
import Formulario from 'components/Formulario.js'
import criaconsole from 'util/myconsole'
import carregaModelo from 'hocs/carregaModelo';
import processaResource from 'util/processaResourcesWithState'
import JSONTree from 'react-json-tree'




const _debug = true;
const myconsole = criaconsole(_debug, ' === Item Generico | ', 'color:#ee5523;font-weight:bold')





@formHoc
class AutoFormComponentComReset extends React.Component {


    constructor(props) {
        super(props);
        this.depoisDeSalvar = this.depoisDeSalvar.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    static defaultProps = {
        id: 0,
        autoForm: true,
        loadFormOptions: true,
    }

    onChange(values) {
        console.log('alterou', values);
        //   alert("ALTEROU")
        if (this.props.onChange)
            this.props.onChange(values);
    }

    depoisDeSalvar(values) {
        // alert('salvou');
        this.MC.reset();
        return values;

    }

    render() {
        return (
            <Formulario {...this.props}>
            </Formulario>
        )
    }
}




@carregaModelo
export default class StatusRegistroList extends React.Component {
    static defaultProps = {
        id: 'all',
        loadFormOptions: true,
        autoForm: false,
        modelo: ["padraoregistro", "statusregistro", "faseregistro", "etaparegistro"]
    }

    constructor(props) {
        super(props)
        this.state = {
            carregando: true,
            filter: '',
            addindex: 0
        };
    }

    removeItem(id) {
        this.props.remove(this.props.model, {
            id: id
        });
    // this.render();
    }


    filterItem(nome) {
        console.log(nome)
        // console.log(ev);
        this.setState({
            filter: nome
        });
    }

    filtrarItens = (values) => {
        var nome = _.get(values, 'nome')
        if (this.state.filter != nome) {
            setTimeout(() => this.setState({
                filter: nome
            }), 200);
        }
    }


    getStatus = (padraoid) => {
        return _.filter(this.props.itens.statusregistro, status => {
            return status.padrao == padraoid
        })
    }

    getFase = (statusid) => {
        return _.filter(this.props.itens.faseregistro, fase => {
            return fase.status == statusid
        })
    }

    getEtapa = (faseid) => {
        return _.filter(this.props.itens.etaparegistro, etapa => {
            return etapa.fase == faseid
        })
    }


    openAba = (abaname)=>{

    }

    fechaAba = (abaname)=>{

    }


    renderItem = (modelo,item,excludeCampo)=>{

            return(
            
                <Autoform exclude={ [excludeCampo] } butoesOnPristine={ true } tipo='placeholder ' modelo={ item._type } id={ item._id + '' } deletable={ true }
                />
          
           )
    }



    adicionarPopup = (modelo,defaultObj)=>{

             this.props.openModal( {nome:"modal"+modelo,
                              tipo:'form',
                              modelo:modelo,
                              onSave:()=>{},
                              value:defaultObj} 
                            )
    }



    render() {


        //monto os itens baseado na hierarquia
        let {itens} = this.props;
        var itensMontados = {}

        _.each(itens.padraoregistro, padrao => {
            itensMontados[padrao._id]
        })


        //    let itens = []
        //    itens = this.props.itens;
        //    var itensVisible = si3.filterItens(itens, this.state.filter, 'all');

        //    var total = itens.lenght || 0;

        //    itens = ( _.isArray(itens) ) ? _.reverse(itens) : false;
        //    if(itens){
        //     _.each(itens, iten=>{
        //             if( _.find(itensVisible, {_id:iten._id} ) ){
        //                 iten._display = 'block';
        //             }else{
        //                  iten._display = 'none';
        //             }
        //     })
        //    }


        var nomes = processaResource({
            titulo: '$api.modelOptions.classificacao.name',
            descricao: '$api.modelOptions.classificacao.description',
            PadraoTitulo: '$api.modelOptions.padraoregistro.name',
            PadraoDescricao: '$api.modelOptions.padraoregistro.description',
            StatusTitulo: '$api.modelOptions.statusregistro.name',
            StatusDescricao: '$api.modelOptions.statusregistro.description',
            FaseTitulo: '$api.modelOptions.faseregistro.name',
            FaseDescricao: '$api.modelOptions.faseregistro.description',
            EtapaTitulo: '$api.modelOptions.etaparegistro.name',
            EtapaDescricao: '$api.modelOptions.etaparegistro.description',

        })





        return (
            <div className="itemGenericoList acordions status">
                 <h2 className="ui header">
                  <div className="content">
                      { t("classificacao") }
                      <div className="sub header">
                        { d("classificacao") }
                       <small>
                            <p></p>
                           <p>Constituido por:</p>
                           <p><strong>{ t("padraoregistro") }</strong> - { d("padraoregistro") }</p>
                           <p><strong>{ t("statusregistro") }</strong> - { d("statusregistro") }</p>
                           <p><strong>{ t("faseregistro") }</strong> - { d("faseregistro") }</p>
                           <p><strong>{ t("etaparegistro") }</strong> - { d("etaparegistro") }</p></small>
                     </div>
                   </div>
                </h2>

              <div>
                {/*<AutoFormComponentComReset onChange={ this.filtrarItens } tipo='normal' modelo="padraoregistro" id="0" key='padraoregistro_0' resetAfterSave={ true }
                />*/}
              </div>

                {_.get(window,'PERM.padraoregistro.add') &&
                <div className='mt-3 mb-3'>  
                   <Button color="blue" fluid onClick={(e)=>this.adicionarPopup('padraoregistro',{})} size='normal'  content='Adicionar um novo Padrão' icon='add' />
                </div>
                }

              { this.props.itens.padraoregistro &&
             
                <div className='segment '>
                
                  { _.map(this.props.itens.padraoregistro, padrao => (
                    
                         <Accordion  className='sublist padrao mt-2'>
                            <Accordion.Title active> <Icon name='dropdown' /> Padrão - {padrao.nome} 
                                  {_.get(window,'PERM.padraoregistro.add') &&
                                    <Button onClick={(e)=>this.adicionarPopup('padraoregistro',{})} size='mini' compact content='Adicionar' icon='add' floated='right'/> 
                                  }
                                </Accordion.Title>
                            <Accordion.Content active>

                         <div  key={ padrao._type + padrao._id } className='editform'>
                                        {this.renderItem(padrao._type,padrao,'')}

                          <Accordion className='sublist status'>
                            <Accordion.Title> <Icon name='dropdown' /> Status <small>do {padrao.nome}</small> <Button onClick={(e)=>this.adicionarPopup('statusregistro',{padrao:padrao._id })} size='mini' compact content='Adicionar' icon='add' floated='right'/> </Accordion.Title>
                            <Accordion.Content >
                        
                                { _.map(this.getStatus(padrao._id), status => (
                                     <div  key={ status._type + status._id } className='editform'>
                                        {this.renderItem(status._type,status,'padrao')}
                                        <Accordion className='sublist fase'>
                                          <Accordion.Title> <Icon name='dropdown' />Fases <small>do {status.nome}</small> 
                                             {_.get(window,'PERM.faseregistro.add') &&
                                         
                                             <Button onClick={(e)=>this.adicionarPopup('faseregistro',{status:status._id })}  size='mini' compact content='Adicionar' icon='add' floated='right'/> 
                                             
                                             }

                                          </Accordion.Title>
                                          <Accordion.Content >
                                           
                                              { _.map(this.getFase(status._id), fase => (
                                                    <div  key={ fase._type + fase._id } className='editform'>
                                                    {this.renderItem(fase._type,fase,'status')}

                                                      <Accordion className='sublist etapa'>
                                                        <Accordion.Title> <Icon name='dropdown' /> Etapas  <small>da {fase.nome}</small>
                                                             {_.get(window,'PERM.etaparegistro.add') &&
                                                        <Button onClick={(e)=>this.adicionarPopup('etaparegistro',{fase:fase._id })} size='mini' compact content='Adicionar' icon='add' floated='right'/> 
                                                             }     
                                                        </Accordion.Title>
                                                        <Accordion.Content >
                                                          
                                                            { _.map(this.getEtapa(fase._id), etapa => (
                                                                    <div  key={ etapa._type + etapa._id } className='editform'>
                                                                     {this.renderItem(etapa._type,etapa,'fase')}
                                                                    </div>
                                                              )) }
                                              
                                                        </Accordion.Content>
                                                      </Accordion>
                                                    </div>
                                                )) }
                                          
                                          </Accordion.Content>
                                        </Accordion>
                                      </div>
                                  )) }
                           
                            </Accordion.Content>
                          </Accordion>
                        </div>
                        </Accordion.Content>
                    </Accordion>
              
                    )) }
                </div> }
              {/*<JSONTree data={ this.props.itens } />*/}
              { /*<pre>{JSON.stringify(this.props.itens,null,2)}</pre>*/ }
            </div>
        // {Json.stringify(this.props)}
        )


    }
}








/*

export class StatusRegistroList extends React.Component
{  

constructor(props){
super(props)
this.state = { carregando:true, filter:'', addindex:0 };
this.getFaseEtapa = this.getFaseEtapa.bind(this);
this.removeItem = this.removeItem.bind(this);
}

componentDidMount() {
this.setState({carregando:true})

let data = this.props.load(this.props.model)
.then(()=>this.props.load('faseregistro'))
.then(()=>this.props.load('etaparegistro'))
.then(()=>this.setState({carregando:false})) 

//LETODO - fazer o delete renovar o banco dedados
//etambem o unmountremover o intervalo
// setInterval(()=>{
//   this.props.load(this.props.model)
//   .then(()=>this.props.load('faseregistro'))
//   .then(()=>this.props.load('etaparegistro'))
// },4000)
}


handleSubmit(values,modelo){
console.log("SALVANDOOOOOOO========")
//Do something with the form values
this.props.save(modelo, values);
return true;
}

createModel(values){
this.props.save(this.props.model, values);
this.setState({filter:''})
const i = this.state.addindex+1;
this.setState({addindex:i})
return true;
}

createFase(values,modelo){
console.log("=====CRIANDO======")
console.log(values)
console.log(modelo)
this.props.save(modelo, values);
this.setState({filter:''})
const i = this.state.addindex+1;
this.setState({addindex:i})
return true;
}


removeItem(id,modelo){
this.props.remove(modelo,{id:id});  
// this.render();
}


filterItem(nome){
console.log(nome)
// console.log(ev);
this.setState({filter:nome});
}


toogle(e){

let quem = e.currentTarget;
let pai = $(quem).parent();
if(pai.hasClass('close')){
pai.css('max-height',pai[0].scrollHeight+400);
pai.removeClass('close')
}else{
pai.addClass('close')
}

}


openAll(){
$('.sublist.close').removeClass('close');
}

closeAll(){
$('.sublist').addClass('close');
}


getFaseEtapa(keyname,parentid,modelo){

let search = {}

search[keyname]=parentid;

let fases = si3.filterItens(this.props.api.entities[modelo],search,["nome"]);

let itens = fases.map((item)=> (
<div className='editform' key={modelo+item.id+this.props.myid+'div'}>
<StatusRegistroForm 
form={modelo+item.id+this.props.myid}
key={modelo+item.id+this.props.myid}
onSubmit={(values)=>this.handleSubmit(values,modelo).bind(this)}
removeItem={(id)=>this.removeItem(id,modelo)}
initialValues={item}
item={item}  />

{modelo=='faseregistro' &&
<div className='faseList' key={modelo}>{this.getFaseEtapa('fase',item.id,'etaparegistro')}</div>
}
</div>
));







return (
<div className='sublist close'>
<a className='titulotoggle' onClick={this.toogle}><h4 ><Icon className='caret' name='caret right' />{modelo=='faseregistro' ? 'Fases' : 'Etapas'}<small> ({fases.length})</small></h4></a>

{itens}

<div className='addform' key={modelo+parentid+this.state.addindex} >
<StatusRegistroFormAdd 
label={t(modelo)}
filter={()=>{return true}} 
initialValues={{[keyname]:parentid}} 
onSubmit={(values)=>this.createFase(values,modelo).bind(this)} 
form={modelo+this.props.myid+parentid+"new"+parentid+this.state.addindex} />
</div>

</div>
)

}





render() { 

const tipo = si3.getTipo(this.props.model);

if( this.state.carregando === false ){
let itens;
if( _.has( this.props.api.entities, tipo) ){
itens = si3.filterItens(this.props.api.entities[tipo],{nome:this.state.filter},["nome"]);
}else{
itens = [];
}
return (
<div className="itemGenericoList status"> 
<h3 className="ui header">
<div className="content">
{this.props.titulo}
<div className="sub header">{this.props.descricao}</div>
</div>
</h3>

<div className='addform' >
<StatusRegistroFormAdd 
label='Status'
filter={this.filterItem.bind(this)} 
onSubmit={this.createModel.bind(this)} 
key={this.props.model+this.props.myid+"new"+this.state.addindex}  
form={this.props.model+this.props.myid+"new"+this.state.addindex} />
</div>


<Button.Group basic size='small' attached='right'>
<Button onClick={this.openAll} icon='indent' />
<Button onClick={this.closeAll} icon='outdent' />
</Button.Group>

<FlipMove enterAnimation="elevator" leaveAnimation="elevator" >
{itens.map((item)=>(
item.id &&
<div className='editform' key={item.id+this.props.myid+'div'}>
<StatusRegistroForm 
form={this.props.model+item.id+this.props.myid}
key={item.id+this.props.myid}
onSubmit={(values)=>this.handleSubmit(values,this.props.model)}
removeItem={(id)=>this.removeItem(id,this.props.model)}
initialValues={item}
item={item}  />

<div className='faseList' key={this.props.model}>{this.getFaseEtapa('status',item.id,'faseregistro')}</div>
</div>
))}
</FlipMove>


</div>
);
}else{
return (
<div className="itemGenericoList">           
<h3 className="ui header">
<div className="content">
{this.props.titulo}
<div className="sub header">{this.props.descricao}</div>
</div>
</h3>

<Loader active content='Carregando' inline='centered' />
</div>
);
}
}
}




export default connect( (state, ownprops)=> {return {api:state.api}} , si3Actions)(StatusRegistroList);*/
