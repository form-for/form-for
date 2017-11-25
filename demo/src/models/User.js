// @flow

import { field } from "../../../src";

export default class User {
  @field({ required: true, placeholder: "First name" })
  name: string;

  @field({ type: "email", required: true })
  email: string;

  @field({ type: "password", required: true })
  password: string;

  @field({ type: "password", observe: "password", validator: "validatePasswordConfirmation" })
  password_confirmation: string;

  @field({ type: "todoItem[]" })
  todoItems = [];

  validatePasswordConfirmation(password_confirmation: string, user: User) {
    if (password_confirmation !== user.password) return "Passwords don't match";
  }
}
