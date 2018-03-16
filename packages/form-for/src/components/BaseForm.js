// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import FieldGroup from './FieldGroup';
import isPromise from '../helpers/isPromise';

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
    showErrorsProp: PropTypes.bool,
    showErrorsState: PropTypes.any,
    onFormChange: PropTypes.func,
    onFormValidate: PropTypes.func,
    submitting: PropTypes.any
  };

  getChildContext() {
    return {
      errors: this.errors,
      showErrorsProp: !!this.props.showErrors,
      showErrorsState: this.getShowErrorsState(),
      onFormChange: this.handleChange,
      onFormValidate: this.handleValidate,
      submitting: this.isSubmitting()
    };
  }

  isInvalid() {
    return Object.keys(this.errors).length;
  }

  isSubmitting(): any {
    return false;
  }

  getShowErrorsState(): any {
    return false;
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

  onValidate(name: string, error: ?string): void {
    if (error) this.errors[name] = error;
    else delete this.errors[name];
  }

  /*
   * Dispatchers
   */

  dispatchShowErrors() {}
  dispatchSubmittingStart() {}
  dispatchSubmittingFinish() {}

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
    if (this.isInvalid()) {
      event.preventDefault();
      this.dispatchShowErrors();
      event.currentTarget.reportValidity();
      return;
    }

    const { onSubmit } = this.props;
    if (onSubmit) {
      const response = onSubmit(event, this.getData());
      if (isPromise(response)) {
        this.dispatchSubmittingStart();
        const dispatchFinish = () => this.dispatchSubmittingFinish();
        response.then(dispatchFinish).catch(dispatchFinish);
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
}
