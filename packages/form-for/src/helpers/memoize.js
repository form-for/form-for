// @flow

import { FieldComponent } from '../components/Field';
import isPromise from './isPromise';

export type MemoizableResult = ?string | Promise<?string>;

const storedValues: { [object: FieldComponent]: { [value: any]: any } } = {};

export function clearMemoize(field: FieldComponent) {
  delete storedValues[field];
}

function getFieldObject(field: FieldComponent) {
  if (!storedValues[field]) storedValues[field] = {};
  return storedValues[field];
}

export function hasMemoizedValue(field: FieldComponent): ?any {
  const fieldValue = field.getObjectValue();
  return getFieldObject(field).hasOwnProperty(fieldValue);
}

export function memoizedValue(field: FieldComponent): ?any {
  const fieldValue = field.getObjectValue();
  return getFieldObject(field)[fieldValue];
}

export default function memoize(field: FieldComponent, callback: () => Promise<?any>): MemoizableResult {
  if (hasMemoizedValue(field)) return memoizedValue(field);

  const fieldValue = field.getObjectValue();
  const promise = callback();
  storedValues[field][fieldValue] = promise;

  const setValue = value => (storedValues[field][fieldValue] = value);
  promise.then(setValue, setValue);

  return storedValues[field][fieldValue];
}
