import React from 'react';
import { mount } from 'enzyme';
import { Field, Form } from '../../src';
import { TodoItem, TodoItems } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Nested fields', () => {
  Field.connect('TodoItem[]', TodoItems);
  Field.connect('text', Input);

  const object = {
    todos: [new TodoItem(1, 'Text 1'), new TodoItem(2, 'Text 2')],
    schema: { todos: { type: 'TodoItem[]' } }
  };

  it('displays nested field', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="todos" />
      </Form>
    );

    const firstInput = wrapper.find('input[name="todos[0][text]"]');
    expect(firstInput.length).toEqual(1);

    const secondInput = wrapper.find('input[name="todos[1][text]"]');
    expect(secondInput.length).toEqual(1);
  });

  it('updates value properly', () => {
    const onChange = jest.fn(data => {
      expect(data.todos[0].text).toEqual('New text');
    });

    const wrapper = mount(
      <Form for={object} onChange={onChange}>
        <Field name="todos" />
      </Form>
    );

    wrapper
      .find('input[name="todos[0][text]"]')
      .first()
      .simulate('change', { target: { value: 'New text' } });

    expect(onChange).toHaveBeenCalled();
  });
});
