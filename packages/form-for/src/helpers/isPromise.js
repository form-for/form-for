// @flow

export default function isPromise(value: any) {
  return typeof value === 'object' && typeof value.then === 'function';
}
