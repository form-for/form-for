import React from 'react';
import { render } from 'enzyme';
import { Form } from '../../src';

describe('Blank form', () => {
  it('does not throw', () => {
    expect(() => render(<Form />)).not.toThrow();
  });
});
