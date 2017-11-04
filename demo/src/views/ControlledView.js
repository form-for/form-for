// @flow

import { observable } from "mobx";
import { observer } from "mobx-react";

import React from "react";
import { Field, Form } from "../../../src";

import User from "../User";
import TodoItem from "../TodoItem";

@observer
export default class ControlledView extends React.Component<any> {
  @observable user = new User();

  constructor(props: any) {
    super(props);

    this.user.firstName = "Jane";
    this.user.email = "jane@doe.com";
    this.user.access = "admin";

    this.user.todoItems.push(new TodoItem("Recommend form-for to my friends", true));
    this.user.todoItems.push(new TodoItem("Enjoy 😄"));
  }

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
                  <Field name="firstName" autoFocus />
                </div>

                <div className="col-md-6">
                  <Field name="last_name" />
                </div>
              </div>

              <Field name="email" />
              <Field name="access" />

              <div className="ml-4">
                <Field name="todoItems" />
              </div>

              <button className="btn btn-primary">Save User</button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
