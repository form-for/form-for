// @flow

import { FieldComponent } from '../components/Field';
import isPromise from './isPromise';

const DEFAULT_DEBOUNCE_TIME_MS = 500;
let timeoutIds: { [object: FieldComponent]: TimeoutID } = {};

function debounce(field: FieldComponent, callback: () => Promise<?any>, timeout?: number): Promise<?any> {
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
}

export default debounce;
