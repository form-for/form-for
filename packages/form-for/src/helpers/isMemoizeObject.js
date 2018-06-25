// @flow

import isPromise from './isPromise';

export default function isMemoizeObject(value: any) {
  return typeof value === 'object' && !isPromise(value);
}
