import React from "react";
import { Field, FieldGroup } from "../../../src";

import TodoItem from "../models/TodoItem";

export default class TodoItems extends React.Component {
  state = {
    items: this.props.value || this.props.defaultValue || []
  };

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

  componentWillReceiveProps(props) {
    this.setState({ items: props.value || props.defaultValue });
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
        <button type="button" onClick={() => this.removeTodoItem(item)} style={{ float: "right" }}>
          X
        </button>

        <FieldGroup for={item} index={index}>
          <Field name="title" style={{ width: "400px" }} />
        </FieldGroup>
      </div>
    );
  }
}
