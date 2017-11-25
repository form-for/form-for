// @flow

import * as React from "react";
import type { Schema } from "./FieldGroup";
import FieldGroup from "./FieldGroup";

export type Props = {
  for: { [_: any]: any },
  schema?: Schema,
  prefix?: string,
  onChange?: Function,
  onSubmit?: Function,
  skipValidation?: boolean,
  touchOnMount?: boolean,
  children: React.Node
};

export default class Form extends React.Component<Props> {
  fieldGroup: ?FieldGroup;

  handleSubmit = (event: Event) => {
    if (this.props.onSubmit) {
      return this.props.onSubmit(event, (this.fieldGroup || {}).data);
    }
  };

  render(): React.Node {
    const {
      ["for"]: object,
      schema,
      prefix,
      onChange,
      skipValidation,
      touchOnMount,
      validate,
      children,
      ...remainingProps
    } = { ...this.props };

    return (
      <form {...remainingProps} onSubmit={this.handleSubmit}>
        <FieldGroup
          ref={el => (this.fieldGroup = el)}
          for={object}
          schema={schema}
          prefix={prefix}
          onChange={onChange}
          skipValidation={skipValidation}
          touchOnMount={touchOnMount}
          validate={typeof validate === "undefined" ? true : validate}
        >
          {children}
        </FieldGroup>
      </form>
    );
  }
}
