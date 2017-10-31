// @flow

import * as React from "react";
import type { Schema } from "./FieldGroup";
import FieldGroup from "./FieldGroup";

export type Props = {
  for: any,
  schema?: Schema,
  prefix?: string,
  onChange?: Function,
  children: React.Node
};

export default class Form extends React.Component<Props> {
  render(): React.Node {
    const { ["for"]: object, schema, prefix, onChange, ...remainingProps } = { ...this.props };

    return (
      <form {...remainingProps}>
        <FieldGroup for={object} schema={schema} prefix={prefix} onChange={onChange}>
          {this.props.children}
        </FieldGroup>
      </form>
    );
  }
}
