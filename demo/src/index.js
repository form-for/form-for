// @flow

import React from "react";
import { render } from "react-dom";

import { Form, Field } from "../../src";
import Input from "./Input";

Field.bindComponent("text", Input);
Field.bindComponent("email", Input);
Field.bindComponent("password", Input);

type State = {
  user: any,
  errors: { [_: string]: string },
  skipValidation?: boolean,
  touchOnMount?: boolean
};

class Demo extends React.Component<any, State> {
  state = {
    user: {
      name: "Anonymous",
      surname: "Doe",
      password: "admin",
      password_confirmation: "",

      schema: {
        name: {
          required: true,
          placeholder: "First name"
        },
        email: {
          type: "email",
          required: true
        },
        password: {
          type: "password",
          required: true
        },
        password_confirmation: {
          type: "password",
          observe: "password",
          validator: (password_confirmation, { password }) => {
            if (password !== password_confirmation) {
              return "The confirmation does not match the password";
            }
          }
        }
      }
    },
    errors: {}
  };

  handleNameValidation = name => {
    if (name === "Anonymous") return name + " is not a valid name";
  };

  handleChange = (user, errors) => {
    this.setState({ user, errors });
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
          key={`${this.state.skipValidation}|${this.state.touchOnMount}`}
          for={this.state.user}
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

          <button disabled={Object.values(this.state.errors).length}>Submit</button>
        </Form>

        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  }
}

render(<Demo />, window.document.querySelector("#demo"));
