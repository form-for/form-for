import React from 'react';
import { mount } from 'enzyme';
import { Field, Form } from '../../index';
import Input from '../fixture/Input';

describe('Field event listening', () => {
  Field.connect('text', Input);

  const object = {
    name: 'John',
    schema: { name: { type: 'text' } }
  };

  it('calls onFocus when provided', () => {
    const onFocus = jest.fn();

    const wrapper = mount(
      <Form for={object}>
        <Field name="name" onFocus={onFocus} />
      </Form>
    );

    wrapper.find('input').simulate('focus');
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledWith(expect.anything());
  });

  it('calls onChange when provided', () => {
    const onChange = jest.fn();

    const wrapper = mount(
      <Form for={object}>
        <Field name="name" onChange={onChange} />
      </Form>
    );

    wrapper.find('input').simulate('change', { target: { value: 'New value' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.anything());
  });
});
