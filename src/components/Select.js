// @flow

import * as React from "react";
import type { ComponentProps } from "./ComponentProps.flow";

export type Props = {
  options: { [key: any]: any },
  placeholder?: string
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
    if (this.props.onMount) {
      this.props.onMount(this.select);
    }
  }

  render() {
    const { type, error, onMount, options, ...props } = { ...this.props };

    return (
      <select ref={this.handleRef} {...props}>
        {this.renderDefaultOption()}
        {this.renderOptions()}
      </select>
    );
  }

  renderDefaultOption() {
    const hasValue = this.props.value || this.props.defaultValue;
    if (this.props.placeholder === false || (this.props.required && hasValue)) return null;

    return <option value="">{this.props.placeholder || "---"}</option>;
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
