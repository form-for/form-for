// @flow

import * as React from 'react';

import Validate from './Validate';
import FieldGroup from './FieldGroup';
import isPromise from '../helpers/isPromise';

import {
  FormDataContext,
  FormErrorsContext,
  FormValidContext,
  FormSubmittedContext,
  FormSubmittingContext,
  FormChangeContext
} from '../contexts';
import type { Schema } from '../types';

export type Props = {
  for?: Object,
  schema?: Schema,
  children: React.Node,
  onInvalidSubmit?: (errors: Object) => any,
  onSubmit?: (event: any, data: Object) => any,
  onChange?: (data: Object) => any
};

type State = {
  submitted: boolean,
  submitting: ?Promise<*>
};

export default class BaseForm extends React.Component<Props, State> {
  static formComponent: React.ComponentType<*> | string = 'form';
  static formComponentProps = { noValidate: true };
  static fieldGroupComponent: React.ComponentType<*> = FieldGroup;

  static Data = FormDataContext.Consumer;
  static Errors = FormErrorsContext.Consumer;
  static Valid = FormValidContext.Consumer;
  static Submitted = FormSubmittedContext.Consumer;
  static Submitting = FormSubmittingContext.Consumer;

  formRef: React.ElementRef<*> = React.createRef();
  valid: boolean = true;

  state = {
    submitted: false,
    submitting: null
  };

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

  onSyncSubmit(submitResponse: any) {
    this.setState({ submitted: true });
  }

  onAsyncSubmitStart(submitting: Promise<*>) {
    this.setState({ submitting });
  }

  onAsyncSubmitFinish = () => {
    this.setState({ submitted: true, submitting: null });
  };

  onInvalidSubmit(event: ?any) {
    const isDOMEvent = event && event.target;
    if (event && isDOMEvent) this.onDOMInvalidSubmit(event);

    this.setState({ submitted: true });
  }

  onDOMInvalidSubmit(event: any) {
    event.preventDefault();
    if (event.target.reportValidity) event.target.reportValidity();
  }

  /*
   * Bound handlers
   */

  handleChange = (value: Object) => {
    this.onChange(value);

    const { onChange } = this.props;
    if (onChange) onChange(this.getData());
  };

  handleValidate = (errors: Object) => {
    this.valid = Object.keys(errors).length === 0;
  };

  handleSubmit = (event?: any) => {
    if (!this.valid) {
      this.onInvalidSubmit(event);
      return;
    }

    const response = this.onSubmit(event);

    if (isPromise(response)) {
      this.onAsyncSubmitStart(response);
      response.then(this.onAsyncSubmitFinish).catch(this.onAsyncSubmitFinish);
    } else {
      this.onSyncSubmit();
    }
  };

  /*
   * Lifecycle
   */

  render(): React.Node {
    const { submitted, submitting } = this.state;

    const C = this.constructor.formComponent;
    const CProps = this.constructor.formComponentProps;

    return (
      <C {...CProps} {...this.getFormProps()} ref={this.formRef} onSubmit={this.handleSubmit}>
        <FormDataContext.Provider value={this.getData()}>
          <FormChangeContext.Provider value={this.handleChange}>
            <FormSubmittedContext.Provider value={submitted}>
              <FormSubmittingContext.Provider value={submitting}>
                <Validate
                  onValidate={this.handleValidate}
                  errorsContext={FormErrorsContext}
                  validContext={FormValidContext}
                >
                  {this.getChildren()}
                </Validate>
              </FormSubmittingContext.Provider>
            </FormSubmittedContext.Provider>
          </FormChangeContext.Provider>
        </FormDataContext.Provider>
      </C>
    );
  }
}
