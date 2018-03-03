import React from 'react';
import { mount } from 'enzyme';
import { Field, Form } from '../../index';
import { TodoItem, TodoItems } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Nested fields', () => {
  Field.connect('TodoItem{}', TodoItems);
  Field.connect('text', Input);

  const object = {
    todos: { first: new TodoItem(1, 'Text 1'), second: new TodoItem(2, 'Text 2') },
    schema: { todos: { type: 'TodoItem{}' } }
  };

  it('displays nested field', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="todos" />
      </Form>
    );

    const firstInput = wrapper.find('input[name="todos[first][text]"]');
    expect(firstInput.length).toEqual(1);

    const secondInput = wrapper.find('input[name="todos[second][text]"]');
    expect(secondInput.length).toEqual(1);
  });

  it('updates value properly', () => {
    const onChange = jest.fn(data => {
      expect(data.todos.first.text).toEqual('New text');
    });

    const wrapper = mount(
      <Form for={object} onChange={onChange}>
        <Field name="todos" />
      </Form>
    );

    wrapper
      .find('input[name="todos[first][text]"]')
      .first()
      .simulate('change', { target: { value: 'New text' } });

    expect(onChange).toHaveBeenCalled();
  });
});
