// @flow

import isPromise from './isPromise';
import memoize, { hasMemoizedValue, memoizedValue } from './memoize';
import debounce from './debounce';

type MemoizeCallback = () => Promise<?any>;

function memoizeAndDebounce(key: any, value: any, callback: () => Promise<?any>, timeout?: number) {
  if (hasMemoizedValue(key, value)) return memoizedValue(key, value);

  const memoizeCallback: MemoizeCallback = () => memoize(key, value, callback);
  return debounce(key, memoizeCallback, timeout);
}

export default memoizeAndDebounce;
