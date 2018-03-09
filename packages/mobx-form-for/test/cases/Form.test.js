import React from 'react';
import { observable } from 'mobx';
import { mount } from 'enzyme';
import { Field, Form } from '../../src';
import Input from '../fixtures/Input';

describe('Form', () => {
  Field.connect('text', Input);

  const object = observable({ name: 'John' });
  const schema = { name: { type: 'text' } };

  let wrapper, input;
  const onChange = jest.fn();
  const onSubmit = jest.fn();

  beforeAll(() => {
    wrapper = mount(
      <Form for={object} schema={schema} onChange={onChange} onSubmit={onSubmit}>
        <Field name="name" />
      </Form>
    );

    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: 'New value' } });

    input = wrapper.find('input').first();
  });

  it('changes original object value', () => {
    expect(object.name).toEqual('New value');
  });

  it('updates input value on change', () => {
    expect(input.prop('value')).toEqual('New value');
  });

  it('provides new data on change', () => {
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(object);
  });

  it('provides new data on submit', () => {
    wrapper.simulate('submit');
    expect(onSubmit).toHaveBeenCalledWith(expect.anything(), object);
  });
});
