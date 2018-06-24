// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import FieldGroup from './FieldGroup';
import isPromise from './isPromise';

export type SchemaProperty = { type?: string, [key: string]: any };
export type Schema = { [key: string]: SchemaProperty };

export type Props = {
  for?: Object,
  schema?: Schema,
  children: React.Node,
  onSubmit?: (event: SyntheticEvent<HTMLFormElement>, data: Object, valid?: boolean) => any,
  onChange?: (data: Object, valid?: boolean) => any,
  showErrors?: boolean
};

export default class BaseForm extends React.Component<Props, *> {
  static fieldGroupComponent: React.ComponentType<*> = FieldGroup;

  form: ?HTMLFormElement;
  errors: Object = {};

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  /*
   * Getters
   */
  static childContextTypes = {
    errors: PropTypes.object,
    showErrors: PropTypes.bool,
    onFormChange: PropTypes.func,
    onFormValidate: PropTypes.func,
    submitted: PropTypes.any,
    submitting: PropTypes.any
  };

  getChildContext() {
    return {
      errors: this.errors,
      showErrors: !!this.props.showErrors,
      onFormChange: this.handleChange,
      onFormValidate: this.handleValidate,
      submitted: this.hasSubmitted(),
      submitting: this.isSubmitting()
    };
  }

  isInvalid() {
    return Object.keys(this.errors).length;
  }

  isSubmitting() {
    return this.throwNotImplementedMethod('isSubmitting');
  }

  hasSubmitted() {
    return this.throwNotImplementedMethod('isSubmitting');
  }

  getData(): Object {
    return this.props.for || {};
  }

  getForm(): HTMLFormElement {
    return this.form || this.throwUndefinedForm();
  }

  /*
   * Handlers
   */

  onChange(data: Object) {}

  onStartSubmit() {
    return this.throwNotImplementedMethod('onStartSubmit');
  }

  onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    return this.throwNotImplementedMethod('onSubmit');
  }

  onFinishSubmit() {
    return this.throwNotImplementedMethod('onFinishSubmit');
  }

  onValidate(name: string, error: ?string): void {
    if (error) this.errors[name] = error;
    else delete this.errors[name];
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
    this.onValidate(name, error);
  };

  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    this.onSubmit(event);

    if (this.isInvalid()) {
      event.preventDefault();
      event.currentTarget.reportValidity();
      return;
    }

    const { onSubmit } = this.props;
    if (onSubmit) {
      const response = onSubmit(event, this.getData());
      if (isPromise(response)) {
        this.onStartSubmit();
        response.then(() => this.onFinishSubmit());
      }
    }
  };

  /*
   * Lifecycle
   */

  render(): React.Node {
    const { ['for']: object, schema, children, ...formProps } = {
      ...this.props
    };
    delete formProps.onChange; // Prevent the browser onChange event from being called
    delete formProps.showErrors;

    let content;
    if (!object) {
      content = children;
    } else {
      content = React.createElement(this.constructor.fieldGroupComponent, {
        for: this.getData(),
        schema,
        children
      });
    }

    return (
      <form {...formProps} ref={el => (this.form = el)} onSubmit={this.handleSubmit} noValidate>
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

  throwNotImplementedMethod(method: string): any {
    throw new Error(`Method "${method}" not implemented on Form`);
  }
}
