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
  onSubmit?: Function,
  onChange?: Function,
  stateless?: boolean,
  touchOnMount?: boolean,
  noValidate?: boolean
};

export default class Form extends React.Component<Props> {
  form: ?HTMLFormElement;
  data: Object;

  constructor(props: Props) {
    super(props);
    this.data = props.for || {};
  }

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
    return !this.props.stateless ? this.data : this.props.for || {};
  }

  getForm(): HTMLFormElement {
    return this.form || this.throwUndefinedForm();
  }

  checkValidity() {
    // $FlowFixMe
    const testingValid = this.props.__testing_valid__;
    if (typeof testingValid !== 'undefined') return testingValid;

    return this.getForm().checkValidity();
  }

  getEventProps(): { data: Object, valid: boolean } {
    return {
      data: this.getData(),
      valid: this.checkValidity()
    };
  }

  handleChange = (value: Object) => {
    if (!this.props.stateless) {
      this.data = value;
      this.forceUpdate();
    }

    const onChange = this.props.onChange;
    if (onChange) {
      const props = this.getEventProps();
      if (!this.props.stateless) props.data = value;

      onChange(props);
    }
  };

  handleSubmit = (event: Event) => {
    const onSubmit = this.props.onSubmit;
    if (!onSubmit) return;

    onSubmit(event, this.getEventProps());
  };

  render(): React.Node {
    const { ['for']: object, schema, stateless, children, ...formProps } = { ...this.props };
    delete formProps.onChange; // Prevent the browser onChange event to be called
    delete formProps.touchOnMount;
    delete formProps.__testing_valid__;

    let content;
    if (!object) {
      content = children;
    } else {
      const statedObject = !stateless ? this.data : object || {};
      content = (
        // $FlowFixMe
        <FieldGroup for={statedObject} schema={schema}>
          {children}
        </FieldGroup>
      );
    }

    return (
      <form {...formProps} ref={el => (this.form = el)} onSubmit={this.handleSubmit}>
        {content}
      </form>
    );
  }

  throwUndefinedForm(): any {
    throw new Error('Undefined form HTML element');
  }
}
