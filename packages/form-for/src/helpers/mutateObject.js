// @flow

import cloneObject from './cloneObject';

export default function mutateObject(object: Object, name: string, value: any, index: ?any) {
  if (typeof index === 'undefined') return cloneObject(object, { [name]: value });

  const previousValue = object[name];
  let newValue;

  if (Array.isArray(previousValue)) {
    newValue = [...previousValue];
    newValue[index] = value;
  } else {
    // $FlowFixMe
    newValue = cloneObject(previousValue, { [index]: value });
  }

  return cloneObject(object, { [name]: newValue });
}
