// @flow

import * as React from "react";
import { withInputProps } from "../../../src";
import type { InputProps } from "../../../src";
import Input from "./Input";

class SelectInput extends React.Component<InputProps> {
  render() {
    return <Input component={this.renderInput()} {...this.props} />;
  }

  renderInput() {
    return (
      <select className="form-control" {...this.props}>
        <option value="">--- {this.props.placeholder} ---</option>
        {this.renderOptions()}
      </select>
    );
  }

  renderOptions() {
    const options = this.props.options;

    return Object.keys(options).map(key => (
      <option key={key} value={key}>
        {options[key]}
      </option>
    ));
  }
}

export default withInputProps(SelectInput);
