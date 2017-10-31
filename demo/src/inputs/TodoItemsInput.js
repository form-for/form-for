// @flow

import React from "react";
import { Field, FieldGroup } from "../../../src";

import type { InputProps } from "../../../src";
import TodoItem from "../TodoItem";

type State = {
  items: TodoItem[]
};

export default class TodoItemsInput extends React.Component<InputProps, State> {
  constructor(props: InputProps) {
    super(props);

    this.state = {
      items: this.props.value || this.props.defaultValue
    };
  }

  addTodoItem = () => {
    const items = this.state.items.concat(new TodoItem("New todo item"));
    this.setState({ items });

    if (this.props.onChange) {
      this.props.onChange(null, items);
    }
  };

  removeTodoItem(item: TodoItem) {
    const items = this.state.items.filter(i => item !== i);
    this.setState({ items });

    if (this.props.onChange) {
      this.props.onChange(null, items);
    }
  }

  render() {
    return (
      <div className="form-group">
        {this.state.items.map((item, index) => this.renderTodoItem(item, index))}

        <button type="button" className="btn btn-primary" onClick={this.addTodoItem}>
          + Add todo
        </button>
      </div>
    );
  }

  renderTodoItem(item: TodoItem, index: number) {
    return (
      <div key={item.uid} className="form-inline form-group clearfix">
        <FieldGroup for={item} index={index}>
          <Field name="checked" label={false} className="mr-1"/>
          <Field name="title" label={false} style={{ width: '400px' }}/>
        </FieldGroup>

        <button type="button" className="btn btn-danger btn-sm ml-2" onClick={() => this.removeTodoItem(item)}>
          X
        </button>
      </div>
    );
  }
}
