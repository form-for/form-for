// @flow

import * as React from 'react';
import Form from './Form';

/*
 * setState(...) only keeps enumerable properties, which causes `schema` created using @field to disappear
 * To work around that it's used the `data` and setState({})
 */
export default class StatefulForm extends Form {
  data: Object;
  counter: number = 0;

  constructor(props: any) {
    super(props);
    this.data = props.for || {};
  }

  getData() {
    return this.data;
  }

  onChange(values: Object) {
    this.data = values;
    this.setState({});
    super.onChange(values);
  }
}
