// import React from 'react';
// import Sidebar from './Sidebar';
// import Topbar from './Topbar';
// import { connect } from 'react-redux';
// import {
//   Header, Modal, Label, List, Icon, Accordion, Input,
//   Dimmer, Loader, Image, Segment, Button
// } from 'semantic-ui-react';
// import { si3, si3Actions } from '../actions/index';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import criaModal from 'components/ModalTypes';
// import { getUserFromToken } from 'auth';
// import JSONTree from 'react-json-tree';
// import { SI3RC_MODELS } from 'models/models';
// import Notifications from 'react-notification-system-redux';

// const NotificationComponent = ({ notifications }) => {
//   const style = {
//     NotificationItem: {
//       DefaultStyle: { margin: '10px 5px 2px 1px' },
//       success: { color: 'green' }
//     }
//   };

//   return <Notifications notifications={notifications} style={style} />;
// };

// // Wrapper para permitir hooks em classe
// function withRouter(Component) {
//   function ComponentWithRouterProp(props) {
//     let navigate = useNavigate();
//     let location = useLocation();
//     let params = useParams();
//     return <Component {...props} router={{ location, navigate, params }} />;
//   }
//   return ComponentWithRouterProp;
// }

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { user: false };
//   }

//   async componentDidMount() {
//     await this.requireAuth();
//   }

//   componentDidUpdate() {
//     if (this.props.modal.length > 0) {
//       document.body.classList.add('scrolling', 'dimmable', 'dimmed');
//     }
//   }

//   requireAuth = async () => {
//     const user = await getUserFromToken();
//     console.log("USUARIO:%o", user);
//     if (!user) {
//       this.props.router.navigate('/login');
//     } else {
//       this.setState({ user });
//       Object.keys(SI3RC_MODELS).forEach((k) => {
//         this.props.loadOptions(k);
//       });
//     }
//   };

//   processaModals = () => {
//     return this.props.modal.map((el) => criaModal(el, { dimmer: false }));
//   };

//   render() {
//     const modals = this.processaModals();
//     const theme = {
//       scheme: 'monokai',
//       author: 'wimer hazenberg (http://www.monokai.nl)',
//       base00: '#272822',
//       base01: '#383830',
//       base02: '#49483e',
//       base03: '#75715e',
//       base04: '#a59f85',
//       base05: '#f8f8f2',
//       base06: '#f5f4f1',
//       base07: '#f9f8f5',
//       base08: '#f92672',
//       base09: '#fd971f',
//       base0A: '#f4bf75',
//       base0B: '#a6e22e',
//       base0C: '#a1efe4',
//       base0D: '#66d9ef',
//       base0E: '#ae81ff',
//       base0F: '#cc6633'
//     };

//     return (
//       <div className="si3">


//         {/* {modals}
//         <Sidebar />
//         <Topbar />
//         {this.props.children}
//         <NotificationComponent notifications={this.props.notifications} />
//         {process.env.NODE_ENV !== 'production' &&
//           <div className="mt7">
//             <div className='w-70 mh5 fl '>
//               <JSONTree data={this.props.options} theme={theme} invertTheme={true} />
//             </div>
//           </div>
//         } */}
//       </div>
//     );
//   }
// }

// // const mapStateToProps = (state) => ({
// //   modal: state.modal,
// //   usuario: state.usuario,
// //   options: state.api.modelOptions,
// //   notifications: state.notifications
// // });

// export default withRouter(connect(mapStateToProps, si3Actions)(App));


// /////////////////////////////////////////////////////////////////////////


import React from 'react';

const App = () => (
  <div style={{ padding: 50 }}>
    <h1 style={{ color: 'green' }}>React funcionando sem Redux nem Router</h1>
    <p>Esse é um teste simples com Webpack.</p>
  </div>
);

export default App;


