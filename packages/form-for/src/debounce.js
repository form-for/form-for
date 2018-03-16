// @flow

import Field from './Field';
import memoize from './memoize';

let timeoutIds: { [object: Field]: TimeoutID } = {};

export default function debounce(field: Field, promise: Promise<*>, timeout?: number) {
  if (timeoutIds[field]) clearTimeout(timeoutIds[field]);
  timeout = timeout === true ? 500 : timeout;

  const timedPromise = new Promise(function(resolve, reject) {
    timeoutIds[field] = setTimeout(function() {
      promise.then(resolve, reject);
    }, timeout);
  });

  return memoize(field, timedPromise);
}
