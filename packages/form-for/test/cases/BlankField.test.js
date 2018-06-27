import React from 'react';
import { mount } from 'enzyme';
import { Form, Field, connectField } from '../../src';
import Input from '../fixtures/Input';

describe('Blank field', () => {
  connectField('text', Input);

  const object = {
    schema: { name: { type: 'text' } }
  };

  it('sets the default value as empty string', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="name" />
      </Form>
    );

    const input = wrapper.find('input[name="name"]').first();
    expect(input.prop('value')).toEqual('');
  });
});
