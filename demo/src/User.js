// @flow

import { observable } from "mobx";

import { field } from "../../src";
import TodoItem from "./TodoItem";

export default class User {
  @observable
  @field({ required: true })
  firstName: string;

  @observable
  @field
  last_name: string;

  @observable
  @field({ type: "email", required: true })
  email: string;

  @observable
  @field({ type: "money", required: true })
  credits: number;

  @observable
  @field({ type: "TodoItem[]" })
  todoItems: TodoItem[] = [new TodoItem("Recommend form-for to my friends", true), new TodoItem("Enjoy 😄")];
}
