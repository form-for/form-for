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
  errors: { [_: string]: string }
};

class Demo extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    const user = {
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
    };

    this.state = { user, errors: {} };
  }

  handleNameValidation = name => {
    if (name === "Anonymous") return name + " is not a valid name";
  };

  handleChange = ({ values }) => {
    this.setState({ user: values });
  };

  handleValidityChange = ({ errors }) => {
    this.setState({ errors });
  };

  render() {
    return (
      <div>
        <Form
          for={this.state.user}
          onChange={this.handleChange}
          autoComplete="off"
          onValidityChange={this.handleValidityChange}
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

          <button>Submit</button>
        </Form>

        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  }
}

render(<Demo />, window.document.querySelector("#demo"));
