import React from "react";
import { input } from "semantic-ui-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { connect } from "react-redux";
import {
  Header,
  Modal,
  Label,
  List,
  Icon,
  Accordion,
  Input,
  Dimmer,
  Loader,
  Image,
  Segment,
  Button,
} from "semantic-ui-react";
import { si3, si3Actions } from "actions/index";
import {
  withRouter,
  Router,
  Route,
  IndexRoute,
  browserHistory,
  Link,
} from "react-router";

import criaModal from "components/ModalTypes";

import { getUserFromToken } from "auth";
import JSONTree from "react-json-tree";
import { SI3RC_MODELS } from "models/models";
import Notifications from "react-notification-system-redux";

@connect((state) => ({ notifications: state.notifications }))
class NotificationComponent extends React.Component {
  render() {
    const { notifications } = this.props;

    //Optional styling
    const style = {
      NotificationItem: {
        // Override the notification item
        DefaultStyle: {
          // Applied to every notification, regardless of the notification level
          margin: "10px 5px 2px 1px",
        },
        success: {
          // Applied only to the success notification item
          color: "green",
        },
      },
    };

    return <Notifications notifications={notifications} style={style} />;
  }
}

class App extends React.Component {
  componentWillMount() {
    this.state = { user: false };
    this.requireAuth();
  }

  componentDidMount() {
    // this.props.load('classificacao');
  }

  componentDidUpdate(prevProps, prevState) {
    //vejo se tenho modal ainda
    //se tiver adiciono a classe no body para nao perder o scrol de quando abro modal em cima de modal
    if (this.props.modal.length > 0)
      $("body").addClass("scrolling dimmable dimmed");
  }

  requireAuth = async (nextState, replace) => {
    var user = await getUserFromToken();
    // console.log("USUARIO:%o", user);
    //usar o redux store
    if (user === false) {
      browserHistory.replace("/login");
    } else {
      this.setState({ user: user });
      _.forOwn(SI3RC_MODELS, (v, k) => {
        this.props.loadOptions(k);
      });
    }
  };

  //funcao para gerar os modals
  processaModals = () => {
    const modals = this.props.modal.map((el) => {
      return criaModal(el, { dimmer: false });
    });
    return modals;
  };

  render() {
    const modals = this.processaModals();
    const theme = {
      scheme: "monokai",
      author: "wimer hazenberg (http://www.monokai.nl)",
      base00: "#272822",
      base01: "#383830",
      base02: "#49483e",
      base03: "#75715e",
      base04: "#a59f85",
      base05: "#f8f8f2",
      base06: "#f5f4f1",
      base07: "#f9f8f5",
      base08: "#f92672",
      base09: "#fd971f",
      base0A: "#f4bf75",
      base0B: "#a6e22e",
      base0C: "#a1efe4",
      base0D: "#66d9ef",
      base0E: "#ae81ff",
      base0F: "#cc6633",
    };
    return (
      <div className="si3">
        {modals}
        <Sidebar />
        <Topbar />
        {this.props.children}
        <NotificationComponent />

        {process.env.NODE_ENV !== "production" && (
          <div className="mt7">
            <div className="w-70 mh5 fl ">
              <JSONTree
                data={this.props.options}
                theme={theme}
                invertTheme={true}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(
  connect(
    (state) => ({
      modal: state.modal,
      usuario: state.usuario,
      options: state.api.modelOptions,
    }),
    si3Actions
  )(App)
);
