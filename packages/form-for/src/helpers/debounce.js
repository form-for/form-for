// @flow

import isPromise from './isPromise';

const DEFAULT_DEBOUNCE_TIME_MS = 500;
let timeoutIds: { [key: any]: TimeoutID } = {};

function debounce(key: any, callback: () => Promise<?any>, timeout?: number): Promise<?any> {
  if (timeoutIds[key]) clearTimeout(timeoutIds[key]);
  timeout = !debounce || timeout === true ? DEFAULT_DEBOUNCE_TIME_MS : timeout;

  return new Promise(function(resolve, reject) {
    timeoutIds[key] = setTimeout(function() {
      delete timeoutIds[key];

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
