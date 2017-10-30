// @flow

import * as React from "react";
import { withInputProps } from "../../../src";
import type { InputProps } from "../../../src";

class BooleanInput extends React.Component<InputProps> {
  render() {
    return (
      <div className="form-check">
        <label className="form-check-label">
          <input name={this.props.name} type="checkbox" className="form-check-input" />
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default withInputProps(BooleanInput);
