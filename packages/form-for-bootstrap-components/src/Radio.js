// @flow

import * as React from 'react';
import { Radio as BaseRadio, type RadioProps } from 'form-for-components';
import { help, humanized, uniqueId } from 'form-for-component-helpers';
import humanizeOptions from './humanizeOptions';
import Label from './Label';
import Help from './Help';
import Feedback from './Feedback';

export type Props = {
  className?: string,
  required?: boolean,
  label?: any,
  help?: any
} & RadioProps;

export default class Radio extends React.PureComponent<Props> {
  input: ?HTMLInputElement;

  componentDidMount() {
    this.props.onMount(this.input);
  }

  render() {
    const humanizedName = humanized(this);
    const helpProps = help(this);

    const { label, className, options, ...props } = { ...this.props };
    delete props.help;

    const inputClasses = ['custom-control-input'];
    if (props.touched && props.error) inputClasses.push('is-invalid');

    return (
      <div className={className || 'form-group'}>
        <header>
          <Label text={label} defaultText={humanizedName} required={props.required} />
        </header>

        <BaseRadio
          className={inputClasses.join(' ')}
          map={this.renderRadio}
          options={humanizeOptions(options)}
          {...props}
        />

        <Help id={helpProps.id} text={helpProps.text} />

        {/* Workaround for Bootstrap 4 issue - https://github.com/twbs/bootstrap/issues/24624 */}
        {props.touched &&
          props.error && <div aria-hidden="true" className="form-control is-invalid" style={{ display: 'none' }} />}
        <Feedback text={props.error} />
      </div>
    );
  }

  renderRadio = (props: Object, label: string) => {
    const id = `${uniqueId(this)}-${props.value}`;

    return (
      <div key={props.value} className="custom-control custom-radio">
        <input ref={el => (this.input = el)} id={id} {...props} />
        <label className="custom-control-label" htmlFor={id}>
          {label}
        </label>
      </div>
    );
  };
}
