// @flow

import cloneObject from './cloneObject';

export default class Mutator {
  for: any;

  constructor(value: any) {
    this.for = value;
  }

  remove(index: any) {
    const method = Array.isArray(this.for) ? this.removeArrayIndex : this.removeObjectIndex;
    return method.bind(this)(index);
  }

  removeArrayIndex(index: any) {
    const newValue = this.for.slice();
    newValue.splice(index, 1);
    return newValue;
  }

  removeObjectIndex(index: any) {
    const newValue = cloneObject(this.for);
    delete newValue[index];
    return newValue;
  }
}
