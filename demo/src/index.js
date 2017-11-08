// @flow

import React from "react";
import { render } from "react-dom";

import { Form, Field } from "../../src";
import Input from "./Input";

Field.bindComponent("text", Input);
Field.bindComponent("email", Input);

type State = {
  user: any
};

class Demo extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    const user = {
      name: "Anonymous",
      surname: "Doe",

      schema: {
        name: {
          required: true,
          placeholder: "First name"
        },
        email: {
          type: "email",
          required: true
        }
      }
    };

    this.state = { user };
  }

  handleNameValidation = name => {
    if (name === "Anonymous") return name + " is not a valid name";
  };

  handleChange = mutator => {
    this.setState({ user: mutator() });
  };

  render() {
    return (
      <div>
        <Form for={this.state.user} onChange={this.handleChange}>
          <div>
            Name: <Field name="name" autoFocus validator={this.handleNameValidation} />
          </div>

          <div>
            Email: <Field name="email" />
          </div>

          <button>Submit</button>
        </Form>

        <pre>{JSON.stringify(this.state.user, null, 2)}</pre>
      </div>
    );
  }
}

render(<Demo />, window.document.querySelector("#demo"));
