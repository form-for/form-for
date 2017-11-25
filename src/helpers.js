function clone(data: any) {
  return Array.isArray(data) ? cloneArray(data) : cloneObject(data);
}

function cloneObject(data: any) {
  if (!data.constructor) return { ...data };

  const constructor = data.constructor;
  try {
    return Object.assign(new constructor(), data);
  } catch (e) {
    throw `The class ${constructor.name} could not be instantiated with no arguments`;
  }
}

function cloneArray(value) {
  return [...value];
}

export { clone };
