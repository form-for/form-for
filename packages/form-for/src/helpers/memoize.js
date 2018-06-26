// @flow

import { FieldComponent } from '../components/Field';
import isPromise from './isPromise';

export type MemoizableResult = ?string | Promise<?string>;

let storedValues: { [object: FieldComponent]: any } = {};
let storedResults: { [object: FieldComponent]: MemoizableResult } = {};

export function memoizeCompare(field: FieldComponent, fn?: Function): boolean {
  const stored = storedValues[field];
  if (fn) return fn();

  const value = field.getObjectValue();
  if (stored === value) return false;

  storedValues[field] = value;
  return true;
}

export function clearMemoize(field: FieldComponent) {
  delete storedValues[field];
  delete storedResults[field];
}

export default function memoize(field: FieldComponent, callback: () => Promise<?string>): MemoizableResult {
  if (!memoizeCompare(field)) return storedResults[field];

  const promise = callback();
  storedResults[field] = promise;

  const setValue = value => (storedResults[field] = value);
  promise.then(setValue, setValue);

  return storedResults[field];
}
