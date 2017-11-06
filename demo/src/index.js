// @flow

import { action, observable, useStrict } from "mobx";
import { observer } from "mobx-react";

import React from "react";
import { render } from "react-dom";

import { Field, Form } from "../../src";

import TodoItemsInput from "./components/TodoItemsInput";
import MoneyInput from "./components/MoneyInput";
import { bindFieldComponents } from "../../src/components";

import MutableView from "./views/MutableView";
import ControlledView from "./views/ControlledView";
import UncontrolledView from "./views/UncontrolledView";

import { bindBootstrapFieldComponents } from "./form-for-bootstrap-components/index";

import "./bootstrap.min.css";

// Enable strict MobX & set @observable and @action decorators
// useStrict(true);

// Field.mutableDecorator = observable;
// Form.mutableDecorator = (mutator, name) => action(`Update form instance ${name}`, mutator);

// Bind field components
bindFieldComponents();
bindBootstrapFieldComponents();

Field.bindComponent("money", MoneyInput);
Field.bindComponent("TodoItem[]", TodoItemsInput);

type State = {
  view: string
};

@observer
class Demo extends React.Component<any, State> {
  state = {
    view: "mutable"
  };

  selectView = (event: Event, name: string) => {
    event.preventDefault();
    this.setState({ view: name });
  };

  getSelectedViewComponent() {
    if (this.state.view === "mutable") {
      return <MutableView />;
    } else if (this.state.view === "controlled") {
      return <ControlledView />;
    }

    return <UncontrolledView />;
  }

  render() {
    return (
      <div className="container-fluid">
        <nav className="navbar-nav mr-auto">
          {this.renderViewNavItem("mutable", "Controlled w/ MobX (Mutable)")}
          {this.renderViewNavItem("controlled", "Controlled w/ setState({...})")}
          {this.renderViewNavItem("uncontrolled", "Uncontrolled")}
        </nav>

        {this.getSelectedViewComponent()}
      </div>
    );
  }

  renderViewNavItem(name: string, text: string) {
    const classes = ["nav-item"];
    if (this.state.view === name) classes.push("active");

    return (
      <li className={classes}>
        <a href="" onClick={event => this.selectView(event, name)}>
          {text}
        </a>
      </li>
    );
  }
}

render(<Demo />, window.document.querySelector("#demo"));
