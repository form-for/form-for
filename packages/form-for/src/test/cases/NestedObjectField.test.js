import React from 'react';
import { mount } from 'enzyme';
import { Field, StatefulForm as Form } from '../../index';
import { TodoItem, TodoItems } from '../fixture/TodoItems';
import Input from '../fixture/Input';

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

    const inputs = wrapper.find('input[name="text"]');
    expect(inputs.length).toEqual(2);
  });

  it('updates value properly', () => {
    const onChange = jest.fn(({ data }) => {
      expect(data.todos.first.text).toEqual('New text');
    });

    const wrapper = mount(
      <Form for={object} onChange={onChange} __testing_valid__>
        <Field name="todos" />
      </Form>
    );

    wrapper
      .find('input[name="text"]')
      .first()
      .simulate('change', { target: { value: 'New text' } });

    expect(onChange).toHaveBeenCalled();
  });
});
