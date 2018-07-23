import React from 'react';
import { mount } from 'enzyme';
import { Field, FieldGroup, Form, connectField } from '../../src';
import { TodoItem } from '../fixtures/TodoItems';
import Input from '../fixtures/Input';

describe('Field.Move', () => {
  connectField('text', Input);
  let object;

  describe('given an array', () => {
    beforeEach(() => {
      object = {
        items: ['a', 'b', 'c']
      };
    });

    describe('bound in a field map', () => {
      it('move itself to requested position', () => {
        const onChange = jest.fn(data => {
          expect(data.items).toEqual(['b', 'a', 'c']);
        });

        const wrapper = mount(
          <Form for={object} onChange={onChange}>
            <Field name="items">
              <Field.Map>
                <Field.Move>{move => <button onClick={() => move(1)} />}</Field.Move>
              </Field.Map>
            </Field>
          </Form>
        );

        wrapper
          .find('button')
          .first()
          .simulate('click');

        expect(onChange).toHaveBeenCalled();
      });
    });

    it('moves the requested item', () => {
      const onChange = jest.fn(data => {
        expect(data.items).toEqual(['b', 'a', 'c']);
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="items">
            <Field.Move>{move => <button onClick={() => move(0, 1)} />}</Field.Move>
          </Field>
        </Form>
      );

      wrapper
        .find('button')
        .first()
        .simulate('click');

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('given an object', () => {
    beforeEach(() => {
      object = {
        items: { first: 'a', second: 'b', third: 'c' }
      };
    });

    it('removes the last item', () => {
      const onChange = jest.fn(data => {
        expect(data.items).toEqual({ second: 'b', third: 'c', fourth: 'a' });
      });

      const wrapper = mount(
        <Form for={object} onChange={onChange}>
          <Field name="items">
            <Field.Map>
              <Field.Move>{move => <button onClick={() => move('first', 'fourth')} />}</Field.Move>
            </Field.Map>
          </Field>
        </Form>
      );

      wrapper
        .find('button')
        .first()
        .simulate('click');

      expect(onChange).toHaveBeenCalled();
    });
  });
});
