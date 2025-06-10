import React from 'react';
import PropTypes from 'prop-types';
import IconesSvg from './icons/Icon';
import {Icon as UIIcon} from 'semantic-ui-react'

//tanto icones svg como do semantic-ui com uma interface parecida.
//----
//verifico o tipo do icone
//
//se for svg retorno o meu icone svg
//
//senao retorno o meu icone do semantic-ui


class S3Icon extends React.Component {
  static defaultProps = {
    tipo: 'fa',
    color: 'black',
    size: '2rem',
  };

  render() {
    if (this.props.tipo === "svg") {
      return (
        <></>
      );
    }
    <></>
  }
}

export default S3Icon;
