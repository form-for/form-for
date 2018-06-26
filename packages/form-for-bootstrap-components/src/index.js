// @flow

import { connectField } from 'form-for';
import { inputTypes } from 'form-for-components';

import Checkbox from './Checkbox';
export type { Props as CheckboxProps } from './Checkbox';

import Input from './Input';
export type { Props as InputProps } from './Input';

import Radio from './Radio';
export type { Props as RadioProps } from './Radio';

import Select from './Select';
export type { Props as SelectProps } from './Select';

import TextArea from './TextArea';
export type { Props as TextAreaProps } from './TextArea';

import Feedback from './Feedback';
import Help from './Help';
import Label from './Label';
import RequiredAbbreviation from './RequiredAbbreviation';
import humanizeOptions from './humanizeOptions';

function connectFields() {
  connectField('checkbox', Checkbox);
  connectField('radio', Radio);
  connectField('select', Select);
  connectField('textarea', TextArea);
  inputTypes.forEach(type => connectField(type, Input));
}

export {
  connectFields,
  Checkbox,
  Input,
  Radio,
  Select,
  TextArea,
  Feedback,
  Help,
  Label,
  RequiredAbbreviation,
  humanizeOptions
};
