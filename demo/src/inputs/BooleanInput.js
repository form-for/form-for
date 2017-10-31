// @flow

import * as React from "react";
import { withInputProps } from "../../../src";
import type { InputProps } from "../../../src";

class BooleanInput extends React.Component<InputProps> {
  handleChange = (event: any) => {
    this.props.onChange(event, event.target.checked);
  };

  render() {
    const { defaultValue, value, ...props } = { ...this.props };
    if (typeof props.checked === "undefined" && typeof value !== "undefined") {
      props.checked = !!value;
    } else if (typeof props.defaultChecked === "undefined") {
      props.defaultChecked = defaultValue;
    }

    return (
      <div className="form-check">
        <label className="form-check-label">
          <input className="form-check-input" {...props} type="checkbox" onChange={this.handleChange} />
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default withInputProps(BooleanInput);
