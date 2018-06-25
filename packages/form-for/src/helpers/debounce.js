// @flow

import { Field } from '../components/Field';
import memoize, { type MemoizableResult } from './memoize';

const DEFAULT_DEBOUNCE_TIME_MS = 500;
let timeoutIds: { [object: Field]: TimeoutID } = {};

export default function debounce(field: Field, callback: () => Promise<*>, timeout?: number): MemoizableResult {
  return memoize(field, () => {
    if (timeoutIds[field]) clearTimeout(timeoutIds[field]);
    timeout = !debounce || timeout === true ? DEFAULT_DEBOUNCE_TIME_MS : timeout;

    return new Promise(function(resolve, reject) {
      timeoutIds[field] = setTimeout(async function() {
        delete timeoutIds[field];

        try {
          resolve(await callback());
        } catch (e) {
          reject(e.message);
        }
      }, timeout);
    });
  });
}
