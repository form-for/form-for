// @flow

export default function uniqueId(component: any): string {
  const id = component.props && component.props.id;
  if (id) return id;

  if (component.__uniqueGeneratedId) return component.__uniqueGeneratedId;

  return (component['__uniqueGeneratedId'] = `${component.constructor.name}-${uniqueId.idCounter++}`);
}

uniqueId.idCounter = 1;
