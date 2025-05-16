
import React, { Component, PropTypes } from 'react'

import { Header, Dropdown, Form, Label, List, Radio, Checkbox, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';

//import FormField  from 'components/formfields/FormField'
// import carregaModelo from 'hocs/carregaModelo'
import onlyDOMProps from 'util/onlyDOMProps'

// import AutoForm from 'components/form/AutoForm'
import moment from 'moment'
import ViewMore from 'components/ViewMore'




export const titulo = (item) => {   

    return (
        <span>
          <small className=""><b>{ _.get(item,'descricao') }</b> </small> 

       
       </span>)
}


export const descricao = (item) => {
    return (
        <div>
           
             <div>  
                <small> <b> Programa:</b>  {_.get(item,'programa.nome')} </small>
            </div>    
    

        </div>
    )
}

