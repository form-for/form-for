// @flow

import * as React from "react";
import RequiredAbbreviation from "./RequiredAbbreviation";

type Props = {
  for: string,
  text: ?string | ?boolean,
  required: boolean
};

export default class Label extends React.Component<Props> {
  render() {
    if (!this.props.text) return null;

    return (
      <label htmlFor={this.props.for} className="form-control-label">
        {this.props.text}
        <RequiredAbbreviation required={this.props.required} />
      </label>
    );
  }
}
