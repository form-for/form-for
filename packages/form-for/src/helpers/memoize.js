// @flow

import { Field } from '../components/Field';
import isPromise from './isPromise';

export type MemoizableResult = ?string | Promise<?string>;

let storedValues: { [object: Field]: any } = {};
let storedResults: { [object: Field]: MemoizableResult } = {};

export function memoizeCompare(field: Field, fn?: Function): boolean {
  const stored = storedValues[field];
  if (fn) return fn();

  const value = field.getObjectValue();
  if (stored === value) return false;

  storedValues[field] = value;
  return true;
}

export function clearMemoize(field: Field) {
  delete storedValues[field];
  delete storedResults[field];
}

export default function memoize(field: Field, callback: () => Promise<?string>): MemoizableResult {
  if (!memoizeCompare(field)) return storedResults[field];

  const promise = callback();
  storedResults[field] = promise;

  const setValue = value => (storedResults[field] = value);
  promise.then(setValue, setValue);

  return storedResults[field];
}
