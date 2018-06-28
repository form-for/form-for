// @flow

import { FieldComponent } from '../components/Field';
import isPromise from './isPromise';
import memoize, { hasMemoizedValue, memoizedValue, type MemoizableResult } from './memoize';
import debounce from './debounce';

type MemoizeCallback = () => Promise<?any>;

function memoizeAndDebounce(field: FieldComponent, callback: () => Promise<?any>, timeout?: number): MemoizableResult {
  if (hasMemoizedValue(field)) return memoizedValue(field);

  // $FlowFixMe - memoizedValue is called beforehand, so the response here will always be a promise
  const memoizeCallback: MemoizeCallback = () => memoize(field, callback);
  return debounce(field, memoizeCallback, timeout);
}

export default memoizeAndDebounce;
