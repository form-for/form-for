// @flow

import isPromise from './isPromise';

const storedValues: { [key: any]: { [value: any]: any } } = {};

export function clearMemoize(key: any) {
  delete storedValues[key];
}

function getStoredValues(key: any) {
  if (!storedValues[key]) storedValues[key] = {};
  return storedValues[key];
}

export function hasMemoizedValue(key: any, value: any): ?any {
  return getStoredValues(key).hasOwnProperty(value);
}

export function memoizedValue(key: any, value: any): ?any {
  return getStoredValues(key)[value];
}

export default function memoize(key: any, value: any, callback: () => Promise<?any>): any {
  if (hasMemoizedValue(key, value)) return memoizedValue(key, value);

  const promise = callback();
  getStoredValues(key)[value] = promise;

  const setValue = value => {
    // If the field has been removed storedValues[field] won't exist anymore
    if (storedValues[key]) storedValues[key][value] = value;
  };
  promise.then(setValue, setValue);

  return storedValues[key][value];
}
