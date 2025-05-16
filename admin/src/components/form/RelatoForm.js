import React from 'react';
import { Label, List, Icon, Radio, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import * as _  from 'lodash';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';

import Formulario from 'components/Formulario'
import formHoc from 'hocs/formularioHoc'
import {Campo, CampoGrupo } from 'components/formfields'

import JSONTree from 'react-json-tree'
import criaconsole from 'util/myconsole';

const _debug = false;
const myconsole = criaconsole(_debug, ' *** RelatoForm.js | ', 'color:green;font-weight:bold');




@formHoc
export default class RelatosForm extends React.Component{
   
  static defaultProps = {
        modelo: "relato",
        autoForm:false,
        loadFormOptions:true,
        // include:'all'
      //   asID:["situacao","colecao_midia","receptor"],
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
      <Formulario {...this.props} deletable={true} >

      <div className="row">

          <div className="col-xs-8 pr3">
          {/*<JSONTree data={this.props.itens} />*/}
        

      <Campo name='relato' label="Relato" req tipo='textoarea'  />


      <Campo  name='receptor'  tipo='model' modelo='pessoa' multiple={false} req={true}  />

      <CampoGrupo label="Informante" req>
        <Campo name='informante_nome'  tipo='texto' req={true}  />
        <Campo name='informante_situacao'  tipo='model' modelo='situacao' multiple={false} req={true}  />
        <Campo  name='informante_endereco'  tipo='endereco'  />
      </CampoGrupo>



      <CampoGrupo label="Datas" req>
      <Campo  name='data_fato'  tipo='data' req={true}  />
      <Campo  name='data_relato'  tipo='data' req={true}  />
      {this.props.itens._new === false &&
        <Campo disable label='Data do cadastro' name='data_cadastro'  tipo='data'  />
      }
      </CampoGrupo>








      <Campo  name='localizacao'  tipo='geopoint' req={true}  />



      <CampoGrupo label="Caracterízação Ambiental">
        <Campo name='caracterizacao_ambiente'  tipo='model' modelo='caracterizacaotipoambiente' multiple={true}   />
        <Campo name='caracterizacao_tipo_hidrografia'  tipo='model' modelo='caracterizacaotipohidrografia' multiple={false}   />
        <Campo name='caracterizacao_posicao_hidrografia'  tipo='model' modelo='caracterizacaoposicaohidrografica' multiple={false}   />
        <Campo name='caracterizacao_inundacao'  tipo='model' modelo='caracterizacaotipoinundacao' multiple={false}   />
        <Campo name='caracterizacao_local'  tipo='texto'  />
      </CampoGrupo>


      <Campo label='Palavras-Chave' name='tags' tipo='model' modelo='tag' multiple={true}   />


      <Campo label='Mídias' name='colecao_midia'  tipo='midia'  />

    </div>


          <div className="col-xs-4 lateral-info">

            <div className="row center-xs">
              <div className="col-sm-10">
                <Campo label='Registros Associado' name='registro_associado'  tipo='model' modelo='registro' multiple={false}  />
                </div>
                </div>
    
          </div>
      
      </div>


</Formulario>
        )
  }
}



