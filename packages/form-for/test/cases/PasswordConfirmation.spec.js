import React from 'react';
import { mount } from 'enzyme';
import { field, Field, Form } from '../../src';
import Input from '../fixtures/Input';

describe('Password Confirmation', () => {
  Field.connect('text', Input);

  class User {
    @field password;

    @field({ error: 'check' })
    password_confirmation: { type: 'text', error: 'check' };

    passwordsMatch() {
      return this.password === this.password_confirmation;
    }

    check() {
      return !this.passwordsMatch() && 'Passwords do not match';
    }
  }

  const user = new User();

  it('updates confirmation error on password change', () => {
    const wrapper = mount(
      <Form for={user}>
        <Field name="password" />
        <Field name="password_confirmation" />
      </Form>
    );

    wrapper
      .find('input[name="password"]')
      .first()
      .simulate('change', { target: { value: 'New value' } });

    const passwordConfirmation = wrapper.find('input[name="password_confirmation"]').first();
    expect(passwordConfirmation.props()['data-error']).toEqual('Passwords do not match');
  });
});
