// @flow

import * as React from "react";
import { withInputProps } from "../../../src";
import type { InputProps } from "../../../src";

class BooleanInput extends React.Component<InputProps> {
  render() {
    const { defaultValue, value, ...props } = { ...this.props };
    if (value && !props.checked) {
      props.checked = value;
    } else if (!props.defaultChecked) {
      props.defaultChecked = defaultValue;
    }

    return (
      <div className="form-check">
        <label className="form-check-label">
          <input className="form-check-input" {...props} type="checkbox" />
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default withInputProps(BooleanInput);
