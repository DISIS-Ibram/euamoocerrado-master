import React from 'react';
import { connect } from 'react-redux';
import { Input, Dimmer, Loader, Image, Segment } from 'semantic-ui-react';
import * as _  from 'lodash';
import FlipMove from 'react-flip-move';
import ItemGenericoListForm from './ItemGenericoListForm';
import ItemGenericoListFormAdd from './ItemGenericoListFormAdd';
import { si3, si3Actions }  from 'actions/index';
import carregaModelo from 'hocs/carregaModelo';
import formHoc from 'hocs/formularioHoc'
import Autoform from 'components/form/AutoForm'
import Formulario from 'components/Formulario.js'
import criaconsole from 'util/myconsole'

import processaResource from 'util/processaResourcesWithState'

import {t,d} from 'models/models'


const _debug = true;
const myconsole = criaconsole(_debug,' === Item Generico | ', 'color:#ee5523;font-weight:bold')





@formHoc
class AutoFormComponentComReset extends React.Component{
  

 constructor(props){
        super(props);
        this.depoisDeSalvar = this.depoisDeSalvar.bind(this);
        this.onChange = this.onChange.bind(this);
 }

  static defaultProps = {
      id:0,
      autoForm:true,
      loadFormOptions:true,
      mudaUrl:false,
  }

  onChange(values){
      console.log('alterou',values);
    //   alert("ALTEROU")
     if(this.props.onChange)
        this.props.onChange(values);
  }

  depoisDeSalvar(values){
        
        // alert('salvou');
        this.MC.reset();
        return values;

  }

  render(){
      return (  
            <Formulario {...this.props}  >
            </Formulario>
        )
  }
}




@carregaModelo
export default class ItemGenericoList extends React.Component
{  
    static defaultProps = {
        id:'all',
        loadFormOptions:true,
        autoForm:true,
        force:true
    }

    constructor(props){
        super(props)
        this.state = { carregando:true, filter:'', addindex:0 };
    }

    // componentDidMount() {
    //     let data = this.props.load(this.props.model);   
    //     this.setState({carregando:true})
    //     data.then(()=>this.setState({carregando:false})) 
    // }

//     handleSubmit(values){
//         //Do something with the form values
//         this.props.save(this.props.model, values);
//         return true;
//    }

//    createModel(values){
//         this.props.save(this.props.model, values);
//         this.setState({filter:''})
//         const i = this.state.addindex+1;
//         this.setState({addindex:i})
//         return true;
//    }


   removeItem(id){
        this.props.remove(this.props.model,{id:id});  
        // this.render();
   }


   filterItem(nome){
        console.log(nome)
        // console.log(ev);
        this.setState({filter:nome});
   }

   filtrarItens = (values)=>{
        var nome = _.get(values,'nome')
        if(this.state.filter != nome){
                setTimeout(()=>this.setState({filter:nome}),200);
        }
}


   render() { 


       let itens = []
       itens = this.props.itens;
       var itensVisible = si3.filterItens(itens, this.state.filter, 'all');
      
       var total = itens.lenght || 0;

       itens = ( _.isArray(itens) ) ? _.reverse(itens) : false;
       if(itens){
        _.each(itens, iten=>{
                if( _.find(itensVisible, {_id:iten._id} ) ){
                    iten._display = 'block';
                }else{
                     iten._display = 'block';
                }
        })
       }


     

       return(
            <div className="itemGenericoList">

               

                <h2 className="ui header">
                    <div className="content">
                       {t(this.props.modelo)}
                  
                        <div className="sub header">
                            {d(this.props.modelo)}
                        </div>
                    </div>
                </h2>
             
            <div>
                 {_.get(window,'PERM.'+this.props.modelo+'.add') &&
                    <AutoFormComponentComReset mudaUrl={false} onChange={this.filtrarItens} tipo='normal' modelo={this.props.modelo} id="0" key={this.props.modelo+'_0'} resetAfterSave={true}/>
                 }
            </div>

            {itens &&
                <div>
                    { _.map(itens, item=>(
                    <Segment color='blue' key={this.props.modelo+"_"+item._id+''} className='editform' style={{display:item._display}}>
                            <Autoform  mudaUrl={false} butoesOnPristine={true} tipo='placeholder' modelo={this.props.modelo} id={item._id+''} deletable={true} />
                    </Segment>
                    ))
                    }
                </div>
            }

               {/*<pre>{JSON.stringify(this.props.itens,null,2)}</pre>*/}
               {/*<pre>{JSON.stringify(this.props.itens,null,2)}</pre>*/}
           </div>
                    // {Json.stringify(this.props)}
        )
       /*const tipo = si3.getTipo(this.props.model);

       if( this.state.carregando === false ){
            let itens;
            if( _.has( this.props.api.entities, tipo) ){
                itens = si3.filterItens(this.props.api.entities[tipo],{nome:this.state.filter},["nome"]);
             }else{
                itens = [];
             }
             return (
                <div className="itemGenericoList">           
                    <h3 className="ui header">
                      <div className="content">
                        {this.props.titulo}
                        <div className="sub header">{this.props.descricao}</div>
                      </div>
                    </h3>

                    <div className='addform' ><ItemGenericoListFormAdd filter={this.filterItem.bind(this)} onSubmit={this.createModel.bind(this)} key={this.props.model+this.props.myid+"new"+this.state.addindex}  form={this.props.model+this.props.myid+"new"+this.state.addindex} /></div>
                  
                    {itens.map((item)=>(
                        item.id &&
                         <div className='editform' key={item.id+this.props.myid+'div'}><ItemGenericoListForm form={this.props.model+item.id+this.props.myid} key={item.id+this.props.myid} onSubmit={this.handleSubmit.bind(this)}  removeItem={this.removeItem.bind(this)}  initialValues={item} item={item}  /></div>
                    ))}
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
    }*/

   }
}

