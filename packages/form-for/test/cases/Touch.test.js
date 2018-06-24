import React from 'react';
import { mount } from 'enzyme';
import { Field, Form } from '../../src';
import Counter from '../fixtures/Counter';
import Input from '../fixtures/Input';

describe('Touch', () => {
  Field.connect('counter', Counter);
  Field.connect('text', Input);

  const object = {
    schema: { name: {}, counter: { type: 'counter' } }
  };

  it('doest not request render after touching a second time', () => {
    const wrapper = mount(
      <Form for={object} showErrors>
        <Field name="counter" />
      </Form>
    );

    wrapper.find('input').simulate('focus');
    expect(wrapper.find('input').props()['data-count']).toEqual(1);
  });

  it('does not provide touch property when not touched', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="name" />
      </Form>
    );

    const input = wrapper.find('input').first();
    expect(input.props()['data-touched']).toBeFalsy();
  });

  it('provides touch property when form has showErrors', () => {
    const wrapper = mount(
      <Form for={object} showErrors>
        <Field name="name" />
      </Form>
    );

    const input = wrapper.find('input[name="name"]').first();
    expect(input.props()['data-touched']).toBeTruthy();
  });

  it('provides touch property on focus', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="name" />
      </Form>
    );

    wrapper.find('input').simulate('focus');
    const input = wrapper.find('input').first();
    expect(input.props()['data-touched']).toBeTruthy();
  });
});
