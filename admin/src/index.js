import React from "react";
import ReactDOM from "react-dom";
// import { Provider } from "react-redux";
// import { Router, Route, IndexRoute, browserHistory } from "react-router";
// import { Router, Route } from "react-router";

//Pages
// import App from "./components/App";
// import Home from "./pages/Home";
// import Admin from "./pages/Admin";

// import PessoasPageList from "./pages/PessoasPageList";
// import PessoasPageForm from "./pages/PessoasPageForm";

// import Login from "./pages/Login";

// Midias
// import MidiasPageList from "./pages/MidiasPageList";

// import EspeciesPage from "./pages/EspeciesPage";
// import ParquesPage from "./pages/ParquesPage";
// import TrilhasPage from "./pages/TrilhasPage";
// import TextosPage from "./pages/TextosPage";
// import AvistamentoPage from "./pages/AvistamentoPage";

// import AutoFormPage from "./pages/AutoFormPage";
import AutoTabelaPage from "./pages/AutoTabelaPage";

import NotFound from "./pages/NotFound";

//Story
import { store, history } from "configStore.js";

// render the main component
ReactDOM.render(
  <div>
    <AutoTabelaPage />
  </div>,

  document.getElementById("app")
);
