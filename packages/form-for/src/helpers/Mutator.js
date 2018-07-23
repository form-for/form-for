// @flow

import cloneObject from './cloneObject';

export default class Mutator {
  for: any;

  constructor(value: any) {
    this.for = this.clone(value);
  }

  clone(value: any) {
    return Array.isArray(value) ? value.splice() : cloneObject(value);
  }

  inArrayObject(name: string, ...args: any[]) {
    const type = Array.isArray(this.for) ? 'Array' : 'Object';
    // $FlowFixMe
    return this[`${name}In${type}`].bind(this)(...args);
  }

  insert(index: any, value: any) {
    this.inArrayObject('insert', index, value);
  }

  insertInArray(index: any, value: any) {
    this.for.splice(index, 0, value);
  }

  insertInObject(index: any, value: any) {
    this.for[index] = value;
  }

  move(fromIndex: any, toIndex: any) {
    const value = this.for[fromIndex];
    this.remove(fromIndex);
    this.insert(toIndex, value);
  }

  pop() {
    this.inArrayObject('pop');
  }

  popInArray() {
    this.for.pop();
  }

  popInObject() {
    const firstKey = Object.keys(this.for).pop();
    delete this.for[firstKey];
  }

  push(value: any) {
    this.for.push(value);
  }

  remove(index: any) {
    this.inArrayObject('remove', index);
  }

  removeInArray(index: any) {
    this.for.splice(index, 1);
  }

  removeInObject(index: any) {
    delete this.for[index];
  }

  shift() {
    this.inArrayObject('shift');
  }

  shiftInArray() {
    this.for.shift();
  }

  shiftInObject() {
    const firstKey = Object.keys(this.for).shift();
    delete this.for[firstKey];
  }

  swap(indexA: any, indexB: any) {
    const valueB = this.for[indexB];
    this.for[indexB] = this.for[indexA];
    this.for[indexA] = valueB;
  }

  unshift(value: any) {
    this.for.unshift(value);
  }
}
