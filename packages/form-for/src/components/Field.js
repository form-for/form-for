// @flow

import * as React from 'react';

import FieldGroup from './FieldGroup';
import ArrayField from './ArrayField';

import type { SchemaProperty } from '../types';
import { ValidateContext, FormSubmittedContext, FieldGroupContext, FieldContext } from '../contexts';

import prefixer from '../helpers/prefixer';
import isPromise from '../helpers/isPromise';
import isMemoizeObject from '../helpers/isMemoizeObject';
import debounce from '../helpers/debounce';
import memoize, { clearMemoize, type MemoizableResult } from '../helpers/memoize';
import memoizeAndDebounce from '../helpers/memoizeAndDebounce';

export type Props = {
  name: string,
  type?: string,
  error?: string,
  onFocus?: Function,
  onChange?: Function,
  children?: React.Node
};

type CombinedProps = Props & {
  contextFor: Object,
  contextSchema: Object,
  contextPrefix: string,
  contextOnChange: Function,
  contextOnValidate: Function
};

<Field name="todos">
  <Field.Map>
    <Field name="done" />
    <Field name="text" />

    <Field.Remove>{remove => <button onClick={remove}>Delete</button>}</Field.Remove>
  </Field.Map>

  <Field.Push>{push => <button onClick={() => push({})}>Add</button>}</Field.Push>
</Field>;

const SUCCESS_ASYNC_VALIDATION = '__success_async__';

export class FieldComponent extends React.Component<CombinedProps> {
  static validatingErrorMessage = 'Validating';
  static formSubmittedContextComponent = FormSubmittedContext.Consumer;
  static fieldGroupComponent = FieldGroup;

  static Array = ArrayField;

  target: Object;
  touched: ?boolean;
  incomingError: ?string;

  asyncError: ?string;
  validatingPromise: ?Promise<?string>;

  /*
   * Component binding
   */

  static connectedComponents: { [_: string]: React.ComponentType<*> } = {};

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
    return FieldComponent.connectedComponents[this.getType()] || this.throwMissingTypeConnection();
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

    return FieldComponent.validatingErrorMessage;
  }

  runMemoizeObject(response: Object): MemoizableResult {
    if (!response.callback) throw new Error('Undefined `callback` in validation function object response');

    const shouldMemoize = response.memoize !== false;
    if (response.debounce) {
      if (shouldMemoize) return memoizeAndDebounce(this, response.callback, response.debounce);
      return debounce(this, response.callback, response.debounce);
    }

    if (shouldMemoize) return memoize(this, response.callback);

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
    if (!this.props.children) {
      this.dispatchValidation();
      clearMemoize(this);
    }
  }

  render() {
    return this.props.children ? this.renderInline() : this.renderConnected();
  }

  renderInline() {
    const { name, children } = this.props;

    const CFieldGroup = this.constructor.fieldGroupComponent;

    return (
      <FieldContext.Provider value={{ name }}>
        <CFieldGroup for={this.getObjectValue() || {}}>{children}</CFieldGroup>
      </FieldContext.Provider>
    );
  }

  renderConnected() {
    const error = this.validate();

    const { name, ...otherProps } = this.props;
    delete otherProps.contextFor;
    delete otherProps.contextSchema;
    delete otherProps.contextPrefix;
    delete otherProps.contextOnChange;
    delete otherProps.contextOnValidate;

    const C = this.getComponent();
    const CSubmitted = this.constructor.formSubmittedContextComponent;

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
      <FieldContext.Provider value={{ name }}>
        <CSubmitted>{submitted => <C {...CProps} touched={CProps.touched || submitted} />}</CSubmitted>
      </FieldContext.Provider>
    );
  }

  /*
   * Errors
   */

  warnMissingSchemaProperty() {
    const name = this.props.name;
    const constructor = this.props.contextFor.constructor.name;
    console.warn(`Undefined property "${name}" in schema for "${constructor}" instance`);
  }

  throwMissingTypeConnection() {
    const type = this.getType();
    const name = this.props.name;
    const constructor = this.props.contextFor.constructor.name;
    throw new Error(`Missing "${type}" connection requested for property "${name}" in "${constructor}" instance`);
  }
}

export function withFieldContext(Component: React.ComponentType<CombinedProps>) {
  return (props: Props) => (
    <ValidateContext.Consumer>
      {onValidate => (
        <FieldGroupContext.Consumer>
          {fieldGroupContext => (
            <FieldComponent
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

export default withFieldContext(FieldComponent);

export function connectField(type: string, component: React.ComponentType<*>): void {
  FieldComponent.connectedComponents[type] = component;
}
