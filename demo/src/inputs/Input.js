// @flow

import * as React from "react";
import { withInputProps } from "../../../src";
import type { InputProps } from "../../../src";

type Props = {
  component?: React.Node
} & InputProps;

class Input extends React.Component<Props> {
  render() {
    return (
      <div className="form-group">
        {this.renderLabel()}
        {this.renderInput()}
      </div>
    );
  }

  renderLabel() {
    const label = this.props.label;
    if (!label) return null;

    return (
      <label htmlFor={this.props.id}>
        {label}
        {this.renderRequiredAbbreviation()}
      </label>
    );
  }

  renderRequiredAbbreviation() {
    if (!this.props.required) return null;

    return <abbr title="required">*</abbr>;
  }

  renderInput() {
    if (this.props.component) return this.props.component;

    const { label, ...props } = { ...this.props };
    return <input className="form-control" {...props} />;
  }
}

export default withInputProps(Input);
