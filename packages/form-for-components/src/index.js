// @flow

import { Field } from 'form-for';

import Checkbox from './Checkbox';
import Input from './Input';
import Radio from './Radio';
import Select from './Select';

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

function connect() {
  Field.connect('checkbox', Checkbox);
  Field.connect('radio', Radio);
  Field.connect('select', Select);
  inputTypes.forEach(type => Field.connect(type, Input));
}

export { connect, inputTypes, Checkbox, Input, Radio, Select };
