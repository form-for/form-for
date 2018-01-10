// @flow

export default function uniqueId(Component: any): string {
  const id = Component.props && Component.props.id;
  if (id) return id;

  if (Component.__uniqueGeneratedId) return Component.__uniqueGeneratedId;

  return (Component["__uniqueGeneratedId"] = `${Component.constructor.name}#${uniqueId.idCounter++}`);
}

uniqueId.idCounter = 1;
