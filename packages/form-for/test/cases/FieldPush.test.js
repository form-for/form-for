import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Field.Push', () => {
  connectField('text', Input);

  let object;

  beforeEach(() => {
    object = {
      items: ['a']
    };
  });

  it('adds a new value at the end', () => {
    const onChange = jest.fn(data => {
      expect(data.items).toEqual(['a', 'b']);
    });

    const wrapper = mount(
      <Form for={object} onChange={onChange}>
        <Field name="items">
          <Field.Push>{push => <button onClick={() => push('b')} />}</Field.Push>
        </Field>
      </Form>
    );

    wrapper.find('button').simulate('click');
    expect(onChange).toHaveBeenCalled();
  });
});
