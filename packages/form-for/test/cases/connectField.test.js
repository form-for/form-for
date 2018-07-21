import React from 'react';
import { mount } from 'enzyme';
import { Field, Form, connectField } from '../../src';
import Input from '../fixtures/Input';
import Select from '../fixtures/Select';

describe('Field connect', () => {
  connectField('text', Input);
  connectField('select', Select);

  const object = {
    schema: { name: { type: 'text' }, role: { type: 'select' } }
  };

  it('binds components properly', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="name" />
        <Field name="role" />
      </Form>
    );

    expect(wrapper.find("input[name='name']").length).toBe(1);
    expect(wrapper.find("select[name='role']").length).toBe(1);
  });
});
