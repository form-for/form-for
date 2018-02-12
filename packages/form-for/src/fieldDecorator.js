// @flow

function decorate(target: any, key: string, descriptor: any, properties: { [_: string]: any }) {
  if (!target.schema) target.schema = {};
  if (properties.error && typeof target[properties.error] === 'function') {
    properties.error = target[properties.error];
  }

  target.schema[key] = properties;
  descriptor.writable = true;
}

export default function fieldDecorator(targetOrProperties: any, key?: string, descriptor?: any) {
  if (key) {
    return decorate(targetOrProperties, key, descriptor, {});
  }

  return (target: any, key: string, descriptor: any) => decorate(target, key, descriptor, targetOrProperties);
}
