// @flow

import * as React from 'react';
import BaseForm from './BaseForm';

/*
 * setState(...) only keeps enumerable properties, which causes `schema` created using @field to disappear
 * To work around that it's used the `data` and setState({})
 */
export default class Form extends BaseForm {
  data: Object;

  constructor(props: any) {
    super(props);
    this.data = props.for || {};
  }

  getData() {
    return this.data;
  }

  onChange(data: Object) {
    this.data = data;
    this.setState({});
    super.onChange(data);
  }
}
