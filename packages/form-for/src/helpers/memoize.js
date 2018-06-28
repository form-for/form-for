// @flow

import { FieldComponent } from '../components/Field';
import isPromise from './isPromise';

export type MemoizableResult = ?string | Promise<?string>;

const storedValues: { [object: FieldComponent]: { [value: any]: any } } = {};

export function clearMemoize(field: FieldComponent) {
  delete storedValues[field];
}

export default function memoize(field: FieldComponent, callback: () => Promise<?string>): MemoizableResult {
  if (!storedValues[field]) storedValues[field] = {};

  const value = field.getObjectValue();
  const stored = storedValues[field][value];

  if (stored) return stored;

  const promise = callback();
  storedValues[field][value] = promise;

  const setValue = value => (storedValues[field][value] = value);
  promise.then(setValue, setValue);

  return storedValues[field][value];
}
