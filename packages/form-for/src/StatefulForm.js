// @flow

import * as React from 'react';
import Form from './Form';

export default class StatefulForm extends Form {
  /*
   * setState(...) only keeps enumerable properties, which causes `schema` created using @field to disappear
   * To work around that it's used `data` as an Object along with `forceUpdate`
   */
  data: Object;

  constructor(props: any) {
    super(props);
    this.data = props.for || {};
  }

  getData() {
    return this.data;
  }

  onChange(values: Object) {
    this.data = values;
    this.forceUpdate();
    super.onChange(values);
  }
}
