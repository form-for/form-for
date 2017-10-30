// @flow

import { field } from "../../src";

export default class TodoItem {
  uid: number;
  static uid = 0;

  @field({ required: true })
  title: string;

  @field({ type: "boolean" })
  checked: boolean = false;

  constructor(title: string) {
    this.title = title;
    this.uid = this.constructor.generateUid();
  }

  static generateUid(): number {
    return this.uid++;
  }
}
