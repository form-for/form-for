// @flow

import * as React from "react";
import type { Schema } from "./FieldGroup";
import FieldGroup from "./FieldGroup";

export type Props = {
  for: any,
  schema?: Schema,
  prefix?: string,
  onChange?: Function,
  validate?: string | boolean, // mount, focus, change, blur
  children: React.Node,
  [key: string]: any
};

export default class Form extends React.Component<Props> {
  render(): React.Node {
    const { ["for"]: object, schema, prefix, onChange, validate, children, ...remainingProps } = { ...this.props };

    return (
      <form {...remainingProps}>
        <FieldGroup
          for={object}
          schema={schema}
          prefix={prefix}
          onChange={onChange}
          validate={typeof validate === "undefined" ? true : validate}
        >
          {children}
        </FieldGroup>
      </form>
    );
  }
}
