import React from 'react';
import { mount } from 'enzyme';
import { Field, BaseForm, connectField } from '../../src';
import Input from '../fixtures/Input';

describe('BaseForm', () => {
  connectField('text', Input);

  const object = {
    name: 'initial',
    schema: { name: { type: 'text' } }
  };

  it('does not update field value on its own', () => {
    const wrapper = mount(
      <BaseForm for={object}>
        <Field name="name" />
      </BaseForm>
    );

    wrapper
      .find('input')
      .first()
      .simulate('change', { target: { value: 'New value' } });

    const input = wrapper.find('input[name="name"]').first();
    expect(input.prop('value')).toEqual('initial');
  });
});
