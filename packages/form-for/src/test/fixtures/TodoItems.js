// @flow

import * as React from 'react';
import { field, Field, FieldGroup, type ComponentProps } from '../../index';

export class TodoItem {
  @field uid: any;
  @field text: string;

  constructor(uid: any, text: string) {
    this.uid = uid;
    this.text = text;
  }
}

export class TodoItems extends React.Component<ComponentProps> {
  render() {
    const { value } = this.props;

    return (
      <fieldset className="form-group">
        <legend>Todo Items</legend>

        {Object.keys(value).map(key => {
          const item = value[key];

          return (
            <FieldGroup key={item.uid} for={item} index={key}>
              <Field name="text" />
            </FieldGroup>
          );
        })}
      </fieldset>
    );
  }
}
