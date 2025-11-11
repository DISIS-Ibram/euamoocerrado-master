import React from 'react';
import IconesSvg from './icons/Icon';
import { Icon as UIIcon } from 'semantic-ui-react';

const semanticColors = [
  "red","orange","yellow","olive","green","teal",
  "blue","violet","purple","pink","brown","grey","black"
];

export default class Icon extends React.Component {
  static defaultProps = {
    tipo: 'fa',
    color: 'black',
    size: '2rem'
  };

  render() {
    const { tipo, name, color, size, ...rest } = this.props;

    if (tipo === "svg") {
      return (
        <IconesSvg
          tipo="svg"
          name={name || ''}
          color={color}
          size={size}
          {...rest}
        />
      );
    } else {
      // Verifica se a cor é reconhecida pelo Semantic UI
      const isSemanticColor = semanticColors.includes(color);
      const semanticColor = isSemanticColor ? color : undefined;

      // Aplica cor via CSS caso não seja uma cor Semantic UI
      const style = {
        color: !isSemanticColor ? color : undefined,
        fontSize: parseInt(size, 10) * 11,
      };

      return (
        <UIIcon
          name={name}
          color={semanticColor}
          style={style}
          {...rest}
        />
      );
    }
  }
}
