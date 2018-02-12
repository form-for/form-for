// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import FieldGroup from './FieldGroup';

export type SchemaProperty = {
  type?: string,
  [key: string]: any
};

export type Schema = {
  [key: string]: SchemaProperty
};

export type Props = {
  for?: Object,
  schema?: Schema,
  children: React.Node,
  onSubmit?: Function,
  onChange?: Function,
  touchOnMount?: boolean,
  noValidate?: boolean
};

export default class StatelessForm extends React.Component<Props, *> {
  form: ?HTMLFormElement;

  /*
   * Getters
   */
  static childContextTypes = {
    onChange: PropTypes.func,
    touchOnMount: PropTypes.bool,
    noValidate: PropTypes.bool
  };

  getChildContext() {
    return {
      onChange: this.handleChange,
      touchOnMount: !!this.props.touchOnMount,
      noValidate: !!this.props.noValidate
    };
  }

  getData(): Object {
    return this.props.for || {};
  }

  getForm(): HTMLFormElement {
    return this.form || this.throwUndefinedForm();
  }

  isValid() {
    // $FlowFixMe
    const testingValid = this.props.__testing_valid__;
    if (typeof testingValid !== 'undefined') return testingValid;

    return this.getForm().checkValidity();
  }

  getEventProps(): { data: Object, valid: boolean } {
    return {
      data: this.getData(),
      valid: this.isValid()
    };
  }

  /*
   * Handlers
   */

  onChange(values: Object) {
    const onChange = this.props.onChange;
    if (onChange) onChange(this.getEventProps());
  }

  /**
   * Since onChange is used by classes that extend BaseForm, handleChange exists to do .bind()
   */
  handleChange = (value: Object) => {
    this.onChange(value);
  };

  handleSubmit = (event: Event) => {
    const onSubmit = this.props.onSubmit;
    if (onSubmit) onSubmit(event, this.getEventProps());
  };

  /*
   * Lifecycle
   */

  render(): React.Node {
    const { ['for']: object, schema, children, ...formProps } = { ...this.props };
    delete formProps.onChange; // Prevent the browser onChange event to be called
    delete formProps.touchOnMount;
    delete formProps.__testing_valid__;

    let content;
    if (!object) {
      content = children;
    } else {
      content = (
        <FieldGroup for={this.getData()} schema={schema}>
          {children}
        </FieldGroup>
      );
    }

    return (
      <form {...formProps} ref={el => (this.form = el)} onSubmit={this.handleSubmit}>
        {content}
      </form>
    );
  }

  /*
   * Errors
   */

  throwUndefinedForm(): any {
    throw new Error('Undefined form HTML element');
  }
}
