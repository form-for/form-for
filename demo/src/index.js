// @flow

import React from "react";
import { render } from "react-dom";
import { Form, Field } from "../../src";

import User from "./models/User";

import Input from "./components/Input";
import TodoItems from "./components/TodoItems";

Field.bindComponent("text", Input);
Field.bindComponent("email", Input);
Field.bindComponent("password", Input);
Field.bindComponent("todoItem[]", TodoItems);

type State = {
  user: any,
  valid: boolean,
  skipValidation?: boolean,
  touchOnMount?: boolean
};

class Demo extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    const user = new User();
    user.name = "test";
    user.email = "test@gmail.com";
    user.password = "admin";
    user.password_confirmation = "admin";

    this.state = { user, valid: true };
  }

  handleNameValidation = name => {
    if (name === "Anonymous") return name + " is not a valid name";
  };

  handleChange = (user, valid) => {
    this.setState({ user, valid });
  };

  handleSubmit = (event, user) => {
    console.log(user);
    event.preventDefault();
  };

  render() {
    return (
      <div>
        <button
          onClick={() =>
            this.setState({
              skipValidation: !this.state.skipValidation
            })}
        >
          Toggle skip validation
        </button>

        <button
          onClick={() =>
            this.setState({
              touchOnMount: !this.state.touchOnMount
            })}
        >
          Toggle touch on mount
        </button>

        <Form
          key={`${this.state.skipValidation ? 1 : 0}|${this.state.touchOnMount ? 1 : 0}`}
          for={this.state.user}
          immutable
          autoComplete="off"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          skipValidation={this.state.skipValidation}
          touchOnMount={this.state.touchOnMount}
        >
          <div>
            Name: <Field name="name" autoFocus validator={this.handleNameValidation} />
          </div>

          <div>
            Email: <Field name="email" />
          </div>

          <div>
            Password: <Field name="password" />
          </div>

          <div>
            Confirmation Password: <Field name="password_confirmation" />
          </div>

          <Field name="todoItems" />

          <button disabled={!this.state.valid}>Submit</button>
        </Form>

        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  }
}

render(<Demo />, window.document.querySelector("#demo"));
