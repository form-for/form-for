// @flow

import * as React from "react";

type Props = {
  required?: boolean
};

export default class RequiredAbbreviation extends React.Component<Props> {
  render() {
    if (!this.props.required) return null;

    return <abbr title="required">*</abbr>;
  }
}
