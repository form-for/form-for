import React from 'react';
import { mount } from 'enzyme';
import { Field, Form } from '../../index';
import Input from '../fixture/Input';
import Counter from '../fixture/Counter';

describe('Form', () => {
  Field.connect('text', Input);
  Field.connect('counter', Counter);

  const object = { name: 'John' };
  const schema = { name: { type: 'text' }, counter: { type: 'counter' } };

  let wrapper, input;
  const onChange = jest.fn();
  const onSubmit = jest.fn();

  beforeAll(() => {
    wrapper = mount(
      <Form for={object} schema={schema} onChange={onChange} onSubmit={onSubmit} __testing_valid__>
        <Field name="name" />
        <Field name="counter" />
      </Form>
    );

    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: 'New value' } });

    input = wrapper.find('input').first();
  });

  it('does not change original object value', () => {
    expect(object.name).toEqual('John');
  });

  it('updates input value on change', () => {
    expect(input.prop('value')).toEqual('New value');
  });

  it('provides new data on change', () => {
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ data: { name: 'New value' }, valid: true });
  });

  it('provides new data on submit', () => {
    wrapper.simulate('submit');
    expect(onSubmit).toHaveBeenCalledWith(expect.anything(), { data: { name: 'New value' }, valid: true });
  });
});
