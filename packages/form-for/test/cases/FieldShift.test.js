import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Field.Shift', () => {
  connectField('text', Input);
  let object;

  describe('given an array', () => {
    beforeEach(() => {
      object = {
        items: ['a', 'b', 'c']
      };
    });

    it('removes the first item', () => {
      const onChange = jest.fn(data => {
        expect(data.items).toEqual(['b', 'c']);
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="items">
            <Field.Shift>{shift => <button onClick={shift} />}</Field.Shift>
          </Field>
        </Form>
      );

      wrapper.find('button').simulate('click');
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('given an object', () => {
    beforeEach(() => {
      object = {
        items: { first: 'a', second: 'b', third: 'c' }
      };
    });

    it('removes the first item', () => {
      const onChange = jest.fn(data => {
        expect(data.items).toEqual({ second: 'b', third: 'c' });
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="items">
            <Field.Shift>{shift => <button onClick={shift} />}</Field.Shift>
          </Field>
        </Form>
      );

      wrapper.find('button').simulate('click');
      expect(onChange).toHaveBeenCalled();
    });
  });
});
