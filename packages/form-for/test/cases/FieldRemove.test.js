import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('FieldPush', () => {
  connectField('text', Input);
  let object;

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
          object.items = data.items;
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
          .last()
          .simulate('click');

        wrapper
          .find('button')
          .first()
          .simulate('click');

        expect(onChange).toHaveBeenCalledTimes(2);
        expect(object.items).toEqual(['b']);
      });
    });
  });

  describe('given an index', () => {});
});
