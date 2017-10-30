// @flow

import * as React from "react";
import type { Schema } from "./FieldContext";
import FieldContext from "./FieldContext";

export type Props = {
  for: any,
  schema?: Schema,
  children: React.Node
};

export default class Form extends React.Component<Props> {
  render(): React.Node {
    const { ["for"]: object, schema, ...remainingProps } = { ...this.props };

    return (
      <form {...remainingProps}>
        <FieldContext for={object} schema={schema}>
          {this.props.children}
        </FieldContext>
      </form>
    );
  }
}
