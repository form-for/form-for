// @flow

import { action } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

import { Form as OriginalForm } from "../../src";
import type { FormProps } from "../../src";

@observer
export default class Form extends React.Component<FormProps> {
  handleChange = (mutator: Function, name: string, value: any) => {
    action(`Update form instance ${name}`, mutator)();

    if (this.props.onChange) {
      this.props.onChange(mutator, name, value);
    }
  };

  render() {
    return <OriginalForm {...this.props} onChange={this.handleChange} />;
  }
}
