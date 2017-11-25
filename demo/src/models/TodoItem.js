import { field } from "../../../src";

export default class TodoItem {
  uid: number;
  static uid = 0;

  @field({ required: true })
  title;

  constructor(title) {
    this.title = title;
    this.uid = this.constructor.generateUid();
  }

  static generateUid() {
    return this.uid++;
  }
}
