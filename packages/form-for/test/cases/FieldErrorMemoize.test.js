import React from 'react';
import { mount } from 'enzyme';
import { Field, Form } from '../../src';
import Input from '../fixtures/Input';

Field.connect('text', Input);

const object = {
  name: 'John',
  schema: { name: { type: 'text', error: 'validate' } }
};

describe('Field Error Memoize', () => {
  it('memoizes', () => {
    const callback = jest.fn().mockReturnValue(Promise.resolve());
    const validate = () => ({ memoize: true, callback });

    const wrapper = mount(
      <Form for={{ ...object, validate }}>
        <Field name="name" />
      </Form>
    );

    function changeValue(value: string) {
      wrapper
        .find('input[name="name"]')
        .first()
        .simulate('change', { target: { value } });
    }

    expect(callback).toHaveBeenCalledTimes(1);
    changeValue('New value');
    expect(callback).toHaveBeenCalledTimes(2);
    changeValue('New value');
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
