import React from 'react';
import { render } from 'enzyme';
import { Form } from '../../index';

describe('Blank form', () => {
  it('does not throw', () => {
    expect(() => render(<Form />)).not.toThrow();
  });
});
