import React from 'react';
import { render } from 'enzyme';
import { Field, Form, connectField } from '../../src';
import Input from '../fixtures/Input';

describe('Missing schema', () => {
  beforeEach(() => {
    console.warn = jest.fn();
    connectField('text', Input);
  });

  it('warns on missing field in schema', () => {
    render(
      <Form for={{ schema: {} }}>
        <Field name="name" />
      </Form>
    );

    const message = `[Form-for] Undefined property "name" in schema for "Object" instance`;
    expect(console.warn).toHaveBeenCalledWith(message);
  });

  it('does not warn on missing field in schema if inline type is given', () => {
    render(
      <Form for={{ schema: {} }}>
        <Field name="name" type="text" />
      </Form>
    );

    expect(console.warn).not.toHaveBeenCalled();
  });
});
