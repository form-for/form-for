// @flow

import * as React from 'react';

import { type Schema } from '../types';

import FieldGroup from './FieldGroup';

export type Props = {
  name: string,
  children: React.Node
};

type CombinedProps = Props & {
  contextFor: Object,
  contextSchema: Object
};

export class InlineFieldComponent extends React.Component<CombinedProps> {
  static fieldGroupComponent = FieldGroup;

  getFor(): ?any {
    const { name, contextFor } = this.props;
    return contextFor[name];
  }

  getSchema(): Schema {
    const { name, contextSchema } = this.props;

    const schema = contextSchema[name] || (this.getFor() || {}).schema;
    if (!schema) this.throwMissingSchema();

    return schema;
  }

  render() {
    const { name, children } = this.props;

    const CFieldGroup = this.constructor.fieldGroupComponent;

    const value = this.getFor();
    if (!value) return null;

    return (
      <CFieldGroup for={value} schema={this.getSchema()}>
        {children}
      </CFieldGroup>
    );
  }

  /*
   * Errors
   */

  throwMissingSchema() {
    console.warn(`Undefined schema for inline field "${this.props.name}"`);
  }
}

export function withInlineFieldContext(Component: React.ComponentType<CombinedProps>) {
  return (props: Props) => (
    <FieldGroup.Context>
      {fieldGroupContext => (
        <Component contextFor={fieldGroupContext.for} contextSchema={fieldGroupContext.schema} {...props} />
      )}
    </FieldGroup.Context>
  );
}

export default withInlineFieldContext(InlineFieldComponent);
