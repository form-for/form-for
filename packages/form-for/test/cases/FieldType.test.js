import React from 'react';
import { render } from 'enzyme';
import { Field, Form } from '../../src';
import Input from '../fixtures/Input';

describe('Field type', () => {
  Field.connect('text', Input);

  const object = {
    schema: { name: {} }
  };

  it('defaults to text if none given', () => {
    const wrapper = render(
      <Form for={object}>
        <Field name="name" />
      </Form>
    );

    expect(wrapper.find("input[name='name']").length).toBe(1);
  });
});
