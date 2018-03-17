import React from 'react';
import { mount } from 'enzyme';
import { Field, Form } from '../../src';
import Input from '../fixtures/Input';

jest.useFakeTimers();

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

describe('Field error', () => {
  Field.connect('text', Input);

  const object = {
    name: 'John',
    schema: { name: { type: 'text', error: 'validate' } }
  };

  describe('without error', () => {
    it('does not show error', () => {
      const wrapper = mount(
        <Form for={object} showErrors>
          <Field name="name" />
        </Form>
      );

      expect(wrapper.find('input').prop('data-error')).toBeNull();
    });
  });

  describe('with error', () => {
    describe('prop in <Field>', () => {
      it('shows error', () => {
        const wrapper = mount(
          <Form for={object}>
            <Field name="name" error="Prop error" />
          </Form>
        );

        const input = wrapper.find('input[name="name"]').first();
        expect(input.prop('data-error')).toEqual('Prop error');
      });
    });

    describe('string in object', () => {
      it('shows error', () => {
        const wrapper = mount(
          <Form for={{ ...object, validate: 'Invalid' }} showErrors>
            <Field name="name" />
          </Form>
        );

        expect(wrapper.find('input').prop('data-error')).toEqual('Invalid');
      });
    });

    describe('function', () => {
      describe('that returns a string', () => {
        it('shows error string', () => {
          function validate() {
            return `${this.name} is invalid`;
          }

          const wrapper = mount(
            <Form for={{ ...object, validate }}>
              <Field name="name" />
            </Form>
          );

          wrapper.find('input').simulate('change', { target: { value: 'New value' } });
          expect(wrapper.find('input').prop('data-error')).toEqual('New value is invalid');
        });
      });

      describe('that returns a successful promise', () => {
        it('shows validating and then no error', async () => {
          const promise = Promise.resolve();
          const validate = () => promise;

          const wrapper = mount(
            <Form for={{ ...object, validate }}>
              <Field name="name" />
            </Form>
          );

          expect.assertions(3);
          expect(wrapper.find('input').prop('data-validating')).toBeTruthy();

          return promise.then(() => {
            wrapper.update();
            expect(wrapper.find('input').prop('data-validating')).toBeFalsy();
            expect(wrapper.find('input').prop('data-error')).toBeFalsy();
          });
        });
      });

      describe('that returns a rejected promise', () => {
        it('shows validating and then the error', () => {
          const promise = Promise.reject('async invalid');
          const validate = () => promise;

          const wrapper = mount(
            <Form for={{ ...object, validate }}>
              <Field name="name" />
            </Form>
          );

          expect.assertions(3);
          expect(wrapper.find('input').prop('data-validating')).toBeTruthy();

          return flushPromises().then(() => {
            wrapper.update();
            expect(wrapper.find('input').prop('data-validating')).toBeFalsy();
            expect(wrapper.find('input').prop('data-error')).toEqual('async invalid');
            wrapper.unmount();
          });
        });
      });
    });
  });

  describe('on fix error', () => {
    it('clears error', () => {
      function validate() {
        if (this.name === 'John') return 'invalid';
      }

      const wrapper = mount(
        <Form for={{ ...object, validate }}>
          <Field name="name" />
        </Form>
      );

      let input = wrapper.find('input[name="name"]').first();
      expect(input.prop('data-error')).toEqual('invalid');

      wrapper
        .find('input[name="name"]')
        .first()
        .simulate('change', { target: { value: 'New value' } });

      input = wrapper.find('input[name="name"]').first();
      expect(input.prop('data-error')).toBeFalsy();
    });
  });

  // TODO - test setCustomValidity and validationMessage
});
