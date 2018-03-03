// @flow

import { Field } from 'form-for';
import { inputTypes } from 'form-for-components';

import Checkbox from './Checkbox';
export type { Props as CheckboxProps } from './Checkbox';

import Input from './Input';
export type { Props as InputProps } from './Input';

import Radio from './Radio';
export type { Props as RadioProps } from './Radio';

import Select from './Select';
export type { Props as SelectProps } from './Select';

import Feedback from './Feedback';
import Help from './Feedback';
import Label from './Label';
import RequiredAbbreviation from './RequiredAbbreviation';
import humanizeOptions from './humanizeOptions';

function connectFields() {
  Field.connect('checkbox', Checkbox);
  Field.connect('radio', Radio);
  Field.connect('select', Select);
  inputTypes.forEach(type => Field.connect(type, Input));
}

export { connectFields, Checkbox, Input, Radio, Select, Feedback, Help, Label, RequiredAbbreviation, humanizeOptions };
