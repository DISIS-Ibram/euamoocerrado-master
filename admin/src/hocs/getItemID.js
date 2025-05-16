import React from 'react';
import { withRouter } from 'react-router'
import has from 'lodash/has';
import criaconsole from 'util/myconsole'

const _debug = false;
const myconsole = criaconsole(_debug,' === HOC getItemID | ', 'color:orange; font-weight:bold')



//======================================================
//  HOC - getItemID
//  retorna um componente com um prop id da url se nao existir
//======================================================

export default function getItemID(Wc){

    let nc = class PP extends React.Component {
          
        render() {

            let id = undefined           
            
            if( has(this.props.params,'id') ) {
              id = this.props.params.id
            }
            if(this.props.id || this.props.id === 0){ // 0 pq ele é ignorado na primeira parte
              id = this.props.id
            }

            myconsole.log("id:",id)
            myconsole.log("parans: %o",this.props.params)
           
            return <Wc {...this.props} id={id} />            
        }
    }
    return withRouter(nc);
}




