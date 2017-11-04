// @flow

import * as React from "react";
import RequiredAbbreviation from "./RequiredAbbreviation";

type Props = {
  text: ?string | ?boolean
};

export default class Feedback extends React.Component<Props> {
  render() {
    if (!this.props.text) return null;

    return <div className="invalid-feedback">{this.props.text}</div>;
  }
}
