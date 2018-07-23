import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Field.Remove', () => {
  connectField('text', Input);
  let object;

  describe('for an array', () => {
    beforeEach(() => {
      object = {
        items: ['a', 'b', 'c']
      };
    });

    describe('inside a field map', () => {
      describe('given no index', () => {
        it('guesses the index', () => {
          const onChange = jest.fn(data => {
            expect(data.items).toEqual(['a', 'b']);
          });

          const wrapper = mount(
            <Form for={object} onChange={onChange}>
              <Field name="items">
                <Field.Map>
                  <Field.Remove>{remove => <button onClick={() => remove()} />}</Field.Remove>
                </Field.Map>
              </Field>
            </Form>
          );

          wrapper
            .find('button')
            .last()
            .simulate('click');

          expect(onChange).toHaveBeenCalled();
        });
      });

      describe('bound', () => {
        it('binds the index', () => {
          const onChange = jest.fn(data => {
            expect(data.items).toEqual(['a', 'c']);
          });

          const wrapper = mount(
            <Form for={object} onChange={onChange}>
              <Field name="items">
                <Field.Map>
                  <Field.Remove bound>{remove => <button onClick={remove} />}</Field.Remove>
                </Field.Map>
              </Field>
            </Form>
          );

          wrapper
            .find('button')
            .at(1)
            .simulate('click');

          expect(onChange).toHaveBeenCalled();
        });
      });
    });

    describe('given an index', () => {
      it('removes the index requested', () => {
        const onChange = jest.fn(data => {
          expect(data.items).toEqual(['b', 'c']);
        });

        const wrapper = mount(
          <Form for={object} onChange={onChange}>
            <Field name="items">
              <Field.Remove>{remove => <button onClick={() => remove(0)} />}</Field.Remove>
            </Field>
          </Form>
        );

        wrapper
          .find('button')
          .last()
          .simulate('click');

        expect(onChange).toHaveBeenCalled();
      });
    });
  });

  describe('for an object', () => {
    beforeEach(() => {
      object = {
        items: { first: 'a', second: 'b', third: 'c' }
      };
    });

    describe('inside a field map', () => {
      describe('given no index', () => {
        it('guesses the index', () => {
          const onChange = jest.fn(data => {
            expect(data.items).toEqual({ first: 'a', second: 'b' });
          });

          const wrapper = mount(
            <Form for={object} onChange={onChange}>
              <Field name="items">
                <Field.Map>
                  <Field.Remove>{remove => <button onClick={() => remove()} />}</Field.Remove>
                </Field.Map>
              </Field>
            </Form>
          );

          wrapper
            .find('button')
            .last()
            .simulate('click');

          expect(onChange).toHaveBeenCalled();
        });
      });

      describe('bound', () => {
        it('binds the index', () => {
          const onChange = jest.fn(data => {
            expect(data.items).toEqual({ first: 'a', third: 'c' });
          });

          const wrapper = mount(
            <Form for={object} onChange={onChange}>
              <Field name="items">
                <Field.Map>
                  <Field.Remove bound>{remove => <button onClick={remove} />}</Field.Remove>
                </Field.Map>
              </Field>
            </Form>
          );

          wrapper
            .find('button')
            .at(1)
            .simulate('click');

          expect(onChange).toHaveBeenCalled();
        });
      });
    });

    describe('given an index', () => {
      it('removes the index requested', () => {
        const onChange = jest.fn(data => {
          expect(data.items).toEqual({ second: 'b', third: 'c' });
        });

        const wrapper = mount(
          <Form for={object} onChange={onChange}>
            <Field name="items">
              <Field.Remove>{remove => <button onClick={() => remove('first')} />}</Field.Remove>
            </Field>
          </Form>
        );

        wrapper
          .find('button')
          .last()
          .simulate('click');

        expect(onChange).toHaveBeenCalled();
      });
    });
  });
});
