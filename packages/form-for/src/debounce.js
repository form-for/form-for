// @flow

import Field from './Field';

let storedValues: { [object: Field]: any } = {};
let storedResults: { [object: Field]: ?string | Promise<?string> } = {};
let timeoutIds: { [object: Field]: TimeoutID } = {};

export function shouldUpdate(field: Field) {
  const value = field.getContextObjectValue();
  if (storedValues[field] === value) return false;

  storedValues[field] = value;
  return true;
}

export default function debounce(
  field: Field,
  callback: Function,
  timeout: number = 500,
  shouldUpdate: Function = shouldUpdate
): Promise<*> | ?string {
  if (!shouldUpdate(field)) return storedResults[field];
  if (timeoutIds[field]) clearTimeout(timeoutIds[field]);

  storedResults[field] = new Promise((resolve, reject) => {
    timeoutIds[field] = setTimeout(async function() {
      try {
        await callback();
        storedResults[field] = null;
        resolve();
      } catch (e) {
        storedResults[field] = e.message;
        reject(e.message);
      }
    }, timeout);
  });

  return storedResults[field];
}
