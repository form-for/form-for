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
  mutable?: boolean,
  children: React.Node,
  [key: string]: any
};

export default class Form extends React.Component<Props> {
  static mutableDecorator: ?Function;

  handleMutableChange = (mutator: Function, name: string, value: any) => {
    const decorator = this.constructor.mutableDecorator;
    if (decorator) {
      decorator(mutator, name, value)();
    } else {
      mutator();
    }

    if (this.props.onChange) {
      this.props.onChange(mutator, name, value);
    }
  };

  render(): React.Node {
    const { ["for"]: object, schema, prefix, onChange, validate, mutable, ...remainingProps } = { ...this.props };

    const onChangeHandler = this.props.mutable !== false ? this.handleMutableChange : onChange;

    return (
      <form {...remainingProps}>
        <FieldGroup
          for={object}
          schema={schema}
          prefix={prefix}
          onChange={onChangeHandler}
          validate={typeof validate === "undefined" ? true : validate}
          mutable={mutable}
        >
          {this.props.children}
        </FieldGroup>
      </form>
    );
  }
}
