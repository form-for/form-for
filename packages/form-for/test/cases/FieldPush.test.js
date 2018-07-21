import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('FieldPush', () => {
  connectField('text', Input);

  let object;

  beforeEach(() => {
    const object = {
      items: ['a']
    };
  });

  it('pushes new value', () => {
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

    wrapper
      .find('button')
      .first()
      .simulate('click');

    expect(onChange).toHaveBeenCalled();
  });
});
