// @flow

import { observable } from "mobx";

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
  @field({ type: "email", required: true })
  email: string;

  @observable
  @field({ type: "money", required: true })
  credits: number;

  @observable
  @field({ type: "select", options: { guest: "Guest", admin: "Admin" } })
  access: string;

  @observable
  @field({ type: "TodoItem[]" })
  todoItems: TodoItem[] = [];
}
