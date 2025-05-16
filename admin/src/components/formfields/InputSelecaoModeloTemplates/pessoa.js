import _ from 'lodash'
import React, {  Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { Header, Dropdown, Form, Label, List, Radio, Checkbox, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';

import { si3, si3Actions }  from 'actions/index';

//import FormField  from 'components/formfields/FormField'
// import carregaModelo from 'hocs/carregaModelo'
import onlyDOMProps from 'util/onlyDOMProps'

// import AutoForm from 'components/form/AutoForm'
import criaconsole from 'util/myconsole'

import Avatar from 'components/elements/Avatar'

const _debug = false;
const myconsole = criaconsole(_debug,' === InputSelecaoPessoa | ', 'color:orange;font-weight:bold')




//funcao que gera render
export function list(item){
      // myconsole.log("relato item list===  %o",item)
     return {text: item.nome + " | CPF: " + si3.util.formatCPF(item.cpf), value:item.cpf,
          children:
          <div className='row  middle-xs '> 
              <Avatar url={item.foto} />
              <div className='col-xs'> {" "+item.nome} 
                     <small className='gray fs07 fw100 ft'>
                    <br /> {" CPF: " + si3.util.formatCPF(item.cpf)}
                    </small>
              </div>
          </div>
         }

}


//funcaao que renderiza a opcao
export class Item extends React.Component{


}
