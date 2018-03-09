// @flow

function decorate(target: any, key: string, descriptor: any, properties: { [_: string]: any }) {
  if (!target.schema) target.schema = {};
  target.schema[key] = properties;
  descriptor.writable = true;
}

export default function fieldDecorator(targetOrProperties: any, key?: string, descriptor?: any) {
  if (key) {
    return decorate(targetOrProperties, key, descriptor, {});
  }

  return (target: any, key: string, descriptor: any) => decorate(target, key, descriptor, targetOrProperties);
}
