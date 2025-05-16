import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ViewMore from 'components/ViewMore'
import { Item, Header, Label, List, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
// import * as _  from 'lodash';
// import FlipMove from 'react-flip-move';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import StringMask from 'string-mask';
// import { ModalYesNo } from 'components/modals';
import * as util from 'util/s3util'
import carregaModelo from 'hocs/carregaModelo'

// import tabelaHoc from 'hocs/tabela'
import Tabela from 'components/tabela'
import {Coluna, ItemAttr, If} from 'components/tabelacolunas/coluna'



@connect(null,si3Actions)
export default class PublicoButton extends React.Component
{

  static defaultProps = {
        modelo: "",
        id:0,
        value:true,

  }; 

  change = async()=>{
        if(this.props.modelo == ""){
            alert("Não foi definido um modelo!")
            return false
        }
        let res = await this.props.save(this.props.modelo, { id:this.props.id, publico:!this.props.value } )
        console.log("salvou")

  }

  render(){

      return(
          <span>
            {this.props.value === true &&
                   <Button size='tiny' compact positive onClick={this.change}> Sim </Button>
            ||
                   <Button size='tiny' compact negative onClick={this.change}> Não </Button>

            }
         </span> 
      )

  }

}
