// @flow

import { action, observable, useStrict } from "mobx";
import { observer } from "mobx-react";

import React from "react";
import { render } from "react-dom";

import User from "./User";
import MoneyInput from "./inputs/MoneyInput";
import TodoItemsInput from "./inputs/TodoItemsInput";
import Input from "./inputs/Input";
import BooleanInput from "./inputs/BooleanInput";

import Form from "./Form";
import Field from "./Field";
import SelectInput from "./inputs/SelectInput";
import TodoItem from "./TodoItem";

useStrict(true);

Field.bindInput("text", Input);
Field.bindInput("number", Input);
Field.bindInput("email", Input);
Field.bindInput("date", Input);
Field.bindInput("boolean", BooleanInput);
Field.bindInput("select", SelectInput);

Field.bindInput("money", MoneyInput);
Field.bindInput("TodoItem[]", TodoItemsInput);

@observer
class Demo extends React.Component<any> {
  @observable user = new User();

  constructor(props: any) {
    super(props);

    this.user.firstName = "Jane";
    this.user.email = "jane@doe.com";
    this.user.access = 'admin';
    this.user.credits = 10;

    this.user.todoItems.push(new TodoItem("Recommend form-for to my friends", true));
    this.user.todoItems.push(new TodoItem("Enjoy 😄"));
  }

  handleChange = action(() => {
    this.user.credits++;
  });

  handleSubmit = (event: Event) => {
    event.preventDefault();

    const target: any = event.target;
    const formData = new FormData(target);

    for (let pair: any of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <pre>{JSON.stringify(this.user, null, 2)}</pre>
          </div>

          <div className="col-md-6">
            <Form for={this.user} prefix="user" onSubmit={this.handleSubmit}>
              <header>
                <h2>Edit User</h2>
              </header>

              <div className="row">
                <div className="col-md-6">
                  <Field name="firstName" autoFocus/>
                </div>

                <div className="col-md-6">
                  <Field name="last_name"/>
                </div>
              </div>

              <Field name="email"/>
              <Field name="credits"/>
              <Field name="access"/>

              <div className="ml-4">
                <Field name="todoItems"/>
              </div>

              <button className="btn btn-primary">Save User</button>
            </Form>
          </div>
        </div>
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
