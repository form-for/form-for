// @flow

import BaseForm from './BaseForm';
export type { Props as FormProps, SchemaProperty, Schema } from './BaseForm';

import Form from './Form';

import Field from './Field';
export type { ComponentProps, Props as FieldProps } from './Field';

import FieldGroup from './FieldGroup';
export type { Props as FieldGroupProps } from './FieldGroup';

import fieldDecorator from './fieldDecorator';

import Errors from './Errors';
export type { Props as ErrorsProps } from './Errors';

import Submit from './Submit';

import cloneObject from './cloneObject';
import mutateObject from './mutateObject';
import prefixer from './prefixer';

export {
  BaseForm,
  Form,
  Field,
  FieldGroup,
  fieldDecorator as field,
  Errors,
  Submit,
  cloneObject,
  mutateObject,
  prefixer
};
