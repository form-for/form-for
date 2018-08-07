// @flow

import * as React from 'react';

import type { SchemaProperty } from '../types';
import { FormSubmittedContext, FieldNameContext, FieldGroupContext, ValidateContext } from '../contexts';

import prefixer from '../helpers/prefixer';
import isPromise from '../helpers/isPromise';
import isMemoizeObject from '../helpers/isMemoizeObject';
import debounce from '../helpers/debounce';
import memoize, { clearMemoize } from '../helpers/memoize';
import memoizeAndDebounce from '../helpers/memoizeAndDebounce';

import FieldGroup from './FieldGroup';

export type Props = {
  name: string,
  type?: string,
  error?: string,
  onFocus?: Function,
  onChange?: Function
};

type CombinedProps = Props & {
  contextFor: Object,
  contextSchema: Object,
  contextPrefix: string,
  contextOnChange: Function,
  contextOnValidate: Function
};

const SUCCESS_ASYNC_VALIDATION = '__success_async__';

export class ConnectedFieldComponent extends React.Component<CombinedProps> {
  static validatingErrorMessage = 'Validating';
  static connectedComponents: { [_: string]: React.ComponentType<*> } = {};

  target: Object;
  touched: ?boolean;
  incomingError: ?string;

  asyncError: ?string;
  validatingPromise: ?Promise<?string>;

  /*
   * Getters
   */

  getObjectValue(): ?any {
    const { name, contextFor } = this.props;
    return contextFor[name];
  }

  getSchemaProperty(): SchemaProperty {
    const { name, contextSchema, type } = this.props;

    const property = contextSchema[name];
    if (!property && !type) this.warnMissingSchemaProperty();

    return property || {};
  }

  getType(): string {
    return this.props.type || this.getSchemaProperty().type || 'text';
  }

  getPrefixedName() {
    const { contextPrefix, name } = this.props;
    return prefixer(contextPrefix, name);
  }

  getComponent(): React.ComponentType<*> {
    return ConnectedFieldComponent.connectedComponents[this.getType()] || this.throwMissingTypeConnection();
  }

  getValue(incomingValue?: any) {
    return incomingValue !== undefined ? incomingValue : this.getTargetValue();
  }

  getTargetValue(): any {
    if (this.target.type === 'checkbox') return this.target.checked;
    return this.target.value;
  }

  getTargetValidationMessage(): ?string {
    return (this.target || {}).validationMessage;
  }

  runErrorPromise(response: any) {
    this.validatingPromise = response;

    const handlePromiseResolve = error => {
      if (this.validatingPromise !== response) return;

      this.validatingPromise = null;
      this.asyncError = error;
      this.forceUpdate();
    };

    response
      .then(error => handlePromiseResolve(error || SUCCESS_ASYNC_VALIDATION))
      .catch(error => handlePromiseResolve(error.message));

    return ConnectedFieldComponent.validatingErrorMessage;
  }

  runMemoizeObject(response: Object) {
    if (!response.callback) throw new Error('Undefined `callback` in validation function object response');

    const shouldMemoize = response.memoize !== false;
    if (response.debounce) {
      if (shouldMemoize) return memoizeAndDebounce(this, this.getObjectValue(), response.callback, response.debounce);
      return debounce(this, response.callback, response.debounce);
    }

    if (shouldMemoize) return memoize(this, this.getObjectValue(), response.callback);

    throw new Error('Invalid validation object response - please set `debounce: timeoutMillis` or `memoize: true`');
  }

  runErrorFunction(callback: Function) {
    const { name, contextFor } = this.props;
    return callback.bind(contextFor)(contextFor, name);
  }

  getSchemaError(): ?string | Promise<?string> {
    let error = this.getSchemaProperty().error;
    if (!error) return;

    if (typeof error === 'string') error = this.props.contextFor[error];
    if (typeof error === 'function') error = this.runErrorFunction(error);
    if (isMemoizeObject(error)) error = this.runMemoizeObject(error);
    if (isPromise(error)) error = this.runErrorPromise(error);

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
    const { name, contextOnChange } = this.props;
    contextOnChange(name, this.getValue(incomingValue));
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
    this.props.contextOnValidate(this.getPrefixedName(), error);
  }

  /*
   * Actions
   */

  touch() {
    this.touched = true;
  }

  touchAndRender() {
    const wasTouched = this.touched;
    this.touch();

    if (!wasTouched) this.forceUpdate();
  }

  validate(): ?string {
    this.validatingPromise = null;
    this.clearBrowserCustomValidity();
    let error = this.getError();

    // Avoid rerenderd when changing among null, false, undefined, 0 and ''
    if (!error || (typeof error === 'string' && error === '')) error = null;

    this.setBrowserCustomValidity(error);
    this.dispatchValidation(error);

    return error;
  }

  /*
   * Handlers
   */

  handleMount = (target: Object) => {
    this.target = target;

    // Force update to fetch and display new error
    this.forceUpdate();
  };

  handleFocus = (event?: Event) => {
    this.target = (event || this).target;
    this.touchAndRender();

    if (this.props.onFocus) this.props.onFocus(event);
  };

  handleChange = (event?: Event, value?: any, error?: any) => {
    this.target = (event || this).target;
    this.incomingError = error;
    this.setValue(value);

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
    const error = this.validate();

    const { name, ...otherProps } = this.props;
    delete otherProps.contextFor;
    delete otherProps.contextSchema;
    delete otherProps.contextPrefix;
    delete otherProps.contextOnChange;
    delete otherProps.contextOnValidate;

    const C = this.getComponent();

    const CProps = {
      ...this.getSchemaProperty(),
      ...otherProps,
      name: this.getPrefixedName(),
      value: this.getObjectValue() || '',
      error,
      validating: this.validatingPromise ? true : undefined,
      touched: this.touched,
      onMount: this.handleMount,
      onFocus: this.handleFocus,
      onChange: this.handleChange
    };

    return (
      <FormSubmittedContext.Consumer>
        {submitted => <C {...CProps} touched={CProps.touched || submitted} />}
      </FormSubmittedContext.Consumer>
    );
  }

  /*
   * Errors
   */

  warnMissingSchemaProperty() {
    const { name } = this.props;
    const constructor = this.props.contextFor.constructor.name;
    console.warn(`[Form-for] Undefined property "${name}" in schema for "${constructor}" instance`);
  }

  throwMissingTypeConnection() {
    const { name } = this.props;
    throw new Error(`[Form-for] Missing field connection "${this.getType()}" requested for "${name}" property"`);
  }
}

export function withConnectedFieldContext(Component: React.ComponentType<CombinedProps>) {
  return (props: Props) => (
    <ValidateContext.Consumer>
      {onValidate => (
        <FieldGroupContext.Consumer>
          {fieldGroupContext => (
            <Component
              contextOnValidate={onValidate}
              contextFor={fieldGroupContext.for}
              contextSchema={fieldGroupContext.schema}
              contextPrefix={fieldGroupContext.prefix}
              contextOnChange={fieldGroupContext.onChange}
              {...props}
            />
          )}
        </FieldGroupContext.Consumer>
      )}
    </ValidateContext.Consumer>
  );
}

export default withConnectedFieldContext(ConnectedFieldComponent);

export function connectField(type: string, component: React.ComponentType<*>): void {
  ConnectedFieldComponent.connectedComponents[type] = component;
}
