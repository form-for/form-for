import React from 'react';
import { render } from 'enzyme';
import { Field, Form, connectField } from '../../src';
import Input from '../fixtures/Input';

describe('Error messages', () => {
  it('throws on missing schema', () => {
    expect(() => render(<Form for={{}} />)).toThrow(`Undefined schema for "Object" instance`);
  });

  it('throws on missing field connection', () => {
    const message = `Missing "text" connection requested for property "name" in "Object" instance`;

    expect(() =>
      render(
        <Form for={{ schema: { name: 'text' } }}>
          <Field name="name" />
        </Form>
      )
    ).toThrow(message);
  });

  describe('missing field warning', () => {
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

      const message = `Undefined property "name" in schema for "Object" instance`;
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
});
