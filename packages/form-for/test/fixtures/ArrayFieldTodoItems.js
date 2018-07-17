// @flow

import * as React from 'react';
import { field, Field, type ComponentProps } from '../../src';

export class TodoItem {
  @field uid: any;
  @field text: string;

  constructor(uid: any, text: string) {
    this.uid = uid;
    this.text = text;
  }
}

export class ArrayFieldTodoItems extends React.Component<ComponentProps> {
  render() {
    const { value } = this.props;

    return (
      <fieldset className="form-group">
        <legend>Todo Items</legend>

        <Field.Map>
          <Field name="text" />
        </Field.Map>
      </fieldset>
    );
  }
}
