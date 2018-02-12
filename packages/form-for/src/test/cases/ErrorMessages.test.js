import React from 'react';
import { render } from 'enzyme';
import { Field, Form } from '../../index';
import Input from '../fixture/Input';

describe('Error messages', () => {
  it('throws on missing schema', () => {
    expect(() => render(<Form for={{}} />)).toThrow(`Undefined schema for "Object" instance`);
  });

  it('throws on missing field connection', () => {
    const message = `Missing "text" connection requested for property "name" in "Object" instance`;

    expect(() =>
      render(
        <Form for={{ schema: {} }}>
          <Field name="name" />
        </Form>
      )
    ).toThrow(message);
  });

  it('warns on missing field in schema', () => {
    console.warn = jest.fn();
    Field.connect('text', Input);

    render(
      <Form for={{ schema: {} }}>
        <Field name="name" />
      </Form>
    );

    const message = `Undefined property "name" in schema for "Object" instance`;
    expect(console.warn).toHaveBeenCalledWith(message);
  });
});
