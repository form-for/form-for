// @flow

import * as React from 'react';
import type { ComponentProps } from 'form-for';

export type Props = {
  options: { [key: any]: any },
  placeholder?: string,
  required?: boolean
} & ComponentProps;

export default class SelectInput extends React.PureComponent<Props> {
  select: ?HTMLSelectElement;

  componentDidMount() {
    this.props.onMount(this.select);
  }

  render() {
    const { error, options, ...props } = { ...this.props };
    delete props.onMount;
    delete props.touched;
    delete props.type;
    delete props.validating;

    return (
      <select ref={el => (this.select = el)} aria-invalid={error} {...props}>
        {this.renderDefaultOption()}

        {Object.keys(options).map(key => (
          <option key={key} value={key}>
            {options[key]}
          </option>
        ))}
      </select>
    );
  }

  renderDefaultOption() {
    const { placeholder, required, value } = this.props;
    if (placeholder === false || (required && value)) return null;

    return <option value="">{placeholder || '---'}</option>;
  }
}
