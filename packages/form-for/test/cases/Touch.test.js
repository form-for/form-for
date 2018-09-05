import React from 'react';
import { mount } from 'enzyme';
import { Field, Form, connectField } from '../../src';
import Counter from '../fixtures/Counter';
import Input from '../fixtures/Input';

describe('Touch', () => {
  connectField('counter', Counter);
  connectField('text', Input);

  const object = {
    schema: { name: {}, counter: { type: 'counter' } }
  };

  it('doest not request render after touching a second time', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="counter" />
      </Form>
    );

    wrapper.find('input').simulate('focus');
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

  it('provides touch property on blur', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="name" />
      </Form>
    );

    wrapper.find('input').simulate('blur');
    const input = wrapper.find('input').first();
    expect(input.props()['data-touched']).toBeTruthy();
  });

  describe('given touchedOn="focus"', () => {
    it('provides touch property on focus', () => {
      const wrapper = mount(
        <Form for={object} touchedOn="focus">
          <Field name="name" />
        </Form>
      );

      wrapper.find('input').simulate('focus');
      const input = wrapper.find('input').first();
      expect(input.props()['data-touched']).toBeTruthy();
    });
  });

  describe('given touchedOn="change"', () => {
    it('provides touch property on change', () => {
      const wrapper = mount(
        <Form for={object} touchedOn="change">
          <Field name="name" />
        </Form>
      );

      wrapper.find('input').simulate('change');
      const input = wrapper.find('input').first();
      expect(input.props()['data-touched']).toBeTruthy();
    });
  });
});
