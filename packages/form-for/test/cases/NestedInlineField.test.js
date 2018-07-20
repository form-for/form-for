import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Nested inline fields', () => {
  connectField('text', Input);

  const object = {
    schema: {
      name: { type: 'text' }
    },
    company: {
      address: 'Text',
      schema: {
        address: { type: 'text' }
      }
    }
  };

  it('displays nested field', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="name" />

        <Field name="company">
          <Field name="address" />
        </Field>
      </Form>
    );

    const firstInput = wrapper.find('input[name="name"]');
    expect(firstInput.length).toEqual(1);

    const secondInput = wrapper.find('input[name="company[address]"]');
    expect(secondInput.length).toEqual(1);
  });

  it('updates value properly', () => {
    const onChange = jest.fn(data => {
      expect(data.company.address).toEqual('New text');
    });

    const wrapper = mount(
      <Form for={object} onChange={onChange}>
        <Field name="name" />

        <Field name="company">
          <Field name="address" />
        </Field>
      </Form>
    );

    wrapper
      .find('input[name="company[address]"]')
      .first()
      .simulate('change', { target: { value: 'New text' } });

    expect(onChange).toHaveBeenCalled();

    const input = wrapper.find('input[name="company[address]"]');
    expect(input.prop('value')).toEqual('New text');
  });
});
