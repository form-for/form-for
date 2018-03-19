// @flow

import Field from '../components/Field';
import memoize from './memoize';

let timeoutIds: { [object: Field]: TimeoutID } = {};

export default function debounce(field: Field, callback: () => Promise<*>, timeout?: number) {
  return memoize(field, () => {
    if (timeoutIds[field]) clearTimeout(timeoutIds[field]);
    timeout = !debounce || timeout === true ? 500 : timeout;

    return new Promise(function(resolve, reject) {
      timeoutIds[field] = setTimeout(async function() {
        delete timeoutIds[field];
        return await callback();
      }, timeout);
    });
  });
}
