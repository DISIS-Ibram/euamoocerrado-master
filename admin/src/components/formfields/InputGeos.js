import React from 'react'

import InputGeoPoint from './InputGeosTypes/InputGeoPoint.js';
import InputGeoLine from './InputGeosTypes/InputGeoLine.js';
import InputGeoArea from './InputGeosTypes/InputGeoArea.js';


//So vejo quem eu carrego conforme o geometrica que quero

export default class InputGeos extends React.Component {

    static defaultProps = {
      geom:"point",  //point, area, line
    }

    render(){

        if(this.props.geom == "point"){
            return (<InputGeoPoint {...this.props} />)
        }else if(this.props.geom == "area"){
            return (<InputGeoArea {...this.props} />)
        }else if(this.props.geom == "line"){
            return (<InputGeoLine {...this.props} />)
        }
    }

}







