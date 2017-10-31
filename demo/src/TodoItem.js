// @flow

import { observable } from "mobx";

import { field } from "../../src";

export default class TodoItem {
  uid: number;
  static uid = 0;

  @observable
  @field({ required: true })
  title: string;

  @observable
  @field({ type: "boolean" })
  checked: boolean = false;

  constructor(title: string, checked: boolean = false) {
    this.title = title;
    this.checked = checked;
    this.uid = this.constructor.generateUid();
  }

  static generateUid(): number {
    return this.uid++;
  }
}
