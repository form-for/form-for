// @flow

import React from "react";
import { Field, FieldGroup } from "../../../src";

import TodoItem from "../TodoItem";

type Props = {
  value?: any,
  defaultValue?: any,
  onChange?: Function,
  [key: string]: any
};

type State = {
  items: TodoItem[]
};

export default class TodoItemsInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      items: this.props.value || this.props.defaultValue || []
    };
  }

  addTodoItem = () => {
    const items = this.state.items.concat(new TodoItem("New todo item"));
    this.setState({ items });

    if (this.props.onChange) {
      this.props.onChange(null, { value: items });
    }
  };

  removeTodoItem(item: TodoItem) {
    const items = this.state.items.filter(i => item !== i);
    this.setState({ items });

    if (this.props.onChange) {
      this.props.onChange(null, { value: items });
    }
  }

  render() {
    return (
      <fieldset className="form-group">
        <legend>Todo Items</legend>

        {this.state.items.map((item, index) => this.renderTodoItem(item, index))}

        <button type="button" className="btn btn-default" onClick={this.addTodoItem}>
          + Add todo
        </button>
      </fieldset>
    );
  }

  renderTodoItem(item: TodoItem, index: number) {
    return (
      <div key={item.uid} className="form-inline form-group clearfix">
        <FieldGroup for={item} index={index}>
          <Field name="checked" label={false} />
          <Field name="title" label={false} style={{ width: "400px" }} />
        </FieldGroup>

        <button type="button" className="btn btn-danger btn-sm ml-2" onClick={() => this.removeTodoItem(item)}>
          X
        </button>
      </div>
    );
  }
}
