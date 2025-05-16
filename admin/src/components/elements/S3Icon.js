import React, {PropTypes} from 'react';
import IconesSvg from './icons/Icon';
import {Icon as UIIcon} from 'semantic-ui-react'

//tanto icones svg como do semantic-ui com uma interface parecida.
//----
//verifico o tipo do icone
//
//se for svg retorno o meu icone svg
//
//senao retorno o meu icone do semantic-ui


export default class Icon extends React.Component{  

    static defaultProps = {
          tipo: 'fa',
          color: 'black',
          size: '2rem'
    }

    render(){
      if (this.props.tipo == "svg"){

        return (
          <IconesSvg  tipo="svg" name={this.props.name || ''} color={this.props.color}  size={this.props.size}  />
          )

      }else{
           const { name, size, tipo, color, ...custom } = this.props;
           return(
              <UIIcon name={name} color={color} style={{fontSize:parseInt(this.props.size,10)*11}}/>
            )
      
    }
  }
}


