// @flow

import React from "react";
import { render } from "react-dom";

import User from "./User";
import { Field, Form } from "../../src";
import MoneyInput from "./inputs/MoneyInput";
import TodoItemsInput from "./inputs/TodoItemsInput";
import Input from "./inputs/Input";
import BooleanInput from "./inputs/BooleanInput";

Field.bindInput("text", Input);
Field.bindInput("number", Input);
Field.bindInput("email", Input);
Field.bindInput("date", Input);
Field.bindInput("boolean", BooleanInput);

Field.bindInput("money", MoneyInput);
Field.bindInput("TodoItem[]", TodoItemsInput);

class Demo extends React.Component<any> {
  handleSubmit = (event: Event) => {
    event.preventDefault();

    const target: any = event.target;
    const formData = new FormData(target);

    for (let pair: any of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  render() {
    const user = new User();
    user.name = "Jane";
    user.email = "jane@doe.com";
    user.credits = 10;

    return (
      <div className="container">
        <Form for={user} onSubmit={this.handleSubmit}>
          <header>
            <h2>Edit User</h2>
          </header>

          <div className="row">
            <div className="col-md-6">
              <Field name="name" autoFocus />
            </div>

            <div className="col-md-6">
              <Field name="last_name" />
            </div>
          </div>

          <Field name="email" label="Business email" placeholder="your-email@business.com" />
          <Field name="credits" />
          <Field name="todoItems" />

          <button className="btn btn-primary">Save User</button>
        </Form>
      </div>
    );
  }
}

const bootstrap: HTMLLinkElement = document.createElement("link");
bootstrap.type = "text/css";
bootstrap.rel = "stylesheet";
bootstrap.href = "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css";
window.document.head.appendChild(bootstrap);

render(<Demo />, window.document.querySelector("#demo"));
