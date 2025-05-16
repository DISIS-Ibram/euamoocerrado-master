import React from 'react';
import { Label, List, Icon, Radio, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import * as _  from 'lodash';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';

import Formulario from 'components/Formulario'
import formHoc from 'hocs/formularioHoc'
import {Campo, CampoGrupo } from 'components/formfields'




const _debug = true;

const myconsole = (function(_debug = true){
  var obj = {}
  for(var o in window.console){
      if(_debug){
          obj[o] = window.console[o]
      }else{
          obj[o] = ()=>{return false}
      }
  }
  return obj
})(_debug)




@formHoc
export default class RelatosForm extends React.Component{
   
  static defaultProps = {
        modelo: "relato",
        autoForm:true,
        loadFormOptions:true,
        asID:["situacao","colecao_midia","receptor"],
        // include:'situacao',
  } 

  state = {
    usuario:false,
  }

  static modeloBase = { 
    senha:'' 
  }



  validar(values){
        myconsole.count('validate RelatoForm')
        // const errors = {}
        // return errors
        return values;
  }


  prepararInfo(item){

        // if( _.isObject(item.situacao) ){
        //     item.situacao = item.situacao.id;
        // }
        // if( _.isObject(item.colecao_midia) ){
        //     item.colecao_midia = item.colecao_midia.id;
        // }
        // if( _.isObject(item.receptor) ){
        //     item.receptor = item.receptor.id;
        // }

        return item;

  }

  antesDeSalvar(values){

        // myconsole.log("antes salvar no Component")
        // if(!values.senha && values._new)
        //   values.senha=""
        return values;
  }


  //os anchange do formulário
  onChange(){
       myconsole.count(" PessoasForm - onChange")
  }

  
  render(){



      //os props que passo abaixo é pq eu ja sou um redux-form
      //e passo abaixo os props do redux form para esse component
      return (  
            <Formulario {...this.props} titulo="Formulatio titulo" >
             
              <Campo req tipo='texto'  name="teste" label="Nome" dica="Nome Completo" />
              <Campo tipo='modelo'  name="pessoa" label="Pessoa" modelo="pessoa" multiple={true}/>
              <Campo tipo='endereco' name="teste4" label="Endereço"/>
              <CampoGrupo label="Informante">
                <Campo req tipo='texto' name="infor343mante_nome" label="Nome"/>
                <Campo tipo='texto' name="inform6ante_endereco" label="Endereço"/>
                <Campo tipo='endereco' name="ou4567tro" label="Endereço"/>
                {/*<Campo tipo='modelo' modelo="situacao" name="informante_situacao" label="Situação"/>*/}
             
                   <CampoGrupo label="Configurações Sub Grupo" tipo="compacto">
                      <Campo tipo='texto' name="a54567" label="Nome"/>
                      <Campo tipo='texto' name="bgh" label="Endereço"/>
                      <Campo tipo='endereco' name="cgte" label="Endereço"/>
                      {/*<Campo tipo='modelo' modelo="situacao" name="informante_situacao" label="Situação"/>*/}

                  </CampoGrupo>

              </CampoGrupo>



             <h2> Formulario normal </h2>
              <Formulario label="Configurações | mini" tipo="normal">
                      <Campo req tipo='texto' name="aa" label="Nome"/>
                      <Campo tipo='texto' name="ba" label="Endereço"/>
                      <Campo tipo='endereco' name="ca" label="Endereço"/>
                      {/*<Campo tipo='modelo' modelo="situacao" name="informante_situacao" label="Situação"/>*/}
              </Formulario>


              <h2> Formulario compacto </h2>
              <Formulario label="Configurações | mini" tipo="compacto">
                      <Campo req tipo='texto' name="aa" label="Nome"/>
                      <Campo tipo='texto' name="ba" label="Endereço"/>
                      <Campo tipo='endereco' name="ca" label="Endereço"/>
                      {/*<Campo tipo='modelo' modelo="situacao" name="informante_situacao" label="Situação"/>*/}
              </Formulario>


              <h2> Formulario mini </h2>
              <Formulario label="Configurações | mini" tipo="mini">
                      <Campo req tipo='texto' name="aa" label="Nome"/>
                      <Campo tipo='texto' name="ba" label="Endereço"/>
                      <Campo tipo='endereco' name="ca" label="Endereço"/>
                          <CampoGrupo label="Configurações Sub Grupo" tipo="compacto">
                            <Campo req tipo='texto' name="a" label="Nome"/>
                            <Campo tipo='texto' name="b" label="Endereço"/>
                            <Campo tipo='endereco' name="c" label="Endereço"/>
                      </CampoGrupo>
              </Formulario>


               <h2> Formulario placeholder </h2>
              <Formulario label="Configurações | mini" tipo="placeholder">
                      <Campo req tipo='texto' name="aa" label="Nome"/>
                      <Campo tipo='texto' name="ba" label="Endereço"/>
                      <Campo tipo='endereco' name="ca" label="Endereço"/>
              </Formulario>

              <h2> Formulario placeholder & mini </h2>
              <Formulario label="Configurações | mini" tipo="placeholder mini">
                      <Campo req tipo='texto' name="aa" label="Nome"/>
                      <Campo tipo='texto' name="ba" label="Endereço"/>
                      <Campo tipo='endereco' name="ca" label="Endereço"/>
              </Formulario>


              <h2> Formulario normal invertido </h2>
              <Formulario label="Configurações | mini" tipo="normal invertido">
                      <Campo req tipo='texto' name="aa" label="Nome"/>
                      <Campo tipo='texto' name="ba" label="Endereço"/>
                      <Campo tipo='endereco' name="ca" label="Endereço"/>
                      {/*<Campo tipo='modelo' modelo="situacao" name="informante_situacao" label="Situação"/>*/}
              </Formulario>
           

            </Formulario>
        )
  }
}



