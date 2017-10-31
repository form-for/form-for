// @flow

import * as React from "react";
import { withInputProps } from "../../../src";
import type { InputProps } from "../../../src";

type Props = {
  input?: React.Node
} & InputProps;

class Input extends React.Component<Props> {
  handleChange = (event: SyntheticInputEvent<>) => {
    if (this.props.onChange) {
      this.props.onChange(event, event.target.value);
    }
  };

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
    if (this.props.input) return this.props.input;
    return (
      <input className="form-control" placeholder={this.props.label} {...this.props} onChange={this.handleChange} />
    );
  }
}

export default withInputProps(Input);
