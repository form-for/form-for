// @flow

import React from "react";

import Input from "../form-for-bootstrap-components/Input";

export default class MoneyField extends React.Component<*> {
  render() {
    return <Input {...this.props} type="number" step="0.01" />;
  }
}
