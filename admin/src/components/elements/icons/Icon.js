import React, {PropTypes} from 'react';

import icons from './_getIcons';
//import colors from '_style/colors';

//<Icon icon="relatos">
const Icon = function (props){ 
    const divProps = Object.assign({}, props);
    let {color, size, name} = divProps;
    //console.log(names);
    delete divProps.className
    delete divProps.style;
    delete divProps.size;
    delete divProps.color;
    delete divProps.tipo;

  let divStyle = {
    display: 'inline-block',
    height: size,
    width: size
  };

  let svgStyle = {};
  if (name.includes('outline')) {
      svgStyle.stroke = color;
  } else {
      svgStyle.fill = color;
  }

  return (
    <div style={divStyle} className='icon iconsvg'>
      <svg
        viewBox="0 0 24 24"
        {...divProps}
        style={svgStyle}
        dangerouslySetInnerHTML={{__html: icons[name]}}
      />
    </div>
  );

}

Icon.defaultProps = {
   color: '#333333',
   size: 24,
   tipo:'svg'
};


export default Icon;






// const function Icon (props) {
//   let {color, size, value, ...more} = props;
//   delete more.className;
//   delete more.style;

//   let divStyle = {
//     display: 'inline-block',
//     height: size,
//     width: size
//   };

//   let svgStyle = {};
//   if (value.includes('filled')) {
//     svgStyle.fill = color;
//   } else {
//     svgStyle.stroke = color;
//   }

//   return (
//     <div style={divStyle}>
//       <svg
//         {...more}
//         viewBox="0 0 24 24"
//         style={svgStyle}
//         dangerouslySetInnerHTML={{__html: icons[value]}}
//       />
//     </div>
//   );


//   return ('AAAAAAA')


// }

// Icon.propTypes = {
//   color: PropTypes.string,
//   size: PropTypes.number,
//   value: PropTypes.string.isRequired
// };

// Icon.defaultProps = {
//   color: '#333333',
//   size: 24
// };



// export default Icon;