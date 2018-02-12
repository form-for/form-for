// @flow

import * as React from 'react';
import { field, Field, FieldGroup } from '../../index';
import type { ComponentProps } from '../../index';

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
    const items: TodoItem[] = this.props.value;

    return (
      <fieldset className="form-group">
        <legend>Todo Items</legend>

        {Object.keys(items).map(key => {
          const item = items[key];

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
