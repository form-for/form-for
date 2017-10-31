// @flow

import * as React from "react";
import { withInputProps } from "../../../src";
import type { InputProps } from "../../../src";

class BooleanInput extends React.Component<InputProps> {
  handleChange = (event: any) => {
    this.props.onChange(event, event.target.checked);
  };

  render() {
    return this.props.label ? this.renderInputWithLabel() : this.renderInput();
  }

  renderInput() {
    const { defaultValue, value, label, onChange, ...props } = { ...this.props };
    if (typeof props.checked === "undefined" && typeof value !== "undefined") {
      props.checked = !!value;
    } else if (typeof props.defaultChecked === "undefined") {
      props.defaultChecked = defaultValue;
    }

    if (onChange) props.onChange = this.handleChange;
    return <input className="form-check-input" {...props} type="checkbox" />;
  }

  renderInputWithLabel() {
    return (
      <div className="form-check">
        <label className="form-check-label">
          {this.renderInput()}
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default withInputProps(BooleanInput);
