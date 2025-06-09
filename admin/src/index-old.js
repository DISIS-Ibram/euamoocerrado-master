// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// //Pages
// import App from './components/App';
// import Home from './pages/Home';
// import Admin from './pages/Admin';

// import PessoasPageList from './pages/PessoasPageList';
// import PessoasPageForm from './pages/PessoasPageForm';


// import Login from './pages/Login';



// // Midias
// import MidiasPageList from './pages/MidiasPageList';



// import EspeciesPage from './pages/EspeciesPage';
// import ParquesPage from './pages/ParquesPage';
// import TrilhasPage from './pages/TrilhasPage';
// import TextosPage from './pages/TextosPage';
// import AvistamentoPage from './pages/AvistamentoPage';

// import AutoFormPage from './pages/AutoFormPage';
// import AutoTabelaPage from './pages/AutoTabelaPage';


// import NotFound from './pages/NotFound';

// // Store
// import { store, history } from "configStore.js"

// // Teste
// import TesteComponente from './components/tests/TesteComponente';

// const root = ReactDOM.createRoot(document.getElementById('app'));
// root.render(
        // //     <Provider store={store}>
        //     <Provider>
        //         {/* <Router history={history}> */}
        //         <Router>
        
        //             <Route path='/' component={TesteComponente} />
        
        //             {/* <Route path="/login" component={Login}/>
        
        //             <Route path="/" component={App}>
        //                 <IndexRoute component={Home}/>
        //                 <Route path="home" component={Home}/>
        //                 <Route path="midias" component={MidiasPageList}/>
        //                 <Route path="especies">
        //                         <IndexRoute component={EspeciesPage} />
        //                         <Route path=":item" component={EspeciesPage}/>
        //                         <Route path=":item/:id" component={EspeciesPage}/>
        //                 </Route>
        //                 <Route path="parques">
        //                         <IndexRoute component={ParquesPage} />
        //                         <Route path=":item" component={ParquesPage}/>
        //                         <Route path=":item/:id" component={ParquesPage}/>
        //                 </Route>
        //                 <Route path="trilhas">
        //                         <IndexRoute component={TrilhasPage} />
        //                         <Route path=":item" component={TrilhasPage}/>
        //                         <Route path=":item/:id" component={TrilhasPage}/>
        //                 </Route>
        //                 <Route path="conteudo">
        //                         <IndexRoute component={TextosPage} />
        //                         <Route path=":item" component={TextosPage}/>
        //                         <Route path=":item/:id" component={TextosPage}/>
        //                 </Route>
        //                 <Route path="pessoa">
        //                         <IndexRoute component={PessoasPageList} />
        //                          <Route path="lista" component={PessoasPageList} />
        //                         <Route path=":id" component={PessoasPageForm}/>
        //                 </Route>
        //                 <Route path="avistamentos">
        //                         <IndexRoute component={AvistamentoPage} />
        //                          <Route path="lista" component={AvistamentoPage} />
        //                         <Route path=":id" component={AvistamentoPage}/>
        //                 </Route>
        //                 <Route path="itensdesistema/:item" component={Admin}>
        //                 </Route>
        //                 <Route path="form/:item" component={AutoFormPage}>
        //                          <Route path=":id" component={AutoFormPage}/>
        //                 </Route>
        //                 <Route path="tabela/:item" component={AutoTabelaPage}>
        //                          <Route path=":id" component={AutoTabelaPage}/>
        //                 </Route>
        //                 <Route path="*" component={NotFound}/>
        //             </Route> */}
        //         </Router>
        //     </Provider>
        // );
        
// /////////////////////////////////////////////

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
