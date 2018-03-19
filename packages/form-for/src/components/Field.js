// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

import type { SchemaProperty } from './BaseForm';
import prefixer from '../helpers/prefixer';
import isPromise from '../helpers/isPromise';
import debounce from '../helpers/debounce';
import memoize, { clearMemoize } from '../helpers/memoize';

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
  validating?: string,
  touched: boolean,
  value: any,
  onMount: Function,
  onFocus: Function,
  onChange: Function
};

const SUCCESS_ASYNC_VALIDATION = '__success_async__';

export default class Field extends React.Component<Props> {
  target: Object;
  touched: ?boolean;
  incomingError: ?string;

  asyncError: ?string;
  validatingPromise: ?Promise<?string>;
  static validatingErrorMessage = 'Validating';

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
    showErrorsProp: PropTypes.bool.isRequired,
    showErrorsState: PropTypes.any.isRequired,
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

  getShowErrorsState(): boolean {
    return this.context.showErrorsState;
  }

  isTouched(): boolean {
    return this.touched || this.context.showErrorsProp || this.getShowErrorsState();
  }

  getErrorObjectResult(response: any) {
    if (!isPromise(response)) response = this.getErrorHelperResult(response);
    if (typeof response === 'string') return response;

    // $FlowFixMe
    this.validatingPromise = response;

    const handlePromiseResolve = error => {
      if (this.validatingPromise === response) {
        this.validatingPromise = null;
        this.asyncError = error;
        this.forceUpdate();
      }
    };

    // $FlowFixMe
    response
      .then(error => handlePromiseResolve(error || SUCCESS_ASYNC_VALIDATION))
      .catch(error => handlePromiseResolve(error.message));

    return Field.validatingErrorMessage;
  }

  getErrorHelperResult(response: Object): Promise<?string> | ?string {
    if (!response.callback) throw new Error('Undefined `callback` in validation function object response');

    if (response.debounce) return debounce(this, response.callback, response.debounce);
    if (response.memoize) return memoize(this, response.callback);

    throw new Error('Invalid validation object response - please set `debounce: timeoutMillis` or `memoize: true`');
  }

  getErrorFunctionResult(callback: Function) {
    return callback.bind(this.context.object)(this.context.object, this.props.name);
  }

  getSchemaError(): ?string | Promise<?string> {
    let error = this.getSchemaProperty().error;
    if (!error) return;

    if (typeof error === 'string') error = this.context.object[error];
    if (typeof error === 'function') error = this.getErrorFunctionResult(error);
    if (typeof error === 'object') error = this.getErrorObjectResult(error);

    return error;
  }

  getError(value?: any): ?any {
    if (this.asyncError) {
      const error = this.asyncError;
      this.asyncError = null;
      return error === SUCCESS_ASYNC_VALIDATION ? null : error;
    }

    if (this.props.error) return this.props.error;
    return this.incomingError || this.getTargetValidationMessage() || this.getSchemaError();
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
      // `isTouched()` may return true if `showErrors` is true
      // and we want to make sure that touched will be true
      this.touch();
    }
  }

  validate(incomingError?: any): ?string {
    this.validatingPromise = null;
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
    clearMemoize(this);
  }

  render() {
    let error = this.validate();

    // Avoid React.PureComponent rerender when changing among null, false, undefined, 0 and ''
    if (!error || (typeof error === 'string' && error === '')) error = null;

    return React.createElement(this.getComponent(), {
      ...this.getSchemaProperty(),
      ...this.props,
      name: this.getPrefixedName(),
      value: this.getContextObjectValue() || '',
      error: error,
      validating: this.validatingPromise ? this.validatingPromise : undefined,
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
