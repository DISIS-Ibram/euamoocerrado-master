import React from 'react';
import {isRealEmpty,formatString} from 'util/s3util'
import _ from 'lodash'
import ViewMore from 'components/ViewMore'
import criaconsole from 'util/myconsole'
import moment from 'moment'

const _debug = false;
const myconsole = criaconsole(_debug,' *** Tabela | Coluna.js | ', 'color:green;font-weight:bold')

import JSONTree from 'react-json-tree'


//RENDERIZA UMA COLUNA NA TABEA
//Aceita:
//   props.name = nome do atributo que vou renderizar
//  OU
//   props.render = func(item)
//  OU
//   props.children com template string %propriedade% 

// EXEMPLOS: 
//  <Coluna name="nome" label="Nome"  />
//  <Coluna name="telefone" label="telefone" render={(item)=>(item.cpf+"00") } />
//  <Coluna name="infos" label="Infos">
//                   <Image avatar size="tiny" src={util.thumb("%foto%","120")} />
//                   <i><Item name="cpf"/></i>
//                   <b><Item name="endereco"/></b>
//  </Coluna>

export class Coluna extends React.Component{

    static type = "Coluna"

    static defaultProps = {
        name:'',
        label:'',
        orderBy:'',
        format:(i)=>{},
        render:'',
        className:'',
        tipo:'', //ex: 'data'
    }

    
    //Vou processar todos os Itens e os "%%", certo?
    processaChildrens = (items)=>{     

          return React.Children.map(items,(elm)=>{
                    // 
                    if(!elm) return elm;
                    if(_.isString(elm)) return this.processaTemplatesString(elm);
                    if(!elm.type) return elm;

                    if( elm.type === ItemAttr ){
                      return React.cloneElement(elm,{item:this.props.item});
                    }

                    if( elm.type === If ){
                      let newProps = {item:this.props.item}
                       // 
                      let children = _.has(elm.props,'children') ? this.processaChildrens(elm.props.children) : false
                     
                      if(children !== false) newProps.children = children
                      return React.cloneElement(this.processaTemplateProps(elm),{...newProps});
                    }
                    
                    if ( _.has(elm.props,'children') ){
                      //vejo se o childrem é uma string
                      let child = elm.props.children;
                      // 
                      //se é string,verifico se
                      // if(_.isString(child)){
                      //   return this.processaTemplatesString(child);
                      // }
                      //retorno um novo elemento com o child processado tb, recursivamento isso funciona
                      let children = this.processaChildrens(elm.props.children)
                      return React.cloneElement(this.processaTemplateProps(elm),{children:children})
                    }else{
                      // 
                      return this.processaTemplateProps(elm)
                    }
          })
    }


    processaTemplateProps = (elm)=>{

        let newProps = {};

        _.each(elm.props, (v,k)=>{
            if(_.isString(v)){
              newProps[k] = this.processaTemplatesString(v)
            }
        })

       myconsole.log(" new props:%o",newProps);
        return React.cloneElement(elm,newProps);
    }


    processaTemplatesString= (string)=>{
        //pego todos o matchs que eu tenho
        let matches = string.match(/%.*?%/g)
        let stringFinal = string;

        myconsole.log(" string:",string);
        myconsole.log(" matches:%o",matches);
        myconsole.log(" props.Item:%o",this.props.item);
        
        _.map(matches,v=>{
           let attr = v.replace(/%/g,'');
            //vejo se o caminho existe no item
           let substitute = _.has(this.props.item,attr) ? _.get(this.props.item,attr) : ""
           myconsole.log("attr:%s, substitute:%s",attr,substitute);

           substitute = substitute === null ? "" : substitute;
           stringFinal = stringFinal.replace(new RegExp(v,'g'),substitute)
        })

        myconsole.log(" string final:",stringFinal);
        return stringFinal;

    }


    render(){

          //se tenho render function, renderizo render function
          if( _.isFunction(this.props.render) ){
              return (<span className={this.props.className}>{this.props.render(this.props.item)}</span>)
          }
          
          //se tenho child renderizo o child
          if(this.props.children){
            return (<span className={this.props.className}>{this.processaChildrens(this.props.children)}</span>)
          }
          
          //senao renderizo pelas infos dos props
          let colRender = _.get(this.props.item,this.props.name) || "";
          
          if(_.isObject(colRender)){
            colRender = <ViewMore><pre>{JSON.stringify(colRender,null,2)}</pre></ViewMore>
          }

          const {format,tipo} = this.props;

          if(format){
              colRender = formatString(format,colRender)
          }

          if(tipo && tipo=='data'){
                colRender = moment(colRender).format('L')
          }

          return(
                 <span className={this.props.className}>{colRender}</span>
            )

    }

}








export class ItemAttr extends React.Component{



    static type = "Item"

    render(){
            let item = _.get(this.props.item,this.props.name);
            const {format, transform} = this.props;

            if(transform){
              item = transform(item)
            }

            if(format){
              item = formatString(format,item)
            }

           return(
                 <span>{item}</span>
             )
    }

}







//IF para renderizar um item condicionamente a coluna
//Aceita
//  props.test={(v)=>teste}
//  props.itemAttributo
export class If extends React.Component{

    static type = "If"
    
    render(){
          


          let {item,children,...sobra} = this.props;

           myconsole.log(" IF |  sobra:%o",sobra)
           myconsole.log(" IF |  children:%o",children)
          
          //verifico se o props existe no item
          if(sobra.test || _.isFunction(sobra.test) ){
               myconsole.log(" IF |  tem TESTE")
               
              let render = sobra['test'](item)
              if(render===true){
                   myconsole.log(" IF |  tem TESTE | deu true")
                  return (<span>{children}</span>)
              }
          }

          //verifico se tem alguma propriedade
          let achouEtem = Object.keys(sobra).length;
           myconsole.log(" IF |  acouETem:",achouEtem)
          _.forOwn(sobra,(v,k)=>{   
              if(_.has(item,k)){
                  myconsole.log(" IF |  k:%s, v:%o",k, item[k])
                  
                  if(v === true){//true é o valor passado quando so forneco o key
                      if(isRealEmpty(item[k]) === false)
                        achouEtem--
                  }else{
                      if( v == item[k])
                        achouEtem--
                  }
              } 
          })

          myconsole.log(" IF |  acouETem Depois:",achouEtem)


          if(achouEtem === 0){
               myconsole.log(" IF |  RENDERIZA CHILD:",achouEtem)
              return (<span>{children}</span>)
          }else{
               myconsole.log(" IF |  NAO RENDERIZA CHILD:",achouEtem)
               return(
                       <span></span>
                )
          }



    }

}




export default Coluna 

//validate={validate}



