// @flow

function decorate(target: any, key: string, descriptor: any, properties: { [_: string]: any }) {
  if (!target.schema) target.schema = {};
  target.schema[key] = properties;

  return {
    writable: true
  };
}

export default function fieldDecorator(targetOrProperties: any, key?: string, descriptor?: any) {
  // @field - without params
  if (key) return decorate(targetOrProperties, key, descriptor, {});

  // @field({ }) - with params
  return (target: any, key: string, descriptor: any) => decorate(target, key, descriptor, targetOrProperties);
}
