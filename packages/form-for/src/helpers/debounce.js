// @flow

import { FieldComponent } from '../components/Field';
import memoize, { type MemoizableResult } from './memoize';
import isPromise from './isPromise';

const DEFAULT_DEBOUNCE_TIME_MS = 500;
let timeoutIds: { [object: FieldComponent]: TimeoutID } = {};

export default function debounce(
  field: FieldComponent,
  callback: () => Promise<*>,
  timeout?: number
): MemoizableResult {
  return memoize(field, () => {
    if (timeoutIds[field]) clearTimeout(timeoutIds[field]);
    timeout = !debounce || timeout === true ? DEFAULT_DEBOUNCE_TIME_MS : timeout;

    return new Promise(function(resolve, reject) {
      timeoutIds[field] = setTimeout(function() {
        delete timeoutIds[field];

        const callbackResponse = callback();
        if (isPromise(callbackResponse)) {
          callbackResponse.then(resolve, reject);
        } else {
          resolve(callbackResponse);
        }
      }, timeout);
    });
  });
}
