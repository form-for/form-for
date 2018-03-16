// @flow

import Field from './Field';
import isPromise from './isPromise';

type Result = ?string | Promise<?string>;

let storedValues: { [object: Field]: any } = {};
let storedResults: { [object: Field]: Result } = {};

export function memoizeCompare(field: Field, fn?: Function): boolean {
  const stored = storedValues[field];
  if (fn) return fn();

  const value = field.getContextObjectValue();
  if (stored === value) return false;

  storedValues[field] = value;
  return true;
}

export function clearMemoize(field: Field) {
  delete storedValues[field];
  delete storedResults[field];
}

export default function memoize(field: Field, promise: Promise<?string>): Result {
  if (!memoizeCompare(field)) return storedResults[field];

  storedResults[field] = promise;

  const setValue = value => (storedResults[field] = value);
  promise.then(setValue, setValue);

  return storedResults[field];
}
