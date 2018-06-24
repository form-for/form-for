// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

import type { SchemaProperty } from './BaseForm';
import prefixer from './prefixer';

export type Props = {
  name: string,
  type?: string,
  error?: string,
  onFocus?: Function,
  onChange?: Function
};

export type ComponentProps = {
  name: string,
  type?: string,
  error?: string,
  touched: boolean,
  value: any,
  onMount: Function,
  onFocus: Function,
  onChange: Function
};

export default class Field extends React.Component<Props> {
  target: Object;
  touched: ?boolean;
  incomingError: ?string;
  lastError: ?string;

  /*
   * Component binding
   */

  static connectedComponents: { [_: string]: React.ComponentType<*> } = {};

  static connect(type: string, component: React.ComponentType<*>): void {
    Field.connectedComponents[type] = component;
  }

  /*
   * Context
   */

  static contextTypes = {
    showErrors: PropTypes.bool.isRequired,
    submitted: PropTypes.any.isRequired,
    onFormValidate: PropTypes.func.isRequired,
    object: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    prefix: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  static childContextTypes = {
    name: PropTypes.string
  };

  getChildContext() {
    return {
      name: this.props.name
    };
  }

  /*
   * Getters
   */

  getContextObject() {
    return this.context.object;
  }

  getContextObjectValue() {
    return this.getContextObject()[this.props.name];
  }

  getSchemaProperty(): SchemaProperty {
    const property = this.context.schema[this.props.name];
    if (!property) this.warnMissingSchemaProperty();

    return property || {};
  }

  getType(): string {
    return this.props.type || this.getSchemaProperty().type || 'text';
  }

  getPrefixedName() {
    return prefixer(this.context.prefix, this.props.name);
  }

  getComponent(): React.ComponentType<*> {
    return Field.connectedComponents[this.getType()] || this.throwMissingTypeConnection();
  }

  getValue(incomingValue?: any) {
    return typeof incomingValue !== 'undefined' ? incomingValue : this.getTargetValue();
  }

  getTargetValue(): any {
    if (this.target.type === 'checkbox') return this.target.checked;
    return this.target.value;
  }

  getTargetValidationMessage(): ?string {
    return (this.target || {}).validationMessage;
  }

  hasContextSubmitted(): boolean {
    return this.context.submitted.get();
  }

  isTouched(): boolean {
    return this.touched || this.context.showError || this.hasContextSubmitted();
  }

  getSchemaError() {
    let error = this.getSchemaProperty().error;
    if (!error) return;

    if (typeof error === 'string') {
      error = this.context.object[error];
    }

    if (typeof error === 'function') {
      return error.bind(this.context.object)(this.context.object, this.props.name);
    }

    return error;
  }

  getError(value?: any): ?any {
    if (this.props.error) return this.props.error;
    return this.getSchemaError() || this.incomingError || this.getTargetValidationMessage();
  }

  /*
   * Setters
   */

  setValue(incomingValue: ?any) {
    this.context.onChange(this.props.name, this.getValue(incomingValue));
  }

  setBrowserCustomValidity(message?: ?string): void {
    if (!this.target) return;

    const targets = Array.isArray(this.target) ? this.target : [this.target];
    targets.forEach(element => {
      if (element.setCustomValidity) element.setCustomValidity(message || '');
    });
  }

  clearBrowserCustomValidity() {
    this.setBrowserCustomValidity();
  }

  /*
   * Dispatchers
   */
  dispatchValidation(error: ?string) {
    this.context.onFormValidate(this.getPrefixedName(), error);
  }

  /*
   * Actions
   */

  touch() {
    this.touched = true;
  }

  touchAndRender() {
    if (!this.isTouched()) {
      this.touch();
      this.forceUpdate();
    } else {
      this.touch();
    }
  }

  validate(incomingError?: any): ?string {
    this.clearBrowserCustomValidity();

    this.incomingError = incomingError;
    const error = this.getError();

    this.setBrowserCustomValidity(error);
    this.dispatchValidation(error);

    return error;
  }

  /*
   * Handlers
   */

  handleMount = (target: Object) => {
    this.target = target;
    this.forceUpdate();
  };

  handleFocus = (event?: Event) => {
    this.target = (event || {}).target || this.target;
    this.touchAndRender();

    if (this.props.onFocus) this.props.onFocus(event);
  };

  handleChange = (event?: Event, value?: any, error?: any) => {
    this.target = (event || {}).target || this.target;
    this.setValue(value);
    this.touch();

    if (this.props.onChange) this.props.onChange(event);
  };

  /*
   * Lifecycle
   */

  componentWillUnmount() {
    this.dispatchValidation();
  }

  render() {
    let error = this.validate();
    if (!error || (typeof error === 'string' && error === '')) error = null; // Avoid changes from false, undefined, 0 and ''

    return React.createElement(this.getComponent(), {
      ...this.getSchemaProperty(),
      ...this.props,
      name: this.getPrefixedName(),
      value: this.getContextObjectValue() || '',
      error: error,
      touched: this.isTouched(),
      onMount: this.handleMount,
      onFocus: this.handleFocus,
      onChange: this.handleChange
    });
  }

  /*
   * Errors
   */

  warnMissingSchemaProperty() {
    const name = this.props.name;
    const constructor = this.context.object.constructor.name;
    console.warn(`Undefined property "${name}" in schema for "${constructor}" instance`);
  }

  throwMissingTypeConnection() {
    const type = this.getType();
    const name = this.props.name;
    const constructor = this.context.object.constructor.name;
    throw new Error(`Missing "${type}" connection requested for property "${name}" in "${constructor}" instance`);
  }
}
