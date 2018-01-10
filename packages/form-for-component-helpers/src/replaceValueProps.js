// @flow

import { capitalize } from "./stringHelpers";

export default function replaceValueProps(props: Object, newName: string, fn?: Function): Object {
  const { defaultValue, value, ...otherProps } = { props };

  let convertedName, convertedValue;

  if (typeof props[newName] === "undefined" && typeof value !== "undefined") {
    convertedName = newName;
    convertedValue = fn ? fn(value) : value;
  } else {
    const defaultNewName = `default${capitalize(newName)}`;
    if (typeof props[defaultNewName] === "undefined") {
      convertedName = defaultNewName;
      convertedValue = defaultValue;
    }
  }

  return convertedName
    ? {
        [convertedName]: convertedValue,
        ...otherProps
      }
    : otherProps;
}
