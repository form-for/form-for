// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import BaseForm from './BaseForm';

/*
 * setState(...) only keeps enumerable properties, which causes `schema` created using @field to disappear
 * To work around that it's used the `data` and setState({})
 */
export default class Form extends BaseForm {
  data: Object;
  errorReporters: Function[] = [];

  getChildContext() {
    return {
      ...super.getChildContext(),
      errorReporters: PropTypes.arrayOf(PropTypes.func)
    };
  }

  constructor(props: any) {
    super(props);
    this.data = props.for || {};
    this.state = { submitting: false };
  }

  isSubmitting() {
    return this.state.submitting;
  }

  getData() {
    return this.data;
  }

  onChange(data: Object) {
    this.data = data;
    this.setState({});
    super.onChange(data);
  }

  onValidate(name: string, error: ?string) {
    super.onValidate(name, error);
    this.errorReporters.forEach(reporter => reporter(name, error));
  }

  onStartSubmit() {
    this.setState({ submitting: true });
  }

  onFinishSubmit() {
    this.setState({ submitting: false });
  }
}

// $FlowFixMe
Form.childContextTypes = {
  ...BaseForm.childContextTypes,
  errorReporters: PropTypes.arrayOf(PropTypes.func)
};
