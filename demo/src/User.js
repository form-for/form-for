// @flow

import { computed, observable } from "mobx";

import { field } from "../../src";
import TodoItem from "./TodoItem";

export default class User {
  @observable
  @field({ required: true })
  firstName: string;

  @observable
  @field({ label: "Last name (if any)" })
  last_name: string;

  @observable
  @field({ type: "email", required: true, validator: "validateEmail" })
  email: string;

  @observable
  @field({ type: "money", required: true })
  coins: number;

  @observable
  @field({ type: "select", options: { guest: "Guest", admin: "Admin" } })
  access: string;

  @observable
  @field
  responsibleSalesperson: string;

  @observable
  @field({ type: "TodoItem[]" })
  todoItems: TodoItem[] = [];

  validateEmail(email: string) {
    if (email.indexOf("@form-for.com") === -1) {
      return "Only @form-for.com emails are valid";
    }
  }
}
