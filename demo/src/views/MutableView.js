// @flow

import { action, observable } from "mobx";
import { observer } from "mobx-react";

import React from "react";
import { Field, Form } from "../../../src";

import User from "../User";
import TodoItem from "../TodoItem";

@observer
export default class MutableView extends React.Component<any> {
  @observable user = new User();
  @observable coinError: ?string;

  constructor(props: any) {
    super(props);

    this.user.firstName = "Jane";
    this.user.email = "jane@form-for.com";
    this.user.access = "admin";
    this.user.coins = 20;

    this.user.todoItems.push(new TodoItem("Recommend form-for to my friends", true));
    this.user.todoItems.push(new TodoItem("Enjoy 😄"));
  }

  @action
  setCoinError(message: string) {
    this.coinError = message;
  }

  @action
  removeCoinError() {
    this.coinError = undefined;
  }

  coinsValidator(coins: number) {
    if (coins > 20) {
      return "Are you trying tro trick me?";
    } else if (coins < 1) {
      return "Show me the money";
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <pre>{JSON.stringify(this.user, null, 2)}</pre>
            <pre>Coin error: {this.coinError}</pre>
          </div>

          <div className="col-md-6">
            <Form for={this.user} validate="mount,change">
              <header>
                <h2>Edit User</h2>
              </header>

              <div className="row">
                <div className="col-md-6">
                  <Field name="firstName" autoFocus help="This is a required field. Try clearing it" />
                </div>

                <div className="col-md-6">
                  <Field name="last_name" help="The custom label defined on the model" />
                </div>
              </div>

              <Field
                name="email"
                validator={this.user.validateEmail.bind(this.user)}
                help="This field has a custom validator that verifies if the email is @form-for.com"
              />

              <Field
                name="coins"
                validator={this.coinsValidator}
                onValid={() => this.removeCoinError()}
                onInvalid={error => this.setCoinError(error)}
                label="Show me the money"
                help="Try setting a number smaller than 1 or bigger than 20"
              />

              <Field name="access" help="Switch to guest to show a guest-specific field" />

              {this.user.access !== "admin" && (
                <div className="ml-4">
                  <Field
                    name="responsibleSalesperson"
                    label={false}
                    help="Although this field does not have a label, it has an aria-describedby for accessibility"
                  />
                </div>
              )}

              <div className="ml-4">
                <Field name="todoItems" />
              </div>

              <button className="btn btn-primary">Submit</button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
