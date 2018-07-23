import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Field.Swap', () => {
  connectField('text', Input);

  let object;

  beforeEach(() => {
    object = {
      items: ['a', 'b', 'c']
    };
  });

  describe('bound in field map', () => {
    it('swaps itself with requested position', () => {
      const onChange = jest.fn(data => {
        expect(data.items).toEqual(['c', 'b', 'a']);
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="items">
            <Field.Map>
              <Field.Swap bound>{swap => <button onClick={() => swap(2)} />}</Field.Swap>
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

  it('swaps two values', () => {
    const onChange = jest.fn(data => {
      expect(data.items).toEqual(['c', 'b', 'a']);
    });

    const wrapper = mount(
      <Form for={object} onChange={onChange}>
        <Field name="items">
          <Field.Swap>{swap => <button onClick={() => swap(0, 2)} />}</Field.Swap>
        </Field>
      </Form>
    );

    wrapper.find('button').simulate('click');
    expect(onChange).toHaveBeenCalled();
  });
});
