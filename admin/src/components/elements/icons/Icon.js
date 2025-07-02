import React from 'react';
import PropTypes from 'prop-types';
// import icons from './_getIcons.js'; // está com erro no require

const Icon = ({ color = '#333333', size = 24, name, tipo = 'svg', ...rest }) => {
  const divStyle = {
    display: 'inline-block',
    height: typeof size === 'number' ? `${size}px` : size,
    width: typeof size === 'number' ? `${size}px` : size
  };

  const svgStyle = name.includes('outline')
    ? { stroke: color }
    : { fill: color };

  return (
    <div style={divStyle} className="icon iconsvg">
      <svg
        viewBox="0 0 24 24"
        style={svgStyle}
        dangerouslySetInnerHTML={{ __html: icons[name] }}
        {...rest}
      />
    </div>
  );
};

Icon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  tipo: PropTypes.string
};

export default Icon;
