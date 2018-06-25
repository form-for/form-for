// @flow

import { Field } from 'form-for';

import Checkbox from './Checkbox';
import Input from './Input';
import Radio from './Radio';
import TextArea from './TextArea';

export type { Props as RadioProps } from './Radio';

import Select from './Select';
export type { Props as SelectProps } from './Select';

const inputTypes = [
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
  'hidden',
  'image',
  'month',
  'number',
  'password',
  'range',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week'
];

function connectFields() {
  Field.connect(
    'checkbox',
    Checkbox
  );
  Field.connect(
    'radio',
    Radio
  );
  Field.connect(
    'select',
    Select
  );
  Field.connect(
    'textarea',
    TextArea
  );
  inputTypes.forEach(type =>
    Field.connect(
      type,
      Input
    )
  );
}

export { connectFields, inputTypes, Checkbox, Input, Radio, TextArea, Select };
