import React from 'react';
import { mount } from 'enzyme';
import { Field, StatefulForm as Form } from '../../index';
import Input from '../fixture/Input';

describe('Field error', () => {
  Field.connect('text', Input);

  const object = {
    name: 'John',
    schema: { name: { type: 'text', error: 'invalidate' } }
  };

  it('does not show error if not existent', () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" />
      </Form>
    );

    wrapper.find('input').simulate('change');
    expect(wrapper.find('input').props()['data-error']).toBeUndefined();
  });

  it('shows object error', () => {
    const wrapper = mount(
      <Form for={{ ...object, invalidate: 'Invalid' }} __testing_valid__>
        <Field name="name" />
      </Form>
    );

    wrapper.find('input').simulate('change');
    expect(wrapper.find('input').props()['data-error']).toEqual('Invalid');
  });

  it('shows object prop result when function', () => {
    function invalidate() {
      return `${this.name} is invalid`;
    }

    const wrapper = mount(
      <Form for={{ ...object, invalidate }} __testing_valid__>
        <Field name="name" />
      </Form>
    );

    wrapper.find('input').simulate('change');
    expect(wrapper.find('input').props()['data-error']).toEqual('John is invalid');
  });

  it('shows errors (touches) on focus', () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" error="Prop error" />
      </Form>
    );

    wrapper
      .find('input[name="name"]')
      .first()
      .simulate('focus');

    const input = wrapper.find('input[name="name"]').first();
    expect(input.props()['data-error']).toEqual('Prop error');
  });

  it('shows error prop', () => {
    const wrapper = mount(
      <Form for={object} __testing_valid__>
        <Field name="name" error="Prop error" />
      </Form>
    );

    const input = wrapper.find('input[name="name"]').first();
    expect(input.props()['data-error']).toEqual('Prop error');
  });

  it('clears error once its gone', () => {
    function invalidate() {
      if (this.name === 'John') return 'invalid';
    }

    const wrapper = mount(
      <Form for={{ ...object, invalidate }} __testing_valid__>
        <Field name="name" />
      </Form>
    );

    let input = wrapper.find('input[name="name"]').first();
    expect(input.props()['data-error']).toEqual('invalid');

    wrapper
      .find('input[name="name"]')
      .first()
      .simulate('change', { target: { value: 'New value' } });

    input = wrapper.find('input[name="name"]').first();
    expect(input.props()['data-error']).toBeFalsy();
  });
});
