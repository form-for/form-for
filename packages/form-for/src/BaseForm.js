// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import FieldGroup from './FieldGroup';

export type SchemaProperty = {
  type?: string,
  [key: string]: any
};

export type Schema = {
  [key: string]: SchemaProperty
};

export type Props = {
  for?: Object,
  schema?: Schema,
  children: React.Node,
  onSubmit?: (event: SyntheticEvent<HTMLFormElement>, data: Object, valid?: boolean) => any,
  onChange?: (data: Object, valid?: boolean) => any,
  touchOnMount?: boolean,
  noValidate?: boolean
};

export default class BaseForm extends React.Component<Props, *> {
  static fieldGroupComponent: React.ComponentType<*> = FieldGroup;

  form: ?HTMLFormElement;

  /*
   * Getters
   */
  static childContextTypes = {
    onChange: PropTypes.func,
    touchOnMount: PropTypes.bool,
    noValidate: PropTypes.bool
  };

  getChildContext() {
    return {
      onChange: this.handleChange,
      touchOnMount: !!this.props.touchOnMount,
      noValidate: !!this.props.noValidate
    };
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

  onChange(data: Object) {
    const onChange = this.props.onChange;
    if (onChange) onChange(this.getData());
  }

  /**
   * Since onChange is used by classes that extend BaseForm, handleChange exists to do .bind()
   */
  handleChange = (value: Object) => {
    this.onChange(value);
  };

  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    const onSubmit = this.props.onSubmit;
    if (onSubmit) onSubmit(event, this.getData());
  };

  /*
   * Lifecycle
   */

  render(): React.Node {
    const { ['for']: object, schema, children, ...formProps } = {
      ...this.props
    };
    delete formProps.onChange; // Prevent the browser onChange event to be called
    delete formProps.touchOnMount;

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
      <form {...formProps} ref={el => (this.form = el)} onSubmit={this.handleSubmit}>
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
