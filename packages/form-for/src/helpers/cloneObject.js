// @flow

export default function cloneObject(object: Object, ...sources: Object[]): Object {
  const newObject = Object.create(Object.getPrototypeOf(object));
  return Object.assign(newObject, object, ...sources);
}
