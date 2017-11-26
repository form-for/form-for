// @flow

import * as React from "react";
import type { Schema } from "./FieldGroup";
import FieldGroup from "./FieldGroup";

export type Props = {
  for: { [_: any]: any },
  schema?: Schema,
  immutable?: boolean,
  mutationWrapper?: Function,
  prefix?: string,
  onChange?: Function,
  onSubmit?: Function,
  skipValidation?: boolean,
  touchOnMount?: boolean,
  children: React.Node
};

export default class Form extends React.Component<Props> {
  form: ?HTMLFormElement;
  fieldGroup: ?FieldGroup;

  handleChange = (values: any) => {
    const onChange = this.props.onChange;

    if (onChange && this.form) {
      onChange(values, this.form.checkValidity());
    }
  };

  handleSubmit = () => {
    if (this.props.onSubmit) {
      return this.props.onSubmit((this.fieldGroup || {}).data);
    }
  };

  componentDidMount() {
    if (this.form && !this.form.checkValidity()) {
      this.handleChange(this.props.for);
    }
  }

  render(): React.Node {
    const {
      ["for"]: object,
      schema,
      immutable,
      mutationWrapper,
      prefix,
      onChange,
      skipValidation,
      touchOnMount,
      validate,
      children,
      ...remainingProps
    } = { ...this.props };

    return (
      <form ref={el => (this.form = el)} {...remainingProps} onSubmit={this.handleSubmit}>
        <FieldGroup
          ref={el => (this.fieldGroup = el)}
          for={object}
          schema={schema}
          immutable={immutable}
          mutationWrapper={mutationWrapper}
          prefix={prefix}
          onChange={this.handleChange}
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
