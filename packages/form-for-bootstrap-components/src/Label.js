// @flow

import * as React from 'react';
import RequiredAbbreviation from './RequiredAbbreviation';

type Props = {
  for?: string,
  text?: any,
  defaultText: string,
  required?: boolean
};

export default class Label extends React.Component<Props> {
  render() {
    if (this.props.text === false) return null;

    return (
      <label htmlFor={this.props.for} className="form-control-label">
        {this.props.text || this.props.defaultText}
        <RequiredAbbreviation required={this.props.required} />
      </label>
    );
  }
}
