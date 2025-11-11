import React from "react";
import { Button, Icon } from "semantic-ui-react";
import { Link } from "react-router";

import Tabela from "components/Tabela";

// //Formularios
// import * as tables from "./index";

// import criaconsole from "util/myconsole";

// const _debug = true;
// const myconsole = criaconsole(
//   _debug,
//   " *** AutoTable.js | ",
//   "color:green;font-weight:bold"
// );

class AutoTable extends React.Component {
  //   static defaultProps = {
  //     id: "all",
  //     autoForm: true,
  //     loadFormOptions: true,
  //     addButton: false,
  //   };

  render() {
    return (
      <div>
        <h1>AutoTable</h1>
        <Tabela />
      </div>
    );
  }

  //     //os props que passo abaixo é pq eu ja sou um redux-form
  //     //e passo abaixo os props do redux form para esse component
  //     let { modelo } = this.props;
  //     modelo = modelo.toLowerCase();
  //     if (tables[modelo]) {
  //       const Component = tables[modelo];
  //       return (
  //         <div>
  //           {this.props.addButton && (
  //             <Button
  //               className="mt-2 mb-2"
  //               primary
  //               as={Link}
  //               to={"/form/" + modelo + "/0"}
  //             >
  //               <Icon name="plus" /> Adicionar
  //             </Button>
  //           )}
  //           <Component {...this.props} />
  //         </div>
  //       ); //React.createElement(forms[modelo].type,this.props)
  //     } else {
  //       return (
  //         <div>
  //           {this.props.addButton && (
  //             <Button
  //               className="mt-2 mb-2"
  //               primary
  //               as={Link}
  //               to={"/form/" + modelo + "/0"}
  //             >
  //               <Icon name="plus" /> Adicionar
  //             </Button>
  //           )}
  //           <AutoTableComponent {...this.props} />
  //         </div>
  //       );
  //     }
  // }
}

class AutoTableComponent extends React.Component {
  // static defaultProps = {
  //   autoTable: true,
  //   loadFormOptions: true,
  // };

  render() {
    //os props que passo abaixo é pq eu ja sou um redux-form
    //e passo abaixo os props do redux form para esse component
    return (
      <div>
        <h1>AutoTableComponent</h1>

        {/* <Tabela {...this.props} id="all"></Tabela> */}
      </div>
    );
  }
}

export default AutoTable;
