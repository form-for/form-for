import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Field.Insert', () => {
  connectField('text', Input);
  let object;

  describe('for an array', () => {
    beforeEach(() => {
      object = {
        items: ['a', 'b']
      };
    });

    it('adds value at the requested index', () => {
      const onChange = jest.fn(data => {
        expect(data.items).toEqual(['a', 'c', 'b']);
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="items">
            <Field.Map>
              <Field.Insert>{insert => <button onClick={() => insert(1, 'c')} />}</Field.Insert>
            </Field.Map>
          </Field>
        </Form>
      );

      wrapper
        .find('button')
        .last()
        .simulate('click');

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('for an object', () => {
    beforeEach(() => {
      object = {
        items: { first: 'a', second: 'b' }
      };
    });

    it('adds value at the requested index', () => {
      const onChange = jest.fn(data => {
        expect(data.items).toEqual({ first: 'a', second: 'b', third: 'c' });
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="items">
            <Field.Map>
              <Field.Insert>{insert => <button onClick={() => insert('third', 'c')} />}</Field.Insert>
            </Field.Map>
          </Field>
        </Form>
      );

      wrapper
        .find('button')
        .last()
        .simulate('click');

      expect(onChange).toHaveBeenCalled();
    });
  });
});
