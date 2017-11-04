// @flow

import * as React from "react";
import type { ComponentProps } from "./ComponentProps.flow";

export type Props = {
  options: { [_: any]: any }
} & ComponentProps;

export default class SelectInput extends React.Component<Props> {
  select: ?HTMLSelectElement;

  handleRef = (el: ?HTMLSelectElement) => {
    this.select = el;

    if (this.props.ref) {
      this.props.ref(el);
    }
  };

  componentDidMount() {
    this.props.onMount(this.select);
  }

  render() {
    const { error, onMount, options, ...props } = { ...this.props };

    return (
      <select ref={el => (this.select = el)} {...props}>
        {this.renderOptions()}
      </select>
    );
  }

  renderOptions() {
    const options: any = this.props.options;

    return Object.keys(options).map(key => {
      const value = options[key];
      return (
        <option key={key} value={key}>
          {value}
        </option>
      );
    });
  }
}
