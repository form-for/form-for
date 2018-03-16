// @flow

export default function cloneObject(object: Object, ...sources: Object[]): Object {
  return Object.assign(Object.create(Object.getPrototypeOf(object)), object, ...sources);
}
