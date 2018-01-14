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
  uncontrolled?: boolean,
  autoRender?: boolean,
  onSubmit?: Function,
  skipValidation?: boolean,
  touchOnMount?: boolean,
  children: React.Node
};

export default class Form extends React.PureComponent<Props> {
  form: ?HTMLFormElement;
  fieldGroup: ?FieldGroup;

  isValid(): boolean {
    // $FlowFixMe
    const testingValid = this.props.__testing_valid__;
    if (typeof testingValid !== "undefined") return testingValid;

    return !!this.form && this.form.checkValidity();
  }

  handleChange = (values: any) => {
    const onChange = this.props.onChange;
    if (onChange) onChange(values, this.isValid());
  };

  handleSubmit = () => {
    if (this.props.onSubmit) {
      return this.props.onSubmit((this.fieldGroup || {}).data);
    }
  };

  componentDidMount() {
    if (!this.isValid()) this.handleChange(this.props.for);
  }

  render(): React.Node {
    const {
      ["for"]: object,
      schema,
      immutable,
      mutationWrapper,
      prefix,
      onChange,
      uncontrolled,
      autoRender,
      skipValidation,
      touchOnMount,
      validate,
      children,
      ...remainingProps
    } = { ...this.props };

    delete remainingProps.__testing_valid__;

    return (
      <form ref={el => (this.form = el)} {...remainingProps} onSubmit={this.handleSubmit}>
        <FieldGroup
          ref={el => (this.fieldGroup = el)}
          for={object}
          schema={schema}
          immutable={immutable}
          mutationWrapper={mutationWrapper}
          prefix={prefix}
          onChange={onChange ? this.handleChange : undefined}
          autoRender={autoRender}
          skipValidation={skipValidation}
          touchOnMount={touchOnMount}
          validate={typeof validate === "undefined" ? true : validate}
          uncontrolled={uncontrolled}
        >
          {children}
        </FieldGroup>
      </form>
    );
  }
}
