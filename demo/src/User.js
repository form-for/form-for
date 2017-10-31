// @flow

import { field } from "../../src";
import TodoItem from "./TodoItem";

export default class User {
  @field({ required: true })
  name: string;

  @field last_name: string;

  @field({ type: "email", required: true })
  email: string;

  @field({ type: "money", required: true })
  credits: number;

  @field({ type: "TodoItem[]" })
  todoItems: TodoItem[] = [new TodoItem("Recommend form-for to my friends", true), new TodoItem("Enjoy 😄")];
}
