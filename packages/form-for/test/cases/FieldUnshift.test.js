import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Field.Unshift', () => {
  connectField('text', Input);

  let object;

  beforeEach(() => {
    object = {
      items: ['a']
    };
  });

  it('adds a new value at the beginning', () => {
    const onChange = jest.fn(data => {
      expect(data.items).toEqual(['b', 'a']);
    });

    const wrapper = mount(
      <Form for={object} onChange={onChange}>
        <Field name="items">
          <Field.Unshift>{unshift => <button onClick={() => unshift('b')} />}</Field.Unshift>
        </Field>
      </Form>
    );

    wrapper.find('button').simulate('click');
    expect(onChange).toHaveBeenCalled();
  });
});
