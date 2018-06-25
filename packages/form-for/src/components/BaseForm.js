// @flow

import React, { Component, createElement } from 'react';
import type { Node, ComponentType, ElementRef } from 'react';

import FieldGroup from './FieldGroup';
import isPromise from '../helpers/isPromise';

import { ErrorsContext, ValidContext, SubmittedContext, SubmittingContext, FormContext } from '../contexts';
import type { Schema } from '../types';

export type Props = {
  for?: Object,
  schema?: Schema,
  children: Node,
  onInvalidSubmit?: (errors: Object) => any,
  onSubmit?: (event: SyntheticEvent<HTMLFormElement>, data: Object) => any,
  onChange?: (data: Object) => any
};

type State = {
  submitted: boolean,
  submitting: boolean
};

export default class BaseForm extends Component<Props, State> {
  static formComponent: ComponentType<*> | string = 'form';
  static formComponentProps = { noValidate: true };
  static fieldGroupComponent: ComponentType<*> = FieldGroup;

  static Errors = ErrorsContext.Consumer;
  static Valid = ValidContext.Consumer;
  static Submitted = SubmittedContext.Consumer;
  static Submitting = SubmittingContext.Consumer;

  formRef: ElementRef<*> = React.createRef();
  errors: Object = {};

  state = {
    submitted: false,
    submitting: false
  };

  isInvalid(): boolean {
    return !!Object.keys(this.errors).length;
  }

  getData(): Object {
    return this.props.for || {};
  }

  getChildren(): Node {
    const { for: object, schema, children } = this.props;

    if (!object) return children;

    return createElement(this.constructor.fieldGroupComponent, {
      for: this.getData(),
      schema,
      children
    });
  }

  getFormProps() {
    const { ...formProps } = this.props;

    // Remove props that should not be passed down
    delete formProps.for;
    delete formProps.schema;
    delete formProps.children;
    delete formProps.onInvalidSubmit;
    delete formProps.onChange;

    return formProps;
  }

  /*
   * Handlers
   */

  onChange(data: Object) {}

  onSubmit(event: any): any {
    const { onSubmit } = this.props;
    if (onSubmit) return onSubmit(event, this.getData());
  }

  onSyncSubmit() {
    this.setState({ submitted: true });
  }

  onAsyncSubmitStart() {
    this.setState({ submitted: true, submitting: true });
  }

  onAsyncSubmitFinish() {
    this.setState({ submitting: false });
  }

  onInvalidSubmit(event: ?any) {
    const isDOMEvent = event && event.currentTarget;
    if (event && isDOMEvent) this.onDOMInvalidSubmit(event);
  }

  onDOMInvalidSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (event.currentTarget.reportValidity) event.currentTarget.reportValidity();
  }

  /*
   * Bound handlers
   */

  handleChange = (value: Object) => {
    this.onChange(value);

    const { onChange } = this.props;
    if (onChange) onChange(this.getData());
  };

  handleValidate = (name: string, error: ?string) => {
    if (error) this.errors[name] = error;
    else delete this.errors[name];
  };

  handleSubmit = (event: any) => {
    if (this.isInvalid()) {
      this.onInvalidSubmit();
      return;
    }

    const response = this.onSubmit();

    if (isPromise(response)) {
      this.onAsyncSubmitStart();
      response.then(this.onAsyncSubmitFinish).catch(this.onAsyncSubmitFinish);
    } else {
      this.onSyncSubmit();
    }
  };

  /*
   * Lifecycle
   */

  render(): Node {
    const { submitted, submitting } = this.state;

    const C = this.constructor.formComponent;
    const CProps = this.constructor.formComponentProps;

    return (
      <C {...CProps} {...this.getFormProps()} ref={this.formRef} onSubmit={this.handleSubmit}>
        <FormContext.Provider value={{ onFormChange: this.handleChange, onFormValidate: this.handleValidate }}>
          <SubmittedContext.Provider value={submitted}>
            <SubmittingContext.Provider value={submitting}>
              <ValidContext.Provider value={!this.isInvalid()}>
                <ErrorsContext.Provider value={this.errors}>{this.getChildren()}</ErrorsContext.Provider>
              </ValidContext.Provider>
            </SubmittingContext.Provider>
          </SubmittedContext.Provider>
        </FormContext.Provider>
      </C>
    );
  }
}
