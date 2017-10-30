// @flow

import React from "react";
import { Field, FieldContext } from "../../../src";

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
    this.setState({ items: this.state.items.concat(new TodoItem("New todo item")) });
  };

  removeTodoItem(item: TodoItem) {
    const index = this.state.items.indexOf(item);
    this.state.items.splice(index, 1);
    this.setState({ items: this.state.items });
  }

  render() {
    return (
      <div className="card form-group">
        <header className="card-header">Todo Items</header>

        <div className="card-body">{this.state.items.map((item, index) => this.renderTodoItem(item, index))}</div>

        <div className="card-footer">
          <button type="button" className="btn btn-primary" onClick={this.addTodoItem}>
            + Add todo
          </button>
        </div>
      </div>
    );
  }

  renderTodoItem(item: TodoItem, index: number) {
    return (
      <div key={item.uid} className="form-group card">
        <header className="card-header">
          Item #{index + 1}
          <button type="button" className="btn btn-danger float-right btn-sm" onClick={() => this.removeTodoItem(item)}>
            X
          </button>
        </header>

        <div className="card-body">
          <FieldContext for={item} index={index}>
            <Field name="title" />
            <Field name="checked" />
          </FieldContext>
        </div>
      </div>
    );
  }
}
