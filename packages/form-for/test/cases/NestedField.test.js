import React from 'react';
import { mount } from 'enzyme';
import { Field, Form, connectField } from '../../src';
import { TodoItem, TodoItems } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Nested Field', () => {
  connectField('TodoItem[]', TodoItems);
  connectField('text', Input);

  describe('given an array', () => {
    const object = {
      todos: [new TodoItem(1, 'Text 1'), new TodoItem(2, 'Text 2')],
      schema: { todos: { type: 'TodoItem[]' } }
    };

    it('displays and updates fields', () => {
      const onChange = jest.fn(data => {
        expect(data.todos[0].text).toEqual('New text');
        expect(data.todos[1].text).toEqual('Text 2');
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="todos" />
        </Form>
      );

      const firstInput = wrapper.find('input[name="todos[0][text]"]');
      expect(firstInput.length).toEqual(1);

      const secondInput = wrapper.find('input[name="todos[1][text]"]');
      expect(secondInput.length).toEqual(1);

      wrapper
        .find('input[name="todos[0][text]"]')
        .first()
        .simulate('change', { target: { value: 'New text' } });

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('given an object', () => {
    const object = {
      todos: { first: new TodoItem(1, 'Text 1'), second: new TodoItem(2, 'Text 2') },
      schema: { todos: { type: 'TodoItem[]' } }
    };

    it('displays and updates fields', () => {
      const onChange = jest.fn(data => {
        expect(data.todos.first.text).toEqual('New text');
        expect(data.todos.second.text).toEqual('Text 2');
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="todos" />
        </Form>
      );

      const firstInput = wrapper.find('input[name="todos[first][text]"]');
      expect(firstInput.length).toEqual(1);

      const secondInput = wrapper.find('input[name="todos[second][text]"]');
      expect(secondInput.length).toEqual(1);

      wrapper
        .find('input[name="todos[first][text]"]')
        .first()
        .simulate('change', { target: { value: 'New text' } });

      expect(onChange).toHaveBeenCalled();
    });
  });
});
