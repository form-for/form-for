import React from 'react';
import { render } from 'enzyme';
import { Field, Form, connectField } from '../../src';
import Input from '../fixtures/Input';

describe('Error messages', () => {
  it('throws on missing field connection', () => {
    const message = `[Form-for] Missing field connection "text" requested for "name" property`;

    expect(() =>
      render(
        <Form for={{ schema: { name: 'text' } }}>
          <Field name="name" />
        </Form>
      )
    ).toThrow(message);
  });
});
