// @flow

import * as React from 'react';

import FieldGroup from './FieldGroup';
import isPromise from '../helpers/isPromise';

import { ErrorsContext, ValidContext, SubmittedContext, SubmittingContext, FormContext } from '../contexts';
import type { Schema } from '../types';

export type Props = {
  for?: Object,
  schema?: Schema,
  children: React.Node,
  onInvalidSubmit?: (errors: Object) => any,
  onSubmit?: (event: SyntheticEvent<HTMLFormElement>, data: Object) => any,
  onChange?: (data: Object) => any
};

type State = {
  submitted: boolean,
  submitting: boolean
};

export default class BaseForm extends React.Component<Props, State> {
  static formComponent: React.ComponentType<*> | string = 'form';
  static formComponentProps = { noValidate: true };
  static fieldGroupComponent: React.ComponentType<*> = FieldGroup;

  static Errors = ErrorsContext.Consumer;
  static Valid = ValidContext.Consumer;
  static Submitted = SubmittedContext.Consumer;
  static Submitting = SubmittingContext.Consumer;

  formRef: React.ElementRef<*> = React.createRef();
  errors: Object = {};
  hasNewErrors: boolean;

  state = {
    submitted: false,
    submitting: false
  };

  isInvalid(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  getData(): Object {
    return this.props.for || {};
  }

  getChildren(): React.Node {
    const { for: object, schema, children } = this.props;

    if (!object) return children;

    return React.createElement(this.constructor.fieldGroupComponent, {
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

  onAsyncSubmitFinish = () => {
    this.setState({ submitting: false });
  };

  onInvalidSubmit(event: ?any) {
    const isDOMEvent = event && event.target;
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
    const currentError = this.errors[name];
    if (currentError !== error) this.hasNewErrors = true;

    this.errors = { ...this.errors };
    if (error) this.errors[name] = error;
    else delete this.errors[name];
  };

  handleSubmit = (event?: any) => {
    if (this.isInvalid()) {
      this.onInvalidSubmit(event);
      return;
    }

    const response = this.onSubmit(event);

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

  componentDidMount() {
    if (this.hasNewErrors) this.forceUpdate();
  }

  componentDidUpdate() {
    if (this.hasNewErrors) this.forceUpdate();
  }

  render(): React.Node {
    this.hasNewErrors = false;
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
