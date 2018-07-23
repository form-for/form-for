import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Field.Pop', () => {
  connectField('text', Input);
  let object;

  describe('given an array', () => {
    beforeEach(() => {
      object = {
        items: ['a', 'b', 'c']
      };
    });

    it('removes the last item', () => {
      const onChange = jest.fn(data => {
        expect(data.items).toEqual(['a', 'b']);
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="items">
            <Field.Map>
              <Field.Pop>{pop => <button onClick={pop} />}</Field.Pop>
            </Field.Map>
          </Field>
        </Form>
      );

      wrapper
        .find('button')
        .first()
        .simulate('click');

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('given an object', () => {
    beforeEach(() => {
      object = {
        items: { first: 'a', second: 'b', third: 'c' }
      };
    });

    it('removes the last item', () => {
      const onChange = jest.fn(data => {
        expect(data.items).toEqual({ first: 'a', second: 'b' });
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="items">
            <Field.Map>
              <Field.Pop>{pop => <button onClick={pop} />}</Field.Pop>
            </Field.Map>
          </Field>
        </Form>
      );

      wrapper
        .find('button')
        .first()
        .simulate('click');

      expect(onChange).toHaveBeenCalled();
    });
  });
});
