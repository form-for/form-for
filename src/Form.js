// @flow

import * as React from "react";
import type { Schema } from "./FieldGroup";
import FieldGroup from "./FieldGroup";

export type Props = {
  for: { [_: any]: any },
  schema?: Schema,
  prefix?: string,
  onMount?: Function,
  onChange?: Function,
  onValidityChange?: Function,
  onValid?: Function,
  onInvalid?: Function,
  validate?: string | boolean, // mount, focus, change, blur
  children: React.Node
};

export default class Form extends React.Component<Props> {
  render(): React.Node {
    const {
      ["for"]: object,
      schema,
      prefix,
      onMount,
      onChange,
      onValidityChange,
      onValid,
      onInvalid,
      validate,
      children,
      ...remainingProps
    } = { ...this.props };

    return (
      <form {...remainingProps}>
        <FieldGroup
          for={object}
          schema={schema}
          prefix={prefix}
          onMount={onMount}
          onChange={onChange}
          onValidityChange={onValidityChange}
          onValid={onValid}
          onInvalid={onInvalid}
          validate={typeof validate === "undefined" ? true : validate}
        >
          {children}
        </FieldGroup>
      </form>
    );
  }
}
