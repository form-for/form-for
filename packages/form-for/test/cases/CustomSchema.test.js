import React from 'react';
import { mount } from 'enzyme';
import { Field, Form, connectField } from '../../src';
import Input from '../fixtures/Input';

describe('Custom schema', () => {
  connectField('text', Input);

  const schema = {
    name: {
      type: 'text'
    }
  };

  it('is used when provided without object schema', () => {
    const wrapper = mount(
      <Form for={{ name: 'John' }} schema={schema}>
        <Field name="name" />
      </Form>
    );

    const input = wrapper.find('input').first();
    expect(input.props().value).toEqual('John');
  });

  it('takes precedence over `for` schema', () => {
    const value = { name: 'John', schema: { name: { type: 'Nothing' } } };

    const wrapper = mount(
      <Form for={value} schema={schema}>
        <Field name="name" />
      </Form>
    );

    const input = wrapper.find('input').first();
    expect(input.props().value).toEqual('John');
  });
});
