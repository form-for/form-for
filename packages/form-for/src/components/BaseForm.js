// @flow

import * as React from 'react';

import Validate from './Validate';
import FieldGroup from './FieldGroup';
import isPromise from '../helpers/isPromise';
import { type Schema } from '../types';

import {
  FormForContext,
  FormErrorsContext,
  FormValidContext,
  FormSubmittedContext,
  FormSubmittingContext,
  FormChangeContext,
  FormTouchedOnContext,
  type TouchedOn
} from '../contexts';

export type Props = {
  for?: Object,
  schema?: Schema,
  children: React.Node,
  onInvalidSubmit?: (errors: Object) => any,
  onSubmit?: (event: any, data: Object) => any,
  onChange?: (data: Object) => any,
  touchedOn?: TouchedOn,
  noPreventDefault?: boolean
};

type State = {
  submitted: boolean,
  submitting: ?Promise<*>
};

export default class BaseForm extends React.Component<Props, State> {
  static defaultProps: Object = { noValidate: true, touchedOn: 'blur' };
  static preventDefault = true;

  static formComponent: React.ComponentType<*> | string = 'form';
  static fieldGroupComponent: React.ComponentType<*> = FieldGroup;

  static For = FormForContext.Consumer;
  static TouchedOn = FormTouchedOnContext.Consumer;
  static Errors = FormErrorsContext.Consumer;
  static Valid = FormValidContext.Consumer;
  static Submitted = FormSubmittedContext.Consumer;
  static Submitting = FormSubmittingContext.Consumer;
  static Change = FormChangeContext.Consumer;

  formRef: React.ElementRef<*> = React.createRef();
  valid: boolean = true;

  unmounting: boolean = false;

  UNSAFE_componentWillMount() {
    this.handleChange = this.handleChange.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getData(): Object {
    return this.props.for || {};
  }

  getChildren(): React.Node {
    const { for: object, schema, children } = this.props;

    if (!object) return children;

    return React.createElement(this.constructor.fieldGroupComponent || BaseForm.fieldGroupComponent, {
      for: this.getData(),
      schema,
      children
    });
  }

  getProps() {
    return { ...BaseForm.defaultProps, ...this.props };
  }

  getFormProps() {
    const formProps = { ...BaseForm.defaultProps, ...this.props };

    // Remove props that should not be passed down
    delete formProps.for;
    delete formProps.schema;
    delete formProps.children;
    delete formProps.onInvalidSubmit;
    delete formProps.onChange;
    delete formProps.touchedOn;
    delete formProps.noPreventDefault;

    return formProps;
  }

  /*
   * Handlers
   */

  onChange(data: Object) {}

  onSubmit(event: any): any {
    const { onSubmit, noPreventDefault } = this.props;

    const shouldPreventDefault = BaseForm.preventDefault && !noPreventDefault;
    if (shouldPreventDefault) event.preventDefault();

    if (onSubmit) return onSubmit(event, this.getData());
  }

  onSyncSubmit(submitResponse: any) {
    this.setState({ submitted: true });
  }

  onAsyncSubmitStart(submitting: Promise<*>) {
    this.setState({ submitting });
  }

  onAsyncSubmitFinish() {
    if (!this.unmounting) this.setState({ submitted: true, submitting: null });
  }

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

  handleChange(value: Object) {
    this.onChange(value);

    const { onChange } = this.props;
    if (onChange) onChange(this.getData());
  }

  handleValidate(errors: Object) {
    this.valid = Object.keys(errors).length === 0;
  }

  handleSubmit(event?: any) {
    if (!this.valid) {
      this.onInvalidSubmit(event);
      return;
    }

    const response = this.onSubmit(event);

    if (isPromise(response)) {
      this.onAsyncSubmitStart(response);
      response.then(this.onAsyncSubmitFinish.bind(this)).catch(this.onAsyncSubmitFinish.bind(this));
    } else {
      this.onSyncSubmit();
    }
  }

  /*
   * Lifecycle
   */

  componentWillUnmount() {
    this.unmounting = true;
  }

  render(): React.Node {
    const { submitted, submitting } = this.state || {};

    const C = this.constructor.formComponent || BaseForm.formComponent;
    const props = this.getProps();

    return (
      <C {...this.getFormProps()} ref={this.formRef} onSubmit={this.handleSubmit}>
        <FormForContext.Provider value={this.getData()}>
          <FormTouchedOnContext.Provider value={props.touchedOn}>
            <FormChangeContext.Provider value={this.handleChange}>
              <FormSubmittedContext.Provider value={!!submitted}>
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
          </FormTouchedOnContext.Provider>
        </FormForContext.Provider>
      </C>
    );
  }
}
