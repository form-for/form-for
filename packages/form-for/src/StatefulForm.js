// @flow

import * as React from 'react';
import Form from './Form';

/*
 * setState(...) only keeps enumerable properties, which causes `schema` created using @field to disappear
 * To work around that it's used setState with a counter
 */
export default class StatefulForm extends Form {
  state = { counter: 0 };

  data: Object;
  counter: number = 0;

  constructor(props: any) {
    super(props);
    this.data = props.for || {};
  }

  getData() {
    return this.data;
  }

  stateHandler = (prevState: { counter: number }) => {
    return { counter: prevState.counter + 1 };
  };

  onChange(values: Object) {
    this.data = values;
    this.setState(this.stateHandler);
    super.onChange(values);
  }
}
